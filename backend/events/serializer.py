from rest_framework import serializers
from .models import Events
from rsvp.models import RSVP

class EventSerializer(serializers.ModelSerializer):


    class Meta:
        model = Events
        fields = "__all__"  




class CustomTokenAddedSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    rsvp_status = serializers.SerializerMethodField()
    rsvp_created_at = serializers.SerializerMethodField()

    class Meta:
        model = Events
        fields = [
            "id",
            "title",
            "desc",
            "date_time",
            "location",
            "attendees",
            "max_attendees",
            "event_cover",
            "token",
            "rsvp_status",
            "rsvp_created_at"
        ]

    def get_token(self, obj):
        user = self.context.get("user")
        if not user:
            return None
        rsvp = RSVP.objects.filter(user=user, event=obj).first()
        return str(rsvp.token) if rsvp else None

    def get_rsvp_status(self, obj):
        user = self.context.get("user")
        if not user:
            return None
        rsvp = RSVP.objects.filter(user=user, event=obj).first()
        return rsvp.status if rsvp else None

    def get_event_cover(self, obj):
        request = self.context.get("request")
        if obj.event_cover:
            return request.build_absolute_uri(obj.event_cover.url)
        return None
    def get_rsvp_created_at(self, obj):
            user = self.context.get("user")
            rsvp = RSVP.objects.filter(user=user, event=obj).first()
            if rsvp:
                return rsvp.created_at.isoformat()
            return None