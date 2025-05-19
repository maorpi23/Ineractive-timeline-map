import csv
from django.core.management.base import BaseCommand
from frontend.models import Soldier  # שנה לנתיב האפליקציה שלך במידת הצורך

class Command(BaseCommand):
    help = 'Import soldiers from CSV file into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            'fighters_data_cleaned.csv',
            type=str,
            help='Path to the CSV file containing soldiers data'
        )

    def handle(self, *args, **options):
        path = options['fighters_data_cleaned.csv']
        with open(path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            total = 0
            for row in reader:
                Soldier.objects.create(
                    name_he=row.get('שם', '').strip(),
                    country_he=row.get('מדינה', '').strip(),
                    lifeStory_he=row.get('קורות חיים', '').strip(),
                    years=row.get('שנות פעילות', 0),
                )
                total += 1

        self.stdout.write(self.style.SUCCESS(f'Successfully imported {total} soldiers'))
