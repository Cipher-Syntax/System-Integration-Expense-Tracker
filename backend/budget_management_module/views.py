from rest_framework import viewsets, permissions #type: ignore
from .serializers import BudgetSerializer
from .models import Budget
from rest_framework.decorators import action #type: ignore
from rest_framework.response import Response #type: ignore
from expense_management_module.utils import get_remaining_budget, get_total_expenses

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Budget.objects.all()

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    @action(detail=True, methods=['get'])
    def available_balance(self, request, pk=None):
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
        total = get_total_expenses(request.user)
        return Response({'total_expenses': total})
