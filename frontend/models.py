from django.db import models

# Create your models here.

class Battle(models.Model):
    MONTH_CHOICES = [
        (1, "January"), (2, "February"), (3, "March"), (4, "April"),
        (5, "May"), (6, "June"), (7, "July"), (8, "August"),
        (9, "September"), (10, "October"), (11, "November"), (12, "December")
    ]
    YEAR_CHOICES = [(year, str(year)) for year in range(1939, 1946)]

    hebrew_title = models.CharField(max_length=200)
    hebrew_description = models.TextField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    month = models.IntegerField(choices=MONTH_CHOICES)
    year = models.IntegerField(choices=YEAR_CHOICES)
    country = models.CharField(max_length=100)
    hebrew_country = models.CharField(max_length=100)



    def __str__(self):
        return self.title

    @property
    def date(self):
        # Dynamically construct the date from month and year
        return f"{self.get_month_display()} {self.year}"