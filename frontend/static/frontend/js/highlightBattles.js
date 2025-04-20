// highlightBattles.js

/**
 * Highlight countries with battles by matching the correct feature property
 * and applying MapLibre style expressions based on exact property values.
 */

function highlightCountriesWithBattles(map, currentLang, selectedYear, selectedMonth) {
  console.log(`[Highlight] Called with lang=${currentLang}, year=${selectedYear}, month=${selectedMonth}`);
  if (!map.isStyleLoaded()) {
    console.log("[Highlight] Waiting for style to load...");
    map.once('styledata', () => ensureLayersExist(map, () => applyHighlighting(map, currentLang, selectedYear, selectedMonth)));
  } else {
    ensureLayersExist(map, () => applyHighlighting(map, currentLang, selectedYear, selectedMonth));
  }
}

function ensureLayersExist(map, callback) {
  if (map.getSource('countries') && map.getLayer('countries-outline') && map.getLayer('countries-fill')) {
    callback();
  } else {
    console.log("[Highlight] Waiting for source/layers...");
    map.once('sourcedata', () => {
      if (map.getSource('countries') && map.getLayer('countries-outline') && map.getLayer('countries-fill')) {
        callback();
      } else {
        console.error("[Highlight] Missing required source or layers for country highlighting.");
      }
    });
  }
}

function applyHighlighting(map, currentLang, selectedYear, selectedMonth) {
  console.log(`[Highlight] Fetching summary for ${selectedYear}-${selectedMonth} (${currentLang})`);
  fetch(`/get-battles-summary/?year=${selectedYear}&month=${selectedMonth}&lang=${currentLang}`)
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

  // Build match expression
  const outlineColorExpr = ['match', ['get', countryProp], ...countryNames.flatMap(name => [name, '#FF0000']), '#000'];
  const outlineWidthExpr = ['match', ['get', countryProp], ...countryNames.flatMap(name => [name, 2]), 1];
  const fillColorExpr    = ['match', ['get', countryProp], ...countryNames.flatMap(name => [name, '#A0A0FF']), '#888888'];
  const fillOpacityExpr  = ['match', ['get', countryProp], ...countryNames.flatMap(name => [name, 0.6]), 0.4];

  // Apply styles
  map.setPaintProperty('countries-outline', 'line-color', outlineColorExpr);
  map.setPaintProperty('countries-outline', 'line-width', outlineWidthExpr);
  map.setPaintProperty('countries-fill', 'fill-color', fillColorExpr);
  map.setPaintProperty('countries-fill', 'fill-opacity', fillOpacityExpr);
}

function resetCountryStyles(map) {
  console.log("[Highlight] Resetting country styles to default.");
  map.setPaintProperty('countries-outline', 'line-color', '#000');
  map.setPaintProperty('countries-outline', 'line-width', 1);
  map.setPaintProperty('countries-fill', 'fill-color', '#888888');
  map.setPaintProperty('countries-fill', 'fill-opacity', 0.4);
}

// Expose globally
window.highlightCountriesWithBattles = highlightCountriesWithBattles;
