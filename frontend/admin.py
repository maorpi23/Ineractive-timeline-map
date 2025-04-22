from django.contrib import admin
from .models import Battle

class BattleAdmin(admin.ModelAdmin):
    list_display = ('title', 'hebrew_country', 'year', 'month', 'end_year', 'end_month')  # Display end date
    search_fields = ('title', 'hebrew_country', 'country', 'year', 'month', 'end_year', 'end_month')
    list_filter = ('year', 'month', 'end_year', 'end_month', 'country')
    exclude = ('hebrew_country',)  # Hide from the admin form
    actions = ['duplicate_battle']

    def duplicate_battle(self, request, queryset):
        for battle in queryset:
            battle.pk = None
            battle.save()
        self.message_user(request, "Selected battles have been duplicated.")

admin.site.register(Battle, BattleAdmin)
