from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Expense
from .utils import check_budget_limit

@receiver(post_save, sender=Expense)
def trigger_budget_check(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        budget = instance.budget
        check_budget_limit(user, budget)