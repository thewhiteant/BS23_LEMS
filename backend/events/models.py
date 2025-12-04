from django.db import models
from django.conf import settings  
from django.utils import timezone

class Events(models.Model):
    title = models.CharField(max_length=200)
    desc = models.TextField()
    date_time = models.DateTimeField()
    location = models.CharField(max_length=200)
    max_attendees = models.PositiveIntegerField()
    attendees = models.PositiveIntegerField(default=0)
    price = models.FloatField(default=0.00)
    event_cover = models.ImageField(upload_to="media/events/", blank=True, null=True)


    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title
    
    class Meta:                       
        verbose_name_plural = "Events"
        