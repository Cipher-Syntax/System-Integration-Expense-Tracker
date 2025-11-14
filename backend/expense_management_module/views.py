from django.shortcuts import render
from rest_framework import viewsets, permissions  # type: ignore
from .models import Expense, Category
from .serializers import ExpenseSerializer, CategorySerializer
from .utils import check_budget_limit

# Category view remains the same
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

# Expense view with automatic budget check
class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by('-created_at')
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only show expenses for the logged-in user
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Save the expense for the logged-in user
        expense = serializer.save(user=self.request.user)

        # Trigger budget check and AI notifications
        if getattr(expense, 'budget', None):
            check_budget_limit(expense.user, expense.budget)
