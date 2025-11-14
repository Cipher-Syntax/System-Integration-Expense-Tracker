from rest_framework import serializers #type: ignore
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'message', 'type', 'status', 
            'is_read', 'created_at', 'related_budget', 
            'achievement_details', 'recommendation_details'
        ]
        read_only_fields = ['user', 'created_at', 'status']
