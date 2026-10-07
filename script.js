function toggleLang() {
  alert("Language switch clicked");
}

function walletConnect() {
  alert("TON Wallet connecting...");
}

function switchView(viewId) {
  const sections = document.querySelectorAll('.view-section');
  sections.forEach(sec => sec.style.display = 'none');
  
  const target = document.getElementById('view-' + viewId);
  if (target) {
    target.style.display = 'block';
  }
}

function upgradeElevator() {
  alert("Elevator upgrade requested");
}
