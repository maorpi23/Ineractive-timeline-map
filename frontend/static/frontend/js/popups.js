function showBattlesPopup(country, year, month, battles) {
  const monthNames = translations[currentLang].months;
  const modalTitle = document.getElementById("battlesModalLabel");

  // Set modal title based on current language
  if (currentLang === 'he') {
    modalTitle.textContent = `קרבות ב${country} מ${monthNames[month - 1]} ${year}`;
  } else {
    modalTitle.textContent = `Battles in ${country} from ${monthNames[month - 1]} ${year}`;
  }

  const battlesList = document.getElementById("battlesList");
  battlesList.innerHTML = ''; // Clear previous content

  if (battles.length === 0) {
    const noBattlesMessage = document.createElement("div");
    noBattlesMessage.className = "text-center text-muted";
    noBattlesMessage.textContent = currentLang === 'he' ? "לא נמצאו קרבות" : "No battles found";
    battlesList.appendChild(noBattlesMessage);
  } else {
    // Create the accordion container
    const accordion = document.createElement("div");
    accordion.className = "accordion";
    accordion.id = "battlesAccordion";

    battles.forEach((battle, index) => {
      // Create the accordion item
      const accordionItem = document.createElement("div");
      accordionItem.className = "accordion-item";

      // Accordion header
      const headerId = `heading${index}`;
      const collapseId = `collapse${index}`;
      const accordionHeader = `
        <h2 class="accordion-header" id="${headerId}">
          <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${index === 0}" aria-controls="${collapseId}">
            ${battle.name}
          </button>
        </h2>
      `;

      // Accordion body
      const accordionBody = `
        <div id="${collapseId}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="${headerId}" data-bs-parent="#battlesAccordion">
          <div class="accordion-body">
            ${battle.description}
          </div>
        </div>
      `;

      // Append header and body to the accordion item
      accordionItem.innerHTML = accordionHeader + accordionBody;
      accordion.appendChild(accordionItem);
    });

    // Append the accordion to the battles list
    battlesList.appendChild(accordion);
  }

  const modal = new bootstrap.Modal(document.getElementById('battlesModal'));
  modal.show();
}