from django.contrib import admin
from .models import Battle

class BattleAdmin(admin.ModelAdmin):
    list_display = ('title', 'hebrew_country', 'year', 'month')  # Display in the list view
    search_fields = ('title', 'hebrew_country', 'country', 'year', 'month')
    list_filter = ('year', 'month', 'country')
    exclude = ('hebrew_country',)  # Hide from the admin form
    # option to duplicate battle
    actions = ['duplicate_battle']

    def duplicate_battle(self, request, queryset):
        for battle in queryset:
            battle.pk = None
            battle.save()
        self.message_user(request, "Selected battles have been duplicated.")

admin.site.register(Battle, BattleAdmin)
