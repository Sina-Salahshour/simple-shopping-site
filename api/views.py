from itertools import count, product
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from rest_framework import status
from .serializers import UserSerializer, ProductSerializer, ProductPtrSerializer
from .models import Product, ProductPtr


@api_view(["POST"])
def signup(request: Request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid() and request.data.get("email", False):
        user = User.objects.create_user(
            request.data["username"],
            password=request.data["password"],
            email=request.data["email"],
        )
        return Response("Registered")
    else:
        return Response(
            "Invald username or password", status=status.HTTP_422_UNPROCESSABLE_ENTITY
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def testpv(request: Request):
    return Response(request.user.username)


@api_view(["GET"])
def products(request: Request):
    q = Product.objects.all()
    serializer = ProductSerializer(q, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def product(request: Request):
    q = Product.objects.get(id=request.data["id"])
    serializer = ProductSerializer(q)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request: Request):
    product = Product.objects.get(id=request.data["id"])
    q = ProductPtr.objects.filter(pointing_product=product, pointing_user=request.user)
    if len(q):
        q[0].count += request.data["count"]
        q[0].save()
    else:
        q = ProductPtr.objects.create(
            pointing_product=product,
            pointing_user=request.user,
            count=request.data["count"],
        )
    return Response("ok")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(request: Request):
    q = ProductPtr.objects.filter(pointing_user=request.user)
    serializer = ProductPtrSerializer(q, many=True)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def del_order(request: Request):
    product = Product.objects.get(id=request.data["id"])
    q = ProductPtr.objects.get(pointing_user=request.user, pointing_product=product)
    q.delete()
    return Response("ok")


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ch_order_count(request: Request):
    product = Product.objects.get(id=request.data["id"])
    q = ProductPtr.objects.get(pointing_user=request.user, pointing_product=product)
    q.count = request.data["count"]
    q.save()
    return Response("ok")
