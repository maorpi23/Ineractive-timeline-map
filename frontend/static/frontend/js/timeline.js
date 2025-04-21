
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  init();

  const monthSelect = document.getElementById("month-select");
  monthSelect.value = "1";
  handleMonthChange(monthSelect);

  // Glare Effect
  const glareButtons = document.querySelectorAll('.glare-btn');

  glareButtons.forEach((button) => {
    const glare = button.querySelector('.glare');
    if (glare) {
      // Trigger the glare animation
      setTimeout(() => {
        glare.style.right = '-100%';
        glare.style.transition = 'all 0.6s linear';

        // Reset the glare position after the animation
        setTimeout(() => {
          glare.style.right = '120%'; // Reset to the initial position
          glare.style.transition = 'none'; // Remove transition to avoid flickering
        }, 600); // Match the duration of the animation (0.6s)
      }, 3000); // Delay to ensure the user notices the effect
    }
  });
});

// Global variables
let map;
window.currentLang = 'he'; // Default language is Hebrew
let hoveredStateId = null;

// GeoJSON file paths
const geoJsonPaths = {
  he: '/static/frontend/data/countriesHE.geojson',
  en: '/static/frontend/data/countries.geojson'
};

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
  window.map = map;
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-left');

  map.on('load', () => {
    console.log("Map fully loaded");
    loadCountryLayer();
    
    // After initial load, highlight countries with battles
    map.once('idle', () => {
      updateBattleHighlights();
    });
  });
}

function loadCountryLayer() {
  // Get the appropriate GeoJSON file based on current language
  const geoJsonUrl = geoJsonPaths[currentLang];
  
  fetch(geoJsonUrl)
    .then(response => response.json())
    .then(data => {
      // If source already exists, update it
      if (map.getSource('countries')) {
        map.getSource('countries').setData(data);
      } else {
        // Otherwise, create the source and layers
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
        
        // Add hover layer
        map.addLayer({
          'id': 'countries-hover',
          'type': 'fill',
          'source': 'countries',
          'paint': {
            'fill-color': '#FF8888',
            'fill-opacity': 0
          },
          'filter': ['==', 'name', '']
        });

        // Add click handler only once
        setupCountryClickHandler();
        
      
      }
      
      // Update battle highlights whenever the map data changes
      updateBattleHighlights();
    })
    .catch(error => console.error("Error loading GeoJSON:", error));
}
function setupCountryHoverEffects() {
  // Create a variable to store the currently hovered country name
  let hoveredCountryName = null;
  
  // Add a new layer for hover effect
  if (!map.getLayer('countries-hover')) {
    map.addLayer({
      'id': 'countries-hover',
      'type': 'fill',
      'source': 'countries',
      'paint': {
        'fill-color': '#FF8888',
        'fill-opacity': 0
      },
      'filter': ['==', 'name', '']
    });
  }

  // When the mouse moves over a country
  map.on('mousemove', 'countries-fill', (e) => {
    map.getCanvas().style.cursor = 'pointer';
    
    if (e.features.length > 0) {
      if (hoveredCountryName) {
        // Reset previous hover state by setting the filter to exclude it
        map.setFilter('countries-hover', ['==', 'name', '']);
      }
      
      hoveredCountryName = e.features[0].properties.name;
      
      // Highlight the hovered country
      map.setFilter('countries-hover', ['==', 'name', hoveredCountryName]);
      map.setPaintProperty('countries-hover', 'fill-opacity', 0.7);
    }
  });

  // When the mouse leaves a country
  map.on('mouseleave', 'countries-fill', () => {
    map.getCanvas().style.cursor = '';
    hoveredCountryName = null;
    map.setFilter('countries-hover', ['==', 'name', '']);
  });
}

function setupCountryClickHandler() {
  map.on('click', 'countries-fill', (e) => {
    // Use the appropriate property for country name based on language
    const countryName = currentLang === 'he' 
      ? e.features[0].properties.name || 'Unknown' 
      : e.features[0].properties.name || 'Unknown';

    const selectedMonth = document.getElementById("month-select").value;
    const selectedYear = document.querySelector(".timeline-button.active").innerText;

    console.log(`Clicked on ${countryName}, ${selectedMonth}/${selectedYear}`);

    fetch(`/get-battles/?country=${encodeURIComponent(countryName)}&year=${selectedYear}&month=${selectedMonth}&lang=${currentLang}`)
      .then(res => res.json())
      .then(data => {
        showBattlesPopup(countryName, selectedYear, selectedMonth, data);
      })
      .catch(err => {
        console.error("Error fetching battle data:", err);
      });
  });
}

function selectYear(button) {
  document.querySelectorAll('.timeline-button').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  
  // Update highlights when year changes
  updateBattleHighlights();
}

function handleMonthChange(selectElement) {
  const selectedMonth = selectElement.value;
  if (selectedMonth === "") {
    console.log("No valid month selected.");
    return;
  }
  console.log("Selected month:", selectedMonth);
  
  // Update highlights when month changes
  updateBattleHighlights();
}

// Function to update battle highlights based on current month and year
function updateBattleHighlights() {
  if (!map || !map.isStyleLoaded()) return;
  
  const selectedMonth = document.getElementById("month-select").value;
  const selectedYearButton = document.querySelector(".timeline-button.active");
  
  if (!selectedMonth || !selectedYearButton) return;
  
  const selectedYear = selectedYearButton.innerText;
  
  // Call the highlighting function
  highlightCountriesWithBattles(map, currentLang, selectedYear, selectedMonth);
}

// expose to global so that languageSwap.js can call them:
window.map = map;  // map ירגיש כ־global
window.currentLang = currentLang;
window.loadCountryLayer = loadCountryLayer;
window.updateBattleHighlights = updateBattleHighlights;
window.selectYear = selectYear;
window.handleMonthChange = handleMonthChange;
