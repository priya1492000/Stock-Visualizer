from django.urls import path
from .views import stock

urlpatterns = [
    path('api/stock/<str:symbol>/', stock, name='stock'),
]
