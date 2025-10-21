from django.shortcuts import render
from rest_framework import viewsets, permissions #type: ignore
from .models import Expense, Category
from .serializers import ExpenseSerializer, CategorySerializer
from .utils import check_budget_limit

# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ExpenseviewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        expense = serializer.save(user=self.request.user)
        check_budget_limit(expense.user, expense.budget)
        