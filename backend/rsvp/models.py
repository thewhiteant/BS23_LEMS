from django.db import models
from django.conf import settings
from events.models import Events
from django.utils import timezone
import uuid
from datetime import timedelta


class InviteToken(models.Model):
    event = models.ForeignKey(Events, on_delete=models.CASCADE, related_name="invite_tokens")
    token = models.CharField(max_length=30, default=uuid.uuid4, unique=True, db_index=True)
    created_at = models.DateTimeField(default=timezone.now)



    #link Active 12h
    def is_expired(self, hours=12):
        return timezone.now() > (self.created_at + timedelta(hours=hours))

    def __str__(self):
        return f"InviteToken for {self.event} ({self.token})"


class RSVP(models.Model):

    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]

    # existing users
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="rsvps"
    )

    event = models.ForeignKey(
        Events,
        on_delete=models.CASCADE,
        related_name="rsvps"
    )

    # guest email (for non-registered users)
    guest_email = models.EmailField(null=True, blank=True)

    # final token AFTER RSVP created
    token = models.CharField(
        max_length=30,
        default=uuid.uuid4,
        unique=True,
        db_index=True
    )
    token_created_at = models.DateTimeField(auto_now_add=True)

    # status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="confirmed"
    )

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = [
            ("event", "user"),
            ("event", "guest_email"),
        ]
    #cancel possible 72 after
    def is_token_expired(self, ttl_hours=72):
        return timezone.now() > (self.token_created_at + timedelta(hours=ttl_hours))

    def __str__(self):
        if self.user:
            return f"RSVP {self.user} -> {self.event}"
        return f"RSVP guest:{self.guest_email} -> {self.event}"
