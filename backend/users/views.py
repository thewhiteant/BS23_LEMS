from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Users
from django.shortcuts import get_object_or_404
import random
from django.core.mail import send_mail
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    ResetPasswordSerializer
)


# ------------------------
# Register
# ------------------------
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)

    def get(self, request):
        return Response({"message": "Method Not Allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


# ------------------------
# Login (return tokens in JSON)
# ------------------------
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response({
            "user": serializer.to_representation({"user": user})["user"],  # user data
            "access": str(access),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
                    request.user,
                    data=request.data,
                    partial=True,
                    context={'request': request}
                )
        serializer.is_valid(raise_exception=True)
        serializer.save()  
        return Response(
            ProfileSerializer(request.user, context={'request': request}).data,
            status=status.HTTP_200_OK
        )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            RefreshToken(refresh_token).blacklist()
            return Response({"message": "Logged out successfully."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

class IsAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        is_admin = user.is_staff 

        return Response({
            "is_admin": is_admin
        }, status=200)
    

    
class ForgotPasswordRequest(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required."},
                            status=status.HTTP_400_BAD_REQUEST)

        user = Users.objects.filter(email=email).first()

        if not user:
            return Response({"error": "No account found with this email."},
                            status=status.HTTP_404_NOT_FOUND)

        otp = random.randint(100000, 999999)
        user.reset_otp = otp
        user.save()

        send_mail(
            "Your Password Reset OTP",
            f"Your OTP is: {otp}",
            "noreply@example.com",
            [email],
            fail_silently=False,
        )

        return Response({"message": "OTP sent to your email."},
                        status=status.HTTP_200_OK)


# New endpoint: Verify OTP only
class VerifyResetOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response({"error": "Email and OTP are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        user = Users.objects.filter(email=email).first()
        if not user:
            return Response({"error": "User not found."},
                            status=status.HTTP_404_NOT_FOUND)

        if str(user.reset_otp) != str(otp):
            return Response({"error": "Invalid OTP."},
                            status=status.HTTP_400_BAD_REQUEST)

        # OTP is correct → allow user to proceed
        return Response({"message": "OTP verified successfully."},
                        status=status.HTTP_200_OK)


# Reset password after OTP verification
class ResetPasswordOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Password has been reset successfully."},
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)