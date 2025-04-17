
from django.urls import path
from .views import index, battles_by_date
from . import views

urlpatterns = [
    path('', index, name='home'),
    path('api/battles/<int:year>/<int:month>/', battles_by_date, name='battles_by_date'),
     path('get-battles/', views.get_battles, name='get_battles')
]
