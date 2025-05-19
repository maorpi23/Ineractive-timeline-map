import pandas as pd
from frontend.models import Battle

def import_battles_from_excel(file_path):
    df = pd.read_excel(file_path)

    for _, row in df.iterrows():
        battle = Battle(
            title=row['title'],
            hebrew_title=row['hebrew_title'],
            description=row['description'],
            hebrew_description=row['hebrew_description'],
            country=row['country'],
            month=int(row['month']),
            year=int(row['year']),
            end_month=int(row['end_month']) if not pd.isna(row['end_month']) else None,
            end_year=int(row['end_year']) if not pd.isna(row['end_year']) else None,
            keywords=row['keywords']
        )
        battle.save()
        print(f"Imported battle: {battle.title}")

# Example usage:
# import_battles_from_excel('path/to/battles_template.xlsx')