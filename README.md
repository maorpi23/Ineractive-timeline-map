git pull                     # מושך שינויים אחרונים מ-GitHub
<br>
git add .                    # מוסיף את הקבצים ששונו
<br>
git commit -m "הודעה קצרה"  # שמירת גרסה עם הודעה
<br>
git push                     # שולח את השינויים ל-GitHub
<br>
python manage.py runserver   כדי להריץ את הפרויקט
<br>

כדי להביא את המסד נתונים של הקרבות : 
1
<br>

python manage.py shell

2
<br>

import sys
sys.path.append('.')  # רק אם צריך
from import_battles_from_excel import import_battles_from_excel
import_battles_from_excel('battles_template.xlsx')

3
<br>

exit()
