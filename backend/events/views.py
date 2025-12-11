from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from .serializer import EventSerializer
from .models import Events


class AllEventsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        now = timezone.now()
        events = Events.objects.filter(date_time__gte=now).order_by("date_time")
        serializer = EventSerializer(events, many=True, context={"request": request})

        return Response(serializer.data, status=status.HTTP_200_OK)


class AddEventView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SingleEventView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        event = get_object_or_404(Events, pk=pk)
        serializer = EventSerializer(event, context={"request": request})
        return Response(serializer.data)


class UpdateEventView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        event = get_object_or_404(Events, pk=pk)
        serializer = EventSerializer(event, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteEventView(APIView):
    def delete(self, request, pk):
        event = get_object_or_404(Events, pk=pk)
        event.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
