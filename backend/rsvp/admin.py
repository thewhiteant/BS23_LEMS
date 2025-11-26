from django.contrib import admin
from .models import RSVP,InviteToken


# Register your models here.

admin.site.register(RSVP)
admin.site.register(InviteToken)
