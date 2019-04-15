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
        this.load.tilemapTiledJSON('level1','./assets/tilemaps/level1.json');
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
        //make the layer(s) from tileset
        const backgroundLayer = level1.createStaticLayer('backgroundLayer',tileset);
        const blockedLayer = level1.createStaticLayer('blockedLayer',tileset);
        //set collision of blocked layer
        //blockedLayer.setCollisionByProperty({collides: true});
        
        
        const camera = this.cameras.main;

        //set up arrows to control camera
        const cursors =  this.input.keyboard.createCursorKeys();
        controls = new Phaser.Cameras.Controls.FixedKeyControl({
            camera: camera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.8
        });
        camera.setBounds(0,0, level1.widthInPixels, level1.heightInPixels);
        console.log(camera);

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
            //launch paused screen
            this.scene.launch('paused');

    
        }.bind(this));


    },
    update: function(time, delta){
        controls.update(delta);
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
                break;

                case 2: 
                this.scene.stop('ingame');
                this.scene.start('levelselect');
                break;
                
                case 3: 
                this.scene.stop('paused');
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

