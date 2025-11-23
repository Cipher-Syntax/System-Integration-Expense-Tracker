# budget_services.py
from decimal import Decimal
from django.db import models
from django.utils import timezone
from expense_management_module.models import Expense
from notification_management_module.models import Notification
from notification_management_module.services import (
    create_ai_budget_notification,
    create_ai_notifications_for_all_budgets,
    get_current_active_budget,
    get_all_active_budgets,
    get_category_with_most_expenses
)
from notification_management_module.utils import send_email_notification, send_sms_philsms, format_phone_number

# ------------------------------
# BUDGET ALERT FUNCTION
# ------------------------------
def check_budget_limit(user, budget):
    """
    Checks if user has reached 96% of budget threshold and creates notifications.
    If budget is exceeded, triggers AI recommendation based on spending categories.
    """
    total_expenses = Expense.objects.filter(
        budget=budget
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')

    limit = budget.limit_amount
    threshold = Decimal('0.96') * limit
    message = f"Alert - You have reached 96% of your budget {total_expenses} of {limit})"
    subject = "Budget Alert Notification"

    # # Check first if notification already exists
    # if total_expenses >= threshold and user.budget_alerts:
    #         if not Notification.objects.filter(user=user, type="General", message=message).exists():
    #             sms_sent = False
    
    #             # if user.email_notification and user.email:
    #             #     email_sent = send_email_notification(subject, message, user.email)
    
    #             if user.sms_notification and user.phone_number:
    #                 formatted_phone = format_phone_number(user.phone_number)
    #                 print(f"DEBUG: Sending SMS to {formatted_phone}")
    #                 sms_sent = send_sms_philsms(formatted_phone, message)
    
    #             # Create notification record after sending
    #             Notification.objects.create(
    #                 user=user,
    #                 message=message,
    #                 status="Sent" if sms_sent else "Unsent",
    #                 type="General"
    #             )    
    # If budget is exceeded, create AI recommendation for this specific budget
    if total_expenses > limit:
        create_ai_budget_notification(user, budget)


# ------------------------------
# BUDGET CREATION HANDLER
# ------------------------------
def on_budget_created(user, budget):
    """
    Called when a new budget is created.
    Checks if it needs notifications (e.g., if already has expenses).
    """
    total_expenses = Expense.objects.filter(
        budget=budget
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
    
    # If new budget already has expenses that exceed limit
    if total_expenses > budget.limit_amount:
        create_ai_budget_notification(user, budget)


# ------------------------------
# BULK EXPENSE CREATION HANDLER
# ------------------------------
def check_all_budgets_after_expense_creation(user):
    """
    Called after an expense is created.
    Checks ALL active budgets for the user to create necessary notifications.
    """
    create_ai_notifications_for_all_budgets(user)


# ------------------------------
# HELPER FUNCTIONS
# ------------------------------
def get_remaining_budget(budget, user):
    """
    Calculates remaining balance for a budget.
    Returns negative value if budget is exceeded.
    """
    total_expenses = Expense.objects.filter(
        budget=budget,
        user=user
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
    return budget.limit_amount - total_expenses


def get_total_expenses(user):
    """
    Calculates total expenses for all active budgets of a user.
    """
    total_expenses = Expense.objects.filter(
        user=user,
        budget__status="active"
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
    return total_expenses


def get_budget_summary(user, budget=None):
    """
    Returns a comprehensive budget summary for the user.
    
    Args:
        user: The user object
        budget: Optional specific budget. If None, gets current active budget.
    
    Returns dict with budget info or None if no budget found
    """
    if budget is None:
        active_budget = get_current_active_budget(user)
    else:
        active_budget = budget
    
    if not active_budget:
        return None
    
    total_expenses = Expense.objects.filter(
        user=user,
        budget=active_budget
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0.00')
    
    category_name, category_amount = get_category_with_most_expenses(user, active_budget)
    remaining = active_budget.limit_amount - total_expenses
    exceeded = total_expenses > active_budget.limit_amount
    
    return {
        'budget': active_budget,
        'total_expenses': total_expenses,
        'remaining_balance': remaining,
        'is_exceeded': exceeded,
        'top_category': category_name,
        'top_category_amount': category_amount,
        'limit': active_budget.limit_amount,
        'percentage_used': (total_expenses / active_budget.limit_amount * 100) if active_budget.limit_amount > 0 else 0
    }


def get_all_budget_summaries(user):
    """
    Returns summaries for ALL active budgets of the user.
    """
    active_budgets = get_all_active_budgets(user)
    summaries = []
    
    for budget in active_budgets:
        summary = get_budget_summary(user, budget)
        if summary:
            summaries.append(summary)
    
    return summaries


def get_expenses_by_category(user, budget):
    """
    Returns all expenses grouped by category for a specific budget.
    """
    expenses_by_category = Expense.objects.filter(
        user=user,
        budget=budget
    ).values('category__name', 'category__id').annotate(
        total=models.Sum('amount'),
        count=models.Count('id')
    ).order_by('-total')
    
    return list(expenses_by_category)