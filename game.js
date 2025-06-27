
let game;
let startButton;
let music;

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [StartScene, Level1, Level2, Finale],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 600 },
            debug: false
        }
    }
};

window.onload = function () {
    game = new Phaser.Game(config);
};

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('start_bg', 'title_screen_1.png');
        this.load.audio('bg_music', 'bg_music_level1.mp3');
    }

    create() {
        this.add.image(400, 300, 'start_bg').setDisplaySize(800, 600);
        let startText = this.add.text(400, 500, 'Click to Start', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Level1');
        });

        music = this.sound.add('bg_music', { loop: true });
        music.play();
    }
}

class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
    }

    preload() {
        this.load.image('bg1', 'bg.png');
        this.load.image('sparkle', 'sparkle.png');
        this.load.spritesheet('jl', 'jl_sprite_fixed.png', { frameWidth: 32, frameHeight: 32 });
        this.load.audio('jump', 'jump.wav');
        this.load.audio('sparkle_collect', 'sparkle_collect.wav');
    }

    create() {
        this.add.image(400, 300, 'bg1').setDisplaySize(800, 600);
        this.player = this.physics.add.sprite(100, 450, 'jl').setScale(2);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('jl', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.sparkle = this.physics.add.sprite(600, 450, 'sparkle');
        this.physics.add.overlap(this.player, this.sparkle, this.collectSparkle, null, this);

        this.jumpSound = this.sound.add('jump');
        this.sparkleSound = this.sound.add('sparkle_collect');

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('run', true);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('run', true);
            this.player.flipX = false;
        } else {
            this.player.setVelocityX(0);
            this.player.anims.stop();
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
            this.jumpSound.play();
        }
    }

    collectSparkle(player, sparkle) {
        sparkle.disableBody(true, true);
        this.sparkleSound.play();
        this.scene.start('Level2');
    }
}

// Placeholder scenes for Level2 and Finale
class Level2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level2' });
    }

    preload() { this.load.image('bg2', 'bg.png'); }
    create() {
        this.add.image(400, 300, 'bg2').setDisplaySize(800, 600);
        this.add.text(300, 280, 'Level 2 Coming Soon!', { fontSize: '32px', fill: '#fff' });
        this.input.once('pointerdown', () => this.scene.start('Finale'));
    }
}

class Finale extends Phaser.Scene {
    constructor() {
        super({ key: 'Finale' });
    }

    preload() { this.load.image('bg3', 'bg.png'); }
    create() {
        this.add.image(400, 300, 'bg3').setDisplaySize(800, 600);
        this.add.text(250, 280, '🎆 Fireworks Finale! 🎆', { fontSize: '32px', fill: '#fff' });
    }
}
