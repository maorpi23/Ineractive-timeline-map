// soldierLogic.js - Logic for handling soldier participation in battles

/**
 * Check if a soldier participated in a battle based on keyword matching
 * @param {Object} battle - Battle object with keywords field
 * @param {Object} soldier - Soldier object with hebrew_biography and Biography fields
 * @param {string} lang - Current language ('he' or 'en')
 * @returns {boolean} - True if soldier participated in the battle
 */
function didSoldierParticipateInBattle(battle, soldier) {
    if (!battle.keywords || !soldier) {
        return false;
    }

    // Clean and split keywords from battle
    const keywords = battle.keywords.toLowerCase()
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

    if (keywords.length === 0) {
        return false;
    }

    // תמיד משווים מילות מפתח מול קורות החיים בעברית
   const biography = soldier.hebrew_biography;

    
    if (!biography) {
        return false;
    }

    const biographyLower = biography.toLowerCase();

    // Check if at least one keyword appears in the soldier's biography
    return keywords.some(keyword => biographyLower.includes(keyword));
}

/**
 * Get all soldiers who participated in a specific battle
 * @param {Object} battle - Battle object
 * @param {Array} allSoldiers - Array of all soldier objects
 * @param {string} lang - Current language
 * @returns {Array} - Array of participating soldiers
 */
function getSoldiersForBattle(battle, allSoldiers) {
    return allSoldiers.filter(soldier => 
        didSoldierParticipateInBattle(battle, soldier)
    );
}

/**
 * Format soldier data for display
 * @param {Object} soldier - Soldier object
 * @param {string} lang - Current language
 * @returns {Object} - Formatted soldier data
 */
function formatSoldierForDisplay(soldier, lang) {
    if (lang === 'he') {
        return {
            id: soldier.id,
            name: soldier.hebrew_name,
            personalDetails: soldier.hebrew_personal_details,
            biography: soldier.hebrew_biography,
            imageLink: soldier.image_link
        };
    } else {
        return {
            id: soldier.id,
            name: soldier.english_name,
            personalDetails: soldier.personal_details,
            biography: soldier.Biography,
            imageLink: soldier.image_link
        };
    }
}

/**
 * Fetch soldiers data from the server
 * @returns {Promise<Array>} - Promise that resolves to array of soldiers
 */
async function fetchSoldiersData() {
    try {
        const response = await fetch('/api/soldiers/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching soldiers data:', error);
        return [];
    }
}

// Cache for soldiers data to avoid repeated API calls
let soldiersCache = null;

/**
 * Get soldiers data with caching
 * @returns {Promise<Array>} - Promise that resolves to array of soldiers
 */
async function getCachedSoldiersData() {
    if (soldiersCache === null) {
        soldiersCache = await fetchSoldiersData();
    }
    return soldiersCache;
}

/**
 * Create HTML for soldier list display
 * @param {Array} soldiers - Array of formatted soldier objects
 * @param {string} lang - Current language
 * @returns {string} - HTML string for soldier list
 */
// soldierLogic.js

// soldierLogic.js

function createSoldierListHTML(soldiers, lang) {
    if (soldiers.length === 0) {
        const noSoldiersText = lang === 'he'
            ? 'לא נמצאו לוחמים עבור קרב זה'
            : 'No soldiers found for this battle';
        return `<p class="text-muted">${noSoldiersText}</p>`;
    }

    // פיצול למי שיש לו תמונה ומי שאין
    const withImg = soldiers.filter(s => s.imageLink);
    const withoutImg = soldiers.filter(s => !s.imageLink);

    let html = `<div class="mt-3 soldiers-section">`;

    // קודם לוחמים עם תמונה – ככרטיסונים קטנים
    withImg.forEach(soldier => {
        const name = soldier.name;
        const imgSrc = soldier.imageLink;
        html += `
        <div class="soldier-card">
          <button class="soldier-btn"
                  data-soldier-id="${soldier.id}"
                  data-lang="${lang}">
            <div class="image-container">
              <img src="${imgSrc}" alt="${name}" />
            </div>
            <div class="soldier-name">${name}</div>
          </button>
        </div>`;
    });

    // אחר כך לוחמים בלי תמונה – ככפתור Bootstrap פשוט
    withoutImg.forEach(soldier => {
        const name = soldier.name;
        html += `
        <button class="btn btn-outline-secondary btn-sm me-2 mb-2 soldier-noimg soldier-btn"
                data-soldier-id="${soldier.id}"
                data-lang="${lang}">
          ${name}
        </button>`;
    });

    html += '</div>';
    return html;
}



/**
 * Show soldier details in modal
 * @param {number} soldierId - ID of the soldier
 * @param {string} lang - Current language
 */
async function showSoldierDetails(soldierId, lang) {
    try {
        const soldiers = await getCachedSoldiersData();
        const soldier = soldiers.find(s => s.id === soldierId);
        
        if (!soldier) {
            console.error('Soldier not found:', soldierId);
            return;
        }

        const formattedSoldier = formatSoldierForDisplay(soldier, lang);
        
        // Update modal content
        const modalTitle = document.getElementById('soldierDetailsModalLabel');
        const modalBody = document.getElementById('soldierDetailsModalBody');
        
        modalTitle.textContent = formattedSoldier.name;
        
        // Create modal body HTML
        let modalHTML = '';
        
        // Add image if available
        if (formattedSoldier.imageLink) {
            modalHTML += `
                <div class="text-center mb-3">
                    <img src="${formattedSoldier.imageLink}" 
                         alt="${formattedSoldier.name}" 
                         class="img-fluid rounded" 
                         style="max-height: 300px; max-width: 100%;">
                </div>`;
        }
        
        // Add personal details
        const personalDetailsTitle = lang === 'he' ? 'פרטים אישיים:' : 'Personal Details:';
        modalHTML += `
            <div class="mb-3">
                <h6 class="fw-bold">${personalDetailsTitle}</h6>
                <p>${formattedSoldier.personalDetails.replace(/\n/g, '<br>')}</p>
            </div>`;
        
        // Add biography
        const biographyTitle = lang === 'he' ? 'קורות חיים:' : 'Biography:';
        modalHTML += `
            <div class="mb-3">
                <h6 class="fw-bold">${biographyTitle}</h6>
                <p>${formattedSoldier.biography.replace(/\n/g, '<br>')}</p>
            </div>`;
        
        modalBody.innerHTML = modalHTML;
        
    } catch (error) {
        console.error('Error showing soldier details:', error);
        const errorMsg = lang === 'he' ? 'שגיאה בטעינת פרטי הלוחם' : 'Error loading soldier details';
        document.getElementById('soldierDetailsModalBody').innerHTML = `<p class="text-danger">${errorMsg}</p>`;
    }
}

// Make functions available globally
window.didSoldierParticipateInBattle = didSoldierParticipateInBattle;
window.getSoldiersForBattle = getSoldiersForBattle;
window.formatSoldierForDisplay = formatSoldierForDisplay;
window.fetchSoldiersData = fetchSoldiersData;
window.getCachedSoldiersData = getCachedSoldiersData;
window.createSoldierListHTML = createSoldierListHTML;
window.showSoldierDetails = showSoldierDetails;