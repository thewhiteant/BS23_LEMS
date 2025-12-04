from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import RSVP, InviteToken
from events.models import Events
from .serializer import RSVPSerializer 
from events.serializer import EventSerializer




# ----------------- 1. USER REGISTER VIEW -----------------
class RegisterUserView(APIView):
    permission_classes = [IsAuthenticated]   # user must login

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

from django.utils import timezone

class RegisterPublicView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
            invite = get_object_or_404(InviteToken, token=token)

            # ✅ Check if expired
            if invite.is_expired():
                return Response({"error": "Invite link expired"}, status=status.HTTP_400_BAD_REQUEST)

            event = invite.event
            event_data = EventSerializer(event, context={"request": request}).data

            return Response({
                "event": event_data,
                "event_id": event.id,
                "token": invite.token,
            }, status=status.HTTP_200_OK)

    def post(self, request):
        guest_email = request.data.get("guest_email")
        token = request.data.get("token")

        if not guest_email:
            return Response(
                {"error": "guest_email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not token:
            return Response(
                {"error": "Token missing!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        invite = get_object_or_404(InviteToken, token=token)

        if invite.is_expired():
            return Response(
                {"error": "Invite link has expired"},
                status=status.HTTP_400_BAD_REQUEST
            )

        event = invite.event
        if RSVP.objects.filter(event=event, guest_email=guest_email).exists():
            return Response(
                {"error": "Already Registered"},
                status=status.HTTP_400_BAD_REQUEST
            )

        current = RSVP.objects.filter(event=event, status="confirmed").count()
        if current >= event.max_attendees:
            return Response(
                {"error": "Event is full"},
                status=status.HTTP_400_BAD_REQUEST
            )
        rsvp = RSVP.objects.create(
            event=event,
            guest_email=guest_email,
            status="confirmed"
        )

        event.attendees = (event.attendees or 0) + 1
        event.save()

        return Response(
            {"token": rsvp.token},
            status=status.HTTP_201_CREATED
        )

class CancelRSVPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "token is missing"}, status=status.HTTP_400_BAD_REQUEST)

        # find RSVP by token
        rsvp = get_object_or_404(RSVP, token=token)

        if rsvp.status == "cancelled":
            return Response({"message": "RSVP already cancelled"}, status=status.HTTP_400_BAD_REQUEST)

        
        rsvp.status = "cancelled"
        rsvp.save()

        event = rsvp.event
        if event.attendees and event.attendees > 0:
            event.attendees = event.attendees - 1
            event.save()


        if rsvp.user:
            user = rsvp.user
            if user.attend_number_of_event and user.attend_number_of_event > 0:
                user.attend_number_of_event = user.attend_number_of_event - 1
                user.save()

        return Response({"message": "Successfully cancelled"}, status=status.HTTP_200_OK)





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
    permission_classes = [IsAuthenticated]  # Only logged-in users (admins or event owner)

    def get(self, request):
        event_id = request.query_params.get("event_id")
        if not event_id:
            return Response({"error": "event_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        event = get_object_or_404(Events, id=event_id)

        # Fetch all RSVPs for this event
        rsvps = RSVP.objects.filter(event=event).order_by("status", "created_at")
        serializer = RSVPSerializer(rsvps, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)


    def get(self, request):
        event_id = request.query_params.get("event_id")
        if not event_id:
            return Response({"error": "event_id is required"}, status=400)

        event = get_object_or_404(Events, id=event_id)
        rsvps = RSVP.objects.filter(event=event).order_by("-status", "created_at")
        serializer = RSVPSerializer(rsvps, many=True, context={'request': request})
        return Response(serializer.data, status=200)


#test

# class Allrsvp(APIView):
#     permission_classes = [AllowAny]
#     def get(self,request):
#         alldata = RSVP.objects.all()
#         serializer = RSVPSerializer(alldata,many=True)
#         return Response(serializer.data,status=status.HTTP_200_OK)