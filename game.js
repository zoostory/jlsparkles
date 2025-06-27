
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player, cursors, sparkle, score = 0, scoreText, platforms;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'bg.png');
    this.load.image('sparkle', 'sparkle.png');
    this.load.image('ground', 'sparkle.png');
    this.load.spritesheet('jl', 'jl_sprite_fixed.png', { frameWidth: 32, frameHeight: 32 });
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(800, 600);

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 590, 'ground').setScale(50, 1).refreshBody();

    player = this.physics.add.sprite(100, 500, 'jl').setScale(2);
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('jl', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    sparkle = this.physics.add.sprite(600, 500, 'sparkle');
    sparkle.setBounce(0.5);
    sparkle.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(sparkle, platforms);
    this.physics.add.overlap(player, sparkle, collectSparkle, null, this);

    cursors = this.input.keyboard.createCursorKeys();
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.flipX = true;
        player.anims.play('run', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.flipX = false;
        player.anims.play('run', true);
    } else {
        player.setVelocityX(0);
        player.anims.stop();
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-400);
    }
}

function collectSparkle(player, sparkle) {
    sparkle.disableBody(true, true);
    score += 1;
    scoreText.setText('Score: ' + score);
}
