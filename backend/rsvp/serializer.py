from rest_framework import serializers
from .models import RSVP ,InviteToken
from django.contrib.auth import get_user_model



User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone"]

class RSVPSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)  

    class Meta:
        model = RSVP
        fields = "__all__"

