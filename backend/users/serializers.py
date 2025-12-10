from rest_framework import serializers
from .models import Users
from rest_framework_simplejwt.tokens import RefreshToken


class ResponseMessages:
    USER_REGISTERED = "User registered successfully"
    USER_ALREADY_EXISTS = "User already exists"
    EMAIL_ALREADY_EXISTS = "Email already used"
    INVALID_CREDENTIALS = "Invalid credentials"
    PASSWORD_MISMATCH = "Passwords do not match"
    RSVP_ALREADY_CANCELLED = "Already cancelled"
    EVENT_NOT_FOUND = "Event not found"
    REFRESH_TOKEN_REQUIRED = "Token is required"
    LOGOUT = "Logged out successfully"
    INVALID_TOKEN = "Invalid or expired token."
    INVALID_EMAIL = "No account found with this email."
    INVALID_OTP = "Invalid OTP."
    OTP_SENT = "OTP sent to your email."


class UserResponseSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

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
            

    def get_profile_image(self, obj):
        request = self.context.get("request")
        if obj.profile_image:
            url = obj.profile_image.url
            return request.build_absolute_uri(url) if request else url
        return None


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
            **self.get_tokens(user)
        }


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True,min_length=8)
    email = serializers.EmailField()


    class Meta:
        model = Users
        fields = ['username', 'email', 'phone', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password":ResponseMessages.PASSWORD_MISMATCH})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = Users(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate_email(self, value):
        if Users.objects.filter(email=value).exists():
            raise serializers.ValidationError({"email":ResponseMessages.EMAIL_ALREADY_EXISTS})
        return value
    
    def to_representation(self, instance):
        return {
            "message": ResponseMessages.USER_REGISTERED
        }


class ProfileUpdateSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)


    class Meta:
        model = Users
        fields = ['username', 'email', 'phone', 'profile_image']

    def validate_username(self, value):
        if value != self.instance.username and Users.objects.filter(username=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError({"username":ResponseMessages.USER_ALREADY_EXISTS})
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

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get("email")
        otp = attrs.get("otp")

        user = Users.objects.filter(email=email, reset_otp=otp).first()
        if not user:
            raise serializers.ValidationError({"otp":ResponseMessages.INVALID_OTP})

        attrs["user"] = user
        return attrs


class ResetPasswordSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Users
        fields = ["new_password", "confirm_password"]

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"password": ResponseMessages.PASSWORD_MISMATCH})
        return attrs
    
    def save(self, **kwargs):
        user = self.context.get("user")
        user.set_password(self.validated_data["new_password"])
        user.reset_otp = None  # Clear the OTP after successful password reset
        user.save()
        return user
    
    
    # new_password = serializers.CharField(write_only=True, min_length=8)
    # confirm_password = serializers.CharField(write_only=True, min_length=8)
    # email = serializers.EmailField(write_only=True)

    # class Meta:
    #     model = Users
    #     fields = ["email", "new_password", "confirm_password"]

    # def validate(self, attrs):
    #     if attrs["new_password"] != attrs["confirm_password"]:
    #         raise serializers.ValidationError("Passwords do not match.")
    #     return attrs

    # def validate_email(self, value):
    #     if not Users.objects.filter(email=value).exists():
    #         raise serializers.ValidationError("No account found with this email.")
    #     return value

    # def save(self, **kwargs):
    #     email = self.validated_data["email"]
    #     user = Users.objects.filter(email=email).first()

    #     if not user:
    #         raise serializers.ValidationError({"email": "User not found."})

    #     # Reset password directly
    #     user.set_password(self.validated_data["new_password"])
    #     user.save()

    #     return user