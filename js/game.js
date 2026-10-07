const WIDTH = 400;
const HEIGHT = 850;
const WALLETS = {
  USDT: '0x71C8A3d9E2b4F6a1C8A3d9E2b4F6a1C8A3d9E2b4',
  GRAM: '0x3B4f6A1c8A3D9e2B4f6A1c8A3D9e2B4f6A1C8a3D',
  SUI: '0x9E2b4F6a1C8A3d9E2b4F6a1C8A3d9E2b4F6a1C8A'
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

let jackpot = 130753;
let jackpotText, pot, page, coins = [];

function preload() {
  this.load.image('main', 'grok_1791385372349.jpg');
  this.load.image('home', 'grok_1791400770832.jpg');
  this.load.image('mine', 'grok_1791400850466.jpg');
  this.load.image('top', 'grok_1791401041596.jpg');
  this.load.image('rules', 'grok_1791402926241.jpg');
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

function openPage(scene, name) {
  if (page) page.destroy();
  page = scene.add.container(0, 0).setDepth(20);
  page.add(scene.add.rectangle(WIDTH / 2, 430, 360, 560, 0x000000, 0.55));
  const pic = scene.add.image(WIDTH / 2, 430, name.toLowerCase());
  pic.setDisplaySize(330, 500);
  page.add(pic);
  const x = scene.add.text(348, 170, 'X', { fontSize: '24px', color: '#fff', backgroundColor: '#000' }).setInteractive();
  x.on('pointerdown', () => page.destroy());
  page.add(x);

  if (name === 'Rules') {
    [['USDT', 250], ['GRAM', 300], ['SUI', 350]].forEach(([label, xPos]) => {
      const b = scene.add.rectangle(xPos, 690, 70, 26, 0x1565c0).setInteractive();
      page.add(b);
      page.add(scene.add.text(xPos, 690, label, { fontSize: '11px', color: '#fff' }).setOrigin(0.5));
      b.on('pointerdown', () => {
        if (navigator.clipboard) navigator.clipboard.writeText(WALLETS[label]);
        const m = scene.add.text(WIDTH / 2, 650, 'Copied', { fontSize: '14px', color: '#ffd54f', backgroundColor: '#000' }).setOrigin(0.5);
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