document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  init();

  const monthSelect = document.getElementById("month-select");
  monthSelect.value = "1";
  handleMonthChange(monthSelect);
});

let currentGeoJsonUrl = '/static/frontend/data/countries.geojson'; // ברירת מחדל עברית
let map; // שיהיה גלובלי ונוכל לגשת אליו מהפונקציה של שינוי שפה


function init() {
  console.log("Initializing map...");

  map = new maplibregl.Map({
    container: 'mapid',
    style: 'https://api.maptiler.com/maps/01961ae0-69ff-7a7f-9600-912e332ef44c/style.json?key=R8uTGCv3RYrhR4yw1YiU',
    center: [14, 48],
    zoom: 4,
    minZoom: 2.5,
    maxZoom: 5,
    attributionControl: true
  });

  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');

  map.on('load', () => {
    console.log("Map fully loaded");
    console.log(map.getStyle().layers);
    loadCountryLayer();

    fetch('/static/frontend/data/countries.geojson')
  .then(response => response.json())
  .then(data => {
    // בדיקה אם הסורס כבר קיים
    if (!map.getSource('countries')) {
      map.addSource('countries', {
        type: 'geojson',
        data: data
      });
    }

    // בדיקה אם הליירים כבר קיימים
    if (!map.getLayer('countries-fill')) {
      map.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': '#888888',
          'fill-opacity': 0.4
        }
      });
    }

    if (!map.getLayer('countries-outline')) {
      map.addLayer({
        id: 'countries-outline',
        type: 'line',
        source: 'countries',
        paint: {
          'line-color': '#000',
          'line-width': 1
        }
      });
    }

    // קליק על מדינה
    map.on('click', 'countries-fill', (e) => {
      const countryName = e.features[0].properties.name || 'Unknown';
      const selectedMonth = document.getElementById("month-select").value;
      const selectedYear = document.querySelector(".timeline-button.active").innerText;

      console.log(`Clicked on ${countryName}, ${selectedMonth}/${selectedYear}`);

      fetch(`/get-battles/?country=${encodeURIComponent(countryName)}&year=${selectedYear}&month=${selectedMonth}`)
        .then(res => res.json())
        .then(data => {
          showBattlesPopup(countryName, selectedYear, selectedMonth, data);
        })
        .catch(err => {
          console.error("Error fetching battle data:", err);
        });
    });
  })
  .catch(error => console.error("Error loading GeoJSON:", error));

  });
}


function loadCountryLayer() {
  fetch(currentGeoJsonUrl)
    .then(response => response.json())
    .then(data => {
      if (map.getSource('countries')) {
        map.getSource('countries').setData(data);
        return;
      }

      map.addSource('countries', {
        type: 'geojson',
        data: data
      });

      map.addLayer({
        id: 'countries-fill',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': '#888888',
          'fill-opacity': 0.4
        }
      });

      map.addLayer({
        id: 'countries-outline',
        type: 'line',
        source: 'countries',
        paint: {
          'line-color': '#000',
          'line-width': 1
        }
      });

      map.on('click', 'countries-fill', (e) => {
        const countryName = e.features[0].properties.name || 'Unknown';
        const selectedMonth = document.getElementById("month-select").value;
        const selectedYear = document.querySelector(".timeline-button.active").innerText;

        console.log(`Clicked on ${countryName}, ${selectedMonth}/${selectedYear}`);

        fetch(`/get-battles/?country=${encodeURIComponent(countryName)}&year=${selectedYear}&month=${selectedMonth}`)
          .then(res => res.json())
          .then(data => {
            showBattlesPopup(countryName, selectedYear, selectedMonth, data);
          })
          .catch(err => {
            console.error("Error fetching battle data:", err);
          });
      });
    })
    .catch(error => console.error("Error loading GeoJSON:", error));
}


function selectYear(button) {
  document.querySelectorAll('.timeline-button').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

function handleMonthChange(selectElement) {
  const selectedMonth = selectElement.value;
  if (selectedMonth === "") {
    console.log("No valid month selected.");
    return;
  }
  console.log("Selected month:", selectedMonth);
}

