from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class Budget(models.Model):
    STATUS_CHOICE = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('full', 'Full'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="budgets")
    limit_amount = models.DecimalField(max_digits=10000, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICE, default="active")
    start_date = models.DateField()
    end_date = models.DateField()
    
    def save(self, *args, **kwargs):
        if not self.pk:
            if self.status == "active":
                Budget.objects.filter(user=self.user, status="active").update(status="expired")
        super().save(*args, **kwargs)

        
    def __str__(self):
        return f"{self.user} - {self.status} ({self.limit_amount})"
