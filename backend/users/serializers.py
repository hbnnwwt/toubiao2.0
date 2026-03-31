from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """用户序列化器"""

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'department', 'avatar', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    """用户创建序列化器"""
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'role', 'phone', 'department']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserSimpleSerializer(serializers.ModelSerializer):
    """简单用户序列化器"""
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'role', 'department']

    def get_name(self, obj):
        return obj.get_full_name() or obj.username
