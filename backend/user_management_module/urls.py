from django.urls import path, include
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView #type: ignore
from .views import CreateUserView, CurrentUserView, UpdateUserView, PasswordResetRequestView, PasswordResetConfirmView, CookieTokenObtainPairView, CookieTokenRefreshView, GoogleLoginAPIView


urlpatterns = [
    path('register/', CreateUserView.as_view(), name='user-register'),
    path('profile/', UpdateUserView.as_view(), name='user-update'),
    path('user/', CurrentUserView.as_view(), name='current-user'),

    # path('token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('token/', CookieTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token-refresh'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('reset-password/<uid>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('accounts/', include('allauth.urls')),  # Google OAuth callback
    path('auth/google/', GoogleLoginAPIView.as_view(), name='google-login')
]
