this.levels = this.levels || {};

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
        level1 = this.add.tilemap('level1');
        this.level1 = level1;
        //add the tileset
        const tileset = level1.addTilesetImage('tileset');
        const objects = level1.addTilesetImage('agentsprite', 'objects');
        //make the layer(s) from tileset
        this.backgroundLayer = level1.createDynamicLayer('backgroundLayer',tileset);
        this.blockedLayer = level1.createStaticLayer('blockedLayer',tileset);
        this.trapsLayer = level1.createDynamicLayer('trapsLayer',objects);
        this.dynamicTrapLayer = level1.createDynamicLayer('dynamicTrapLayer',objects);
        this.spikeLayer = level1.createDynamicLayer('spikeLayer',objects);
        this.dynamicTrapLayer.setVisible(false);
        this.spikeLayer.setVisible(false);
        //set collision of blocked layer
        //blockedLayer.setCollisionByProperty({collides: true});

        //music
        music = this.sound.add('level1audio',1,true);
        music.setLoop(true);
        music.play();

        var laserSound = this.sound.add('laser',1,true);
        laserSound.volume = 0.5;
        //spawn point of player from tiled
        this.spawnPoint = level1.findObject("objectsLayer",obj => obj.name ==="Spawn Point");
        const winCoord = level1.findObject("objectsLayer",obj =>obj.name ==="Goal Point");
        const winTile = this.backgroundLayer.getTileAtWorldXY(winCoord.x,winCoord.y);
        winTile.win = true;
        console.log(winTile);

        this.player = this.physics.add.sprite(this.spawnPoint.x,this.spawnPoint.y,'agent');
    
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
            if (this.dynamicTrapLayer.visible && this.dynamicTrapLayer.getTileAtWorldXY(this.player.x, this.player.y) !== null )
            {
                this.player.destroy();
                this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y,'agent');
                camera.startFollow(this.player);
            }
            if (this.spikeLayer.visible && this.spikeLayer.getTileAtWorldXY(this.player.x, this.player.y) !== null )
            {
                this.player.destroy();
                this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y,'agent');
                camera.startFollow(this.player);
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
        this.camera = camera;

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
            laserSound.play();
            setTimeout(function(){
                dtl.setVisible(false);
            }, 500);
        }
    },
    update: function(time, delta){
        // this.scene.get('ingame').controls.update(delta);
        if (this.dynamicTrapLayer.visible && this.dynamicTrapLayer.getTileAtWorldXY(this.player.x, this.player.y) !== null )
        {
            this.player.destroy();
            this.player = this.physics.add.sprite(this.spawnPoint.x,this.spawnPoint.y,'agent');
            this.camera.startFollow(this.player);
        }
        if (this.spikeLayer.visible && this.spikeLayer.getTileAtWorldXY(this.player.x, this.player.y) !== null )
        {
            this.player.destroy();
            this.player = this.physics.add.sprite(this.spawnPoint.x,this.spawnPoint.y,'agent');
            this.camera.startFollow(this.player);
        }

        var tile = this.backgroundLayer.getTileAtWorldXY(this.player.x, this.player.y);
        //console.log(this.backgroundLayer);
        level1.putTileAt(5 , level1.worldToTileX(this.player.x), level1.worldToTileY(this.player.y), true, this.backgroundLayer);
        }

});

this.levels.level1 = InGame;