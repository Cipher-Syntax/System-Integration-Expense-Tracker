# notifications/budget_check.py
from decimal import Decimal
from notification_management_module.utils import send_email_notification, send_sms_notification
from notification_management_module.models import Notification
from expense_management_module.models import Expense
from notification_management_module.services import create_ai_budget_notification
from django.db import models

def check_budget_limit(user, budget):
    """
    Checks budget limits for a user: 
    Sends general alerts if near threshold.
    Calls AI-based recommendation or achievement notifications.
    """
    total_expenses = Expense.objects.filter(budget=budget).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
    limit = budget.limit_amount
    threshold = Decimal('0.96') * limit

    # 1️⃣ General budget alert (email/SMS)
    if total_expenses >= threshold and user.budget_alerts:
        message = f"⚠️ Alert: You've reached 96% of your budget ({total_expenses}/{limit})."
        subject = "Budget Alert Notification"

        email_sent = sms_sent = False

        if user.email_notification and user.email:
            email_sent = send_email_notification(subject, message, user.email)

        if user.sms_notification and user.phone_number:
            sms_sent = send_sms_notification(user.phone_number, message)

        if not Notification.objects.filter(user=user, type="General", message=message).exists():
            Notification.objects.create(
                user=user,
                message=message,
                status="Sent" if email_sent or sms_sent else "Unsent",
                type="General"
            )

    # 2️⃣ AI-based Recommendation / Achievement
    create_ai_budget_notification(user)


def get_remaining_budget(budget, user):
    """
    Returns the remaining budget for a user for a given budget period.
    """
    total_expenses = Expense.objects.filter(
        budget=budget,
        user=user
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')

    remaining_balance = budget.limit_amount - total_expenses
    return remaining_balance


def get_total_expenses(user):
    """
    Returns the total expenses for a user in active budgets.
    """
    total_expenses = Expense.objects.filter(user=user, budget__status="active").aggregate(
        total=models.Sum('amount')
    )['total'] or Decimal('0.00')
    return total_expenses
