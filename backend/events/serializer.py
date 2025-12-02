from rest_framework import serializers
from .models import Events
from django.conf import settings

class EventSerializer(serializers.ModelSerializer):
    event_cover_url = serializers.SerializerMethodField()

    class Meta:
        model = Events
        fields = "__all__"  # keep all fields
        # optionally, replace 'event_cover' with 'event_cover_url' if you want only the full URL

    def get_event_cover_url(self, obj):
        request = self.context.get('request')
        if obj.event_cover:
            # if request exists, use it to build absolute URI
            if request:
                return request.build_absolute_uri(obj.event_cover.url)
            # fallback to BASE_URL from settings
            return f"{settings.BASE_URL}{obj.event_cover.url}"
        return None
