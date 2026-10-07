// Switch between views (Landing, Mine, Leaderboard, Rules)
function switchView(viewId) {
    const views = ['landing', 'main', 'leaderboard', 'rules'];
    views.forEach(v => {
        const el = document.getElementById('view-' + v);
        if (el) {
            el.style.display = (v === viewId) ? 'block' : 'none';
        }
    });
}

// Countdown Timer logic
function updateCountdown() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;

    // Set a target date (e.g., 78 days from now)
    let targetTime = localStorage.getItem('la_linea_target');
    if (!targetTime) {
        targetTime = new Date().getTime() + (78 * 24 * 60 * 60 * 1000);
        localStorage.setItem('la_linea_target', targetTime);
    }

    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance < 0) {
        timerElement.innerHTML = "Landed!";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Elevator upgrade function
let elevatorLevel = 1;
function upgradeElevator() {
    elevatorLevel++;
    const lvlEl = document.getElementById('elevator-lvl');
    if (lvlEl) {
        lvlEl.innerText = elevatorLevel;
    }
    alert("Elevator upgraded to level " + elevatorLevel + "!");
}

// Language toggle (RU/EN)
let currentLang = 'EN';
function toggleLang() {
    currentLang = currentLang === 'EN' ? 'RU' : 'EN';
    const btn = document.getElementById('lang-btn');
    if (btn) {
        btn.innerText = currentLang + " / " + (currentLang === 'EN' ? 'RU' : 'EN');
    }
}

// Run timer every second
setInterval(updateCountdown, 1000);
updateCountdown();
