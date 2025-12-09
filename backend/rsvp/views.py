from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import RSVP, InviteToken
from events.models import Events
from .serializer import RSVPSerializer ,InviteTokenSerializer
from events.serializer import EventSerializer


from django.core.mail import send_mail
from django.shortcuts import render
from django.http import HttpResponse


class RegisterUserView(APIView):
    permission_classes = [IsAuthenticated]   

    def get(self, request):
        event_id = request.query_params.get("event_id")
        if not event_id:
            return Response({"message": "event_id is required!"}, status=status.HTTP_400_BAD_REQUEST)
        event = get_object_or_404(Events, id=event_id)
        is_registered = RSVP.objects.filter(event=event, user=request.user).exists()
        return Response({"is_registered": is_registered}, status=status.HTTP_200_OK)

    def post(self, request):
        event_id = request.data.get("event_id")
        if not event_id:
            return Response({"error": "event_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        event = get_object_or_404(Events, id=event_id)

        # prevent duplicate RSVP
        if RSVP.objects.filter(event=event, user=request.user).exists():
            return Response({"error": "Already Registered"}, status=status.HTTP_400_BAD_REQUEST)

        # check event availability
        current = RSVP.objects.filter(event=event, status="confirmed").count()
        if current >= event.max_attendees:
            return Response({"error": "Event is full"}, status=status.HTTP_400_BAD_REQUEST)

        # create RSVP
        rsvp = RSVP.objects.create(
            user=request.user,
            event=event,
            status="confirmed"
        )
        user = request.user
        user.attend_number_of_event = (user.attend_number_of_event or 0) + 1
        user.save()
        event.attendees = (event.attendees or 0)+1
        event.save()

        return Response({"token": rsvp.token}, status=status.HTTP_201_CREATED)



class RegisterPublicView(APIView):
    permission_classes = [AllowAny]

    # GET: Check invite token and see if already registered
    def get(self, request, token):
        invite = get_object_or_404(InviteToken, token=token)

        if invite.is_expired():
            return Response({"error": "Invite link has expired"}, status=status.HTTP_400_BAD_REQUEST)

        if invite.is_used:
            # Already used → find who registered
            rsvp = RSVP.objects.filter(invite_token=invite, status="confirmed").first()
            if rsvp:
                event_data = EventSerializer(invite.event, context={"request": request}).data
                return Response({
                    "event": event_data,
                    "is_registered": True,
                    "rsvp_token": str(rsvp.token),
                    "guest_email": rsvp.guest_email,
                })

        event_data = EventSerializer(invite.event, context={"request": request}).data
        return Response({
            "event": event_data,
            "is_registered": False,
        })

    # POST: Register the guest
    def post(self, request):
        guest_email = request.data.get("guest_email")
        token = request.data.get("token")

        if not guest_email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        invite = get_object_or_404(InviteToken, token=token)

        if invite.is_expired():
            return Response({"error": "Invite link has expired"}, status=status.HTTP_400_BAD_REQUEST)

        if invite.is_used:
            return Response({"error": "This invite link has already been used"}, status=status.HTTP_400_BAD_REQUEST)

        event = invite.event

        # Check capacity
        confirmed_count = RSVP.objects.filter(event=event, status="confirmed").count()
        if event.max_attendees and confirmed_count >= event.max_attendees:
            return Response({"error": "Event is full"}, status=status.HTTP_400_BAD_REQUEST)

        # Create RSVP
        rsvp = RSVP.objects.create(
            event=event,
            guest_email=guest_email,
            invite_token=invite,
            status="confirmed"
        )

        # Mark invite as used
        invite.is_used = True
        invite.save()

        return Response({
            "message": "Registration successful!",
            "token": str(rsvp.token),  # for cancel later
        }, status=status.HTTP_201_CREATED)

class CancelRSVPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        rsvp_token = request.data.get("token")

        if not rsvp_token:
            return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)


        rsvp = get_object_or_404(RSVP, token=rsvp_token)

        if rsvp.status == "cancelled":
            return Response({"message": "Already cancelled"}, status=status.HTTP_400_BAD_REQUEST)

        
        rsvp.status = "cancelled"
        rsvp.save()

        
        if rsvp.invite_token:
            rsvp.invite_token.delete()  

        return Response({
            "message": "RSVP cancelled. This invite link is now permanently dead and cannot be reused."
        }, status=status.HTTP_200_OK)



# ----------------- 4. INVITE LINK GENERATOR -----------------
class LinkGenaratorView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        event_id = request.data.get("event_id")
        if not event_id:
            return Response({"error": "event_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        event = get_object_or_404(Events, id=event_id)

        invite_token = InviteToken.objects.create(event=event)

        invite_url = request.build_absolute_uri(
            f"/invite/{invite_token.token}/"
        )

        return Response({"link": invite_url}, status=status.HTTP_201_CREATED)


class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  

        reservations = RSVP.objects.filter(user=user).select_related('event')
        events = Events.objects.filter(rsvps__in=reservations).distinct()
        serializer = EventSerializer(events, many=True, context={'request': request})

        return Response({
            "events": serializer.data
        }, status=status.HTTP_200_OK)

class EventRSVPListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        event_id = request.query_params.get("event_id")
        if not event_id:
            return Response({"error": "event_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        event = get_object_or_404(Events, id=event_id)

        rsvps = RSVP.objects.filter(event=event).order_by("-status", "created_at")
        serializer = RSVPSerializer(rsvps, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)




# TODO: This section will infuture goes to notifcation app 



class SendEmailAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            recipient = request.data.get("recipient", "test@example.com")
            subject = request.data.get("subject", "Hello from Django APIView")
            message = request.data.get("message", "This is a test email from React.")

            send_mail(
                subject,
                message,
                None,  
                [recipient],
                fail_silently=False,
            )

            return Response(
                {"status": "success", "message": "Email sent! Check console."},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"status": "error", "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )




#---------------------------------- Invite Management -------------------
class InviteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        invites = InviteToken.objects.prefetch_related("rsvps__user").select_related("event").all().order_by("-created_at")
        
        # ✅ Check for query param "expired"
        expired_param = request.query_params.get("expired")
        if expired_param is not None:
            if expired_param.lower() == "true":
                invites = [invite for invite in invites if invite.is_expired(hours=12)]
            elif expired_param.lower() == "false":
                invites = [invite for invite in invites if not invite.is_expired(hours=12)]

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
        # Force expire by setting created_at far in the past
        from django.utils import timezone
        invite.created_at = timezone.now() - timezone.timedelta(hours=24)
        invite.save()
        return Response({"status": "success", "message": "Invite expired"}, status=status.HTTP_200_OK)