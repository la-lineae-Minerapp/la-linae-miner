const WIDTH = 400;
const HEIGHT = 850;
const WALLETS = {
  USDT: 'TC3PdXe5dD1rxBeUsF84QCpsPR9cPGsnsU',
  TON: 'UQAs7GN-XXXQTdiIckg4cIOeEeWEjFvhCvy3QjDem2u-dAWK',
  SUI: '0x5d5664a6f0c2abb2714309af50f9c615bf82134f3897e5b093e593d1188aced5'
};

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'game-container',
  backgroundColor: '#063a78',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: { preload, create, update }
};
new Phaser.Game(config);

let jackpot = 130118;
let gems = 2500;
let tokens = 12.5;
let level = 1;
let jackpotText, gemText, tokenText, timerText, nightOverlay;
let bubbles = [];
let sparks = [];
let menuLayer;

function preload() {
  this.load.image('main', 'grok_1791385372349.jpg');
}

function create() {
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 18;

  const bg = this.add.image(WIDTH / 2, HEIGHT / 2, 'main');
  bg.setScale(Math.max(WIDTH / bg.width, HEIGHT / bg.height));

  nightOverlay = this.add.rectangle(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT, 0x020814, isNight ? 0.38 : 0);

  const pot = this.add.container(WIDTH / 2, 108);
  pot.add(this.add.rectangle(0, 0, 220, 58, 0x10243f, 0.9).setStrokeStyle(3, 0xffd54f));
  pot.add(this.add.text(0, -16, 'DAILY JACKPOT', { fontSize: '11px', color: '#ffd54f', fontStyle: 'bold' }).setOrigin(0.5));
  jackpotText = this.add.text(0, 2, jackpot.toLocaleString(), { fontSize: '18px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
  timerText = this.add.text(0, 20, '', { fontSize: '10px', color: '#b3e5fc' }).setOrigin(0.5);
  pot.add([jackpotText, timerText]);
  this.tweens.add({ targets: pot, y: 116, duration: 1400, yoyo: true, repeat: -1 });

  this.add.rectangle(338, 78, 116, 108, 0x071426, 0.82).setStrokeStyle(2, 0x4fc3f7);
  this.add.circle(292, 42, 12, 0x90caf9);
  const tg = (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe.user) || {};
  this.add.text(308, 36, tg.username || 'guest', { fontSize: '10px', color: '#fff' });
  gemText = this.add.text(286, 62, '', { fontSize: '11px', color: '#7cffb2' });
  tokenText = this.add.text(286, 80, '', { fontSize: '11px', color: '#ffd54f' });
  this.add.text(286, 98, 'L = $0.50', { fontSize: '10px', color: '#fff' });
  refreshHud();

  const up = this.add.rectangle(70, 150, 92, 28, 0x00c853).setInteractive({ useHandCursor: true });
  this.add.text(70, 150, 'UPGRADE', { fontSize: '11px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
  up.on('pointerdown', () => {
    if (level < 25 && gems >= 1000) {
      gems -= 1000;
      jackpot += 1000;
      level += 1;
    }
    refreshHud();
  });

  drawBoard(this);
  drawMenu(this);

  for (let i = 0; i < 16; i++) {
    bubbles.push(this.add.circle(Phaser.Math.Between(12, 388), Phaser.Math.Between(180, 760), Phaser.Math.Between(2, 5), 0xb3e5fc, 0.45));
  }
  for (let i = 0; i < 10; i++) {
    sparks.push(this.add.circle(Phaser.Math.Between(160, 240), Phaser.Math.Between(200, 640), 3, 0xffd54f, 0.9));
  }

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
}

function refreshHud() {
  gemText.setText('GEM ' + gems);
  tokenText.setText('L ' + tokens + '  lv' + level);
  jackpotText.setText(jackpot.toLocaleString());
}

function drawBoard(scene) {
  scene.add.rectangle(WIDTH / 2, 735, 360, 78, 0x071426, 0.88).setStrokeStyle(2, 0x00e5ff);
  scene.add.text(28, 706, 'USDT 1.00   TON 5.20   SUI 1.80   L 0.50', { fontSize: '11px', color: '#7cffb2' });
  [['USDT', 70], ['TON', 200], ['SUI', 320]].forEach(([name, x]) => {
    const b = scene.add.rectangle(x, 748, 92, 24, 0x1565c0).setInteractive({ useHandCursor: true });
    scene.add.text(x, 748, 'Copy ' + name, { fontSize: '10px', color: '#fff' }).setOrigin(0.5);
    b.on('pointerdown', () => {
      if (navigator.clipboard) navigator.clipboard.writeText(WALLETS[name]);
      const msg = scene.add.text(WIDTH / 2, 688, 'Copied!', { fontSize: '14px', color: '#ffd54f', backgroundColor: '#000' }).setOrigin(0.5);
      scene.time.delayedCall(700, () => msg.destroy());
    });
  });
}

function drawMenu(scene) {
  ['Home', 'Mine', 'Top', 'Rules'].forEach((name, i) => {
    const x = 50 + i * 100;
    const b = scene.add.rectangle(x, 812, 84, 30, 0x10243f, 0.92).setStrokeStyle(1, 0x4fc3f7).setInteractive();
    scene.add.text(x, 812, name, { fontSize: '12px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
    b.on('pointerdown', () => openPage(scene, name));
  });
}

function openPage(scene, name) {
  if (menuLayer) menuLayer.destroy();
  menuLayer = scene.add.container(0, 0);
  const box = scene.add.rectangle(WIDTH / 2, 430, 320, 280, 0x071426, 0.94).setStrokeStyle(2, 0xffd54f);
  const close = scene.add.text(330, 300, 'X', { fontSize: '18px', color: '#fff' }).setInteractive();
  close.on('pointerdown', () => menuLayer.destroy());
  let body = name;
  if (name === 'Mine') body = 'Lv 1-25: 1000 GEM\nLv 26-50: 1 TON\n500,000 GEM = 1 L';
  if (name === 'Top') body = '1st 50%\n2nd 30%\n3rd 20%\nMost active time wins';
  if (name === 'Rules') body = 'L = $0.50\nSend TX hash after deposit';
  const t = scene.add.text(50, 320, body, { fontSize: '16px', color: '#fff', wordWrap: { width: 280 } });
  menuLayer.add([box, close, t]);
}

function update() {
  const end = new Date();
  end.setHours(24, 0, 0, 0);
  const left = Math.max(0, end - new Date());
  const h = String(Math.floor(left / 3600000)).padStart(2, '0');
  const m = String(Math.floor(left / 60000) % 60).padStart(2, '0');
  const s = String(Math.floor(left / 1000) % 60).padStart(2, '0');
  timerText.setText(h + ':' + m + ':' + s);

  bubbles.forEach(b => {
    b.y -= 0.6;
    if (b.y < 140) b.y = 780;
  });
  sparks.forEach(c => {
    c.y -= 0.9;
    if (c.y < 150) c.y = 650;
  });
  if (Phaser.Math.Between(0, 100) > 96) {
    jackpot += 1;
    jackpotText.setText(jackpot.toLocaleString());
  }
}