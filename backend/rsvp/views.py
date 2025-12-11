from datetime import timedelta
from rest_framework.views import APIView
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import RSVP, InviteToken
from events.models import Events
from .serializer import (
    RSVPSerializer,
    InviteTokenSerializer,
    PublicRSVPSerializer,
    CancelRSVPSerializer,
)
from events.serializer import CustomTokenAddedSerializer
from events.serializer import EventSerializer
from config.constans import ResponseMessages
from users.tasks import send_mail_x


class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        reservations = RSVP.objects.filter(user=user).select_related("event")
        events = Events.objects.filter(rsvps__in=reservations).distinct()
        serializer = CustomTokenAddedSerializer(
            events, many=True, context={"request": request, "user": request.user}
        )
        return Response({"events": serializer.data}, status=status.HTTP_200_OK)


class RegisterUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        event_id = request.query_params.get("event_id")
        event = get_object_or_404(Events, id=event_id)
        is_registered = RSVP.objects.filter(event=event, user=request.user).exists()

        return Response({"is_registered": is_registered}, status=status.HTTP_200_OK)

    def post(self, request):
        event_id = request.data.get("event_id")
        if not event_id:
            return Response(
                {"error": ResponseMessages.EVENT_ID_REQUIRED},
                status=status.HTTP_400_BAD_REQUEST,
            )
        event = get_object_or_404(Events, id=event_id)

        serializer = RSVPSerializer(
            data={}, context={"user": request.user, "event": event}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RegisterPublicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        invite = get_object_or_404(InviteToken, token=token)

        if invite.is_expired():
            return Response(
                {"error": ResponseMessages.TOKEN_EXPIRED},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if invite.is_used:

            rsvp = RSVP.objects.filter(invite_token=invite, status="confirmed").first()
            if rsvp:
                event_data = EventSerializer(
                    invite.event, context={"request": request}
                ).data
                return Response(
                    {
                        "event": event_data,
                        "is_registered": True,
                        "rsvp_token": str(rsvp.token),
                        "guest_email": rsvp.guest_email,
                    }
                )

        event_data = EventSerializer(invite.event, context={"request": request}).data
        return Response(
            {
                "event": event_data,
                "is_registered": False,
            }
        )

    def post(self, request):
        serializer = PublicRSVPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rsvp = serializer.save()

        return Response(
            {
                "message": ResponseMessages.RSVP_SUCCESS,
                "rsvp": PublicRSVPSerializer(rsvp).data,
            },
            status=201,
        )


class CancelRSVPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CancelRSVPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        rsvp = serializer.save()

        return Response(
            {
                "message": ResponseMessages.RSVP_CANCELLED,
            },
            status=200,
        )


class LinkGenaratorView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        event_id = request.data.get("event_id")
        if not event_id:
            return Response(
                {"error": "event_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        event = get_object_or_404(Events, id=event_id)
        invite_token = InviteToken.objects.create(event=event)
        invite_url = request.build_absolute_uri(f"/invite/{invite_token.token}/")

        return Response({"link": invite_url}, status=status.HTTP_201_CREATED)


class EventRSVPListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        event_id = request.query_params.get("event_id")
        if not event_id:
            return Response(
                {"error": "event_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        event = get_object_or_404(Events, id=event_id)

        rsvps = RSVP.objects.filter(event=event).order_by("-status", "created_at")
        serializer = RSVPSerializer(rsvps, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class SendEmailAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            recipient = request.data.get("recipient", "test@example.com")
            subject = request.data.get("subject", "Hello from Django APIView")
            message = request.data.get("message", "This is a test email from React.")

            # Call Celery task asynchronously
            send_mail_x.delay(subject, message, recipient)

            return Response(
                {"status": "success", "message": "Email queued for sending!"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class InviteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        invites = (
            InviteToken.objects.select_related("event")
            .prefetch_related("rsvps__user")
            .all()
            .order_by("-created_at")
        )

        expired_param = request.query_params.get("expired")
        if expired_param is not None:
            now = timezone.now()
            expire_time = now - timedelta(hours=12)
            if expired_param.lower() == "true":
                invites = invites.filter(created_at__lte=expire_time)
            elif expired_param.lower() == "false":
                invites = invites.filter(created_at__gt=expire_time)

        serializer = InviteTokenSerializer(invites, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InviteDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, token_id):
        invite = get_object_or_404(InviteToken, id=token_id)
        invite.delete()
        return Response({"status": "success"}, status=status.HTTP_200_OK)


class InviteExpireView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, token_id):
        invite = get_object_or_404(InviteToken, id=token_id)

        invite.created_at = timezone.now() - timezone.timedelta(hours=24)
        invite.save()
        return Response(
            {"status": "success", "message": "Invite expired"},
            status=status.HTTP_200_OK,
        )
