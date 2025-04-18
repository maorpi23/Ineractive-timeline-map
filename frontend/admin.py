from django.contrib import admin
from .models import Battle

class BattleAdmin(admin.ModelAdmin):
    list_display = ('title', 'hebrew_country', 'year', 'month')  # Display in the list view
    search_fields = ('title', 'hebrew_country', 'country', 'year', 'month')
    list_filter = ('year', 'month', 'country')
    exclude = ('hebrew_country',)  # Hide from the admin form

admin.site.register(Battle, BattleAdmin)
