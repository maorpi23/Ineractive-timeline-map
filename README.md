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

| Component       | Technology                            |
|----------------|----------------------------------------|
| Frontend        | MapLibre GL JS, HTML, CSS, Vanilla JS |
| Backend         | Django REST APIs                      |
| Database        | SQL (SQLite or other SQL-compatible DB)|
| Data Formats    | GeoJSON (EN/HE), CSV, Excel           |
| Deployment      | Local via `runserver`, ready for Docker/cloud deployment |

---
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

## Usage

Once the project is running locally, you can start interacting with the map through your browser.  
The application is designed to be intuitive, but here are detailed instructions and examples for how to use it:

### 1. Navigating the Timeline
- Use the **year/month dropdown menus** at the bottom of the page.  
- Selecting a specific **year** (e.g., 1941) will filter the map to show only battles that occurred during that year.  
- Selecting a **month** as well (e.g., March 1942) will refine the results even further.

Example:
- If you select **1942 → March**, the map will highlight only the battles that took place during March 1942.

---

### 2. Exploring the Map
- The **map view** shows country borders and highlights countries where battles took place during the selected period.    
- **Click on the country** to open a popup with full details about battles in that location.

---

### 3. Viewing Battle Details
When you click on a battle marker or country:
- A **popup window** will appear containing:  
  - 🏷️ **Battle Name**  
  - 📍 **Location** (country, city if available)  
  - 📖 **Short Description** of the battle  
  - ⚔️ **Outcome/Results** (who won, what was achieved)  
  - 🏳️ **Participating Countries**


---

### 4. Discovering Jewish Soldiers
- Beneath the battle details, the popup will also list **Jewish soldiers** associated with that battle.  
- Each soldier entry may include:  
  - 📜 Short biography  
  - 🖼️ Photo(s)  
  - 🎥 Video links (if available)  

This feature connects historical events with personal stories, providing both educational and emotional value.

---

### 5. Switching Languages
- Use the **language switcher button** to toggle between:
  - 🇮🇱 **Hebrew** (default) – loads `countriesHE.geojson`  
  - 🌍 **English** – loads `countries.geojson`   
- The map and all popups will automatically reload with the selected language.

---

### 6. Mobile Usage
- The map and popups are fully optimized for mobile devices.  
- Tap on a country the same way you would click on desktop.  
- Popups are styled to fit smaller screens and include **scrolling support** for long content.

---

### 7. Example Workflow
1. Open the map.  
2. Select **1944 → June** in the timeline filter.  
3. The map highlights countries with battles in June 1944 (e.g., France).  
4. Click on **France** to open a popup about the **Battle of Normandy**.  
5. Read about the battle, see outcome details, and scroll to view Jewish soldiers who fought in it.  
6. Switch to Hebrew to see the same data in your preferred language.

---

This makes the platform a powerful tool for **research, education, and exploration** of World War II history.

