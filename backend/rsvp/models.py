from django.db import models
from django.conf import settings
from events.models import Events
from django.utils import timezone
import uuid
from datetime import timedelta

# Create your models here.



class RSVP(models.Model):
    
    #change those in functions 
    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("pending", "Pending"),   
    ]

    #existing users
    user = models.ForeignKey(settings.AUTH_USER_MODEL ,null=True,blank=True,on_delete=models.SET_NULL,related_name="rsvps")
    event = models.ForeignKey(Events,on_delete=models.CASCADE,related_name="rsvps")


    #guest 
    guest_email = models.EmailField(null=True,blank=True)
#     guest_phone = models.CharField(max_length=30,null=True,blank=True)

    #ganrating Token
    token = models.CharField(max_length=30, default=uuid.uuid4,db_index=True,unique=True)
    token_created_at = models.DateTimeField(auto_now_add=True)

    #infograph
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="confirmed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
            unique_together = [
                  ("event","user"),
                  ("event","guest_email"),
            ]

    def is_token_expired(self,ttl_hours=72):
          return timezone.now() > (self.token_created_at+timedelta(hours=ttl_hours))
    

    def __str__(self):
          if self.user:
            return f"RSVP {self.user} -> {self.event}"
          return f"RSVP guest:{self.guest_email or self.guest_phone} -> {self.event}"
    
