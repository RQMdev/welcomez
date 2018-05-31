// This is a bad code that need to be refactored.
// feel free to PR if you wanna help  ;)

// TODO : Refactor everything!!
let windowWidth = 1440;
let windowHeight = 700;

let config = {
    parent: 'gameWindow',
    type: Phaser.AUTO,
    width: windowWidth,
    height: windowHeight,
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

let playback;
let duckSound;
let textDuck;
let bg;
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
    "Il s'appelle Benoit Laurent, mais sur le net vous le verrez sous l'énigmatique pseudo de RQM-, allez savoir!",
    "Il se serait formé au Design au lycée, en Arts Appliqués! à voir cette page, on se rend compte que ça remonte un peu!",
    "En arrivant à Rennes il s'est beaucoup intéressé à la Musique, et s'est formé dans les techniques du Spectacle, son et lumière!",
    "Le milieu du spectacle étant un peu \"particulier\" et ne lui convenant pas, il a cherché une solution de replis...",
    "Comme il a passé beaucoup de temps dans son enfance à jouer à Counter-Strike, il s'est dit pourquoi pas l'informatique!",
    "C'est là qu'il est tombé sur un article du Ouest-France sur la Code-Académie, une formation rapide en développement web",
    "Il s'y est inscrit sans trop de conviction et s'est retrouvé embarqué dans une belle aventure!",
    "C'était 8 mois de formation, sans cours théorique, où il favorisait l'entraide et la pédagogie par projet réel!",
    "Enfin une formation où l'on se confronte au problème d'abord, et où on apprend à chercher par nous même! comme en vrai quoi...",
    "C'est là qu'il s'est rendu compte que la programmation, c'était cool en fait, et que le Javascript était fait pour lui!",
    "Du coup il a touché un peu à React, à React-Native, Meteor et Phaser et s'est même mis au back-end avec Node.js pendant cette formation!",
    "Mais en vrai, si vous voulez vraiment apprendre à le connaitre, vous le trouverez dans un coin de l'open-space, caché sous sa capuche!",
    "Ah oui, il revient tout juste de vacances en Thailande, où il a chopé la Dengue... donc ne vous inquiéter pas s'il a le regard vide et le teint livide ;)", 
]

function preload() {
    this.load.audio('playback', 'assets/battle.mp3')
    this.load.audio('duckSound', 'assets/duck.wav')

    this.load.image('bg', 'assets/background.png')
    
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

    // this.load.spritesheet('duck', 'assets/duck.png', { frameWidth: 252, frameHeight: 288 })
    this.load.spritesheet('player', 'assets/player/player-spritemap-v9.png', { frameWidth: 46, frameHeight: 50})
}

function create() {
    scene = this;

    playback = this.sound.add('playback', { volume: 0.05, loop: true })
    playback.play()
    
    duckSound = this.sound.add('duckSound', {volume: 0.05})

    map = this.add.tilemap('map')
    mapWidth = map.width * tileSize
    mapHeight = map.height * tileSize   
    
    bg = this.add.image(windowWidth/2, windowHeight/2, 'bg')
    bg.setScrollFactor(0.1)
    
    tileset = map.addTilesetImage('tilesheet')
    walls = map.createStaticLayer(0, tileset, 0, 0)

    // WIP Parallax background layer
    // background = map.createStaticLayer(1, tileset, 0, 0)
    // background.setScrollFactor(0.5)
    grounds = map.createStaticLayer(3, tileset, 0, 0)
    
    walls.setCollisionByExclusion([ -1 ])
    grounds.setCollisionByExclusion([ -1 ])
    
    this.physics.world.setBounds(0,0, mapWidth, mapHeight)
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
    
    textDuck = this.physics.add.sprite(32, 16, 'duckFlying0').setOrigin(0, 0);
    textDuck.setScrollFactor(0)
    textDuck.setScale(0.05, 0.05)
    
    displayedText = this.add.text(110, 34, data[dataIndex], { font: "18px Ubuntu", fill: "#000000" })
    displayedText.setScrollFactor(0, 0)
    
    enemy = this.physics.add.group();

    map.objects[0].objects.forEach(function(object){
        if (object.type == 'player') {
            player = scene.physics.add.sprite(object.x, object.y, 'player');
            player.setCollideWorldBounds(true);
            player.body.setGravity(0, 200)
            player.setScale(1.5)

        } else if (object.type == 'enemy') {
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
       frameRate: 12,
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
        frameRate: 10,
        repeat: 4
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
        frameRate: 12,
    });
    
    enemy.children.iterate(function (child) {
        child.setScale(0.05, 0.05)
        child.play('flying', true)
        child.setVelocityX(50)
        child.body.setGravity(0, 0)
    });
             
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
        frameRate: 4,
        repeat: -1
    });

    this.physics.add.collider(player, walls);
    this.physics.add.collider(player, grounds);
    this.physics.add.collider(enemy, walls, function(enemy, walls){
        enemy.toggleFlipX()
        if (enemy.body.blocked.left){
            enemy.setVelocityX(50);
        } else if (enemy.body.blocked.right){
            enemy.setVelocityX(-50);
        }
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
            duckSound.play()  
            duck.setVelocityX(0)
            duck.body.setGravity(0, 200)
            displayedText.setText(data[++dataIndex])
            textDuck.play('speak')
        }
    }
}

function update() {
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
                player.setVelocityX(200);
                player.anims.play('run', true);
                player.flipX = false;
            } else if (cursors.left.isDown){
                player.setVelocityX(-200);
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
            player.setVelocityX(200)
            player.flipX = false;
        } else if (cursors.left.isDown){
            player.anims.play('jump', true);
            player.setVelocityX(-200)
            player.flipX = true;
        } else if (!isPunching) {
            player.anims.play('jump', true);
        }
    }
}