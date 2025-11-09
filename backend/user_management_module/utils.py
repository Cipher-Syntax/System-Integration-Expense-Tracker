from google.oauth2 import id_token #type: ignore 
from google.auth.transport import requests #type: ignore
from django.contrib.auth import get_user_model #type: ignore
from rest_framework.exceptions import AuthenticationFailed #type: ignore
from decouple import config #type: ignore

User = get_user_model()
GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID")

def verify_google_token(token):
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        email = idinfo.get("email")
        if not email:
            return None

        user, created = User.objects.get_or_create(email=email, defaults={"username": email.split("@")[0]})
        return user
    except ValueError:
        return None
