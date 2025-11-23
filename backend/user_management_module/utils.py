from google.oauth2 import id_token #type: ignore
from google.auth.transport import requests #type: ignore
from django.contrib.auth import get_user_model #type: ignore
from decouple import config #type: ignore

User = get_user_model()
GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID")

def verify_google_token(token):
    """
    Verify Google ID token and return a Django user.
    Creates a new user if none exists.
    """
    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        email = idinfo.get("email")
        name = idinfo.get("name", email.split("@")[0])

        if not email:
            return None

        # Fetch existing user or create a new one
        # user, created = User.objects.get_or_create(
        #     email=email,
        #     defaults={
        #         'firstname': 
        #         "username": name,
        #         "is_active": True,
        #     }
        # )
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': idinfo.get('given_name', ''),
                'last_name': idinfo.get('family_name', ''),
                'is_active': True
            }
        )

        return user

    except ValueError:
        return None
