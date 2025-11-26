from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import RSVP
from events.models import Events
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from django.shortcuts import get_object_or_404

# Create your views here.


class RegisterUser(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        event_id = request.data.get("event_id")
        if not event_id:
            return Response({"error":"event_id is required"},status=status.HTTP_400_BAD_REQUEST)
        event = get_object_or_404(Events,id=event_id)

        if RSVP.objects.filter(event=event,user=request.user).exists():
            return Response({"error":"Already Registered"},status=status.HTTP_400_BAD_REQUEST)

        rsvp  = RSVP.objects.create(
            user = request.user,
            event = event,
        )

        return Response(
            { "token":rsvp.token },status=status.HTTP_201_CREATED
        )


class RegisterPublic(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        guest_email = request.data.get("guest_email")
        event_id = request.data.get("event_id")
        if not guest_email or not event_id:
            return Response({"message":"guest_email and event_id are required"},status=status.HTTP_400_BAD_REQUEST)

        event = get_object_or_404(Events,id=event_id)

        if RSVP.objects.filter(event=event,guest_email=guest_email).exists():
            return Response({"message":"Already Register"})
        
        rsvp = RSVP.objects.create(            
            event = event,
            guest_email = guest_email
        )

        return Response({
            "token":rsvp.token
        },status=status.HTTP_201_CREATED)


class CancelRSVP(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        event_id = request.data.get('event_id')
        user_id = request.data.get("user_id")
        guest_email = request.data.get("geust_email")

        if not user_id and not guest_email:
            return Response({"message":"user_id or guest_email is required"},status=status.HTTP_404_NOT_FOUND)

        if user_id:
            pass

        else :
            pass


class Token_genarate(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request):
        pass
    

