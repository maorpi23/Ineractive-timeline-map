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

# Load centroid-based country mapping
centroids_en_path = Path(__file__).resolve().parent / 'static' / 'frontend' / 'data' / 'countries_centroids_main.geojson'
centroids_he_path = Path(__file__).resolve().parent / 'static' / 'frontend' / 'data' / 'countriesHE_centroids_main.geojson'

with open(centroids_en_path, encoding='utf-8') as f:
    centroids_en = json.load(f)

with open(centroids_he_path, encoding='utf-8') as f:
    centroids_he = json.load(f)

# Build mapping: English country name -> centroid coords
english_centroid_map = {
    feature['properties']['name']: tuple(feature['geometry']['coordinates'])
    for feature in centroids_en['features']
}

# Build reverse map: centroid coords -> Hebrew name
hebrew_centroid_map = {
    tuple(feature['geometry']['coordinates']): feature['properties']['name']
    for feature in centroids_he['features']
}

# Final mapping: English name -> Hebrew name (through matching centroids)
EN_TO_HE = {
    en_name: hebrew_centroid_map.get(coords, '')
    for en_name, coords in english_centroid_map.items()
}

class Battle(models.Model):
    MONTH_CHOICES = [
        (1, "January"), (2, "February"), (3, "March"), (4, "April"),
        (5, "May"), (6, "June"), (7, "July"), (8, "August"),
        (9, "September"), (10, "October"), (11, "November"), (12, "December")
    ]
    YEAR_CHOICES = [(year, str(year)) for year in range(1939, 1946)]
    country = models.CharField(max_length=100, choices=COUNTRY_CHOICES)
    month = models.IntegerField(choices=MONTH_CHOICES)
    year = models.IntegerField(choices=YEAR_CHOICES)
    end_month = models.IntegerField(choices=MONTH_CHOICES, blank=True, null=True)
    end_year = models.IntegerField(choices=YEAR_CHOICES, blank=True, null=True)
    keywords = models.TextField(blank=True, help_text="הכנס תגיות מופרדות בפסיקים")
    hebrew_title = models.CharField(max_length=200)
    hebrew_description = models.TextField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    hebrew_country = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        print(f"Selected country: {self.country}")

        if not self.end_year:
            self.end_year = self.year
        if not self.end_month:
            self.end_month = self.month

        self.hebrew_country = EN_TO_HE.get(self.country, '')
        print(f"Auto-filled hebrew_country: {self.hebrew_country}")

        super().save(*args, **kwargs)

class Soldier(models.Model):
    name_he = models.CharField("שם בעברית", max_length=200)
    name_en = models.CharField("Name (EN)", max_length=200)
    country_he = models.CharField("ארץ (עברית)", max_length=200)
    country_en = models.CharField("Country (EN)", max_length=200)
    lifeStory_he = models.TextField("קורות חיים (עברית)")
    lifeStory_en = models.TextField("Life Story (EN)")
    years = models.CharField("שנים", max_length=200)

    def __str__(self):
        return self.name_he