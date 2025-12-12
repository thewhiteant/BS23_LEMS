from celery import shared_task
from django.core.mail import send_mail


@shared_task
def send_mail_x(subject, message, recipient):
    send_mail(
        subject,
        message,
        "noreply@example.com",
        [recipient],
        fail_silently=False,
    )
