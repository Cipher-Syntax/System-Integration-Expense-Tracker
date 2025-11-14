# notifications/models.py
from django.db import models
from django.contrib.auth import get_user_model
from budget_management_module.models import Budget  # import Budget

User = get_user_model()

class Notification(models.Model):
    STATUS_CHOICE = [
        ('Unsent', 'Unsent'),
        ('Sent', 'Sent')
    ]

    TYPE_CHOICE = [
        ('General', 'General'),         # Regular notifications
        ('Achievement', 'Achievement'), # Budget saving achievement
        ('Recommendation', 'Recommendation') # Suggestions / AI recommendations
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICE, default='General')
    status = models.CharField(max_length=50, choices=STATUS_CHOICE, default="Unsent")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    related_budget = models.ForeignKey(Budget, null=True, blank=True, on_delete=models.SET_NULL)
    achievement_details = models.TextField(null=True, blank=True)
    recommendation_details = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.type} - {self.message[:20]}"
