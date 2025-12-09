# models.py (for RSVP and InviteToken)

from django.db import models
from django.conf import settings
from events.models import Events 
from django.utils import timezone
import uuid
from datetime import timedelta


class InviteToken(models.Model):
    event = models.ForeignKey(Events, on_delete=models.CASCADE, related_name="invite_tokens")
    token = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False) 

    def is_expired(self, hours=24): 
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
    
    # 🟢 FIX 1: Make guest_email explicitly nullable and 
    guest_email = models.EmailField(blank=True, null=True) 

    invite_token = models.ForeignKey(
        InviteToken,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="rsvps"
    )

    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False) 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="confirmed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (("event", "user"),) 

    def __str__(self):
        # Update display to show the email if user is not set
        return f"{self.user.get_username() if self.user else self.guest_email} → {self.event.title}"