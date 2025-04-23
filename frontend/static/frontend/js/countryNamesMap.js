
// Global variables to track state
let countryNamesLayer = null;
let isLoadingNames = false;

// GeoJSON file paths for country names centroids
const countryCentroidsPath = {
  he: '/static/frontend/data/countriesHE_centroids_main.geojson',
  en: '/static/frontend/data/countries_centroids_main.geojson'
};

// Initialize RTL text plugin once
function initRTLTextPlugin() {
  if (!window.maplibreRTLTextPluginInitialized) {
    try {
      maplibregl.setRTLTextPlugin(
        'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
        null,
        true
      );
      window.maplibreRTLTextPluginInitialized = true;
      console.log("RTL text plugin initialized");
    } catch (e) {
      console.error("Error initializing RTL text plugin:", e);
    }
  }
}

/**
 * Loads country names layer based on the current language
 * @param {Object} map - The MapLibre GL map instance
 * @param {string} language - The current language code ('he' or 'en')
 */
function loadCountryNamesLayer(map, language) {
  // Prevent multiple simultaneous loading operations
  if (isLoadingNames) {
    console.log("Already loading country names, skipping");
    return;
  }
  
  isLoadingNames = true;
  console.log(`Loading country names for language: ${language}`);
  
  // Safety check for map
  if (!map) {
    console.error("Map object is not available");
    isLoadingNames = false;
    return;
  }
  
  // Initialize RTL plugin
  initRTLTextPlugin();
  
  // Define layer ID
  const newLayerId = `country-names-${language}`;
  
  // Clean up existing layers and sources
  try {
    if (countryNamesLayer && map.getLayer(countryNamesLayer)) {
      map.removeLayer(countryNamesLayer);
    }
    
    if (map.getSource('country-names-source')) {
      map.removeSource('country-names-source');
    }
  } catch (e) {
    console.warn(`Cleanup error: ${e.message}`);
  }
  
  // Update the current layer ID
  countryNamesLayer = newLayerId;
  
  // Fetch the appropriate centroids file
  fetch(countryCentroidsPath[language])
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      try {
        // Add source and layer
        map.addSource('country-names-source', {
          type: 'geojson',
          data: data
        });
        
        map.addLayer({
          'id': countryNamesLayer,
          'type': 'symbol',
          'source': 'country-names-source',
          'layout': {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'symbol-placement': 'point',
            'text-allow-overlap': false,
            'text-ignore-placement': false,
            'text-anchor': 'center',
            'text-justify': 'center'
          },
          'paint': {
            'text-color': '#333',
            'text-halo-color': 'rgba(255, 255, 255, 0.9)',
            'text-halo-width': 1.5
          }
        });
        
        console.log(`Successfully added country names in ${language}`);
      } catch (e) {
        console.error(`Error adding map elements: ${e.message}`);
      } finally {
        isLoadingNames = false;
      }
    })
    .catch(error => {
      console.error(`Error loading country names: ${error}`);
      isLoadingNames = false;
    });
}

/**
 * Updates the country names language
 */
function updateCountryNamesLanguage(map, newLanguage) {
  // Simple check to avoid redundant operations
  if (!map || isLoadingNames) return;
  
  console.log(`Updating country names to ${newLanguage}`);
  
  // Use a one-time event handler for when the map is ready
  if (!map.isStyleLoaded()) {
    map.once('idle', () => {
      loadCountryNamesLayer(map, newLanguage);
    });
  } else {
    loadCountryNamesLayer(map, newLanguage);
  }
}

// Initialize when document is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Initialize RTL plugin right away
  initRTLTextPlugin();
  
  // Simple polling for map availability
  let attempts = 0;
  const maxAttempts = 30;
  
  const checkMap = setInterval(() => {
    attempts++;
    
    if (window.map) {
      clearInterval(checkMap);
      console.log("Map found, waiting for it to be ready");
      
      // Wait for map to be ready
      if (window.map.isStyleLoaded()) {
        loadCountryNamesLayer(window.map, window.currentLang || 'he');
      } else {
        window.map.once('idle', () => {
          loadCountryNamesLayer(window.map, window.currentLang || 'he');
        });
      }
    } else if (attempts >= maxAttempts) {
      clearInterval(checkMap);
      console.error("Timed out waiting for map");
    }
  }, 100);
});

// Export functions for external use
window.updateCountryNamesLanguage = updateCountryNamesLanguage;
window.loadCountryNamesLayer = loadCountryNamesLayer;

 