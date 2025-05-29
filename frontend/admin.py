from django.contrib import admin
from django.utils.html import format_html
from .models import Battle, Soldier

class BattleAdmin(admin.ModelAdmin):
    list_display = ('title', 'country', 'hebrew_country', 'year', 'month', 'end_year', 'end_month')  # Add highlight column
    search_fields = ('title', 'hebrew_country', 'country', 'year', 'month',)
    list_filter = ('year', 'month', 'end_year', 'end_month', 'country')
    exclude = ('hebrew_country',)  # Hide from the admin form
    actions = ['duplicate_battle']

#id,hebrew_name,קישור לתמונה,פרטים אישיים,קורות חיים,english_name,personal details,Biography
@admin.register(Soldier)
class SoldierAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'hebrew_name', 'hebrew_personal_details', 'hebrew_biography',
        'image_with_link',
        'english_name', 'personal_details', 'Biography'
    )
    search_fields = ('id', 'hebrew_name', 'english_name')
    list_filter = ('hebrew_name', 'english_name')
    readonly_fields = ('image_with_link',)

    def image_with_link(self, obj):
        if obj.image_link:
            return format_html(
                '<div style="display: flex; align-items: center;">'
                '<img src="{url}" style="max-height: 60px;"/>'
                '<a href="{url}" target="_blank" style="margin-right: 10px;">{url}</a>'
                '</div>',
                url=obj.image_link
            )
        return "-"
    image_with_link.short_description = 'תמונה + קישור'

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
