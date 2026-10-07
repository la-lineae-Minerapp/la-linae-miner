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
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let coins = 0;
let jackpot = 128450;
let elevator;
let elevDir = 1;
let bubbles = [];
let fishes = [];
let particles = [];
let isNight = false;
let coinText, jackpotText, timeText;

function create() {
  // ===== DAY / NIGHT DETECT =====
  const hour = new Date().getHours();
  isNight = (hour < 6 || hour >= 18);

  // ===== SKY =====
  if (isNight) {
    this.add.rectangle(WIDTH/2, 50, WIDTH, 100, 0x0a1628);
    // Stars
    for (let i = 0; i < 25; i++) {
      this.add.circle(Phaser.Math.Between(10, 390), Phaser.Math.Between(10, 80), 1.5, 0xffffff, 0.8);
    }
    // Moon
    this.add.circle(340, 35, 18, 0xf0f0f0);
  } else {
    this.add.rectangle(WIDTH/2, 50, WIDTH, 100, 0x4fc3f7);
    this.add.circle(340, 35, 20, 0xffeb3b);
  }

  // ===== ISLAND =====
  this.add.ellipse(WIDTH/2, 100, 300, 40, 0xc2b280);
  this.add.ellipse(WIDTH/2, 90, 260, 25, 0x388e3c);

  // Trees
  this.add.rectangle(60, 75, 8, 30, 0x5d4037);
  this.add.circle(60, 55, 18, 0x2e7d32);
  this.add.rectangle(340, 75, 8, 30, 0x5d4037);
  this.add.circle(340, 55, 18, 0x2e7d32);

  // Title
  this.add.text(WIDTH/2, 20, 'ISLAND MINERS', {
    fontSize: '18px',
    fontStyle: 'bold',
    color: '#ffffff',
    stroke: '#000',
    strokeThickness: 3
  }).setOrigin(0.5);

  // ===== WATER =====
  const waterColor = isNight ? 0x002 exp33 : 0x0277bd;
  this.add.rectangle(WIDTH/2, 480, WIDTH, 700, waterColor);

  // ===== 12 FLOORS =====
  const floorH = 42;
  const startY = 145;

  for (let i = 0; i < 12; i++) {
    const y = startY + i * (floorH + 8);
    const floorColor = isNight ? 0x1a237e : 0x0d47a1;

    // Floor
    this.add.rectangle(WIDTH/2, y, 290, floorH, floorColor)
      .setStrokeStyle(2, isNight ? 0x00e5ff : 0x4fc3f7);

    // Number
    this.add.circle(32, y, 11, 0x0288d1);
    this.add.text(32, y, `${i+1}`, { fontSize: '12px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

    // Left miner + girl
    this.add.rectangle(90, y+2, 28, 22, 0x37474f);
    this.add.rectangle(90, y-5, 14, 6, 0x00e676);
    this.add.circle(130, y-5, 9, 0xffab91);
    this.add.rectangle(130, y+7, 14, 12, 0x7e57c2);

    // Cable from girl to center
    this.add.rectangle(WIDTH/2 - 30, y, 40, 2, 0x90a4ae);

    // Right miner + girl
    this.add.rectangle(270, y+2, 28, 22, 0x37474f);
    this.add.rectangle(270, y-5, 14, 6, 0x00e676);
    this.add.circle(310, y-5, 9, 0xffab91);
    this.add.rectangle(310, y+7, 14, 12, 0x26a69a);
  }

  // ===== ELEVATOR (glass cage) =====
  this.add.rectangle(WIDTH/2, 470, 48, 620, 0x263238, 0.5)
    .setStrokeStyle(2, 0xb0bec5);

  elevator = this.add.rectangle(WIDTH/2, 180, 40, 40, 0x78909c, 0.8)
    .setStrokeStyle(2, 0xffffff);

  // ===== COIN TANK =====
  this.add.rectangle(WIDTH/2, 115, 70, 24, 0x37474f)
    .setStrokeStyle(2, 0xffd600);
  coinText = this.add.text(WIDTH/2, 115, '0', {
    fontSize: '15px', color: '#ffd600', fontStyle: 'bold'
  }).setOrigin(0.5);

  // ===== JACKPOT WIDGET =====
  this.add.rectangle(WIDTH/2, 780, 220, 36, 0x1a237e)
    .setStrokeStyle(2, 0xffd600);
  this.add.text(WIDTH/2 - 70, 780, 'JACKPOT', {
    fontSize: '11px', color: '#ffd600', fontStyle: 'bold'
  }).setOrigin(0.5);
  jackpotText = this.add.text(WIDTH/2 + 40, 780, jackpot.toLocaleString(), {
    fontSize: '13px', color: '#ffffff', fontStyle: 'bold'
  }).setOrigin(0.5);

  // ===== BOTTOM MENU =====
  const menuY = 820;
  const menus = ['Home', 'Mine', 'Top', 'Rules'];
  menus.forEach((m, i) => {
    const x = 50 + i * 100;
    this.add.rectangle(x, menuY, 70, 28, 0x1565c0)
      .setStrokeStyle(1, 0x4fc3f7)
      .setInteractive({ useHandCursor: true });
    this.add.text(x, menuY, m, {
      fontSize: '12px', color: '#fff', fontStyle: 'bold'
    }).setOrigin(0.5);
  });

  // ===== BUBBLES =====
  for (let i = 0; i < 20; i++) {
    const b = this.add.circle(
      Phaser.Math.Between(15, 385),
      Phaser.Math.Between(160, 750),
      Phaser.Math.Between(2, 6),
      0x81d4fa, 0.4
    );
    bubbles.push({ obj: b, speed: Phaser.Math.FloatBetween(0.4, 1.2) });
  }

  // ===== SIMPLE FISH =====
  for (let i = 0; i < 6; i++) {
    const f = this.add.ellipse(
      Phaser.Math.Between(40, 360),
      Phaser.Math.Between(200, 700),
      14, 8, Phaser.Math.RND.pick([0xff7043, 0xffca28, 0x26c6da])
    );
    fishes.push({ obj: f, speed: Phaser.Math.FloatBetween(0.3, 0.8), dir: 1 });
  }

  // Telegram
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
}

function update() {
  // Elevator move
  elevator.y += elevDir * 1.1;
  if (elevator.y > 690) elevDir = -1;
  if (elevator.y < 160) elevDir = 1;

  // Bubbles
  bubbles.forEach(b => {
    b.obj.y -= b.speed;
    if (b.obj.y < 130) {
      b.obj.y = 760;
      b.obj.x = Phaser.Math.Between(15, 385);
    }
  });

  // Fish
  fishes.forEach(f => {
    f.obj.x += f.speed * f.dir;
    if (f.obj.x > 370 || f.obj.x < 30) f.dir *= -1;
  });

  // Fake jackpot increase
  if (Phaser.Math.Between(0, 100) > 97) {
    jackpot += Phaser.Math.Between(1, 5);
    jackpotText.setText(jackpot.toLocaleString());
  }
}