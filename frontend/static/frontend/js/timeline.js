let onboardingShown = false;

// תרגומים לטיפים
const onboardingTipTexts = {
  he: {
    tip1: "🖱️ לחצו על מדינה במפה כדי לגלות מה קרה שם",
    tip2: "📅 אפשר לשנות חודש ושנה בתחתית המסך"
  },
  en: {
    tip1: "🖱️ Click a country on the map to see what happened there",
    tip2: "📅 You can change the month and year at the bottom"
  }
};

window.showOnboardingTip = function() {
  console.log("showOnboardingTip: התחלה");
  const tip1 = document.getElementById('onboard-tip');
  const tip2 = document.getElementById('onboard-tip-2');
  if (!tip1 || !tip2) {
    console.log("showOnboardingTip: לא מוצא אלמנטים!");
    return;
  }

  const lang = window.currentLang || 'he';
  tip1.innerText = onboardingTipTexts[lang]?.tip1 || onboardingTipTexts.he.tip1;
  tip2.innerText = onboardingTipTexts[lang]?.tip2 || onboardingTipTexts.he.tip2;

  // אפס הכל
  tip1.classList.remove('hide');
  tip1.style.display = "";
  tip2.classList.remove('hide');
  tip2.style.display = "none";

  if (window._onboardTimer1) clearTimeout(window._onboardTimer1);
  if (window._onboardTimer2) clearTimeout(window._onboardTimer2);
  document.getElementById('mapid').removeEventListener('click', window._hideFirstTip);

  // פונקציה פנימית לסגירת טיפ ראשון
  window._hideFirstTip = function() {
    tip1.classList.add('hide');
    setTimeout(() => {
      tip1.style.display = "none";
      showSecondTip();
    }, 400);
    document.getElementById('mapid').removeEventListener('click', window._hideFirstTip);
    console.log("showOnboardingTip: הסתיים טיפ ראשון, עובר לשני");
  };

  // סגירה אוטומטית/בלחיצה
  window._onboardTimer1 = setTimeout(window._hideFirstTip, 6000);
  document.getElementById('mapid').addEventListener('click', window._hideFirstTip);

  function showSecondTip() {
    console.log("showSecondTip: הופעל");
    tip2.classList.remove('hide');
    tip2.style.display = "";
    window._onboardTimer2 = setTimeout(() => {
      tip2.classList.add('hide');
      setTimeout(() => {
        tip2.style.display = "none";
        tip2.classList.remove('hide');
        console.log("showSecondTip: סיום");
      }, 400);
    }, 5000);
  }
};






// spinner
  function showSpinner(text = "") {
    const overlay = document.getElementById("spinner-overlay");
    overlay.style.display = "flex";
    overlay.style.opacity = "1";
    overlay.querySelector('.spinner-text').innerText = text;
  }
  function hideSpinner() {
    const overlay = document.getElementById("spinner-overlay");
    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.display = "none", 400);
  }
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded");
  init();

  const monthSelect = document.getElementById("month-select");
  monthSelect.value = "9";
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
  showSpinner("טוען  Loading");



  map = new maplibregl.Map({
    container: 'mapid',
    style: 'https://api.maptiler.com/maps/01965c4d-c2fb-7c39-a924-7b766071b45b/style.json?key=R8uTGCv3RYrhR4yw1YiU',
    center: [14, 48],
    zoom: 4,
    minZoom: 2.5,
    maxZoom: 5,
    attributionControl: true,
    pitchWithRotate: false,
    
  });
  window.map = map;
  map.touchZoomRotate.disableRotation();
  map.dragRotate.disable();
  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');

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
      const sourceExists = map.getSource('countries');

      // If source already exists, update it
      if (sourceExists) {
        map.getSource('countries').setData(data);
      } else {
        // Otherwise, create the source and layers
        map.addSource('countries', {
          type: 'geojson',
          data: data
        });

        // Add layers before the first symbol layer found, or add without beforeId if none found
        map.addLayer({
          id: 'countries-fill',
          type: 'fill',
          source: 'countries',
          paint: {
            'fill-color': '#888888',
            'fill-opacity': 0.4
          }
        }); // Add layer without beforeId initially

        map.addLayer({
          id: 'countries-outline',
          type: 'line',
          source: 'countries',
          paint: {
            'line-color': '#000',
            'line-width': 1
          }
        }); // Add layer without beforeId initially
        
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
        }); // Add layer without beforeId initially

        // Add click handler only once
        setupCountryClickHandler();

        // Move all symbol layers on top of our custom layers
        const layers = map.getStyle().layers;
        layers.forEach(layer => {
          if (layer.type === 'symbol') {
            console.log(`[Layer Move] Moving symbol layer '${layer.id}' above 'countries-outline'`);
            map.moveLayer(layer.id); // Move to the top first
            map.moveLayer(layer.id, 'countries-outline'); // Then move before outline? No, move *after* outline. Let's rethink.
            // Correction: We want symbols *on top*. Moving layer without beforeId puts it on top.
            // So, move all symbol layers to be *after* our layers.
            // Let's move them after 'countries-hover' to be safe.
            if (map.getLayer(layer.id) && map.getLayer('countries-hover')) { // Check layers exist before moving
               try {
                 map.moveLayer(layer.id, undefined); // Move to top
               } catch (e) {
                 console.warn(`Could not move layer ${layer.id} initially: ${e.message}`);
               }
            }
          }
        });
         // Re-iterate to ensure they are after our layers if needed,
         // but moving all symbols to the top *after* adding ours might be sufficient.
         // Let's try just moving them to the top first. If that fails, we adjust.
         // A simpler approach: Move our layers *down* if needed.
         // Let's stick to moving symbols up for now.
         // Final attempt logic: Move all symbol layers to the very top of the stack *after* our layers are added.
         layers.forEach(layer => {
           if (layer.type === 'symbol') {
             if (map.getLayer(layer.id)) { // Check layer exists
               try {
                 map.moveLayer(layer.id); // Moves layer to the top of the stack
                 console.log(`[Layer Move] Moved symbol layer '${layer.id}' to top.`);
               } catch (e) {
                 console.warn(`Could not move layer ${layer.id} to top: ${e.message}`);
               }
             }
           }
         });

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

  waitForSource(map, 'countries', () => {
    highlightCountriesWithBattles(map, currentLang, selectedYear, selectedMonth);

    let spinnerClosed = false;
    let timeoutId = setTimeout(() => {
      if (!spinnerClosed) {
        spinnerClosed = true;
        hideSpinner();
        map.off('render', onRender);
      }
    }, 600);

    // FALLBACK – אם onRender לא ירוץ
    let onboardingTimeout = setTimeout(() => {
      if (!onboardingShown) {
        onboardingShown = true;
        console.log("updateBattleHighlights: Fallback - מציג onboarding אחרי 1.5 שניות");
        window.showOnboardingTip();
      }
    }, 1500);

    function onRender() {
      if (!spinnerClosed) {
        spinnerClosed = true;
        hideSpinner();
        clearTimeout(timeoutId);
        clearTimeout(onboardingTimeout);
        map.off('render', onRender);

        if (!onboardingShown) {
          onboardingShown = true;
          console.log("updateBattleHighlights: מציג onboarding אחרי טעינה ראשונה");
          window.showOnboardingTip();
        }
      }
    }

    map.once('idle', () => {
      map.on('render', onRender);
    });
  });
}


// expose to global so that languageSwap.js can call them:
window.map = map;  // map ירגיש כ־global
window.currentLang = currentLang;
window.loadCountryLayer = loadCountryLayer;
window.updateBattleHighlights = updateBattleHighlights;
window.selectYear = selectYear;
window.handleMonthChange = handleMonthChange;
