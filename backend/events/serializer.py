from rest_framework import serializers
from .models import Events
from rsvp.models import RSVP

class EventSerializer(serializers.ModelSerializer):


    class Meta:
        model = Events
        fields = "__all__"  

class CustomTokenAddedSerializer(serializers.ModelSerializer):
    rsvp_token = serializers.SerializerMethodField()
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
            "rsvp_token"  
        ]

    def get_rsvp_token(self, obj):
        user = self.context.get("user")
        if not user:
            return None

        rsvp = RSVP.objects.filter(user=user, event=obj).first()
        if rsvp:
            return str(rsvp.token)
        return None

