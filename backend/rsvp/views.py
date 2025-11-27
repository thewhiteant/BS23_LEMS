from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import RSVP, InviteToken
from events.models import Events
from .serializer import RSVPSerializer


# ----------------- 1. USER REGISTER VIEW -----------------
class RegisterUserView(APIView):
    permission_classes = [IsAuthenticated]   # user must login

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

        return Response({"token": rsvp.token}, status=status.HTTP_201_CREATED)



# ----------------- 2. PUBLIC REGISTER VIEW -----------------
class RegisterPublicView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        guest_email = request.data.get("guest_email")
        event_id = request.data.get("event_id")
        token = request.data.get("token")

        if not guest_email or not event_id:
            return Response({"error": "guest_email and event_id are required"}, status=status.HTTP_400_BAD_REQUEST)

        if not token:
            return Response({"error": "Token missing!"}, status=status.HTTP_400_BAD_REQUEST)

        event = get_object_or_404(Events, id=event_id)

        # check duplicate guest
        if RSVP.objects.filter(event=event, guest_email=guest_email).exists():
            return Response({"error": "Already Registered"}, status=status.HTTP_400_BAD_REQUEST)

        # event full check
        current = RSVP.objects.filter(event=event, status="confirmed").count()
        if current >= event.max_attendees:
            return Response({"error": "Event is full"}, status=status.HTTP_400_BAD_REQUEST)

        # create RSVP
        rsvp = RSVP.objects.create(
            event=event,
            guest_email=guest_email,
            token=token,
            status="confirmed"
        )

        return Response({"token": rsvp.token}, status=status.HTTP_201_CREATED)



# ----------------- 3. CANCEL RSVP VIEW -----------------
class CancelRSVPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "token is missing"}, status=status.HTTP_400_BAD_REQUEST)

        # find RSVP by token
        rsvp = get_object_or_404(RSVP, token=token)

        rsvp.status = "cancelled"
        rsvp.save()

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




#test

class Allrsvp(APIView):
    permission_classes = [AllowAny]
    def get(self,request):
        alldata = RSVP.objects.all()
        serializer = RSVPSerializer(alldata,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)