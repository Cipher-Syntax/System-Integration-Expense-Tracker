from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class Notification(models.Model):
    STATUS_CHOICE = [
        ('Unsent', 'Unsent'),
        ('Sent', 'Sent')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICE, default="Unsent")
    created_at = models.DateTimeField(auto_now_add=True)
    
    
