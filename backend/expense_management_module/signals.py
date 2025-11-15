# expense_management_module/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from .models import Expense
from .utils import check_budget_limit

@receiver(post_save, sender=Expense)
def trigger_budget_check(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        budget = instance.budget

        # Delay execution until after the DB transaction commits
        def run_budget_check():
            print(f"DEBUG: Running budget check for user {user.username}, budget {budget.limit_amount}")
            check_budget_limit(user, budget)

        transaction.on_commit(run_budget_check)
