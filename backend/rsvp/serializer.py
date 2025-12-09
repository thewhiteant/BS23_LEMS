from rest_framework import serializers
from .models import RSVP, InviteToken
from django.contrib.auth import get_user_model

User = get_user_model()

class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "phone"]

class RSVPSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    used_by = serializers.SerializerMethodField()

    class Meta:
        model = RSVP
        fields = "__all__"
    
    def get_used_by(self, obj):

        if obj.user:
            return obj.user.username
        return obj.guest_email

class InviteTokenSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source="event.title", read_only=True)
    expired = serializers.SerializerMethodField()
    rsvps = RSVPSerializer(many=True, read_only=True)  # Nested RSVPs

    class Meta:
        model = InviteToken
        fields = ["id", "token", "event_title", "created_at", "is_used", "expired", "rsvps"]

    def get_expired(self, obj):
        return obj.is_expired(hours=12)  # adjust hours as needed
