// highlightBattles.js

/**
 * Highlight countries with battles by matching the correct feature property
 * and applying MapLibre style expressions based on exact property values.
 */

// Helper function to get CSS variable values
function getCssVariable(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function highlightCountriesWithBattles(map, currentLang, selectedYear, selectedMonth) {
  console.log(`[Highlight] Fetching summary for ${selectedYear}-${selectedMonth} (${currentLang})`);

  return fetch(`/get-battles-summary/?year=${selectedYear}&month=${selectedMonth}&lang=${currentLang}`)
    .then(res => res.json())
    .then(data => {
      console.log("[Highlight] Received summary data:", data);
      if (!data || !Array.isArray(data.countries) || data.countries.length === 0) {
        console.warn(`[Highlight] No battle data for ${selectedYear}-${selectedMonth}`);
        resetCountryStyles(map);
        return;
      }
      processBattleData(map, detectNameProperty(map), data.countries);
    })
    .catch(err => console.error("[Highlight] Error fetching battles summary:", err));
}


function detectNameProperty(map) {
  const src = map.getSource('countries');
  const geojson = src._data || (src._options && src._options.data);
  if (!geojson || !geojson.features.length) return 'name';
  const props = geojson.features[0].properties;
  if ('name' in props) return 'name';
  const key = Object.keys(props).find(k => /en|english/i.test(k));
  console.log(`[Highlight] Detected property for country name: ${key || 'name'}`);
  return key || 'name';
}

function processBattleData(map, countryProp, countryList) {
  console.log(`[Highlight] Processing with property: ${countryProp}`);
  const countryNames = countryList.map(c => c.name && c.name.trim()).filter(n => !!n);
  console.log('[Highlight] Country names to match:', countryNames);

  if (!countryNames.length) {
    console.warn("[Highlight] No valid country names to match, resetting styles.");
    resetCountryStyles(map);
    return;
  }

  // Get colors from CSS variables
  const highlightedOutlineColor = getCssVariable('--accent-color') || '#669bbc'; // Fallback
  const defaultOutlineColor = getCssVariable('--muted-color') || '#000814'; // Fallback
  const highlightedFillColor = getCssVariable('--secondary-color') || '#ffb703'; // Fallback
  const defaultFillColor = getCssVariable('--primary-color') || '#003049'; // Fallback

  // Build match expression using CSS variable values
  const outlineColorExpr = ['match', ['get', countryProp], ...countryNames.flatMap(name => [name, highlightedOutlineColor]), defaultOutlineColor];
  const outlineWidthExpr = ['match', ['get', countryProp], ...countryNames.flatMap(name => [name, 2]), 1]; // Keep width logic
  const fillColorExpr    = ['match', ['get', countryProp], ...countryNames.flatMap(name => [name, highlightedFillColor]), defaultFillColor];
  const fillOpacityExpr  = ['match', ['get', countryProp], ...countryNames.flatMap(name => [name, 0.7]), 0.5]; // Adjusted opacity slightly

  // Apply styles
  map.setPaintProperty('countries-outline', 'line-color', outlineColorExpr);
  map.setPaintProperty('countries-outline', 'line-width', outlineWidthExpr);
  map.setPaintProperty('countries-fill', 'fill-color', fillColorExpr);
  map.setPaintProperty('countries-fill', 'fill-opacity', fillOpacityExpr);
}

function resetCountryStyles(map) {
  console.log("[Highlight] Resetting country styles to default using CSS variables.");
  // Get default colors from CSS variables
  const defaultOutlineColor = getCssVariable('--muted-color') || '#000814'; // Fallback
  const defaultFillColor = getCssVariable('--primary-color') || '#003049'; // Fallback

  map.setPaintProperty('countries-outline', 'line-color', defaultOutlineColor);
  map.setPaintProperty('countries-outline', 'line-width', 1);
  map.setPaintProperty('countries-fill', 'fill-color', defaultFillColor);
  map.setPaintProperty('countries-fill', 'fill-opacity', 0.5); // Match default opacity from processBattleData
}

// Expose globally
window.highlightCountriesWithBattles = highlightCountriesWithBattles;
