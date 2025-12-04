# urls.py
from django.urls import path
from .views import RegisterView, LoginView, ProfileView, LogoutView,IsAdminView
from rest_framework_simplejwt.views import TokenRefreshView
from rsvp.views import UserDashboardView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('dashboard/', UserDashboardView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path("auth/is-admin/", IsAdminView.as_view(), name="is-admin"),

]