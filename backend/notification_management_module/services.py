from decimal import Decimal
from django.utils import timezone
from django.db import models
from django.conf import settings
import re

from openai import OpenAI  # type: ignore

from .models import Notification
from budget_management_module.models import Budget
from expense_management_module.models import Expense

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
# 2. AI RECOMMENDATION FUNCTION
# ------------------------------------------------------------
def get_ai_budget_recommendation(budget_limit, total_spent):
    """
    AI-powered budget recommendation using gpt-4o-mini.
    Always returns a safe fallback if API fails or quota is exceeded.
    """
    prompt = (
        f"The user's budget is ₱{budget_limit} and they have spent ₱{total_spent}. "
        "Give a friendly, short around 3 senteces only and simple recommendation on how they can manage their spending better."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a friendly financial advisor."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=120,
            temperature=0.7,
        )
        message = response.choices[0].message.content.strip()
        return message or "Keep track of your spending to stay within your budget."
    except Exception as e:
        print("AI Error:", e)
        return "Keep track of your spending to stay within your budget."


# ------------------------------------------------------------
# 3. CLEAN AI TEXT FOR NOTIFICATION
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
# 4. RECOMMENDATION NOTIFICATION
# ------------------------------------------------------------
def create_recommendation_notification(user):
    """
    Creates a Recommendation notification if user exceeded their active budget.
    """
    budget = get_current_active_budget(user)
    if not budget:
        return None

    total_spent = Expense.objects.filter(
        user=user,
        budget=budget
    ).aggregate(total=models.Sum('amount'))['total'] or Decimal('0')

    if total_spent > budget.limit_amount:
        # prevent duplicate notifications for same budget
        if Notification.objects.filter(
            user=user,
            type="Recommendation",
            related_budget=budget
        ).exists():
            return None

        recommendation = get_ai_budget_recommendation(
            budget.limit_amount,
            total_spent
        )
        recommendation = ai_text_to_bullets(recommendation)

        notification = Notification.objects.create(
            user=user,
            message="⚠️ You've exceeded your budget! Here's a recommendation:",
            type="Recommendation",
            recommendation_details=recommendation,
            status="Sent",
            related_budget=budget
        )

        return notification
    return None


# ------------------------------------------------------------
# 5. ACHIEVEMENT NOTIFICATION
# ------------------------------------------------------------
def create_achievement_notification(user):
    """
    Creates an Achievement notification if the user saved money in a completed past budget.
    """
    today = timezone.now().date()

    budget = Budget.objects.filter(
        user=user,
        end_date__lt=today
    ).order_by('-end_date').first()

    if not budget:
        return None

    # prevent duplicates
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
        message_text = f"🎉 Congrats! You saved ₱{saved_amount} from your budget of ₱{budget.limit_amount}."
        achievement_text = f"You managed to save ₱{saved_amount} this month."
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
# 6. MAIN ENTRY POINT
# ------------------------------------------------------------
def create_ai_budget_notification(user):
    """
    Main function to trigger either Recommendation or Achievement notifications.
    Priority: Recommendation > Achievement
    """
    notification = create_recommendation_notification(user)
    if notification:
        return notification

    notification = create_achievement_notification(user)
    if notification:
        return notification

    return None
