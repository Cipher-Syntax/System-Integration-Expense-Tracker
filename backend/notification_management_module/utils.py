import threading
import requests
from django.conf import settings

# ------------------------------
# 📧 EMAIL FUNCTION (EMAILJS + THREADING)
# ------------------------------
class EmailThread(threading.Thread):
    def __init__(self, subject, message, receiver):
        self.subject = subject
        self.message = message
        self.receiver = receiver
        threading.Thread.__init__(self)

    def run(self):
        try:
            print(f"DEBUG: EmailThread started. Sending to {self.receiver} using EmailJS...")

            payload = {
                "service_id": settings.EMAILJS_SERVICE_ID,
                "template_id": settings.EMAILJS_TEMPLATE_ID,
                "user_id": settings.EMAILJS_PUBLIC_KEY,
                "template_params": {
                    "to_email": self.receiver,
                    "subject": self.subject,
                    "message": self.message
                }
            }

            response = requests.post(
                "https://api.emailjs.com/api/v1.0/email/send",
                json=payload,
                headers={"Content-Type": "application/json"}
            )

            print(f"DEBUG: EmailJS response: {response.status_code}, {response.text}")
            if response.status_code == 200:
                print(f"DEBUG: Email sent successfully to {self.receiver}")
            else:
                print(f"DEBUG: Failed to send email. Response: {response.text}")

        except Exception as e:
            print(f"DEBUG: Failed to send email via EmailJS: {e}")


def send_email_notification(subject, message, receiver):
    """
    Starts EmailThread using EmailJS API.
    Returns True immediately (non-blocking).
    """
    try:
        print(f"DEBUG: send_email_notification called for {receiver} (EmailJS)")

        email_thread = EmailThread(subject, message, receiver)
        email_thread.start()

        return True

    except Exception as e:
        print(f"DEBUG: Error initializing EmailJS email thread: {e}")
        return False


# ======================================================================
# ============================  SMS SYSTEM  =============================
# ======================================================================

import requests
import requests.exceptions

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


class SMSThread(threading.Thread):
    def __init__(self, phone_number, message):
        self.phone_number = phone_number
        self.message = message
        self.threading = threading.Thread.__init__(self)

    def run(self):
        """
        Handles the actual API Request to PhilSMS in the background.
        """
        try:
            formatted_number = format_phone_number(self.phone_number)
            print(f"DEBUG: Formatted phone number: {formatted_number}")

            api_token = settings.PHILSMS_API_TOKEN.strip()

            print(f"DEBUG: PHILSMS_API_TOKEN={api_token}")
            print(f"DEBUG: PHILSMS_SENDER_ID={settings.PHILSMS_SENDER_ID}")

            headers = {
                "Authorization": f"Bearer {api_token}", 
                "Content-Type": "application/json"
            }

            data = {
                "recipient": formatted_number,
                "sender_id": settings.PHILSMS_SENDER_ID,
                "type": "plain",
                "message": self.message
            }

            print(f"DEBUG: Payload sent to PhilSMS: {data}")

            response = requests.post(
                f"{settings.PHILSMS_API_URL}/sms/send",
                json=data,
                headers=headers
            )

            try:
                response_content = response.json()
            except requests.exceptions.JSONDecodeError:
                response_content = response.text

            print(f"PhilSMS API response (status {response.status_code}): {response_content}")

            if response.status_code == 200:
                print(f"SMS sent to {formatted_number}")
            else:
                print(f"Failed to send SMS. Status code: {response.status_code}. Response: {response_content}")

        except requests.exceptions.RequestException as e:
            print(f"Network error occurred while sending SMS: {e}")
        except Exception as e:
            print(f"General exception occurred while sending SMS: {e}")


def send_sms_philsms(phone_number, message):
    """
    Starts the SMSThread to send SMS in the background.
    Returns True immediately to prevent blocking the HTTP request.
    """
    try:
        sms_thread = SMSThread(phone_number, message)
        sms_thread.start()
        return True
    except Exception as e:
        print(f"Error initializing SMS thread: {e}")
        return False