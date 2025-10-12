from rest_framework import serializers #type: ignore
from .models import Category, Expense

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
class ExpenseSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset = Category.objects.all(), source='category', write_only=True
    )
    
    class Meta:
        model = Expense
        fields = ['id', 'user', 'category', 'category_id', 'budget', 'amount', 'date', 'description', 'created_at']
        read_only_fields = ['user']