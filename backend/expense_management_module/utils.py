# budget_services.py
from decimal import Decimal
from django.db import models
from expense_management_module.models import Expense
from notification_management_module.models import Notification
from notification_management_module.services import create_ai_budget_notification
from notification_management_module.utils import send_email_notification, send_sms_philsms, format_phone_number

# ------------------------------
# BUDGET ALERT FUNCTION
# ------------------------------
def check_budget_limit(user, budget):
    total_expenses = Expense.objects.filter(
        budget=budget
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')

    limit = budget.limit_amount
    threshold = Decimal('0.96') * limit
    message = f"Alert - You have reached 96% of your budget ({total_expenses} of {limit})"
    subject = "Budget Alert Notification"

    # Check first if notification already exists
    if total_expenses >= threshold and user.budget_alerts:
        if not Notification.objects.filter(user=user, type="General", message=message).exists():
            email_sent = sms_sent = False

            if user.email_notification and user.email:
                email_sent = send_email_notification(subject, message, user.email)

            if user.sms_notification and user.phone_number:
                formatted_phone = format_phone_number(user.phone_number)
                print(f"DEBUG: Sending SMS to {formatted_phone}")
                sms_sent = send_sms_philsms(formatted_phone, message)

            # Create notification record after sending
            Notification.objects.create(
                user=user,
                message=message,
                status="Sent" if email_sent or sms_sent else "Unsent",
                type="General"
            )
            
    if total_expenses > limit:
        create_ai_budget_notification(user)

# ------------------------------
# HELPER FUNCTIONS
# ------------------------------
def get_remaining_budget(budget, user):
    """Calculates remaining balance for a budget."""
    total_expenses = Expense.objects.filter(
        budget=budget,
        user=user
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
    return budget.limit_amount - total_expenses

def get_total_expenses(user):
    """Calculates total expenses for all active budgets of a user."""
    total_expenses = Expense.objects.filter(
        user=user,
        budget__status="active"
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
    return total_expenses
