

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
  const html = document.documentElement;
  const langButton = document.getElementById("lang-toggle");
  const monthSelect = document.getElementById("month-select");

  const heImg = langButton.getAttribute("data-he-img");
  const enImg = langButton.getAttribute("data-en-img");

  // Toggle language
  if (currentLang === 'he') {
    currentLang = 'en';
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");
    langButton.innerHTML = `<img src="${heImg}" alt="Hebrew" class="img-fluid lang-img">`;
  } else {
    currentLang = 'he';
    html.setAttribute("lang", "he");
    html.setAttribute("dir", "rtl");
    langButton.innerHTML = `<img src="${enImg}" alt="English" class="img-fluid lang-img">`;
  }
  
  // Update month names in dropdown
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
  // First option is "Select a month" text
  //options[0].text = translations[currentLang].selectMonth;

  // Update month names (options 1-12)
  // for (let i = 0; i < 12; i++) {
  //   if (options[i+1]) {
  //     options[i+1].text = translations[currentLang].months[i];
  //   }
  // }
  for (let i = 0; i < 12; i++) {
    options[i].text = translations[currentLang].months[i];
  }
}
