# # notification_utils.py (Full Code with Final Fixes)
# from django.conf import settings
# from django.core.mail import send_mail
# import requests
# import requests.exceptions

# # ------------------------------
# # 📧 EMAIL FUNCTION
# # ------------------------------
    
# def send_email_notification(subject, message, receiver):
#     """Sends email using Django's core send_mail."""
#     try:
#         recipient_list = [receiver] if isinstance(receiver, str) else receiver

#         send_mail(
#             subject=subject,
#             message=message,
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             recipient_list=recipient_list,
#             fail_silently=False,
#         )
#         print(f"Email sent to {recipient_list}")
#         return True
#     except Exception as e:
#         print(f"Failed to send email: {e}")
#         return False

# # ------------------------------
# # 📞 PHILSMS UTILITY FUNCTIONS
# # ------------------------------
# def format_phone_number(phone_number: str) -> str:
#     """Formats phone number for PhilSMS API (639XXXXXXXXX)."""
#     phone_number = phone_number.strip().replace(" ", "").replace("-", "")
#     if phone_number.startswith("0"):
#         phone_number = "63" + phone_number[1:]
#     elif phone_number.startswith("+63"):
#         phone_number = "63" + phone_number[3:]
#     elif phone_number.startswith("63"):
#         phone_number = phone_number
#     else:
#         if len(phone_number) == 10 and not phone_number.startswith('63'):
#             phone_number = '63' + phone_number
#     return phone_number

# def send_sms_philsms(phone_number, message):
#     """Sends SMS using PhilSMS API via requests with detailed logging."""
#     try:
#         phone_number = format_phone_number(phone_number)
#         print(f"DEBUG: Formatted phone number: {phone_number}")
        
#         # 💡 FINAL FIX: Strip whitespace (including newlines) from the token
#         api_token = settings.PHILSMS_API_TOKEN.strip() 

#         print(f"DEBUG: PHILSMS_API_TOKEN={api_token}")
#         print(f"DEBUG: PHILSMS_SENDER_ID={settings.PHILSMS_SENDER_ID}")

#         headers = {
#             # Use the stripped token
#             "Authorization": f"Bearer {api_token}", 
#             "Content-Type": "application/json"
#         }

#         data = {
#             "recipient": phone_number,
#             "sender_id": settings.PHILSMS_SENDER_ID,
#             "type:": "plain",
#             "message": message
#         }

#         print(f"DEBUG: Payload sent to PhilSMS: {data}")

#         # ✅ Corrected URL: Using PHILSMS_API_URL from settings
#         response = requests.post(
#             f"{settings.PHILSMS_API_URL}/sms/send",
#             json=data,
#             headers=headers
#         )

#         try:
#             response_content = response.json()
#         except requests.exceptions.JSONDecodeError:
#             response_content = response.text

#         print(f"PhilSMS API response (status {response.status_code}): {response_content}")

#         if response.status_code == 200:
#             print(f"SMS sent to {phone_number}")
#             return True
#         else:
#             print(f"Failed to send SMS. Status code: {response.status_code}. Response: {response_content}")
#             return False

#     except requests.exceptions.RequestException as e:
#         print(f"Network error occurred while sending SMS: {e}")
#         return False
#     except Exception as e:
#         print(f"General exception occurred while sending SMS: {e}")
#         return False

import threading
import requests
import requests.exceptions
from django.conf import settings
from django.core.mail import send_mail

# ------------------------------
# 📧 EMAIL FUNCTION (BACKGROUND THREAD)
# ------------------------------

class EmailThread(threading.Thread):
    def __init__(self, subject, message, receiver):
        self.subject = subject
        self.message = message
        self.recipient_list = [receiver] if isinstance(receiver, str) else receiver
        threading.Thread.__init__(self)

    def run(self):
        try:
            # ADDED: Print BEFORE sending to confirm the thread started
            print(f"DEBUG: EmailThread started. Preparing to send to {self.recipient_list}...")
            
            send_mail(
                subject=self.subject,
                message=self.message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=self.recipient_list,
                fail_silently=False,
            )
            print(f"DEBUG: Email sent successfully to {self.recipient_list}")
        except Exception as e:
            print(f"DEBUG: Failed to send email: {e}")

def send_email_notification(subject, message, receiver):
    """
    Starts the EmailThread to send email in the background.
    Returns True immediately to prevent blocking the HTTP request.
    """
    try:
        # ADDED: Print to confirm the main function was actually called
        print(f"DEBUG: send_email_notification called for {receiver}")
        
        email_thread = EmailThread(subject, message, receiver)
        email_thread.start()
        return True
    except Exception as e:
        print(f"DEBUG: Error initializing email thread: {e}")
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
            
            # 💡 Strip whitespace (including newlines) from the token
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