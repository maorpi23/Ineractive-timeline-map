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
  battlesList.innerHTML = '';

  if (battles.length === 0) {
    const li = document.createElement("li");
    li.className = "list-group-item text-center text-muted";
    li.textContent = currentLang === 'he' ? "לא נמצאו קרבות" : "No battles found";
    battlesList.appendChild(li);
  } else {
    battles.forEach(battle => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = battle.name;
      battlesList.appendChild(li);
    });
  }

  const modal = new bootstrap.Modal(document.getElementById('battlesModal'));
  modal.show();
}