const WIDTH = 400;
const HEIGHT = 800;

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

let coins = 0;

function preload() {}

function create() {
  // Sky and Island
  this.add.rectangle(WIDTH/2, 60, WIDTH, 120, 0x87CEEB);
  this.add.circle(340, 40, 25, 0xFFD700);
  this.add.rectangle(WIDTH/2, 110, 280, 40, 0xC2B280);
  this.add.rectangle(WIDTH/2, 95, 260, 20, 0x228B22);

  // Trees
  this.add.rectangle(80, 70, 8, 30, 0x8B4513);
  this.add.circle(80, 50, 18, 0x228B22);
  this.add.rectangle(320, 70, 8, 30, 0x8B4513);
  this.add.circle(320, 50, 18, 0x228B22);

  // Title
  this.add.text(WIDTH/2, 25, 'ISLAND MINERS', {
    fontSize: '18px',
    fontFamily: 'Arial',
    color: '#ffffff',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  // Water
  this.add.rectangle(WIDTH/2, 460, WIDTH, 680, 0x006994);

  // 12 Floors
  const floorHeight = 48;
  const startY = 160;

  for (let i = 0; i < 12; i++) {
    const y = startY + i * floorHeight;
    const color = i % 2 === 0 ? 0x1a3a5c : 0x0f2a45;

    this.add.rectangle(WIDTH/2, y, 300, floorHeight - 4, color);
    this.add.rectangle(WIDTH/2, y, 300, floorHeight - 4).setStrokeStyle(2, 0x4a90d9);

    this.add.text(30, y, `${i + 1}`, {
      fontSize: '14px',
      color: '#7ec8ff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Left miner + girl
    this.add.rectangle(100, y, 36, 28, 0x333333);
    this.add.rectangle(100, y - 5, 20, 8, 0x00ff88);
    this.add.circle(160, y - 8, 10, 0xffb6c1);
    this.add.rectangle(160, y + 6, 16, 14, 0x6495ed);

    // Right miner + girl
    this.add.rectangle(260, y, 36, 28, 0x333333);
    this.add.rectangle(260, y - 5, 20, 8, 0x00ff88);
    this.add.circle(300, y - 8, 10, 0xffb6c1);
    this.add.rectangle(300, y + 6, 16, 14, 0x6495ed);
  }

  // Elevator shaft
  this.add.rectangle(WIDTH/2, 460, 50, 620, 0x222222, 0.6);
  this.add.rectangle(WIDTH/2, 460, 50, 620).setStrokeStyle(3, 0xaaaaaa);

  // Elevator cage
  this.elevator = this.add.rectangle(WIDTH/2, 200, 40, 50, 0x888888);
  this.elevator.setStrokeStyle(2, 0xffffff);

  // Coin tank
  this.add.rectangle(WIDTH/2, 130, 70, 30, 0x444444);
  this.add.rectangle(WIDTH/2, 130, 70, 30).setStrokeStyle(2, 0xffd700);
  this.coinText = this.add.text(WIDTH/2, 130, '0', {
    fontSize: '16px',
    color: '#ffd700',
    fontStyle: 'bold'
  }).setOrigin(0.5);

  // Button
  const btn = this.add.rectangle(WIDTH/2, 760, 160, 40, 0x00aa55)
    .setInteractive({ useHandCursor: true });
  this.add.text(WIDTH/2, 760, 'Collect Coins', {
    fontSize: '14px',
    color: '#fff'
  }).setOrigin(0.5);

  btn.on('pointerdown', () => {
    coins += 10;
    this.coinText.setText(coins);
  });

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
}

function update() {}