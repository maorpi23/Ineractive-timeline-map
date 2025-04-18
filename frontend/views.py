from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Battle
from .serializers import BattleSerializer
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import Battle


def index(request):
    return render(request, 'frontend/timeline.html')

@api_view(['GET'])
def battles_by_date(request, year, month):
    country = request.GET.get('country', None)
    battles = Battle.objects.filter(date__year=year, date__month=month)
    if country:
        battles = battles.filter(country__iexact=country)
    serializer = BattleSerializer(battles, many=True)
    return Response(serializer.data)

@require_GET
def get_battles(request):
    country = request.GET.get('country')
    year = request.GET.get('year')
    month = request.GET.get('month')
    lang = request.GET.get('lang', 'he')  # ברירת מחדל לעברית

    if not (country and year and month):
        return JsonResponse([], safe=False)

    # Use the appropriate field for country based on language
    country_filter = {'hebrew_country__iexact': country} if lang == 'he' else {'country__iexact': country}

    # Updated query to use 'year' and 'month' fields directly
    battles = Battle.objects.filter(
        **country_filter,
        year=year,
        month=month,
    )

    # Select fields based on language
    if lang == 'he':
        data = [{"name": b.hebrew_title, "description": b.hebrew_description} for b in battles]
    else:
        data = [{"name": b.title, "description": b.description} for b in battles]

    return JsonResponse(data, safe=False)