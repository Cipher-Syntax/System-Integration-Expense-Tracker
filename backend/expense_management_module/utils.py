from decimal import Decimal
from notification_management_module.utils import send_email_notification, send_sms_notification
from notification_management_module.models import Notification

def check_budget_limit(user, budget):
    total_expenses = sum(exp.amount for exp in budget.expenses.all())
    limit = budget.limit_amount

    threshold = Decimal('0.96') * limit

    if total_expenses >= threshold:
        message = f"⚠️ Alert: You've reached 96% of your budget ({total_expenses}/{limit})."
        subject = "Budget Alert Notification"
        email_sent = send_email_notification(subject, message, user.email)
        
        phone_number = getattr(user, 'phone_number', None)
        sms_sent = False
        if phone_number:
            sms_sent = send_sms_notification(phone_number, message)

        Notification.objects.create(
            user=user,
            message=message,
            status="Sent" if email_sent or sms_sent else "Unsent"
        )

        print(f"Notification created for {user.username}")
