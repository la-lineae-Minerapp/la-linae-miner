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
  this.load.image('main', 'grok_1791385372349.jpg');
}

function create() {
  const bg = this.add.image(WIDTH / 2, HEIGHT / 2, 'main');
  bg.setDisplaySize(WIDTH, HEIGHT);

  this.add.rectangle(WIDTH / 2, 790, 240, 36, 0x0d1b2a, 0.85)
    .setStrokeStyle(2, 0xffd600);

  this.add.text(WIDTH / 2 - 75, 790, 'JACKPOT', {
    fontSize: '12px',
    color: '#ffd600',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  jackpotText = this.add.text(WIDTH / 2 + 45, 790, jackpot.toLocaleString(), {
    fontSize: '14px',
    color: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  if (window.Telegram && Telegram.WebApp) {
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