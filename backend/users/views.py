from time import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import random
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    ProfileUpdateSerializer,
    ResetPasswordSerializer,
    UserResponseSerializer,
    ResponseMessages,
    ForgotPasswordSerializer,
    OTPVerifySerializer,
)
from .tasks import send_mail_x
from .models import Users


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status.HTTP_201_CREATED)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserResponseSerializer(request.user, context={"request": request})

        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:

            return Response(
                {"error": ResponseMessages.REFRESH_TOKEN_REQUIRED},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            RefreshToken(refresh_token).blacklist()

            return Response(
                {"message": ResponseMessages.LOGOUT},
                status=status.HTTP_205_RESET_CONTENT,
            )
        except Exception:

            return Response(
                {"error": ResponseMessages.INVALID_TOKEN},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ForgotPasswordRequest(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower()
        user = Users.objects.filter(email=email).first()
        if not user:
            return Response({"message": ResponseMessages.INVALID_EMAIL}, status=400)
        otp = random.randint(100000, 999999)
        user.reset_otp = otp
        user.save()
        # send_mail_x.delay("Your Password Reset OTP", f"Your OTP is: {otp}", email)
        print(f"Time : {timezone.now()} Your OTP is: {otp} for email: {email}")  

        return Response({"message": ResponseMessages.OTP_SENT}, status=200)


class VerifyResetOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordOTP(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IsAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        is_admin = user.is_staff

        return Response({"is_admin": is_admin}, status=200)
