
// תרגומים
const translations = {
  he: {
    selectMonth: "בחר חודש",
    months: [
      "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
      "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
    ],
  },
  en: {
    selectMonth: "Select a month",
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
  }
};

let currentLang = 'he';

function toggleLanguage() {
  const html = document.documentElement;
  const langButton = document.getElementById("lang-toggle");
  const monthSelect = document.getElementById("month-select");

  const heImg = langButton.getAttribute("data-he-img");
  const enImg = langButton.getAttribute("data-en-img");

  if (currentLang === 'he') {
    currentLang = 'en';
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");
    langButton.innerHTML = `<img src="${heImg}" alt="Hebrew" class="img-fluid lang-img">`;
    currentGeoJsonUrl = '/static/frontend/data/countriesHE.geojson';
  } else {
    currentLang = 'he';
    html.setAttribute("lang", "he");
    html.setAttribute("dir", "rtl");
    langButton.innerHTML = `<img src="${enImg}" alt="English" class="img-fluid lang-img">`;
    currentGeoJsonUrl = '/static/frontend/data/countries.geojson';
  }
  
  // עדכון שמות החודשים
  const options = monthSelect.options;
  for (let i = 0; i < 12; i++) {
    options[i].text = translations[currentLang].months[i];
  }
  
  // עדכון המפה לפי שפה
  if (map && map.isStyleLoaded()) {
    loadCountryLayer();
  }
  
}