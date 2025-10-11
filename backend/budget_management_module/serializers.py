from rest_framework import serializers #type: ignore
from .models import Budget

class BudgetSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Budget
        fields = ['id', 'user', 'limit_amount', 'start_date', 'end_date']
        read_only_fields = ['user']