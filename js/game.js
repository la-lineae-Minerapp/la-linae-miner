const WIDTH = 400;
const HEIGHT = 850;
const WALLETS = {
  USDT: '0x71C8A3d9E2b4F6a1C8A3d9E2b4F6a1C8A3d9E2b4',
  GRAM: '0x3B4f6A1c8A3D9e2B4f6A1c8A3D9e2B4f6A1C8a3D',
  SUI: '0x9E2b4F6a1C8A3d9E2b4F6a1C8A3d9E2b4F6a1C8A'
};
const LISTING = new Date('2027-01-01T00:00:00Z');

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

let jackpot = 130753, gems = 2500, tokens = 12.5, level = 1;
let jackpotText, gemText, tokenText, pot, page, coins = [];

function preload() {
  this.load.image('main', 'grok_1791385372349.jpg');
}
function create() {
  const bg = this.add.image(WIDTH / 2, HEIGHT / 2, 'main');
  bg.setScale(Math.max(WIDTH / bg.width, HEIGHT / bg.height));
  for (let i = 0; i < 14; i++) coins.push(this.add.circle(200, 300 + i * 24, 4, 0xffd54f, 0.95));
  pot = this.add.container(WIDTH / 2, 78);
  pot.add(this.add.rectangle(0, 0, 230, 46, 0x10243f, 0.82).setStrokeStyle(3, 0xffd54f));
  pot.add(this.add.text(0, -12, 'JACKPOT', { fontSize: '11px', color: '#ffd54f', fontStyle: 'bold' }).setOrigin(0.5));
  jackpotText = this.add.text(0, 8, jackpot.toLocaleString(), { fontSize: '16px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
  pot.add(jackpotText);
  this.add.rectangle(78, 128, 128, 32, 0x0b3d2e, 0.9).setStrokeStyle(2, 0x69f0ae);
  gemText = this.add.text(78, 128, 'GEM ' + gems, { fontSize: '13px', color: '#b9f6ca', fontStyle: 'bold' }).setOrigin(0.5);
  this.add.rectangle(230, 128, 130, 32, 0x0d47a1, 0.9).setStrokeStyle(2, 0x81d4fa);
  tokenText = this.add.text(230, 128, 'L ' + tokens, { fontSize: '13px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
  ['Home', 'Mine', 'Top', 'Rules'].forEach((name, i) => {
    const x = 52 + i * 98;
    const b = this.add.rectangle(x, 812, 88, 36, 0x10243f, 0.94).setStrokeStyle(2, 0xffd54f).setInteractive().setDepth(5);
    this.add.text(x, 812, name, { fontSize: '13px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5).setDepth(6);
    b.on('pointerdown', () => openPage(this, name));
  });
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
}
function box(scene, title) {
  if (page) page.destroy();
  page = scene.add.container(0, 0).setDepth(20);
  page.add(scene.add.rectangle(WIDTH / 2, 430, 350, 500, 0x071426, 0.96).setStrokeStyle(3, 0xffd54f));
  page.add(scene.add.text(36, 195, title, { fontSize: '22px', color: '#ffd54f', fontStyle: 'bold' }));
  const x = scene.add.text(348, 195, 'X', { fontSize: '22px', color: '#fff' }).setInteractive();
  x.on('pointerdown', () => page.destroy());
  page.add(x);
}
function openPage(scene, name) {
  box(scene, name);
  if (name === 'Home') {
    page.add(scene.add.text(36, 250, 'TREASURE CHEST\n\nPearl GEM\n' + gems + '\n\nLa Linae\n' + tokens + '\n\nTap + later to add', { fontSize: '20px', color: '#fff', lineSpacing: 6 }));
  }
  if (name === 'Mine') {
    const left = Math.max(0, LISTING - new Date());
    const d = Math.floor(left / 86400000);
    const h = Math.floor(left / 3600000) % 24;
    page.add(scene.add.text(36, 250, 'La Linae: ' + tokens + '\n\nListing Countdown\n' + d + 'd ' + h + 'h\n\nEnter Mining Base\nLevel ' + level, { fontSize: '20px', color: '#fff', lineSpacing: 8 }));
  }
  if (name === 'Top') {
    page.add(scene.add.text(36, 250, 'JACKPOT\n' + jackpot.toLocaleString() + '\n\nWeekly top 500\n\n1-3 win La Linae\n4-500 win green gems\n\n1 You\n2 Player\n3 Player', { fontSize: '18px', color: '#fff', lineSpacing: 6 }));
  }
  if (name === 'Rules') {
    page.add(scene.add.text(36, 240, 'EXCHANGE\nLa Linae = $0.50\n\n1 USDT = 2 L\n1 SUI = 2 L\n1 GRAM = 2 L', { fontSize: '18px', color: '#fff', lineSpacing: 6 }));
    [['USDT', 430], ['GRAM', 490], ['SUI', 550]].forEach(([label, y]) => {
      page.add(scene.add.text(36, y, label, { fontSize: '14px', color: '#ffd54f' }));
      const b = scene.add.rectangle(300, y + 8, 80, 28, 0x1565c0).setInteractive();
      page.add(b);
      page.add(scene.add.text(300, y + 8, 'Copy', { fontSize: '13px', color: '#fff' }).setOrigin(0.5));
      b.on('pointerdown', () => {
        if (navigator.clipboard) navigator.clipboard.writeText(WALLETS[label]);
        const m = scene.add.text(180, y + 30, 'Copied', { fontSize: '12px', color: '#7cffb2' });
        page.add(m);
        scene.time.delayedCall(600, () => m.destroy());
      });
    });
  }
}
function update() {
  pot.y = 78 + Math.sin(this.time.now / 500) * 4;
  coins.forEach((c, i) => {
    c.y -= 0.8;
    c.x = 200 + Math.sin(this.time.now / 300 + i) * 18;
    if (c.y < 210) c.y = 650;
  });
  if (Phaser.Math.Between(0, 90) > 87) {
    jackpot += 1;
    jackpotText.setText(jackpot.toLocaleString());
  }
}