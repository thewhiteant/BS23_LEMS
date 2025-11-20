from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

class users(models.Model):
    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=250, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Django hashed password
    phone = models.CharField(max_length=20, blank=True, null=True)
    profile_image = models.ImageField(upload_to="users/profile/", blank=True, null=True)
    is_admin = models.BooleanField(default=False)
    date_join = models.DateTimeField(default=timezone.now)
    attend_number_of_event = models.PositiveIntegerField(default=0)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    def __str__(self):
        return self.username
