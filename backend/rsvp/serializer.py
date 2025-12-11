from rest_framework import serializers
from .models import RSVP, InviteToken
from users.models import Users

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from config.constans import ResponseMessages


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ["id", "username", "email", "phone"]


class RSVPSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    used_by = serializers.SerializerMethodField()
    event = serializers.HiddenField(default=None)

    class Meta:
        model = RSVP
        fields = "__all__"

    def get_used_by(self, obj):
        if obj.user:
            return obj.user.username
        return obj.guest_email

    def create(self, validated_data):
        user = self.context.get("user")
        event = self.context.get("event")

        if RSVP.objects.filter(event=event, user=user).exists():
            raise ValidationError({"error": ResponseMessages.RSVP_EXISTS})

        current = RSVP.objects.filter(event=event, status="confirmed").count()
        if current >= event.max_attendees:
            raise ValidationError({"error": ResponseMessages.MAX_ATTENDEES_REACHED})

        rsvp = RSVP.objects.create(
            user=user,
            event=event,
            guest_email=user.email,
            status="confirmed",
        )

        user.attend_number_of_event = (user.attend_number_of_event or 0) + 1
        user.save()
        event.attendees = (event.attendees or 0) + 1
        event.save()

        return rsvp


class PublicRSVPSerializer(serializers.ModelSerializer):
    token = serializers.UUIDField(write_only=True)
    guest_email = serializers.EmailField()
    event = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = RSVP
        fields = ["token", "guest_email", "event", "status", "created_at"]

    def validate_token(self, value):
        try:
            invite = InviteToken.objects.get(token=value)
        except InviteToken.DoesNotExist:
            raise serializers.ValidationError(ResponseMessages.INVALID_TOKEN)

        if invite.is_expired():
            raise serializers.ValidationError(ResponseMessages.TOKEN_EXPIRED)

        if invite.is_used:
            raise serializers.ValidationError(ResponseMessages.TOKEN_ALREADY_USED)

        self.context["invite"] = invite
        return value

    def create(self, validated_data):
        guest_email = validated_data.get("guest_email")
        invite = self.context.get("invite")
        event = invite.event

        confirmed_count = RSVP.objects.filter(
            event=event, status=RSVP.Status.CONFIRMED
        ).count()
        if event.max_attendees and confirmed_count >= event.max_attendees:
            raise serializers.ValidationError(
                {"error": ResponseMessages.MAX_ATTENDEES_REACHED}
            )

        rsvp = RSVP.objects.create(
            event=event,
            guest_email=guest_email,
            invite_token=invite,
            status=RSVP.Status.CONFIRMED,
        )

        invite.is_used = True
        invite.save()

        return rsvp


class CancelRSVPSerializer(serializers.Serializer):
    token = serializers.UUIDField()

    def validate_token(self, value):
        try:
            rsvp = RSVP.objects.get(token=value)
        except RSVP.DoesNotExist:
            raise serializers.ValidationError("Invalid RSVP token")

        if rsvp.status == RSVP.Status.CANCELLED:
            raise serializers.ValidationError("RSVP is already cancelled")

        self.context["rsvp"] = rsvp
        return value

    def save(self):
        rsvp = self.context["rsvp"]
        rsvp.status = RSVP.Status.CANCELLED
        rsvp.save()

        if rsvp.invite_token:
            rsvp.invite_token.delete()

        return rsvp


class InviteTokenSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source="event.title", read_only=True)
    expired = serializers.SerializerMethodField()
    rsvps = RSVPSerializer(many=True, read_only=True)

    class Meta:
        model = InviteToken
        fields = [
            "id",
            "token",
            "event_title",
            "created_at",
            "is_used",
            "expired",
            "rsvps",
        ]

    def get_expired(self, obj):
        return obj.is_expired(hours=12)
