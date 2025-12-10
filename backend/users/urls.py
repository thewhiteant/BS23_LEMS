from django.urls import path
from .views import (
    RegisterView,
    LoginView, 
    ProfileView, 
    LogoutView,
    # IsAdminView, 
    ResetPasswordOTP,
    ForgotPasswordRequest,
    VerifyResetOTP
)
from rest_framework_simplejwt.views import TokenRefreshView
from rsvp.views import UserDashboardView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path("reset-password/", ResetPasswordOTP.as_view(), name="reset-password"),
    path('dashboard/', UserDashboardView.as_view(), name='dashboard'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path("forgot-password/", ForgotPasswordRequest.as_view(), name="forgot-password"),
    path("verify-otp/", VerifyResetOTP.as_view(), name="verify-otp"),


    # path("is-admin/", IsAdminView.as_view(), name="is-admin"),
]
