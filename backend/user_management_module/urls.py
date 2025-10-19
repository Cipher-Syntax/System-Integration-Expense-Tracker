from django.urls import path
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView #type: ignore
from .views import CreateUserView, CurrentUserView, UpdateUserView, PasswordResetRequestView, PasswordResetConfirmView, CookieTokenObtainPairView, CookieTokenRefreshView


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
]
