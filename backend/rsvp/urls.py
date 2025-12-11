# urls.py
from django.urls import path
from .views import (
    RegisterUserView,
    RegisterPublicView,
    LinkGenaratorView,
    CancelRSVPView,
    EventRSVPListView,
    SendEmailAPIView,
    InviteListView,
    InviteDeleteView,
    InviteExpireView,
)


urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="user_register"),
    path(
        "guest-register/<str:token>",
        RegisterPublicView.as_view(),
        name="guest_register",
    ),
    path("guest-register/", RegisterPublicView.as_view(), name="guest_register_post"),
    path("cancel-rsvp/", CancelRSVPView.as_view(), name="cancel_rsvp"),
    path("invite-link", LinkGenaratorView.as_view(), name="genarate_invite"),
    path("list/", EventRSVPListView.as_view(), name="event-rsvp-list"),
    path("send-mail/", SendEmailAPIView.as_view(), name="event-rsvp-list"),
    path("invite-tokens/", InviteListView.as_view(), name="invite-list"),
    path(
        "invite-tokens/<int:token_id>/delete/",
        InviteDeleteView.as_view(),
        name="invite-delete",
    ),
    path(
        "invite-tokens/<int:token_id>/expire/",
        InviteExpireView.as_view(),
        name="invite-expire",
    ),
]
