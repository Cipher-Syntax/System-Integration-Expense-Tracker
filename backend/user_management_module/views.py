from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics, permissions, status #type: ignore
from rest_framework.response import Response #type: ignore
from .serializers import UserSerializer, ForgotPasswordSerializer, PasswordResetConfirmSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth import  get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str 
from django.core.mail import send_mail
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView #type: ignore
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer #type: ignore
from rest_framework.exceptions import AuthenticationFailed #type: ignore
from django.conf import settings
from rest_framework.views import APIView #type: ignore
from rest_framework_simplejwt.tokens import RefreshToken #type: ignore
from .utils import verify_google_token
from rest_framework_simplejwt.exceptions import InvalidToken #type: ignore


# Create your views here.
User = get_user_model()

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"detail": "User account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class UpdateUserView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = ForgotPasswordSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"{settings.FRONTEND_BASE_URL}/api/reset-password/{uid}/{token}/"
        print('reset_link: ', reset_link)

        # send_mail(
        #     subject="Reset Your Password",
        #     message=f"Hi {user.username},\n\nClick this link to reset your password:\n{reset_link}\n\nIf you didn't request this, ignore this email.",
        #     from_email=settings.DEFAULT_FROM_EMAIL,
        #     recipient_list=[user.email],
        #     fail_silently=False,
        # )
        return Response({
            "detail": "Password reset email sent to email.",
            "email": email,
            "uid": uid,
            "token": token,
            })


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, uid=None, token=None, *args, **kwargs):
        try:
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid_decoded)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"detail": "Invalid user."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)

        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)
    
# class CookieTokenObtainPairView(TokenObtainPairView):
#     # serializer_class = TokenObtainPairSerializer
#     serializer_class = CustomTokenObtainPairSerializer

#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)
#         data = response.data
#         access_token = data.get('access')
#         refresh_token = data.get('refresh')
        
#         response.set_cookie(
#             key='access_token',
#             value=access_token,
#             httponly=True,
#             secure=True, 
#             samesite='None',
#             max_age=60 * 5, 
#         )
#         response.set_cookie(
#             key='refresh_token',
#             value=refresh_token,
#             httponly=True,
#             secure=True, 
#             samesite='None',  
#             max_age=60 * 60 * 24 * 7,
#         )

#         return response
    
class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            raise AuthenticationFailed('Refresh token not found in cookies.')

        serializer = self.get_serializer(data={'refresh': refresh_token})
        serializer.is_valid(raise_exception=True)

        access_token = serializer.validated_data.get('access')
        response = Response({'access': access_token}, status=status.HTTP_200_OK)
        
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True, 
            samesite='None', 
            max_age=60 * 5,
        )

        return response

class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            raise AuthenticationFailed('Refresh token not found in cookies.')

        try:
            serializer = self.get_serializer(data={'refresh': refresh_token})
            serializer.is_valid(raise_exception=True)
            access_token = serializer.validated_data.get('access')

        except User.DoesNotExist:
            # Clear cookies if the user does not exist
            response = Response({"detail": "User not found. Please login again."}, status=401)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response

        except InvalidToken:
            response = Response({"detail": "Invalid or expired refresh token."}, status=401)
            response.delete_cookie('access_token')
            response.delete_cookie('refresh_token')
            return response

        response = Response({'access': access_token}, status=status.HTTP_200_OK)
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=True, 
            samesite='None', 
            max_age=60 * 5,
        )

        return response


class GoogleLoginAPIView(APIView):
    def post(self, request):
        token = request.data.get("token")
        user = verify_google_token(token)

        if user is None:
            return Response({"detail": "Invalid Google token"}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # We prepare the response
        response = Response({
            "user": user.username,
            # We don't strictly need to send tokens in body anymore, but it's fine to leave them
            "access": str(refresh.access_token), 
        })

        # --- KEY FIX: SET COOKIES FOR GOOGLE LOGIN TOO ---
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=True, 
            samesite='None',
            max_age=60 * 5, 
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True, 
            samesite='None',
            max_age=60 * 60 * 24 * 7, 
        )
        
        return response