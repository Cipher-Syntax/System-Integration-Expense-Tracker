from django.db import models
from django.contrib.auth.models import User
from budget_management_module.models import Budget

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255)
    
class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True)
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE, related_name="expenses")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)