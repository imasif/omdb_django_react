from django.contrib.auth.models import Group
from django.contrib.auth.password_validation import validate_password
from django.core.mail import EmailMessage
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from omdb_movies.core.models import CustomUser, Favorite


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class UserSerializer(serializers.ModelSerializer):
    favorites = serializers.SlugRelatedField(many=True, read_only=True, slug_field='tmdb_id')

    class Meta:
        model = CustomUser
        fields = ['url', 'email', 'first_name', 'last_name', 'favorites']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class FavoriteSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.SlugRelatedField(
         queryset = CustomUser.objects.all(),
         slug_field='id'
    )

    class Meta:
        model = Favorite
        fields = ['tmdb_id', 'user']
