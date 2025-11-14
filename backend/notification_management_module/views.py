from rest_framework import viewsets, permissions #type: ignore
from .serializers import NotificationSerializer
from rest_framework.views import APIView #type: ignore
from rest_framework.response import Response #type: ignore
from .services import create_ai_budget_notification
from .models import Notification

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Notification.objects.all()

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class GenerateBudgetRecommendation(APIView):
    def post(self, request):
        notification = create_ai_budget_notification(request.user)
        if notification:
            return Response({"success": True, "recommendation": notification.recommendation_details})
        return Response({"success": False, "message": "No active budget found"})