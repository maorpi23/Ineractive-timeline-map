from django.contrib import admin
from django.utils.html import format_html
from .models import Battle, Soldier

class BattleAdmin(admin.ModelAdmin):
    list_display = ('title', 'country', 'hebrew_country', 'year', 'month', 'end_year', 'end_month')  # Add highlight column
    search_fields = ('title', 'hebrew_country', 'country', 'year', 'month',)
    list_filter = ('year', 'month', 'end_year', 'end_month', 'country')
    exclude = ('hebrew_country',)  # Hide from the admin form
    actions = ['duplicate_battle']

@admin.register(Soldier)
class SoldierAdmin(admin.ModelAdmin):
    list_display = (
        'name_he', 'name_en',
        'country_he', 'country_en',
        'years'
    )
    search_fields = ('name_he', 'name_en', 'country_he', 'country_en')
    list_filter = ('years', 'country_en')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image_url:
            return format_html('<img src="{}" style="max-height: 100px;"/>', obj.image_url)
        return "-"
    image_preview.short_description = 'תצוגת תמונה'

    def highlight_battle(self, obj):
        # Highlight if the battle has an end date
        if obj.end_year and obj.end_month:
            return format_html('<span style="color: green;">Ended</span>')
        return format_html('<span style="color: red;">Ongoing</span>')

    highlight_battle.short_description = 'Status'  # Column name in the admin panel

    def duplicate_battle(self, request, queryset):
        for battle in queryset:
            battle.pk = None
            battle.save()
        self.message_user(request, "Selected battles have been duplicated.")

admin.site.register(Battle, BattleAdmin)
