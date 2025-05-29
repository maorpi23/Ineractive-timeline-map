// soldierDetails.js

document.addEventListener('DOMContentLoaded', () => {
  // צור את ה־modal DOM פעם אחת
  createSoldierModal();
  
  // האזן לכל לחיצה על כפתור לוחם
  document.body.addEventListener('click', async (ev) => {
    const btn = ev.target.closest('.soldier-btn');
    if (!btn) return;

    const soldierId = btn.dataset.soldierId;
    const lang = btn.dataset.lang || window.currentLang || 'he';
    ev.preventDefault();

    try {
      // קבל את כל הלוחמים מה־cache
      const soldiers = await getCachedSoldiersData();
      const soldier = soldiers.find(s => String(s.id) === String(soldierId));
      if (!soldier) throw new Error('Soldier not found in cache');

      // עיצוב לפי שפה
      const formatted = formatSoldierForDisplay(soldier, lang);

      // השב למודאל
      populateAndShowModal(formatted, lang);
    } catch (err) {
      console.error('Error loading soldier details:', err);
    }
  });
});

/**
 * מוסיף ל־<body את ה־HTML הבסיסי של מודאל הלוחם
 */
function createSoldierModal() {
  if (document.getElementById('soldierDetailsModal')) return;
  
  const modalHtml = `
  <div class="modal fade" id="soldierDetailsModal" tabindex="-1" aria-labelledby="soldierDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="soldierDetailsModalLabel"></h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" id="soldierDetailsModalBody"></div>
      </div>
    </div>
  </div>`;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * ממלא את תוכן המודאל ומציג אותו
 * @param {{id, name, personalDetails, biography, imageLink}} soldier 
 * @param {'he'|'en'} lang 
 */
function populateAndShowModal(soldier, lang) {
  // כותרת
  const titleEl = document.getElementById('soldierDetailsModalLabel');
  titleEl.textContent = soldier.name;

  // גוף המודאל
  const bodyEl = document.getElementById('soldierDetailsModalBody');
  let html = '';
  
  // תמונה אם קיימת
  if (soldier.imageLink) {
    html += `
      <div class="text-center mb-3">
        <img src="${soldier.imageLink}" alt="${soldier.name}" class="img-fluid rounded" style="max-height: 300px;">
      </div>`;
  }

  // פרטים אישיים
  const pdLabel = lang === 'he' ? 'פרטים אישיים:' : 'Personal Details:';
  html += `
    <div class="mb-3">
      <h6 class="fw-bold">${pdLabel}</h6>
      <p>${soldier.personalDetails.replace(/\n/g,'<br>')}</p>
    </div>`;

  // קורות חיים / Biography
  const bioLabel = lang === 'he' ? 'קורות חיים:' : 'Biography:';
  html += `
    <div class="mb-3">
      <h6 class="fw-bold">${bioLabel}</h6>
      <p>${soldier.biography.replace(/\n/g,'<br>')}</p>
    </div>`;

  bodyEl.innerHTML = html;

  // הצג את המודאל
  const modal = new bootstrap.Modal(document.getElementById('soldierDetailsModal'));
  modal.show();
}
