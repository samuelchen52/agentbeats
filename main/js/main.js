class Conductor {
    constructor(bpm, offset){
        this.bpm = bpm;
        this.offset = offset;
    }
}
var audioContext;
function initAudio() {
    try {
        audioContext = new(window.AudioContext || window.webkitAudioContext)();
    } catch(e){
        console.error(e);
    }
}
window.addEventListener('load',initAudio, false);
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
        this.load.image('win','./assets/screens/levelcomplete.png' )
        //TILES
        this.load.image('tileset','./assets/tilesets/tileset.png');
        this.load.image('agentsprite','./assets/sprites/agentsprite.png');
        this.load.image('spikes','./assets/sprites/spikes.png');
        this.load.image('lasers','./assets/sprites/lasers.png');

        this.load.tilemapTiledJSON('level1','./assets/tilemaps/level1.json');
        this.load.tilemapTiledJSON('level2','./assets/tilemaps/level2.json');


        //SPRITESHEETS
        this.load.spritesheet('agent','./assets/sprites/agentsprite.png',
        {frameWidth: 64, frameHeight: 75}
        );

        //SOUNDS
        this.load.audio("level1audio", './assets/sounds/level_1.mp3');
        this.load.audio("laser", './assets/sounds/laser.mp3');
        this.load.audio("mainmenu", './assets/sounds/mainmenu.mp3');
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
        //music
        music = this.sound.add('mainmenu',1,true);
        music.play('', {loop:true});
        music.volume = 0.3;
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
        //music
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

        var level2 = this.add.text( 400,190, 'level 2', {
            fontFamily: 'retrocycles',
            fontSize: 40,
            
        }).setOrigin().setInteractive().key = 2;


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

                case 1: this.scene.start('level1');
                music.stop();
                break;

                case 2: this.scene.start('level2');
                music.stop();
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

var level1 = this.levels.level1;
var level2 = this.levels.level2;


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

            console.log(this);
            switch(gameObject.key)
            {
                case 1: 
                this.scene.stop(this.game.currentLevel);
                this.scene.start(this.game.currentLevel);
                music.stop();
                break;

                case 2: 
                this.scene.stop(this.game.currentLevel);
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
                this.scene.resume(this.game.currentLevel);
                break;

            }
    
        }.bind(this));
        
        
    }

});


var Win = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Help ()
    {
        Phaser.Scene.call(this, { key: 'win' });
    },

    // preload: function ()
    // {
    //     this.load.image('face', 'assets/pics/bw-face.png');
    // },

    create: function ()
    {
        this.add.image(0, 0, 'win').setOrigin(0);

        this.input.keyboard.once('keydown', function () {
            //game.nextLevel set by me
            this.scene.stop();
            music.stop();
            //temporary for benchmark 3 bc no level 3 yet
            if(this.game.nextLevel === "level3"){
                alert("level 3 not implemented yet, please refresh to restart the game");
            }
            else{
                this.scene.start(this.game.nextLevel);
            }
        }, this);

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
    scene: [ Preloader, Splash, MainMenu, LevelSelect, Controls, Help, level1, level2, Paused, Win],
    //physics options
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0} //no gravityy
        }
    },
    audio: {
        context: audioContext
    }
};

var game = new Phaser.Game(config);

