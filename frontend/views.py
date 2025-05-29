from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import Battle, Soldier
from .serializers import BattleSerializer
from django.http import Http404


def index(request):
    return render(request, 'frontend/timeline.html')


def _filter_active_battles(queryset, target_year, target_month):
    """
    Helper to filter battles active during the target year and month.
    """
    target = target_year * 100 + target_month
    active = []
    for battle in queryset:
        # Determine start and end in YYYYMM format
        start = battle.year * 100 + battle.month
        end_year = battle.end_year if battle.end_year else battle.year
        end_month = battle.end_month if battle.end_month else battle.month
        end = end_year * 100 + end_month
        if start <= target <= end:
            active.append(battle)
    return active


@api_view(['GET'])
def get_battle_keywords(request, battle_id):
    """
    מחזיר רק את מחרוזת ה-keywords עבור קרב לפי ה-ID שלו
    """
    try:
        battle = Battle.objects.get(pk=battle_id)
    except Battle.DoesNotExist:
        raise Http404("Battle not found")
    return Response({'keywords': battle.keywords})


@api_view(['GET'])
def battles_by_date(request, year, month):
    """
    Fetch battles for a specific year and month, considering start and end dates.
    """
    country = request.GET.get('country')
    try:
        year = int(year)
        month = int(month)
    except (TypeError, ValueError):
        return Response({'error': 'Invalid year or month'}, status=400)

    queryset = Battle.objects.all()
    if country:
        queryset = queryset.filter(country__iexact=country)

    active = _filter_active_battles(queryset, year, month)
    serializer = BattleSerializer(active, many=True)
    return Response(serializer.data)


@require_GET
def get_battles(request):
    """
    Fetch battles for a specific country, year, and month, considering start and end dates.
    """
    country = request.GET.get('country')
    try:
        year = int(request.GET.get('year'))
        month = int(request.GET.get('month'))
    except (TypeError, ValueError):
        return JsonResponse([], safe=False)
    lang = request.GET.get('lang', 'he')  # Default to Hebrew

    # Select appropriate filter field
    if lang == 'he':
        queryset = Battle.objects.filter(hebrew_country__iexact=country)
    else:
        queryset = Battle.objects.filter(country__iexact=country)

    active = _filter_active_battles(queryset, year, month)

    # Prepare response data
    if lang == 'he':
        data = [
            {"id": b.id, "name": b.hebrew_title, "description": b.hebrew_description}
            for b in active
        ]
    else:
        data = [
            {"id": b.id, "name": b.title, "description": b.description}
            for b in active
        ]

    return JsonResponse(data, safe=False)


def get_battles_summary(request):
    """
    Return a summary of countries that have battles in the specified year and month.
    """
    try:
        year = int(request.GET.get('year'))
        month = int(request.GET.get('month'))
    except (TypeError, ValueError):
        return JsonResponse({'error': 'Valid year and month parameters are required'}, status=400)
    lang = request.GET.get('lang', 'he')

    # Aggregate by country
    if lang == 'he':
        field_name, display_field = 'hebrew_country', 'hebrew_country'
    else:
        field_name, display_field = 'country', 'country'

    summary = []
    # Unique countries that have any battles
    countries = Battle.objects.values_list(field_name, flat=True).distinct()
    for country_val in countries:
        queryset = Battle.objects.filter(**{f"{field_name}__iexact": country_val})
        active = _filter_active_battles(queryset, year, month)
        if active:
            summary.append({
                'name': country_val,
                'count': len(active)
            })

    return JsonResponse({
        'year': year,
        'month': month,
        'countries': summary
    })


@api_view(['GET'])
def get_soldiers(request):
    """
    API endpoint to get all soldiers data for client-side processing.
    """
    soldiers = Soldier.objects.all()
    
    data = []
    for soldier in soldiers:
        data.append({
            'id': soldier.id,
            'hebrew_name': soldier.hebrew_name,
            'hebrew_personal_details': soldier.hebrew_personal_details,
            'hebrew_biography': soldier.hebrew_biography,
            'image_link': soldier.image_link,
            'english_name': soldier.english_name,
            'personal_details': soldier.personal_details,
            'Biography': soldier.Biography
        })
    
    return Response(data)