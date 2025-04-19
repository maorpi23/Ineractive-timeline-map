from django.contrib import admin
from .models import Battle

class BattleAdmin(admin.ModelAdmin):
     list_display = ('title', 'month', 'year', 'country')  # הצג שדות שקיימים בפועל
     search_fields = ('title', 'country')
    

# Register your models here.
admin.site.register(Battle, BattleAdmin) #it tells django that this model should be added to the administration site.
# This allows you to manage the Battle model through the Django admin interface.
