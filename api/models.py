from itertools import count
from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    name = models.CharField(max_length=30, blank=False)
    details = models.TextField(blank=False)
    price = models.IntegerField(blank=False)

    def __str__(self) -> str:
        return self.name


class ProductPtr(models.Model):
    pointing_product = models.ForeignKey(Product, blank=False, on_delete=models.CASCADE)
    pointing_user = models.ForeignKey(User, blank=False, on_delete=models.CASCADE)
    count = models.IntegerField(blank=False)

    def __str__(self) -> str:
        return f"[{self.pointing_user.username} -> {self.pointing_product.name} ({self.count})]"
