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
    battles.forEach(battle => {
      // Create a button styled as a list group item
      const button = document.createElement("button");
      button.type = "button";
      button.className = "list-group-item list-group-item-action"; // Bootstrap list group styling
      button.textContent = battle.name;
      button.addEventListener("click", () => showBattleDetailsPopup(battle)); // Open details popup on click

      battlesList.appendChild(button);
    });
  }

  const modal = new bootstrap.Modal(document.getElementById('battlesModal'));
  modal.show();
}

// Function to show the battle details in another popup
function showBattleDetailsPopup(battle) {
  const detailsModalTitle = document.getElementById("battleDetailsModalLabel");
  const detailsModalBody = document.getElementById("battleDetailsModalBody");

  // Set the title and description in the details modal
  detailsModalTitle.textContent = battle.name;
  detailsModalBody.textContent = battle.description;

  const detailsModal = new bootstrap.Modal(document.getElementById('battleDetailsModal'));
  detailsModal.show();
}