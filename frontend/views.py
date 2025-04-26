from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.db.models import Q, Count
from .models import Battle
from .serializers import BattleSerializer


def index(request):
    return render(request, 'frontend/timeline.html')


@api_view(['GET'])
def battles_by_date(request, year, month):
    """
    Fetch battles for a specific year and month, considering start and end dates.
    """
    country = request.GET.get('country', None)

    # Filter battles that overlap with the given year and month
    battles = Battle.objects.filter(
        Q(year__lte=year, end_year__gte=year) &
        Q(
            Q(month__lte=month, end_month__gte=month) |
            Q(end_year__gt=year)  # Handle year overlaps
        )
    )

    if country:
        battles = battles.filter(country__iexact=country)

    serializer = BattleSerializer(battles, many=True)
    return Response(serializer.data)


@require_GET
def get_battles(request):
    """
    Fetch battles for a specific country, year, and month, considering start and end dates.
    """
    country = request.GET.get('country')
    year = int(request.GET.get('year'))
    month = int(request.GET.get('month'))
    lang = request.GET.get('lang', 'he')  # Default to Hebrew

    if not (country and year and month):
        return JsonResponse([], safe=False)

    # Use the appropriate field for country based on language
    country_filter = {'hebrew_country__iexact': country} if lang == 'he' else {'country__iexact': country}

    # Filter battles that overlap with the given year and month
    battles = Battle.objects.filter(
        Q(year__lte=year, end_year__gte=year) &
        Q(
            Q(month__lte=month, end_month__gte=month) |
            Q(end_year__gt=year)  # Handle year overlaps
        ),
        **country_filter  # Move this to the end
    )

    # Format the response based on the language
    if lang == 'he':
        data = [{"id": b.id, "name": b.hebrew_title, "description": b.hebrew_description} for b in battles]
    else:
        data = [{"id": b.id, "name": b.title, "description": b.description} for b in battles]

    return JsonResponse(data, safe=False)


def get_battles_summary(request):
    """
    Return a summary of countries that have battles in the specified year and month,
    considering start and end dates.
    """
    year = int(request.GET.get('year'))
    month = int(request.GET.get('month'))
    lang = request.GET.get('lang', 'he')  # Default to Hebrew

    if not year or not month:
        return JsonResponse({'error': 'Year and month parameters are required'}, status=400)

    try:
        # Filter battles that overlap with the given year and month
        battles = Battle.objects.filter(
            Q(year__lte=year, end_year__gte=year) &
            Q(
                Q(month__lte=month, end_month__gte=month) |
                Q(end_year__gt=year)  # Handle year overlaps
            )
        )

        # Annotate countries with battle counts
        countries_with_battles = battles.values('country', 'hebrew_country').annotate(
            battle_count=Count('id')
        ).order_by('country')

        # Format the response based on the language
        country_list = [
            {
                'name': item['hebrew_country'] if lang == 'he' else item['country'],
                'count': item['battle_count']
            }
            for item in countries_with_battles
        ]

        return JsonResponse({
            'year': year,
            'month': month,
            'countries': country_list
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
