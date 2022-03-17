from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views


urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # -
    path("signup/", views.signup),
    path("test/", views.testpv),
    # -
    path("products/add_to_cart/", views.add_to_cart),
    path("products/", views.products),
    path("product/", views.product),
    path("user/orders/delete/", views.del_order),
    path("user/orders/change/", views.ch_order_count),
    path("user/orders/", views.get_cart),
]
