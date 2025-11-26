from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import RSVP,InviteToken
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

        current = RSVP.objects.filter(event=event, status="confirmed").count()
        if current >= event.max_attendees:
            return Response({"error": "Event is full"}, status=status.HTTP_400_BAD_REQUEST)


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
        token = request.data.get("token")
        if not guest_email or not event_id :
            return Response({"message":"guest_email and event_id are required"},status=status.HTTP_400_BAD_REQUEST)

        if not token:
            return Response({"error":"Token missing!"},status=status.HTTP_404_NOT_FOUND)

        event = get_object_or_404(Events,id=event_id)

        if RSVP.objects.filter(event=event,guest_email=guest_email).exists():
            return Response({"message":"Already Register"})
    
        current = RSVP.objects.filter(event=event, status="confirmed").count()
        if current >= event.max_attendees:
            return Response({"error": "Event is full"}, status=status.HTTP_400_BAD_REQUEST)


        rsvp = RSVP.objects.create(            
            event = event,
            guest_email = guest_email
            token = token
        )

        return Response({
            "token":token
        },status=status.HTTP_201_CREATED)


class CancelRSVP(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        event_id = request.data.get('event_id')
        user_id = request.data.get("user_id")
        guest_email = request.data.get("geust_email")

        token = request.data.get("token")
        if not token:
            return Response({"message":"token is missing"},status=status.HTTP_404_NOT_FOUND)    
        rsvp = get_object_or_404(Events,token=token)
        rsvp.status = "cancelled"
        rsvp.save()
        return Response("message":"successfully cancelled",status=status.HTTP_200_OK)
            


class LinkGenarator(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request):
        event_id = request.data.get("event_id")
        if not event:
            return Response({"message":"event_id is required"},status=status.HTTP_400_BAD_REQUEST)
        
        event =  get_object_or_404(Events,id=event_id)
        invite_token = InviteToken.objects.create(event=event)
        invite_url = request.build_absolute_uri(f"/invite/{invite_token.token}/")
        return Response({"link":invite_url},status=status.HTTP_201_CREATED)
       

