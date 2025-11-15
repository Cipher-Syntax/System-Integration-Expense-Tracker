# notification_utils.py
from django.conf import settings
from django.core.mail import send_mail
import requests

# ------------------------------
# 📧 EMAIL FUNCTION
# ------------------------------
def send_email_notification(subject, message, receiver):
    """Sends email using Django's core send_mail."""
    try:
        recipient_list = [receiver] if isinstance(receiver, str) else receiver

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        print(f"Email sent to {recipient_list}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

# ------------------------------
# 📞 PHILSMS UTILITY FUNCTIONS
# ------------------------------
def format_phone_number(phone_number: str) -> str:
    """Formats phone number for PhilSMS API (639XXXXXXXXX)."""
    phone_number = phone_number.strip().replace(" ", "").replace("-", "")
    if phone_number.startswith("0"):
        phone_number = "63" + phone_number[1:]
    elif phone_number.startswith("+63"):
        phone_number = "63" + phone_number[3:]
    elif phone_number.startswith("63"):
        phone_number = phone_number
    else:
        if len(phone_number) == 10 and not phone_number.startswith('63'):
            phone_number = '63' + phone_number
    return phone_number
# notification_utils.py
def send_sms_philsms(phone_number, message):
    """Sends SMS using PhilSMS API via requests with detailed logging."""
    try:
        phone_number = format_phone_number(phone_number)
        print(f"DEBUG: Formatted phone number: {phone_number}")
        print(f"DEBUG: PHILSMS_API_TOKEN={settings.PHILSMS_API_TOKEN}")
        print(f"DEBUG: PHILSMS_SENDER_ID={settings.PHILSMS_SENDER_ID}")

        headers = {
            "Authorization": f"Bearer {settings.PHILSMS_API_TOKEN}",
            "Content-Type": "application/json"
        }

        data = {
            "recipient": phone_number,
            "sender_id": settings.PHILSMS_SENDER_ID,
            "message": message
        }

        print(f"DEBUG: Payload sent to PhilSMS: {data}")

        response = requests.post(
            "https://dashboard.philsms.com/api/v3/sms/send",
            json=data,
            headers=headers
        )

        try:
            response_content = response.json()
        except Exception:
            response_content = response.text

        print(f"PhilSMS API response (status {response.status_code}): {response_content}")

        if response.status_code == 200:
            print(f"SMS sent to {phone_number}")
            return True
        else:
            print("Failed to send SMS. Check API response above.")
            return False

    except Exception as e:
        print(f"Exception occurred while sending SMS: {e}")
        return False
