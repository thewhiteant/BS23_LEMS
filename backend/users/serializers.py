from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Users
from config.constans import ResponseMessages


class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = [
            "id",
            "username",
            "email",
            "phone",
            "profile_image",
            "is_staff",
            "date_joined",
            "attend_number_of_event",
        ]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        user = Users.objects.filter(username=username).first()

        if not user or not user.check_password(password):
            raise serializers.ValidationError(ResponseMessages.INVALID_CREDENTIALS)

        attrs["user"] = user
        return attrs

    def get_tokens(self, user):
        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

    def to_representation(self, instance):
        user = instance["user"]

        return {
            "user": UserResponseSerializer(user, context=self.context).data,
            **self.get_tokens(user),
        }


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField()

    class Meta:
        model = Users
        fields = ["username", "email", "phone", "password", "password_confirm"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password": ResponseMessages.PASSWORD_MISMATCH}
            )
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        user = Users(**validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    def validate_email(self, value):
        if Users.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                {"email": ResponseMessages.EMAIL_ALREADY_EXISTS}
            )
        return value

    def to_representation(self, instance):
        return {"message": ResponseMessages.USER_REGISTERED}


class ProfileUpdateSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Users
        fields = ["username", "email", "phone", "profile_image"]

    def validate_username(self, value):
        if (
            value != self.instance.username
            and Users.objects.filter(username=value)
            .exclude(pk=self.instance.pk)
            .exists()
        ):
            raise serializers.ValidationError(
                {"username": ResponseMessages.USER_ALREADY_EXISTS}
            )
        return value

    def to_representation(self, instance):
        return UserResponseSerializer(instance, context=self.context).data


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        value = value.lower()
        if not Users.objects.filter(email=value).exists():
            raise serializers.ValidationError(ResponseMessages.INVALID_EMAIL)
        return value

    def to_representation(self, instance):
        return {"message": ResponseMessages.OTP_SENT}


class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get("email")
        otp = attrs.get("otp")

        user = Users.objects.filter(email=email, reset_otp=otp).first()
        if not user:
            raise serializers.ValidationError({"otp": ResponseMessages.INVALID_OTP})

        attrs["user"] = user
        return attrs

    def to_representation(self, instance):
        return {"message": ResponseMessages.OTP_VERIFIED}


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email", "").lower()
        otp = attrs.get("otp")
        new_pass = attrs.get("new_password")
        confirm_pass = attrs.get("confirm_password")

        if new_pass != confirm_pass:
            raise serializers.ValidationError(
                {"password": ResponseMessages.PASSWORD_MISMATCH}
            )

        user = Users.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError({"email": ResponseMessages.INVALID_EMAIL})

        if str(user.reset_otp) != str(otp):
            raise serializers.ValidationError({"otp": ResponseMessages.INVALID_OTP})

        attrs["user"] = user
        return attrs

    def save(self):
        user = self.validated_data.get("user")
        user.set_password(self.validated_data.get("new_password"))
        user.reset_otp = None
        user.save()
        return user

    def to_representation(self, instance):
        return {"message": ResponseMessages.PASS_RESET}
