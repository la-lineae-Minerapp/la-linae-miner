function copyToClipboard(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        let originalText = btnElement.innerText;
        btnElement.innerText = "COPIED!";
        btnElement.style.background = "#00ff00";
        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.style.background = "#00ffff";
        }, 2000);
    });
}

function checkDayNightCycle() {
    const hours = new Date().getHours();
    const body = document.getElementById("game-body");
    
    if (hours >= 7 && hours < 19) {
        body.className = "day-mode";
    } else {
        body.className = "night-mode";
    }
}
setInterval(checkDayNightCycle, 60000);
checkDayNightCycle();

function openProfileModal() {
    document.getElementById("profile-modal").style.display = "flex";
}

function closeProfileModal() {
    document.getElementById("profile-modal").style.display = "none";
}

function saveTelegramID() {
    let tgId = document.getElementById("telegram-id-input").value;
    if (tgId.trim() !== "") {
        localStorage.setItem("user_telegram_id", tgId);
        alert("Telegram ID saved successfully!");
        closeProfileModal();
    } else {
        alert("Please enter a valid ID.");
    }
}
