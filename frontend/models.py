from django.db import models

# Create your models here.

class Battle(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    country = models.CharField(max_length=100)
  
    def __str__(self):
        return self.title