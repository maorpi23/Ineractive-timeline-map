# Interactive Timeline Map

An interactive timeline map showcasing significant battles of World War II.  
The project enables users to visually explore battle locations by year and month, including additional details about the battles and Jewish soldiers who participated.

## ✨ Features

- 🗺️ **Interactive Map** (MapLibre GL JS) to display country borders and battlefields.  
- 📅 **Timeline Filter** – Select a year and month to display the battles that occurred during that time.  
- ⚔️ **Battle Details** – Clicking on a country displays information about the battles that took place there, including:  
  - Battle name and location  
  - Short description and outcome  
  - Participating countries  
- 👨‍✈️ **Jewish Soldiers** – Each battle includes a list of Jewish soldiers who participated, along with biography, photos, and videos.  
- 🌍 **Multilingual Support** – Hebrew and English (switching GeoJSON files with translated country names).  
- 📱 **Mobile-Friendly** – Styled popups and responsive design for mobile devices.  

## 🛠️ Tech Stack

- **Frontend:**  
  - [MapLibre GL JS](https://maplibre.org/) – for map visualization  
  - Vanilla **HTML / CSS / JavaScript**  
  - Modern UI with popups, filters, and buttons  

- **Backend:**  
  - [Django](https://www.djangoproject.com/) – API server  
  - SQL database queries for battles, soldiers, and timeline data  

- **Data:**  
  - GeoJSON files for countries (English and Hebrew)  
  - Archive data of battles from museum records  

## 📂 Project Structure

```
Ineractive-timeline-map/
│── frontend/                # Django app frontend
│   ├── static/frontend/     # JS, CSS, images
│   ├── templates/frontend/  # HTML templates
│   ├── views.py             # API endpoints
│   ├── urls.py
│
│── data/                    # Battles and soldiers data
│   ├── countries.geojson
│   ├── countriesHE.geojson
│
│── manage.py                # Django entry point
│── README.md
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/maorpi23/Ineractive-timeline-map.git
   cd Ineractive-timeline-map
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Django server**
   ```bash
   python manage.py runserver
   ```

4. Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

## 📸 Screenshots

*(You can add screenshots of the map, timeline filter, and soldier popups here)*

## 📖 Future Improvements

- Add more map layers (e.g., troop movements, unit positions).  
- Improve UI/UX design.  
- Expand the database of battles and soldiers.  
- Support additional languages.  

## 👥 Authors

- **Maor Pinhas**  
- **Shaked [Last Name]**  

