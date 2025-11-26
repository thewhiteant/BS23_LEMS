from django.db import models
from django.conf import settings  

class Events(models.Model):
    title = models.CharField(max_length=200)
    desc = models.TextField()
    date_time = models.DateTimeField()
    location = models.CharField(max_length=200)
    max_attendees = models.PositiveIntegerField()
    price = models.IntegerField(default=0)
    event_cover = models.ImageField(upload_to="media/events/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title
    
    class Meta:                       
        verbose_name_plural = "Events"
        