// Auto-close popup function
function showAutoClosePopup(message) {
  let container = document.getElementById('auto-popup-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'auto-popup-container';
    container.style.position = 'fixed';
    container.style.top = '45px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  const popup = document.createElement('div');
  popup.className = 'auto-popup';
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  popup.style.color = '#fff';
  popup.style.padding = '10px 15px';
  popup.style.borderRadius = '5px';
  popup.style.marginTop = '10px';
  popup.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  popup.textContent = message;
  container.appendChild(popup);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    popup.style.transition = 'opacity 0.5s';
    popup.style.opacity = '0';
    setTimeout(() => container.removeChild(popup), 500);
  }, 3000);
}

// Show battles in modal or auto-close popup if none
async function showBattlesPopup(country, year, month, battles) {
  const monthNames = translations[currentLang].months;
  const modalTitle = document.getElementById("battlesModalLabel");

  // Set modal title
  if (currentLang === 'he') {
    modalTitle.textContent = `קרבות ב${country} מ${monthNames[month - 1]} ${year}`;
  } else {
    modalTitle.textContent = `Battles in ${country} from ${monthNames[month - 1]} ${year}`;
  }

  const battlesList = document.getElementById("battlesList");
  battlesList.innerHTML = ''; // Clear previous content

  // If no battles found, use auto-close popup
  if (battles.length === 0) {
    const msg = currentLang === 'he' ? "לא נמצאו קרבות" : "No battles found";
    showAutoClosePopup(msg);
    return;
  }

  // Fetch keywords for all battles
  const battlesWithKeywords = await Promise.all(
    battles.map(async battle => {
      const res = await fetch(`/api/battles/${battle.id}/keywords/`);
      const json = await res.json();
      return {
        ...battle,
        keywords: json.keywords || ''
      };
    })
  );
  // === כאן מתחילה טעינת הלוחמים – נציג ספינר ===
  showSpinner(currentLang === 'he' ? 'טוען...' : 'Loading...');

  // Get soldiers data for soldier matching
  const soldiersData = await getCachedSoldiersData();

  hideSpinner();


  // Determine which accordion item (if any) opens by default
  const openIndex = battlesWithKeywords.length === 1 ? 0 : -1;

  // Add "בחר קרב" / "Choose a battle" message if more than one battle
if (battlesWithKeywords.length > 1) {
  const chooseMsg = currentLang === 'he'
    ? 'להצגת פרטי קרב, לחץ על אחד הקרבות ברשימה'
    : 'Click a battle from the list to view details';

  const infoDiv = document.createElement('div');
  infoDiv.className = 'mb-2 fw-bold'; // בלי text-secondary

  // שליפת הצבע מה־CSS Variable
  infoDiv.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();

  infoDiv.textContent = chooseMsg;
  battlesList.appendChild(infoDiv);
}


  // Create the accordion container
  const accordion = document.createElement("div");
  accordion.className = "accordion";
  accordion.id = "battlesAccordion";

  battlesWithKeywords.forEach((battle, index) => {
    // סינון הלוחמים לפי keywords מהקריאה החדשה
    const battleSoldiers = getSoldiersForBattle(battle, soldiersData);
    const formattedSoldiers = battleSoldiers.map(s => formatSoldierForDisplay(s, currentLang));

    // Create the accordion item
    const accordionItem = document.createElement("div");
    accordionItem.className = "accordion-item";

    // Accordion header IDs
    const headerId = `heading${index}`;
    const collapseId = `collapse${index}`;
    const accordionHeader = `
      <h2 class="accordion-header" id="${headerId}">
        <button class="accordion-button ${index === openIndex ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${index === openIndex}" aria-controls="${collapseId}">
          ${battle.name}
        </button>
      </h2>
    `;

    // Format description with line breaks and add soldiers list
    const formattedDesc = battle.description.replace(/\n/g, '<br>');
    const soldiersHTML = createSoldierListHTML(formattedSoldiers, currentLang);

    const accordionBody = `
      <div id="${collapseId}" class="accordion-collapse collapse ${index === openIndex ? 'show' : ''}" aria-labelledby="${headerId}" data-bs-parent="#battlesAccordion">
        <div class="accordion-body">
          ${formattedDesc}
          ${soldiersHTML}
        </div>
      </div>
    `;

    // Append header and body
    accordionItem.innerHTML = accordionHeader + accordionBody;
    accordion.appendChild(accordionItem);
  });

  // Append to list and show modal
  battlesList.appendChild(accordion);
  const modal = new bootstrap.Modal(document.getElementById('battlesModal'));
  modal.show();
}
