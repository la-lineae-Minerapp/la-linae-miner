const WIDTH = 400;
const HEIGHT = 850;

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

let jackpot = 130156;
let gems = 2500;
let tokens = 12.5;
let jackpotText, pot, bubbles = [];

function preload() {
  this.load.image('main', 'grok_1791385372349.jpg');
}

function create() {
  const bg = this.add.image(WIDTH / 2, HEIGHT / 2, 'main');
  bg.setScale(Math.max(WIDTH / bg.width, HEIGHT / bg.height));

  pot = this.add.container(WIDTH / 2, 78);
  pot.add(this.add.rectangle(0, 0, 230, 46, 0x10243f, 0.82).setStrokeStyle(3, 0xffd54f));
  pot.add(this.add.text(0, -12, 'JACKPOT', { fontSize: '11px', color: '#ffd54f', fontStyle: 'bold' }).setOrigin(0.5));
  jackpotText = this.add.text(0, 8, jackpot.toLocaleString(), { fontSize: '16px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
  pot.add(jackpotText);

  this.add.rectangle(70, 128, 120, 32, 0x0b3d2e, 0.88).setStrokeStyle(2, 0x69f0ae);
  this.add.text(70, 128, 'GEM ' + gems, { fontSize: '13px', color: '#b9f6ca', fontStyle: 'bold' }).setOrigin(0.5);

  this.add.rectangle(220, 128, 130, 32, 0x0d47a1, 0.88).setStrokeStyle(2, 0x81d4fa);
  this.add.text(220, 128, 'L ' + tokens, { fontSize: '13px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

  this.add.circle(350, 78, 18, 0xffd54f);
  this.add.circle(350, 78, 14, 0x1565c0);

  ['Home', 'Mine', 'Top', 'Rules'].forEach((name, i) => {
    const x = 52 + i * 98;
    const b = this.add.rectangle(x, 812, 88, 36, 0x10243f, 0.92).setStrokeStyle(2, 0xffd54f).setInteractive();
    this.add.text(x, 812, name, { fontSize: '13px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
    b.on('pointerdown', () => {
      const m = this.add.text(WIDTH / 2, 760, name, { fontSize: '16px', color: '#ffd54f', backgroundColor: '#000' }).setOrigin(0.5);
      this.time.delayedCall(500, () => m.destroy());
    });
  });

  for (let i = 0; i < 18; i++) {
    bubbles.push(this.add.circle(Phaser.Math.Between(16, 384), Phaser.Math.Between(180, 760), Phaser.Math.Between(2, 5), 0xb3e5fc, 0.45));
  }

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
}

function update() {
  pot.y = 78 + Math.sin(this.time.now / 500) * 4;
  bubbles.forEach(b => {
    b.y -= 0.7;
    if (b.y < 150) b.y = 780;
  });
  if (Phaser.Math.Between(0, 80) > 77) {
    jackpot += 1;
    jackpotText.setText(jackpot.toLocaleString());
  }
}