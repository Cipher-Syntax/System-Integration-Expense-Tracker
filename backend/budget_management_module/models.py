from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="budgets")
    limit_amount = models.DecimalField(max_digits=10000, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
