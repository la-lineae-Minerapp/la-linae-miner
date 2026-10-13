let state = {
    pearls: 0,
    score: 0,
    level: 1,
    upgradeCost: 50,
    tokenPrice: 0.00142
};

const pearlsCountEl = document.getElementById('pearlsCount');
const scoreCountEl = document.getElementById('scoreCount');
const levelCountEl = document.getElementById('levelCount');
const tokenPriceEl = document.getElementById('tokenPrice');
const tapButton = document.getElementById('tapButton');
const upgradeLevelBtn = document.getElementById('upgradeLevelBtn');
const connectWalletBtn = document.getElementById('connectWalletBtn');
const walletAddressEl = document.getElementById('walletAddress');
const navItems = document.querySelectorAll('.nav-item');
const viewSections = document.querySelectorAll('.view-section');

if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
}

function updateUI() {
    pearlsCountEl.textContent = state.pearls;
    scoreCountEl.textContent = state.score;
    levelCountEl.textContent = state.level;
    tokenPriceEl.textContent = `$${state.tokenPrice.toFixed(5)}`;
    upgradeLevelBtn.textContent = `Upgrade Floor (Cost: ${state.upgradeCost} Pearls)`;
}

tapButton.addEventListener('click', () => {
    state.pearls += 1 * state.level;
    state.score += 10 * state.level;
    updateUI();
});

upgradeLevelBtn.addEventListener('click', () => {
    if (state.pearls >= state.upgradeCost) {
        state.pearls -= state.upgradeCost;
        state.level += 1;
        state.upgradeCost = Math.floor(state.upgradeCost * 1.8);
        updateUI();
    } else {
        alert("Not enough pearls!");
    }
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        viewSections.forEach(section => section.classList.remove('active'));
        
        item.classList.add('active');
        const targetId = item.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});

document.querySelectorAll('.buy-island-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        alert(`Successfully purchased island! Generating passive yield.`);
    });
});

connectWalletBtn.addEventListener('click', () => {
    walletAddressEl.textContent = "0x8F92...3B11 (Sui Connected)";
    connectWalletBtn.textContent = "Connected";
    connectWalletBtn.classList.add('disabled');
});

setInterval(() => {
    const change = (Math.random() - 0.48) * 0.00005;
    state.tokenPrice = Math.max(0.0001, state.tokenPrice + change);
    tokenPriceEl.textContent = `$${state.tokenPrice.toFixed(5)}`;
}, 3000);

updateUI();
