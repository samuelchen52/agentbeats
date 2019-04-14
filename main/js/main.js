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

        this.input.once('pointerdown', function () {

            this.scene.start('mainmenu');

        }, this);
    }

});

var MainMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainMenu ()
    {
        Phaser.Scene.call(this, { key: 'mainmenu' });
    },

    // preload: function ()
    // {
    //     this.load.image('face', 'assets/pics/bw-face.png');
    // },

    create: function ()
    {
        this.add.image(0, 0, 'mainmenu').setOrigin(0);

        this.input.once('pointerdown', function () {

            this.scene.start('levelselect');

        }, this);
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

        this.input.once('pointerdown', function () {

            this.scene.start('controls');

        }, this);
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

        this.input.once('pointerdown', function () {

            this.scene.start('help');

        }, this);
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

        this.input.once('pointerdown', function () {

            this.scene.start('ingame');

        }, this);
    }

});

var InGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function InGame ()
    {
        Phaser.Scene.call(this, { key: 'ingame' });
    },

    // preload: function ()
    // {
    //     this.load.image('face', 'assets/pics/bw-face.png');
    // },

    create: function ()
    {
        this.add.image(0, 0, 'ingame').setOrigin(0);

        this.input.once('pointerdown', function () {

            this.scene.start('paused');

        }, this);
    }

});

var Paused = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Splash ()
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

        this.input.once('pointerdown', function () {

            this.scene.start('splash');

        }, this);
    }

});
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ Preloader, Splash, MainMenu, LevelSelect, Controls, Help, InGame, Paused]
};

var game = new Phaser.Game(config);

