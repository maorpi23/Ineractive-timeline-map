from datetime import date
from django.db.models import Q

def filter_battles_by_date_range(start_date, end_date):
    """
    Filters battles that overlap with the given date range.
    """
    return Battle.objects.filter(
        Q(year__lte=end_date.year, end_year__gte=start_date.year) &
        Q(
            Q(month__lte=end_date.month, end_month__gte=start_date.month) |
            Q(end_year__gt=start_date.year)  # Handle year overlaps
        )
    )