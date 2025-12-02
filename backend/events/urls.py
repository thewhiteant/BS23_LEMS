# urls.py
from django.urls import path
from .views import(
AddEventView,
EditEventView,
UpdateEventView,
DeleteEventView,
AllEventsView
)

urlpatterns = [
    path("all/", AllEventsView.as_view(),name="all"), 
    path('add/', AddEventView.as_view(), name='add'),
    path('edit/<int:pk>/', EditEventView.as_view(), name='edit'),
    path('update/<int:pk>/', UpdateEventView.as_view(), name='update'),
    path('delete/<int:pk>/', DeleteEventView.as_view(), name='delete'),

    # test 
    # path('allevent/',viewAllData.as_view(),name="all"),    
]