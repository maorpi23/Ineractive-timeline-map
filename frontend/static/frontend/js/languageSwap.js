
const translations = {
  he: {
    selectMonth: "בחר חודש",
    months: [
      "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
      "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
    ],
    noBattles: "לא נמצאו קרבות",
    battlesIn: "קרבות ב"
  },
  en: {
    selectMonth: "Select a month",
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    noBattles: "No battles found",
    battlesIn: "Battles in"
  }
};


function toggleLanguage() {
  // Toggle the current language
  currentLang = currentLang === 'he' ? 'en' : 'he';

  // Update the language toggle button image
  const langToggleButton = document.getElementById("lang-toggle");
  const langImage = langToggleButton.querySelector("img");
  langImage.src = currentLang === 'he' ? langToggleButton.dataset.enImg : langToggleButton.dataset.heImg;

  // Update the text direction and alignment
  const body = document.body;
  if (currentLang === 'he') {
    body.setAttribute("dir", "rtl"); // Set direction to right-to-left
    body.style.textAlign = "right"; // Align text to the right
  } else {
    body.setAttribute("dir", "ltr"); // Set direction to left-to-right
    body.style.textAlign = "left"; // Align text to the left
  }

  // Update the month dropdown
  const monthSelect = document.getElementById("month-select");
  updateMonthSelect(monthSelect);
  
  // Update currentLang in window
  window.currentLang = currentLang;
  
  console.log(`Language changed to: ${currentLang}`);

  // If map exists and style is loaded, update the layers
  if (window.map && window.map.isStyleLoaded()) {
    // First update the country boundaries layer
    window.loadCountryLayer();
    
    // Then explicitly update the country names layer with the new language
    console.log("Calling updateCountryNamesLanguage from toggleLanguage");
    window.updateCountryNamesLanguage(window.map, currentLang);
    
    // Finally update battle highlights
    window.updateBattleHighlights();
  } else {
    console.warn("Map not ready yet, could not update layers");
  }
}
// Helper function to update month dropdown
function updateMonthSelect(monthSelect) {
  const options = monthSelect.options;
  for (let i = 0; i < 12; i++) {
    options[i].text = translations[currentLang].months[i];
  }
}
