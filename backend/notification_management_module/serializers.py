from rest_framework import serializers #type: ignore
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'status', 'created_at']
        read_only_fields = ['user']