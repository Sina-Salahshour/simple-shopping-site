from dataclasses import fields
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product, ProductPtr


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ProductPtrSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPtr
        fields = "__all__"
