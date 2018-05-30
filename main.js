// TODO : Refactor everything!!

let config = {
    parent: 'gameWindow',
    type: Phaser.AUTO,
    width: 1400,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            // debug: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

let game = new Phaser.Game(config);

let textDuck;
let scene;
let map;
let mapWidth;
let mapHeight;
let displayedText;
let dataIndex = 0;
let tileset;
let walls;
let tileSize = 16;
let player;
let platforms;
let cursors;
let spaceKey;
let isPunching;
let timedEvent;
let flyingUp;
let collideProtection = false;


data = [
    "",
    "Chase ball of string Gate keepers of hell. Hack up furballs russian blue when owners are asleep,",
    "cry for no apparent reason yet chew foot. Then cats take over the world.",
    "Annoy kitten brother with poking sleep eat half my food and ask for more for weigh eight pounds",
    "but take up a full-size bed or that box? i can fit in that box. Floof tum, tickle bum," 
]

function preload() { 
    this.load.image('sky', 'assets/space.png')
    this.load.image('ground', 'assets/platform.png')
    
    this.load.tilemapTiledJSON('map', 'assets/map2.json')
    this.load.image('tilesheet', 'assets/tilesheet.png')
    
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
    scene = this;

    textDuck = this.physics.add.sprite(16, 16, 'duckFlying0').setOrigin(0, 0);
    textDuck.setScrollFactor(0)
    textDuck.setScale(0.05, 0.05)
    this.add.image(0, 0, 'sky').setOrigin(0, 0);
    
    map = this.add.tilemap('map')
    mapWidth = map.width * tileSize
    mapHeight = map.height * tileSize
    // map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 })
    tileset = map.addTilesetImage('tilesheet')
    walls = map.createStaticLayer(0, tileset, 0, 0)
    grounds = map.createStaticLayer(3, tileset, 0, 0)
    
    walls.setCollisionByExclusion([ -1 ])
    grounds.setCollisionByExclusion([ -1 ])
    
    this.physics.world.setBounds(0,0, mapWidth, mapHeight)
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    // platforms = this.physics.add.staticGroup();
    
    // platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');
    
    displayedText = this.add.text(96, 32, data[dataIndex], { font: "15px Arial", fill: "#19de65" })
    displayedText.setScrollFactor(0, 0)
    
    enemy = this.physics.add.group();

    map.objects[0].objects.forEach(function(object){
        if(object.type == 'player'){
            player = scene.physics.add.sprite(object.x, object.y, 'player');
            player.setCollideWorldBounds(true);
            player.body.setGravity(0, 200)
            player.setScale(1.5)

        } else if(object.type == 'enemy') {
            enemy.create(object.x, object.y, 'duckFlying0')
        }
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
        key :'speak',
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
     });

    this.anims.create({
        key: 'duckHit',
        frames: [
            { key: 'duckHit0', frame: null },
            { key: 'duckHit1', frame: null },
            { key: 'duckHit0', frame: null },
            { key: 'duckHit1', frame: null },
            { key: 'duckHit0', frame: null },
            { key: 'duckHit1', frame: null },
            { key: 'duckHit0', frame: null },
            { key: 'duckHit1', frame: null },
            { key: 'duckHit0', frame: null },
            { key: 'duckHit1', frame: null },
            { key: 'duckHit0', frame: null },
            { key: 'duckHit1', frame: null },
            { key: 'duckHit0', frame: null },
            { key: 'duckHit1', frame: null },
            { key: 'duckHit0', frame: null },
            { key: 'duckHit1', frame: null },
            { key: 'duckFaint', frame: null },
        ],
        framerate: 1,
    });
    
    flyingUp = function(duck) {
        duck.setVelocityY(-100)
    }

    enemy.children.iterate(function (child) {
        // child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
        child.setScale(0.05, 0.05)
        child.play('flying', true)
        child.setVelocityX(50)
        child.body.setGravity(0, 0)
        // child.flyingEvent = scene.time.addEvent({
        //     delay: 1000,
        //     callback: function toto(){
        //         console.log(enemy)
        //     },
        //     callbackScope: scene,
        //     repeat: -1,
        // });
    });
    
    // console.log(this)
    // timedEvent = this.time.addEvent({
    //     delay: 1000,
    //     callback: flyingUp,
    //     callbackScope: this,
    //     repeat: -1,
    // });

        
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

    this.physics.add.collider(player, walls);
    this.physics.add.collider(player, grounds);
    this.physics.add.collider(enemy, walls, function(enemy, walls){
        console.log('collide!')
        // if (collideProtection){
        //     return
        // }
        // console.log(enemy.body)
        // collideProtection = true;
        // setTimeout(function(){
        //     collideProtection = false
        // }, 500);
        // console.log(child.body.blocked.left || child.body.blocked.right)
            // console.log(enemy.body.velocity)
                // console.log(enemy.body.blocked.left)
                if (enemy.body.blocked.left){
                    enemy.setVelocityX(50);
                } else if (enemy.body.blocked.right){
                    enemy.setVelocityX(-50);
                }
                enemy.toggleFlipX()
    });
    this.physics.add.collider(enemy, grounds);
    this.physics.add.overlap(player, enemy, killEnemy, null, this);
    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.cameras.main.startFollow(player, true, 0.5, 0.5)
}

function killEnemy(player, duck) {
    if (player.anims.currentAnim.key == 'groundPunch' || player.anims.currentAnim.key == 'jumpPunch') {
        if (duck.anims.currentAnim.key == 'duckHit'){
        } else {
            duck.play('duckHit', true)    
            // enemy.disableBody(true, true);
            console.log('normally reset velocityX')
            // console.log(enemy.flyingEvent)
            duck.setVelocityX(0)
            duck.body.setGravity(0, 200)
            displayedText.setText(data[++dataIndex])
            textDuck.play('speak')
        }
    }
}

function update() {
    if(spaceKey.isDown) {
        // console.log()
    }

    // enemy.children.iterate(function(child){
    //     console.log(child.body.blocked.left || child.body.blocked.right)
    //     if (child.body.blocked.left || child.body.blocked.right){
    //         if (child.body.velocity.x > 0){
    //             child.setVelocityX(-50)
    //         } else {
    //             child.setVelocityX(50)
    //         }
    //     }
    // });


    if (player.body.blocked.down){
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
        if (spaceKey.isDown){
            player.anims.play('jumpPunch', true)
            isPunching = true;
                setTimeout(function(){
                    isPunching = false;
                }, 500)
        } else if (cursors.right.isDown){
            player.anims.play('jump', true);
            player.setVelocityX(160)
            player.flipX = false;
        } else if (cursors.left.isDown){
            player.anims.play('jump', true);
            player.setVelocityX(-160)
            player.flipX = true;
        } else if (!isPunching) {
            player.anims.play('jump', true);
        }
    }
}