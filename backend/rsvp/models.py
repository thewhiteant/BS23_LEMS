# models.py
from django.db import models
from django.conf import settings
from events.models import Events  # make sure this is correct
from django.utils import timezone
import uuid
from datetime import timedelta


class InviteToken(models.Model):
    event = models.ForeignKey(Events, on_delete=models.CASCADE, related_name="invite_tokens")
    token = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)  # Only one person can use this link

    def is_expired(self, hours=24):  # you can change to 12, 48, etc.
        expiry = self.created_at + timedelta(hours=hours)
        return timezone.now() > expiry

    def __str__(self):
        return f"Invite for {self.event.title} - Used: {self.is_used}"


class RSVP(models.Model):
    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="rsvps"
    )

    event = models.ForeignKey(Events, on_delete=models.CASCADE, related_name="rsvps")
    guest_email = models.EmailField()

    # This is the key: link RSVP back to the exact invite link used
    invite_token = models.ForeignKey(
        InviteToken,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="rsvps"
    )

    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)  # for cancel link
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="confirmed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("event", "guest_email")  

    def __str__(self):
        return f"{self.guest_email or self.user} → {self.event.title}"