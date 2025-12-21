from django.db import migrations
import os

def create_superuser(apps, schema_editor):
    User = apps.get_model("users", "User")

    username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
    email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

    if not username or not password:
        return

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )

class Migration(migrations.Migration):

    dependencies = [
        ("users", "000X_previous_migration"),
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]
