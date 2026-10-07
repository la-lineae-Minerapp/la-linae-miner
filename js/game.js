const WIDTH = 400;
const HEIGHT = 850;

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  parent: 'game-container',
  backgroundColor: '#001a33',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let jackpot = 129898;
let jackpotText;

function preload() {
  this.load.image('main', 'assets/main.png');
  this.load.image('logo', 'assets/logo.png');
  this.load.image('banner', 'assets/banner.png');
}

function create() {
  // Main background image (the big island picture)
  const bg = this.add.image(WIDTH/2, HEIGHT/2, 'main');
  bg.setDisplaySize(WIDTH, HEIGHT);

  // Logo on top
  const logo = this.add.image(WIDTH/2, 45, 'logo');
  logo.setDisplaySize(70, 70);

  // Title
  this.add.text(WIDTH/2, 95, 'LA LINAE MINER', {
    fontSize: '18px',
    fontStyle: 'bold',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4
  }).setOrigin(0.5);

  // Jackpot bar
  this.add.rectangle(WIDTH/2, 780, 240, 38, 0x0d1b2a, 0.85)
    .setStrokeStyle(2, 0xffd600);

  this.add.text(WIDTH/2 - 80, 780, 'JACKPOT', {
    fontSize: '12px',
    color: '#ffd600',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  jackpotText = this.add.text(WIDTH/2 + 50, 780, jackpot.toLocaleString(), {
    fontSize: '14px',
    color: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  // Bottom menu
  const menus = ['Home', 'Mine', 'Top', 'Rules'];
  menus.forEach((m, i) => {
    const x = 50 + i * 100;
    const btn = this.add.rectangle(x, 825, 80, 32, 0x1b263b, 0.9)
      .setStrokeStyle(1, 0x4fc3f7)
      .setInteractive({ useHandCursor: true });

    this.add.text(x, 825, m, {
      fontSize: '13px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    btn.on('pointerdown', () => {
      console.log(m + ' clicked');
    });
  });

  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
}

function update() {
  if (Phaser.Math.Between(0, 120) > 115) {
    jackpot += Phaser.Math.Between(1, 8);
    jackpotText.setText(jackpot.toLocaleString());
  }
}
