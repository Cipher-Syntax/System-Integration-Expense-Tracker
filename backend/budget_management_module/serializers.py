from rest_framework import serializers #type: ignore
from .models import Budget
from expense_management_module.models import Expense
from django.db import models

class BudgetSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Budget
        fields = ['id', 'user', 'limit_amount', 'status', 'start_date', 'end_date']
        read_only_fields = ['user']
        
        