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

let jackpot = 130118;
let gems = 2500;
let tokens = 12.5;
let jackpotText, gemText, tokenText;

function preload() {
  this.load.image('main', 'grok_1791385372349.jpg');
  this.load.image('jackpot', 'grok_1791398905218.jpg');
  this.load.image('bars', 'grok_1791388346534.jpg');
  this.load.image('menu', 'grok_1791388801596.jpg');
  this.load.image('avatar', 'grok_1791388341279.jpg');
}

function create() {
  const bg = this.add.image(WIDTH / 2, HEIGHT / 2, 'main');
  bg.setScale(Math.max(WIDTH / bg.width, HEIGHT / bg.height));

  const pot = this.add.image(WIDTH / 2, 118, 'jackpot');
  pot.setDisplaySize(250, 150);
  jackpotText = this.add.text(WIDTH / 2, 168, jackpot.toLocaleString(), {
    fontSize: '16px', color: '#fff', fontStyle: 'bold', stroke: '#000', strokeThickness: 4
  }).setOrigin(0.5);

  const bars = this.add.image(WIDTH / 2, 214, 'bars');
  bars.setDisplaySize(340, 54);
  gemText = this.add.text(118, 214, String(gems), {
    fontSize: '13px', color: '#fff', fontStyle: 'bold'
  }).setOrigin(0.5);
  tokenText = this.add.text(292, 214, String(tokens), {
    fontSize: '13px', color: '#fff', fontStyle: 'bold'
  }).setOrigin(0.5);

  const avatar = this.add.image(348, 78, 'avatar');
  avatar.setDisplaySize(62, 62);

  const menu = this.add.image(WIDTH / 2, 800, 'menu');
  menu.setDisplaySize(370, 78);
  ['Home', 'Mine', 'Top', 'Rules'].forEach((name, i) => {
    const x = 58 + i * 95;
    const hit = this.add.rectangle(x, 800, 80, 70, 0x000000, 0.01).setInteractive();
    hit.on('pointerdown', () => {
      const msg = this.add.text(WIDTH / 2, 740, name, {
        fontSize: '16px', color: '#ffd54f', backgroundColor: '#000'
      }).setOrigin(0.5);
      this.time.delayedCall(600, () => msg.destroy());
    });
  });

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
}

function update() {
  if (Phaser.Math.Between(0, 100) > 96) {
    jackpot += 1;
    jackpotText.setText(jackpot.toLocaleString());
  }
}
