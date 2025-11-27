# urls.py
from django.urls import path
from .views import RegisterUserView,RegisterPublicView,LinkGenaratorView,CancelRSVPView,Allrsvp
urlpatterns = [
        path('register/', RegisterUserView.as_view(), name='user_register'),
        path('guest-register/', RegisterPublicView.as_view(), name='guest_register'),
        path('cancel-rsvp/', CancelRSVPView.as_view(), name='cancel_rsvp'),
        path('invite-link',LinkGenaratorView.as_view(), name ="genarate_invite"),

        #test 
        path("allrsvp/",Allrsvp.as_view(),name="allview")


]