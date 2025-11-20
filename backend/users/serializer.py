from rest_framework import serializers
from .models import users


class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = [
            "user_id",
            "username",
            "email",
            "phone",
            "profile_image",
            "is_admin",
            "date_join",
            "attend_number_of_event",
        ]
        

