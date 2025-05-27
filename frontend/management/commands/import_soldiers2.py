# frontend/management/commands/import_soldiers.py

import csv
from django.core.management.base import BaseCommand, CommandError
from frontend.models import Soldier

class Command(BaseCommand):
    help = 'Import soldiers from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--csv-path',
            type=str,
            required=True,
            help='Path to the CSV file, e.g. ./soldiers_full.csv'
        )

    def handle(self, *args, **options):
        path = options['csv_path']
        created = updated = skipped = 0

        try:
            # אם יש BOM – 'utf-8-sig' ייבטל אותו
            with open(path, encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                self.stdout.write(f"CSV columns: {reader.fieldnames}")

                for i, row in enumerate(reader):
                    # דילוג על שורות ריקות
                    if not any(cell and cell.strip() for cell in row.values()):
                        skipped += 1
                        continue

                    if i == 0:
                        self.stdout.write(f"First row raw data: {row}")

                    # שמות העמודות כפי שהופיעו בפלט:
                    csv_id     = row.get('id')
                    heb_name   = row.get('hebrew_name')
                    he_details = row.get('פרטים אישיים')
                    he_bio     = row.get('קורות חיים')
                    en_name    = row.get('english_name')
                    en_details = row.get('personal details')
                    en_bio     = row.get('Biography')
                    img        = row.get('קישור לתמונה')

                    # אם אין שם בעברית – דילוג
                    if not heb_name:
                        skipped += 1
                        continue

                    defaults = {
                        'hebrew_personal_details': he_details or "",
                        'hebrew_biography':        he_bio     or "",
                        'english_name':            en_name    or "",
                        'personal_details':        en_details or "",
                        'Biography':               en_bio     or "",
                        'image_link':              img        or "",
                    }

                    if csv_id:
                        # יצירה/עדכון לפי PK מה־CSV
                        soldier, created_flag = Soldier.objects.update_or_create(
                            pk=csv_id,
                            defaults={**defaults, 'hebrew_name': heb_name}
                        )
                    else:
                        # יצירה/עדכון לפי שם עברי
                        soldier, created_flag = Soldier.objects.update_or_create(
                            hebrew_name=heb_name,
                            defaults=defaults
                        )

                    if created_flag:
                        created += 1
                    else:
                        updated += 1

        except FileNotFoundError:
            raise CommandError(f"CSV file not found at path: {path}")

        self.stdout.write(self.style.SUCCESS(
            f'Import finished: {created} created, {updated} updated, {skipped} skipped.'
        ))
