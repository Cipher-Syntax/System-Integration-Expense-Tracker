from django.urls import path, include
from rest_framework.routers import DefaultRouter #type: ignore
from .views import ExpenseviewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'expenses', ExpenseviewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls))
]
