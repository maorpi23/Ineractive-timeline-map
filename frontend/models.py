import json
from django.db import models
from pathlib import Path

# Load country data from countries.geojson
geojson_path = Path(__file__).resolve().parent / 'static' / 'frontend' / 'data' / 'countries.geojson'
with open(geojson_path, encoding='utf-8') as f:
    geojson_data = json.load(f)
    COUNTRY_CHOICES = sorted(
        [(feature['properties']['name'], feature['properties']['name']) for feature in geojson_data['features']],
        key=lambda x: x[0]
    )

# Load Hebrew country data from countriesHE.geojson
hebrew_geojson_path = Path(__file__).resolve().parent / 'static' / 'frontend' / 'data' / 'countriesHE.geojson'
with open(hebrew_geojson_path, encoding='utf-8') as f:
    hebrew_geojson_data = json.load(f)

class Battle(models.Model):
    MONTH_CHOICES = [
        (1, "January"), (2, "February"), (3, "March"), (4, "April"),
        (5, "May"), (6, "June"), (7, "July"), (8, "August"),
        (9, "September"), (10, "October"), (11, "November"), (12, "December")
    ]
    YEAR_CHOICES = [(year, str(year)) for year in range(1939, 1946)]
    country = models.CharField(max_length=100, choices=COUNTRY_CHOICES)  # Dropdown for countries
    month = models.IntegerField(choices=MONTH_CHOICES)
    year = models.IntegerField(choices=YEAR_CHOICES)
    end_month = models.IntegerField(choices=MONTH_CHOICES, blank=True, null=True)  # Optional end month
    end_year = models.IntegerField(choices=YEAR_CHOICES, blank=True, null=True)  # Optional end year
    keywords = models.TextField(blank=True, help_text="הכנס תגיות מופרדות בפסיקים")
    hebrew_title = models.CharField(max_length=200)
    hebrew_description = models.TextField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    hebrew_country = models.CharField(max_length=100, blank=True)  # Auto-filled field

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        print(f"Selected country: {self.country}")

        # Set default end_year and end_month if not provided
        if not self.end_year:
            self.end_year = self.year
        if not self.end_month:
            self.end_month = self.month

        # Find the unique identifiers (ISO3166-1-Alpha-3 and ISO3166-1-Alpha-2) of the selected country in countries.geojson
        selected_country_id_alpha_3 = None
        selected_country_id_alpha_2 = None
        for feature in geojson_data['features']:
            if feature['properties']['name'] == self.country:
                selected_country_id_alpha_3 = feature['properties'].get('ISO3166-1-Alpha-3')  # ISO Alpha-3 code
                selected_country_id_alpha_2 = feature['properties'].get('ISO3166-1-Alpha-2')  # ISO Alpha-2 code
                break
        print(f"Selected country ISO3166-1-Alpha-3: {selected_country_id_alpha_3}")
        print(f"Selected country ISO3166-1-Alpha-2: {selected_country_id_alpha_2}")

        # Match the identifiers with the corresponding entry in countriesHE.geojson
        if selected_country_id_alpha_3 and selected_country_id_alpha_2:
            for feature in hebrew_geojson_data['features']:
                if (
                    feature['properties'].get('ISO3166-1-Alpha-3') == selected_country_id_alpha_3 and
                    feature['properties'].get('ISO3166-1-Alpha-2') == selected_country_id_alpha_2
                ):
                    self.hebrew_country = feature['properties'].get('name', '')  # Use 'name' for Hebrew name
                    break

        print(f"Auto-filled hebrew_country: {self.hebrew_country}")

        super().save(*args, **kwargs)

