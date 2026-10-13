const $ = (id) => document.getElementById(id);
let pearls = 0;
let points = 0;

$("collect").addEventListener("click", () => {
  // Demo-only interaction. Production rewards must be issued by the Worker.
  pearls += 5;
  points += 50;
  $("pearls").textContent = pearls.toLocaleString("en-US");
  $("points").textContent = points.toLocaleString("en-US");
  $("collect").textContent = "۵ مروارید آزمایشی جمع شد";
  setTimeout(() => $("collect").textContent = "جمع‌آوری آزمایشی مروارید", 900);
});

fetch("/api/config").then(r => r.json()).then(cfg => {
  if (cfg.listingDateType === "target_unconfirmed") {
    $("countdown").textContent = "تاریخ هدف هنوز تنظیم نشده";
  }
}).catch(() => {});

if (window.Telegram?.WebApp) {
  window.Telegram.WebApp.ready();
  window.Telegram.WebApp.expand();
}
