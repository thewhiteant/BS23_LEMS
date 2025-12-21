from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

class Users(AbstractUser):
    
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    profile_image = models.ImageField(
        upload_to="users/profile/",
        blank=True,
        null=True
    )
    attend_number_of_event = models.PositiveIntegerField(default=0)
    reset_otp = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)



from django.contrib.auth import get_user_model

User = get_user_model()
User.objects.create_superuser(
    username="whiteant",
    email="trafi227@gmail.com",
    password="whiteant321"
)
