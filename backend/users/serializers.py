from rest_framework import serializers
from .models import Users
from rest_framework_simplejwt.tokens import RefreshToken



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = Users
        fields = ['username', 'email', 'phone', 'password', 'password_confirm']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = Users(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs["username"]
        password = attrs["password"]

        user = Users.objects.filter(username=username).first()
        if not user or not user.check_password(password):
            raise serializers.ValidationError("Invalid username or password.")

        attrs["user"] = user
        return attrs

    def to_representation(self, instance):
        user = instance["user"]
        request = self.context.get("request")
        refresh = RefreshToken.for_user(user)
        self.context["refresh_token"] = str(refresh)
        return {
            "user": UserResponseSerializer(user, context=self.context).data,
            "access": str(refresh.access_token),
        }


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



















class ProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = Users
        fields = [
            'id', 
            'username', 'email', 'phone', 'profile_image', 'is_staff', 'date_joined', 'attend_number_of_event']
        read_only_fields = ['id', 'is_staff', 'date_joined', 'attend_number_of_event']

    def get_profile_image(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            url = obj.profile_image.url
            return request.build_absolute_uri(url) if request else url
        return None



class ProfileUpdateSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Users
        fields = ['username', 'email', 'phone', 'profile_image']

    def validate_email(self, value):
        if value != self.instance.email and Users.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        if value != self.instance.username and Users.objects.filter(username=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value


