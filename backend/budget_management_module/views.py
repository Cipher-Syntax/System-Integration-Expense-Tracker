from rest_framework import viewsets, permissions #type: ignore
from .serializers import BudgetSerializer
from .models import Budget
from rest_framework.decorators import action #type: ignore
from rest_framework.response import Response #type: ignore
from expense_management_module.utils import get_remaining_budget, get_total_expenses
# from expense_management_module.services import check_all_budgets_after_expense_creation
from expense_management_module.utils import check_all_budgets_after_expense_creation
from notification_management_module.services import (
    create_ai_budget_notification,
    create_ai_notifications_for_all_budgets
)
from django.db import models
from datetime import timezone
from expense_management_module.models import Expense
from datetime import date

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Budget.objects.all()

    def get_queryset(self):
        user = self.request.user
        budgets = Budget.objects.filter(user=user).order_by('-start_date')

        for budget in budgets:
            total_expenses = Expense.objects.filter(budget=budget).aggregate(total=models.Sum('amount'))['total'] or 0
            
            # Check if budget is full (all limit reached)
            if total_expenses >= budget.limit_amount:
                if budget.status != 'full':
                    budget.status = 'full'
                    budget.save(update_fields=['status'])
                    # Create notification when budget becomes full
                    create_ai_budget_notification(user, budget)
            
            # Check if budget is expired
            elif date.today() > budget.end_date:
                if budget.status != 'expired':
                    budget.status = 'expired'
                    budget.save(update_fields=['status'])
            
            # Do NOT automatically make any budget 'active' here.
            # Only budgets explicitly created as active remain active.
            
        return budgets

    def perform_create(self, serializer):
        """
        Creates a new budget and checks for notifications if it has expenses.
        """
        budget = serializer.save(user=self.request.user)
        
        # Check if new budget already has expenses that exceed limit
        total_expenses = Expense.objects.filter(budget=budget).aggregate(total=models.Sum('amount'))['total'] or 0
        if total_expenses > budget.limit_amount:
            create_ai_budget_notification(self.request.user, budget)

    def perform_update(self, serializer):
        """
        Updates a budget and checks for notifications.
        """
        budget = serializer.save()
        
        # Check if the updated budget now exceeds its limit
        total_expenses = Expense.objects.filter(budget=budget).aggregate(total=models.Sum('amount'))['total'] or 0
        if total_expenses > budget.limit_amount:
            create_ai_budget_notification(self.request.user, budget)
    
    def perform_destroy(self, instance):
        """
        Deletes a budget and cleans up related data.
        """
        user = instance.user
        instance.delete()
        
        # Recheck all remaining budgets for notifications
        create_ai_notifications_for_all_budgets(user)

    @action(detail=True, methods=['get'])
    def available_balance(self, request, pk=None):
        """
        Returns the available balance for a specific budget.
        """
        try:
            budget = Budget.objects.get(pk=pk, user=request.user)
        except Budget.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)

        available_balance = get_remaining_budget(budget, request.user)

        return Response({
            'budget_id': budget.id,
            'limit_amount': budget.limit_amount,
            'remaining_balance': available_balance
        })

    @action(detail=False, methods=['get'])
    def total_expenses(self, request):
        """
        Returns total expenses for all active budgets of the user.
        """
        total = get_total_expenses(request.user)
        return Response({'total_expenses': total})

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """
        Returns the current status of a budget.
        """
        try:
            budget = Budget.objects.get(pk=pk, user=request.user)
        except Budget.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=404)

        total_expenses = Expense.objects.filter(budget=budget).aggregate(total=models.Sum('amount'))['total'] or 0
        
        return Response({
            'budget_id': budget.id,
            'status': budget.status,
            'limit_amount': budget.limit_amount,
            'total_expenses': total_expenses,
            'is_exceeded': total_expenses > budget.limit_amount,
            'percentage_used': (total_expenses / budget.limit_amount * 100) if budget.limit_amount > 0 else 0
        })

    @action(detail=False, methods=['get'])
    def all_summaries(self, request):
        """
        Returns summaries for all active budgets of the user.
        """
        user = request.user
        budgets = Budget.objects.filter(user=user, status='active').order_by('-start_date')
        
        summaries = []
        for budget in budgets:
            total_expenses = Expense.objects.filter(budget=budget).aggregate(total=models.Sum('amount'))['total'] or 0
            remaining = budget.limit_amount - total_expenses
            
            summaries.append({
                'budget_id': budget.id,
                'name': budget.name,
                'limit_amount': budget.limit_amount,
                'total_expenses': total_expenses,
                'remaining_balance': remaining,
                'is_exceeded': total_expenses > budget.limit_amount,
                'percentage_used': (total_expenses / budget.limit_amount * 100) if budget.limit_amount > 0 else 0,
                'start_date': budget.start_date,
                'end_date': budget.end_date,
                'status': budget.status
            })
        
        return Response({
            'count': len(summaries),
            'budgets': summaries
        })