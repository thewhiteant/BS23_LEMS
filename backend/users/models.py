from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class Users(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    profile_image = models.ImageField(upload_to="users/profile/", blank=True, null=True)
    attend_number_of_event = models.PositiveIntegerField(default=0)
    reset_otp = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)



#     # Built-in fields inherited from AbstractUser
#     # id = AutoField(primary_key=True)  # automatically added
#     # password = models.CharField(max_length=128)
#     # last_login = models.DateTimeField(blank=True, null=True)
#     # is_superuser = models.BooleanField(default=False)
#     # username = models.CharField(max_length=150, unique=True)
#     # first_name = models.CharField(max_length=150, blank=True)
#     # last_name = models.CharField(max_length=150, blank=True)
#     # email = models.EmailField(blank=True)
#     # is_staff = models.BooleanField(default=False)
#     # is_active = models.BooleanField(default=True)
#     # date_joined = models.DateTimeField(auto_now_add=True)
