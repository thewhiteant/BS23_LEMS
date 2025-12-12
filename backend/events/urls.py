# urls.py
from django.urls import path
from .views import (
    AddEventView,
    UpdateEventView,
    DeleteEventView,
    AllEventsView,
    SingleEventView,
    TopEventsView,
)

urlpatterns = [
    path("all/", AllEventsView.as_view(), name="all"),
    path("add/", AddEventView.as_view(), name="add"),
    path("edit/<int:pk>/", SingleEventView.as_view(), name="edit"),
    path("update/<int:pk>/", UpdateEventView.as_view(), name="update"),
    path("delete/<int:pk>/", DeleteEventView.as_view(), name="delete"),
    path("top/", TopEventsView.as_view(), name="top"),
]
