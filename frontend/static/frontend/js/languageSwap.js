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
  langImage.src = currentLang === 'he' ? langToggleButton.dataset.heImg : langToggleButton.dataset.enImg;

  // Update the text direction and alignment
  const body = document.body;
  if (currentLang === 'he') {
    body.setAttribute("dir", "rtl"); // Set direction to right-to-left
    body.style.textAlign = "right"; // Align text to the right
  } else {
    body.setAttribute("dir", "ltr"); // Set direction to left-to-right
    body.style.textAlign = "left"; // Align text to the left
  }

  // Reload or update content dynamically if needed
  loadCountryLayer();
  updateBattleHighlights();
}

// Helper function to update month dropdown
function updateMonthSelect(monthSelect) {
  const options = monthSelect.options;
  for (let i = 0; i < 12; i++) {
    options[i].text = translations[currentLang].months[i];
  }
}




