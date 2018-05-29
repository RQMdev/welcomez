let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

let game = new Phaser.Game(config);
let player;
let platforms;
let cursors;
let spaceKey;
let isPunching;
let timedEvent;


function preload() {
    // this.load.setBaseURL('http://labs.phaser.io');
    
    this.load.image('sky', 'assets/space.png')
    this.load.image('ground', 'assets/platform.png')

    this.load.image('duckFlying0', 'assets/flying/frame-1.png')
    this.load.image('duckFlying1', 'assets/flying/frame-2.png')
    this.load.image('duckFlying2', 'assets/flying/frame-3.png')
    this.load.image('duckFlying3', 'assets/flying/frame-4.png')
    this.load.image('duckFlying4', 'assets/flying/frame-5.png')
    this.load.image('duckFlying5', 'assets/flying/frame-6.png')
    this.load.image('duckFlying6', 'assets/flying/frame-7.png')
    this.load.image('duckFlying7', 'assets/flying/frame-8.png')

    this.load.image('duckHit0', 'assets/gotHit/frame-1.png')
    this.load.image('duckHit1', 'assets/gotHit/frame-2.png')

    this.load.image('duckFaint', 'assets/faint/frame.png')

    this.load.spritesheet('duck', 'assets/duck.png', { frameWidth: 252, frameHeight: 288 })
    this.load.spritesheet('player', 'assets/player/player-spritemap-v9.png', { frameWidth: 46, frameHeight: 50})
}

function create() {

    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    
    platforms = this.physics.add.staticGroup();
    
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    
    player = this.physics.add.sprite(400, 100, 'player');
    
    player.setCollideWorldBounds(true);
    
    // TODO: Fix Animations 
    this.anims.create({
        key: 'stand',
        frames: [ { key: 'player', frame: 0 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 24, end: 31 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'groundPunch',
        frames: this.anims.generateFrameNumbers('player', { start: 2, end: 5 }),
        frameRate: 10,
        repeat: 0
    });
    
    this.anims.create({
        key: 'jumpPunch',
        frames: this.anims.generateFrameNumbers('player', { start: 10, end: 13 }),
        frameRate: 10,
        repeat: 0
    });
    
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('player', { start: 6, end: 7 }),
        frameRate: 5,
        repeat: -1
    });

    enemy = this.physics.add.group({
        key: 'duckFlying0',
        repeat: 0,
        setXY: { x: 50, y: 0, stepX: 70 }
    });

    this.anims.create({
       key :'flying',
       frames : [
           { key: 'duckFlying0', frame: null },
           { key: 'duckFlying1', frame: null },
           { key: 'duckFlying2', frame: null },
           { key: 'duckFlying3', frame: null },
           { key: 'duckFlying4', frame: null },
           { key: 'duckFlying5', frame: null },
           { key: 'duckFlying6', frame: null },
           { key: 'duckFlying7', frame: null },
        ],
       frameRate: 15,
       repeat: -1, 
    });

    this.anims.create({
        key : 'duckHit',
        frames: [
            { key: 'duckHit0', frame: null },
            { key: 'duckHit1', frame: null },
            { key: 'duckFaint', frame: null },
        ],
        framerate: 15,
    });
    
    enemy.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.setScale(0.1, 0.1)
        child.play('flying', true)
        child.setVelocityX(50)
    });
    
    timedEvent = this.time.addEvent({
        delay: 1000,
        callback: flyingUp,
        callbackScope: this,
        repeat: -1,
    });

    console.log(timedEvent)
    
    function flyingUp() {
        enemy.setVelocityY(-100)
    }

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemy, platforms);
    this.physics.add.overlap(player, enemy, killEnemy, null, this);
    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
    this.cameras.main.setBounds(0, 0, 1024, 768)
    this.cameras.main.startFollow(player)
}


function killEnemy(player, enemy) {
    if (player.anims.currentAnim.key == 'groundPunch' || player.anims.currentAnim.key == 'jumpPunch') {
        enemy.play('duckHit', true)    
        // enemy.disableBody(true, true);
        enemy.setVelocityX(0)
        timedEvent.destroy()
    }
}

function update() {
    if (player.body.touching.down){
        if (!isPunching){
            if (spaceKey.isDown) {
                player.setVelocityX(0)
                player.anims.play('groundPunch', true)
                isPunching = true;
                setTimeout(function(){
                    isPunching = false;
                }, 500)
            } else if (cursors.right.isDown){
                player.setVelocityX(160);
                player.anims.play('run', true);
                player.flipX = false;
            } else if (cursors.left.isDown){
                player.setVelocityX(-160);
                player.anims.play('run', true);
                player.flipX = true;
            } else {
                player.setVelocityX(0);
                player.anims.play('stand');
            }
            if (cursors.up.isDown) {
                player.setVelocityY(-330);
            }
        }
    } else {
        if (spaceKey.isDown && !isPunching){
            player.anims.play('jumpPunch', true)
            isPunching = true;
                setTimeout(function(){
                    isPunching = false;
                }, 500)
        } else if (!isPunching) {
            player.anims.play('jump', true);
        }
    }
}