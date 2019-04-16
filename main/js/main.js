var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Preloader ()
    {
        Phaser.Scene.call(this, 'preloader');
    },

    preload: function ()
    {
        this.load.image('splash', './assets/screens/Splash.png');
        this.load.image('mainmenu', './assets/screens/Mainmenu.png');
        this.load.image('levelselect', './assets/screens/levelselect.png');
        this.load.image('controls', './assets/screens/controls.png');
        this.load.image('help', './assets/screens/Help.png');
        this.load.image('ingame', './assets/screens/ingame.png');
        this.load.image('paused', './assets/screens/ingamepaused.png'); 
        this.load.image('pausebutton', './assets/screens/pause.png'); 
        //TILES
        this.load.image('tileset','./assets/tilesets/tileset.png');
        this.load.image('objects','./assets/sprites/agentsprite.png');
        this.load.tilemapTiledJSON('level1','./assets/tilemaps/level1.json');

        //SPRITESHEETS
        this.load.spritesheet('agent','/assets/sprites/agentsprite.png',
        {frameWidth: 64, frameHeight: 64}
        );

        //SOUNDS
        this.load.audio("level1audio", 'assets/sounds/level1.mp3');
    },

    create: function ()
    {
        this.scene.start('splash');
    }

});

var Splash = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Splash ()
    {
        Phaser.Scene.call(this, { key: 'splash' });
    },

    // preload: function ()
    // {
    //     this.load.image('face', 'assets/pics/bw-face.png');
    // },

    create: function ()
    {
        this.add.image(0, 0, 'splash').setOrigin(0);
        this.input.keyboard.once('keydown', function () {

            this.scene.start('mainmenu');

        }, this);
    }

});

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        Phaser.Scene.call(this, { key: 'mainmenu'});
    },

    // preload: function ()
    // {
    //     this.load.image('face', 'assets/pics/bw-face.png');
    // },

    create: function ()
    {
        //var offsetTop = this.game.canvas.offsetTop;
        //var offsetLeft = this.game.canvas.offsetLeft;

        this.add.image(0, 0, 'mainmenu').setOrigin(0);

        var something = this.add.text( this.game.renderer.width / 2 - 50, this.game.renderer.height / 2 + 50, '- PLAY', {
            fontFamily: 'neonabsolute',
            fontSize: 30,
        }).setOrigin().setInteractive().key = 1;
        
        this.add.text( this.game.renderer.width / 2 - 50, this.game.renderer.height / 2 + 150, '- HELP', {
            fontFamily: 'neonabsolute',
            fontSize: 30,
            
        }).setOrigin().setInteractive().key = 2;

        this.add.text( this.game.renderer.width / 2 + 3, this.game.renderer.height / 2 + 100, '- CONTROLS', {
            fontFamily: 'neonabsolute',
            fontSize: 30,
            
        }).setOrigin().setInteractive().key = 3;

       
        this.input.on('gameobjectover', function (pointer, gameObject) {

            gameObject.setTint(0xff0000, 0xff0000, 0xffff00, 0xff00ff);
    
        });
    
        this.input.on('gameobjectout', function (pointer, gameObject) {
    
            gameObject.clearTint();
    
        });

        this.input.on('gameobjectdown', function (pointer, gameObject) {

            
            switch(gameObject.key)
            {
                case 1: this.scene.start('levelselect');
                break;

                case 2: this.scene.start('help');
                break;

                case 3: this.scene.start('controls');
                break;
            }
    
        }.bind(this));
    }

});

var LevelSelect = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LevelSelect ()
    {
        Phaser.Scene.call(this, { key: 'levelselect' });
    },

    // preload: function ()
    // {
    //     this.load.image('face', 'assets/pics/bw-face.png');
    // },

    create: function ()
    {
        this.add.image(0, 0, 'levelselect').setOrigin(0);

        var back = this.add.text(50, 50, 'BACK', {
            fontFamily: 'neonabsolute',
            fontSize: 30,
        }).setOrigin().setInteractive().key = 0;

        var level1 = this.add.text( 125,190, 'level 1', {
            fontFamily: 'retrocycles',
            fontSize: 40,
            
        }).setOrigin().setInteractive().key = 1;


        // back.on('pointerover', function () {

        //     this.setTint(0xff0000, 0xff0000, 0xffff00, 0xff00ff);

    
        // });

        // back.on('pointerout', function () {

        //     this.clearTint();

    
        // });

        // back.on('pointerdown', function () {

        //     this.scene.start('mainmenu');

    
        // }.bind(this));

        this.input.on('gameobjectover', function (pointer, gameObject) {

            gameObject.setTint(0xff0000, 0xff0000, 0xffff00, 0xff00ff);
    
        });
    
        this.input.on('gameobjectout', function (pointer, gameObject) {
    
            gameObject.clearTint();
    
        });

        this.input.on('gameobjectdown', function (pointer, gameObject) {

            
            switch(gameObject.key)
            {
                case 0: this.scene.start('mainmenu');
                break;

                case 1: this.scene.start('ingame');
                break;

            }
    
        }.bind(this));


    }

});

var Controls = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Controls ()
    {
        Phaser.Scene.call(this, { key: 'controls' });
    },

    // preload: function ()
    // {
    //     this.load.image('face', 'assets/pics/bw-face.png');
    // },

    create: function ()
    {
        this.add.image(0, 0, 'controls').setOrigin(0);

        var back = this.add.text(50, 50, 'BACK', {
            fontFamily: 'neonabsolute',
            fontSize: 30,
        }).setOrigin().setInteractive();

        back.on('pointerover', function () {

            this.setTint(0xff0000, 0xff0000, 0xffff00, 0xff00ff);

    
        });

        back.on('pointerout', function () {

            this.clearTint();

    
        });

        back.on('pointerdown', function () {

            this.scene.start('mainmenu');

    
        }.bind(this));
    }

});

var Help = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Help ()
    {
        Phaser.Scene.call(this, { key: 'help' });
    },

    // preload: function ()
    // {
    //     this.load.image('face', 'assets/pics/bw-face.png');
    // },

    create: function ()
    {
        this.add.image(0, 0, 'help').setOrigin(0);

        var back = this.add.text(50, 50, 'BACK', {
            fontFamily: 'neonabsolute',
            fontSize: 30,
        }).setOrigin().setInteractive();

        back.on('pointerover', function () {

            this.setTint(0xff0000, 0xff0000, 0xffff00, 0xff00ff);

    
        });

        back.on('pointerout', function () {

            this.clearTint();
        });

        back.on('pointerdown', function () {

            this.scene.start('mainmenu');

    
        }.bind(this));
    }

});

var InGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function InGame ()
    {
        Phaser.Scene.call(this, { key: 'ingame' });
    },


    create: function ()
    {
        //this.add.image(0, 0, 'ingame').setOrigin(0);
        //make our map
        const level1 = this.add.tilemap('level1');
        //add the tileset
        const tileset = level1.addTilesetImage('tileset');
        const objects = level1.addTilesetImage('agentsprite', 'objects');
        //make the layer(s) from tileset
        const backgroundLayer = level1.createStaticLayer('backgroundLayer',tileset);
        this.blockedLayer = level1.createStaticLayer('blockedLayer',tileset);
        this.trapsLayer = level1.createDynamicLayer('trapsLayer',objects);
        this.dynamicTrapLayer = level1.createDynamicLayer('dynamicTrapLayer',objects);
        this.spikeLayer = level1.createDynamicLayer('spikeLayer',objects);
        this.dynamicTrapLayer.setVisible(false);
        this.spikeLayer.setVisible(false);
        //set collision of blocked layer
        //blockedLayer.setCollisionByProperty({collides: true});

        //music
        music = this.sound.add('level1audio',1);
        music.play();

        //spawn point of player from tiled
        const spawnPoint = level1.findObject("objectsLayer",obj => obj.name ==="Spawn Point");
        const winCoord = level1.findObject("objectsLayer",obj =>obj.name ==="Goal Point");
        const winTile = backgroundLayer.getTileAtWorldXY(winCoord.x,winCoord.y);
        winTile.win = true;
        console.log(winTile);
        this.player = this.physics.add.sprite(spawnPoint.x,spawnPoint.y,'agent');
    
        //create animations for the sprites
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('agent',{start:0, end: 1}),
            frameRate: 7,
            //repeat -1 means loop
            repeat: -1
        });

        //play animations
        this.player.anims.play('idle',true);

        //set up key input

        var callback = function (event) { 
            switch (event.keyCode)
            {
                case 37:
                if (this.blockedLayer.getTileAtWorldXY(this.player.x - 64, this.player.y) === null)
                {
                this.player.x -= 64;
                }
                break;

                case 38:
                if (this.blockedLayer.getTileAtWorldXY(this.player.x, this.player.y - 64) === null)
                {
                this.player.y -= 64;
                }
                break;

                case 39:
                if (this.blockedLayer.getTileAtWorldXY(this.player.x + 64 , this.player.y) === null)
                {
                this.player.x += 64;
                }
                break;

                case 40:
                if (this.blockedLayer.getTileAtWorldXY(this.player.x, this.player.y + 64) === null)
                {
                this.player.y += 64;
                }
                break;

                default:
                window.alert("this shouldnt happen");

            }
        }.bind(this);

        this.input.keyboard.addKey(37);
        this.input.keyboard.addKey(38);
        this.input.keyboard.addKey(39);
        this.input.keyboard.addKey(40);

        this.input.keyboard.on('keydown-LEFT', callback);
        this.input.keyboard.on('keydown-RIGHT', callback);
        this.input.keyboard.on('keydown-UP', callback);
        this.input.keyboard.on('keydown-DOWN', callback);

        
    

        const camera = this.cameras.main;

        //set up arrows to control camera
        // const cursors =  this.input.keyboard.createCursorKeys();
        // this.scene.get('ingame').controls = new Phaser.Cameras.Controls.FixedKeyControl({
        //     camera: camera,
        //     left: cursors.left,
        //     right: cursors.right,
        //     up: cursors.up,
        //     down: cursors.down,
        //     speed: 0.8
        // });
        camera.setBounds(0,0, level1.widthInPixels, level1.heightInPixels);
        //camera follows player
        camera.startFollow(this.player);

        var pauseButton = this.add.image(this.game.renderer.width - 50, 50, 'pausebutton').setInteractive().setScrollFactor(0);

        pauseButton.on('pointerover', function () {
            //setTint() doesnt work for some reason idk
            this.setTintFill();
        });

        pauseButton.on('pointerout', function () {

            this.clearTint();
        });

        pauseButton.on('pointerdown', function () {

            //pause itself
            this.scene.pause('ingame');
            music.pause();
            //launch paused screen
            this.scene.launch('paused');

    
        }.bind(this));
        //SPIKES
        this.SpikeEvent = this.time.addEvent({delay:1000, callback: fireSpikes, callbackScope: this, loop: true});
        function fireSpikes(){
            const sl = this.spikeLayer;
            sl.setVisible(true);
            setTimeout(function(){
                sl.setVisible(false);
            }, 500);
        }
        //LASERS
        this.LaserEvent = this.time.addEvent({delay: 2000, callback: fireLasers, callbackScope: this, loop: true });
        function fireLasers(){

            const dtl = this.dynamicTrapLayer;
            this.dynamicTrapLayer.setVisible(true);
            setTimeout(function(){
                dtl.setVisible(false);
            }, 500);
        }
    },
    update: function(time, delta){
        // this.scene.get('ingame').controls.update(delta);

    }

});

var Paused = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Paused ()
    {
        Phaser.Scene.call(this, { key: 'paused' });
    },

    // preload: function ()
    // {
    //     this.load.image('face', 'assets/pics/bw-face.png');
    // },

    create: function ()
    {
        this.add.image(0, 0, 'paused').setOrigin(0);
     
        var something = this.add.text( this.game.renderer.width / 2, this.game.renderer.height / 2 - 50, 'RESTART LEVEL', {
            fontFamily: 'neonabsolute',
            fontSize: 30,
        }).setOrigin().setInteractive().key = 1;
        
        this.add.text( this.game.renderer.width / 2 - 13, this.game.renderer.height / 2 , 'LEVEL SELECT', {
            fontFamily: 'neonabsolute',
            fontSize: 30,
        }).setOrigin().setInteractive().key = 2;

        this.add.text( this.game.renderer.width / 2 - 68, this.game.renderer.height / 2 + 50, 'RESUME', {
            fontFamily: 'neonabsolute',
            fontSize: 30,
        }).setOrigin().setInteractive().key = 3;

        this.input.on('gameobjectover', function (pointer, gameObject) {

            gameObject.setTint(0xff0000, 0xff0000, 0xffff00, 0xff00ff);
    
        });
    
        this.input.on('gameobjectout', function (pointer, gameObject) {
    
            gameObject.clearTint();
    
        });

        this.input.on('gameobjectdown', function (pointer, gameObject) {

            
            switch(gameObject.key)
            {
                case 1: 
                this.scene.stop('ingame');
                this.scene.start('ingame');
                music.stop();
                break;

                case 2: 
                this.scene.stop('ingame');
                this.scene.start('levelselect');
                music.stop();
                break;
                
                case 3: 
                this.scene.stop('paused');
                //release the keys, just in case player was holding down the cursors as he paused the game
                // this.scene.get('ingame').controls.left.isDown = false;
                // this.scene.get('ingame').controls.right.isDown = false;
                // this.scene.get('ingame').controls.up.isDown = false;
                // this.scene.get('ingame').controls.down.isDown = false;
                music.resume();
                this.scene.resume('ingame');
                break;

            }
    
        }.bind(this));

        
    }

});
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    autoCenter: true,
    //looks like
    //it initializes all the sceneobjects, only calls create and whatnot if active is true (true by default for first sceneobject)
    scene: [ Preloader, Splash, MainMenu, LevelSelect, Controls, Help, InGame, Paused],
    //physics options
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0} //no gravityy
        }
    }
};

var game = new Phaser.Game(config);

