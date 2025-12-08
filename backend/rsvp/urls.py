# urls.py
from django.urls import path
from .views import (
    RegisterUserView,
    RegisterPublicView,
    LinkGenaratorView,
    CancelRSVPView,
    EventRSVPListView,
    SendEmailAPIView
    )



urlpatterns = [
        path('register/', RegisterUserView.as_view(), name='user_register'),
        path('guest-register/<str:token>', RegisterPublicView.as_view(), name='guest_register'),
        path('guest-register/', RegisterPublicView.as_view(), name='guest_register_post'),
        path('cancel-rsvp/', CancelRSVPView.as_view(), name='cancel_rsvp'),
        path('invite-link',LinkGenaratorView.as_view(), name ="genarate_invite"),
        path("list/", EventRSVPListView.as_view(), name="event-rsvp-list"),
        path("send-mail/", SendEmailAPIView.as_view(), name="event-rsvp-list"),
        
        #test 
        # path("allrsvp/",Allrsvp.as_view(),name="allview")


]