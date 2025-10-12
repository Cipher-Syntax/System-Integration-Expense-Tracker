from twilio.rest import Client  # type: ignore
from django.conf import settings
from django.core.mail import send_mail

def send_email_notification(subject, message, receiver):
    try:
        if isinstance(receiver, str):
            recipient_list = [receiver]
        else:
            recipient_list = receiver

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


def send_sms_notification(phone_number, message):
    try:
        if not str(phone_number).startswith('+'):
            phone_number = f"+{phone_number}"

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        print(f"SMS sent to {phone_number}")
        return True
    except Exception as e:
        print(f"Failed to send SMS: {e}")
        return False
