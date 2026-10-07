let balance = 15.50;
let elevatorLevel = 1;
let floorLevels = Array(13).fill(1);

// Real Day & Night Cycle implementation based on real local time hours
function updateDayNightCycle() {
    const now = new Date();
    const hour = now.getHours();
    
    const islandCard = document.getElementById('island-card');
    const timeIndicator = document.getElementById('time-indicator');
    const envDesc = document.getElementById('environment-desc');
    const islandIcon = document.getElementById('island-icon');

    if (!islandCard) return;

    // Day time: 6:00 AM to 6:59 PM (6 تا 19)
    // Night time: 7:00 PM to 5:59 AM (19 تا 6 صبح)
    const isDay = hour >= 6 && hour < 19;

    if (isDay) {
        // Natural Day Theme (Blue sky, bright ocean, sunlight)
        islandCard.style.background = "linear-gradient(to bottom, #2980b9, #6dd5fa, #2ecc71)";
        timeIndicator.innerHTML = `☀️ Day (${hour}:00)`;
        envDesc.innerHTML = "Sunlit beaches, crystal water & rustling palm trees";
        islandIcon.innerHTML = "🌴🌊☀️";
    } else {
        // Natural Night Theme (Deep dark blue sky, moonlight, stars, gentle waves)
        islandCard.style.background = "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";
        timeIndicator.innerHTML = `🌙 Night (${hour}:00)`;
        envDesc.innerHTML = "Starlit sky, moonlight glow over calm ocean waves";
        islandIcon.innerHTML = "🌴🌊🌙✨";
    }
}

function updateCountdown() {
    const timerElement = document.getElementById('countdown-timer');
    if (!timerElement) return;

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

    timerElement.innerHTML = `Listing: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Render 12 Underground Floors with Miners & Laptop Girls
function renderFloors() {
    const container = document.getElementById('floors-container');
    if (!container) return;
    container.innerHTML = '';

    for (let i = 1; i <= 12; i++) {
        let floorCard = document.createElement('div');
        floorCard.style.cssText = "background: #151a23; border: 1px solid #2a3447; border-radius: 8px; padding: 6px 8px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;";
        
        floorCard.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px;">
                <div style="font-size: 20px; background: rgba(58, 134, 255, 0.1); padding: 4px; border-radius: 6px;">💻👩‍💻⛏️</div>
                <div>
                    <div style="font-size: 12px; font-weight: bold; color: #fff;">Floor ${i}: Miner & Laptop Girl</div>
                    <div style="font-size: 10px; color: #aaa;">Prod: +${(i * 0.3 * floorLevels[i]).toFixed(1)} L/m</div>
                </div>
            </div>
            <button onclick="upgradeFloor(${i})" style="background: #3a86ff; color: #fff; border: none; border-radius: 6px; padding: 5px 8px; font-size: 10px; cursor: pointer; font-weight: bold;">
                Lvl ${floorLevels[i]}<br><span style="font-size: 8px; color: #ddd;">(${i * 5}L)</span>
            </button>
        `;
        container.appendChild(floorCard);
    }
}

function upgradeFloor(floorNum) {
    let cost = floorNum * 5;
    if (balance >= cost) {
        balance -= cost;
        floorLevels[floorNum]++;
        document.getElementById('balance').innerText = balance.toFixed(2);
        renderFloors();
    } else {
        alert("Not enough La Lineae coins!");
    }
}

// Automatic Production loop
setInterval(() => {
    let totalProd = 0;
    for (let i = 1; i <= 12; i++) {
        totalProd += (i * 0.05 * floorLevels[i] * elevatorLevel);
    }
    balance += totalProd;
    const bEl = document.getElementById('balance');
    if (bEl) {
        bEl.innerText = balance.toFixed(2);
    }
}, 2000);

function upgradeElevator() {
    let cost = elevatorLevel * 10;
    if (balance >= cost) {
        balance -= cost;
        elevatorLevel++;
        document.getElementById('elevator-lvl').innerText = elevatorLevel;
        document.getElementById('balance'].innerText = balance.toFixed(2);
    } else {
        alert("Not enough coins to upgrade elevator!");
    }
}

let currentLang = 'EN';
function toggleLang() {
    currentLang = currentLang === 'EN' ? 'RU' : 'EN';
    document.getElementById('lang-btn').innerText = currentLang + " / " + (currentLang === 'EN' ? 'RU' : 'EN');
}

renderFloors();
updateDayNightCycle();
setInterval(updateCountdown, 1000);
setInterval(updateDayNightCycle, 60000); // Check time every minute for day/night transition
updateCountdown();
