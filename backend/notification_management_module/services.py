from decimal import Decimal
from django.utils import timezone
from django.db import models
from django.conf import settings
import re

from openai import OpenAI  # type: ignore

from .models import Notification
from budget_management_module.models import Budget
from expense_management_module.models import Expense, Category

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# ------------------------------------------------------------
# 1. GET ACTIVE BUDGET
# ------------------------------------------------------------
def get_current_active_budget(user):
    """
    Returns the user's current active budget based on today's date.
    """
    today = timezone.now().date()
    return Budget.objects.filter(
        user=user,
        start_date__lte=today,
        end_date__gte=today
    ).order_by('-start_date').first()


# ------------------------------------------------------------
# 2. GET ALL ACTIVE BUDGETS FOR USER
# ------------------------------------------------------------
def get_all_active_budgets(user):
    """
    Returns all active budgets for the user (not just current one).
    Useful if user has multiple concurrent budgets.
    """
    today = timezone.now().date()
    return Budget.objects.filter(
        user=user,
        start_date__lte=today,
        end_date__gte=today,
        status="active"
    ).order_by('-start_date')


# ------------------------------------------------------------
# 3. GET CATEGORY WITH MOST EXPENSES
# ------------------------------------------------------------
def get_category_with_most_expenses(user, budget):
    """
    Returns the category with the highest total expenses for the given budget.
    Returns: (category_name, total_amount, category_percentage)
    """
    expenses_by_category = Expense.objects.filter(
        user=user,
        budget=budget
    ).values('category__name').annotate(
        total=models.Sum('amount')
    ).order_by('-total').first()

    if expenses_by_category:
        category_name = expenses_by_category['category__name'] or 'Uncategorized'
        total_amount = expenses_by_category['total']
        return category_name, total_amount
    
    return None, Decimal('0')


# ------------------------------------------------------------
# 4. AI RECOMMENDATION FUNCTION (ENHANCED)
# ------------------------------------------------------------
def get_ai_budget_recommendation(budget_limit, total_spent, category_name=None, category_amount=None):
    """
    AI-powered budget recommendation using gpt-4o-mini.
    Now includes specific category information for targeted advice.
    Always returns a safe fallback if API fails or quota is exceeded.
    """
    budget_exceeded = total_spent - budget_limit
    exceeded_percentage = ((total_spent - budget_limit) / budget_limit * 100) if budget_limit > 0 else 0
    
    if category_name and category_amount:
        prompt = (
            f"The user's budget limit is ₱{budget_limit} and they have spent ₱{total_spent} (exceeded by ₱{budget_exceeded:.2f} or {exceeded_percentage:.1f}%). "
            f"The highest spending category is '{category_name}' with ₱{category_amount:.2f} spent. "
            f"Give a friendly, short 3-4 sentence recommendation on how they can reduce spending on '{category_name}' "
            f"and manage their budget better. Be specific to the '{category_name}' category."
        )
    else:
        prompt = (
            f"The user's budget is ₱{budget_limit} and they have spent ₱{total_spent} (exceeded by ₱{budget_exceeded:.2f}). "
            "Give a friendly, short 3-4 sentence recommendation on how they can manage their spending better."
        )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a friendly and practical financial advisor. Provide specific, actionable advice."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=150,
            temperature=0.7,
        )
        message = response.choices[0].message.content.strip()
        return message or "Keep track of your spending to stay within your budget."
    except Exception as e:
        print("AI Error:", e)
        if category_name:
            return f"Try to reduce your spending on {category_name} to stay within budget. Set limits on {category_name} purchases and track them daily."
        return "Keep track of your spending to stay within your budget."


# ------------------------------------------------------------
# 5. CLEAN AI TEXT FOR NOTIFICATION
# ------------------------------------------------------------
def ai_text_to_bullets(text):
    """
    Converts numbered or dash lists from AI output into clean bullets.
    Example: '1. Track spending' -> '• Track spending'
    """
    # Convert numbered lists (1., 2., etc.) to bullets
    text = re.sub(r'^\s*\d+\.\s+', '• ', text, flags=re.MULTILINE)
    # Convert dash or asterisk lists to bullets
    text = re.sub(r'^\s*[-*]\s+', '• ', text, flags=re.MULTILINE)
    return text.strip()


# ------------------------------------------------------------
# 6. CHECK IF RECOMMENDATION ALREADY EXISTS FOR BUDGET
# ------------------------------------------------------------
def has_recommendation_for_budget(user, budget):
    """
    Checks if a recommendation notification already exists for this specific budget.
    Returns True if exists, False otherwise.
    """
    return Notification.objects.filter(
        user=user,
        type="Recommendation",
        related_budget=budget
    ).exists()


# ------------------------------------------------------------
# 7. RECOMMENDATION NOTIFICATION (ENHANCED - MULTIPLE BUDGETS SUPPORT)
# ------------------------------------------------------------
def create_recommendation_notification(user, budget=None):
    """
    Creates a Recommendation notification if user exceeded their budget.
    Now supports multiple budgets per user.
    
    Args:
        user: The user object
        budget: Optional specific budget. If None, checks all active budgets.
    
    Returns:
        Notification object if created, None otherwise
    """
    # If specific budget provided, check only that one
    if budget:
        budgets_to_check = [budget]
    else:
        # Check all active budgets for the user
        budgets_to_check = get_all_active_budgets(user)
    
    # Process each budget
    for current_budget in budgets_to_check:
        # Skip if recommendation already exists for this budget
        if has_recommendation_for_budget(user, current_budget):
            continue
        
        total_spent = Expense.objects.filter(
            user=user,
            budget=current_budget
        ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0')

        # Check if budget is exceeded
        if total_spent > current_budget.limit_amount:
            # Get the category with most expenses
            category_name, category_amount = get_category_with_most_expenses(user, current_budget)
            
            # Calculate exceeded amount
            exceeded_amount = total_spent - current_budget.limit_amount
            exceeded_percentage = ((exceeded_amount / current_budget.limit_amount) * 100) if current_budget.limit_amount > 0 else 0

            # Get AI recommendation with category info
            recommendation = get_ai_budget_recommendation(
                current_budget.limit_amount,
                total_spent,
                category_name,
                category_amount
            )
            recommendation = ai_text_to_bullets(recommendation)

            # Build detailed message
            if category_name:
                message_text = (
                    f"⚠️ Budget Exceeded! You've spent ₱{total_spent:.2f} out of ₱{current_budget.limit_amount:.2f} "
                    f"(exceeded by ₱{exceeded_amount:.2f} or {exceeded_percentage:.1f}%). "
                    f"Your highest spending category is '{category_name}' with ₱{category_amount:.2f}. "
                    f"Here's a recommendation:"
                )
            else:
                message_text = (
                    f"⚠️ You've exceeded your budget! "
                    f"You've spent ₱{total_spent:.2f} out of ₱{current_budget.limit_amount:.2f}. "
                    f"Here's a recommendation:"
                )

            notification = Notification.objects.create(
                user=user,
                message=message_text,
                type="Recommendation",
                recommendation_details=recommendation,
                status="Sent",
                related_budget=current_budget
            )

            return notification
    
    return None


# ------------------------------------------------------------
# 8. ACHIEVEMENT NOTIFICATION
# ------------------------------------------------------------
def create_achievement_notification(user):
    """
    Creates an Achievement notification if the user saved money in a completed past budget.
    Only creates one notification per budget to avoid duplicates.
    """
    today = timezone.now().date()

    budget = Budget.objects.filter(
        user=user,
        end_date__lt=today,
        status="active"
    ).order_by('-end_date').first()

    if not budget:
        return None

    # prevent duplicates for this specific budget
    if Notification.objects.filter(
        user=user,
        type="Achievement",
        related_budget=budget
    ).exists():
        return None

    total_spent = Expense.objects.filter(
        user=user,
        budget=budget
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0')

    saved_amount = budget.limit_amount - total_spent

    if saved_amount > 0:
        message_text = f"🎉 Congrats! You saved ₱{saved_amount:.2f} from your budget of ₱{budget.limit_amount:.2f}."
        achievement_text = f"You managed to save ₱{saved_amount:.2f} this month."
        achievement_text = ai_text_to_bullets(achievement_text)

        notification = Notification.objects.create(
            user=user,
            message=message_text,
            type="Achievement",
            achievement_details=achievement_text,
            status="Sent",
            related_budget=budget
        )
        return notification

    return None


# ------------------------------------------------------------
# 9. MAIN ENTRY POINT - SINGLE BUDGET
# ------------------------------------------------------------
def create_ai_budget_notification(user, budget=None):
    """
    Main function to trigger either Recommendation or Achievement notifications.
    Priority: Recommendation > Achievement
    
    Args:
        user: The user object
        budget: Optional specific budget to check
    """
    notification = create_recommendation_notification(user, budget)
    if notification:
        return notification

    notification = create_achievement_notification(user)
    if notification:
        return notification

    return None


# ------------------------------------------------------------
# 10. MAIN ENTRY POINT - ALL BUDGETS
# ------------------------------------------------------------
def create_ai_notifications_for_all_budgets(user):
    """
    Checks all active budgets for the user and creates notifications as needed.
    Returns list of created notifications.
    """
    active_budgets = get_all_active_budgets(user)
    created_notifications = []
    
    for budget in active_budgets:
        notification = create_ai_budget_notification(user, budget)
        if notification:
            created_notifications.append(notification)
    
    # If no recommendation created, check for achievement
    if not created_notifications:
        achievement = create_achievement_notification(user)
        if achievement:
            created_notifications.append(achievement)
    
    return created_notifications