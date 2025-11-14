from django.urls import path, include
from rest_framework.routers import DefaultRouter #type: ignore
from .views import ExpenseViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls))
]
