this.levels = this.levels || {};

var level2 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function level2 ()
    {
        this.key = "level2";
        Phaser.Scene.call(this, { key: 'level2' });
    },


    create: function ()
    {
        //this.add.image(0, 0, 'ingame').setOrigin(0);
        //make our map
        level1 = this.add.tilemap('level2');
        level1.setBaseTileSize(64,64);
        this.level1 = level1;
        //add the tileset
        const tileset = level1.addTilesetImage('tileset'); //covers indices 1 - 100
        const spikes = level1.addTilesetImage('spikes', null, 64, 128); //covers indices 101 - 105

        
        //make the layer(s) from tileset
        this.backgroundLayer = level1.createDynamicLayer('backgroundLayer',tileset);
        this.blockedLayer = level1.createStaticLayer('blockedLayer',tileset);
        //spike layer is made on the spot in this code, NOT in tiled;
        //render spikes
        this.spikeLayer = level1.createBlankDynamicLayer('spikeLayer',spikes);
        this.spikeTiles = this.findTileset(level1, "spikeObjectLayer");
        this.prepareSpikeTiles(this.spikeTiles);
        this.spikeIndicesArray = [101,102,103,104,105,104,103,102,101];
        this.spikeEvent = this.time.addEvent({delay: 100, callback: function(){ this.updateSpikeTiles(this.spikeTiles, this.spikeIndicesArray, 105) }.bind(this), callbackScope: this, loop: true });



        //music
        music = this.sound.add('level1audio',1,true);
        music.setLoop(true);
        music.play();

        var laserSound = this.sound.add('laser',1,true);
        laserSound.volume = 0.5;
        //spawn point of player from tiled
        this.spawnPoint = level1.findObject("objectsLayer",obj => obj.name ==="Spawn Point");

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

        console.log(this.player);

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
            // if (this.dynamicTrapLayer.visible && this.dynamicTrapLayer.getTileAtWorldXY(this.player.x, this.player.y) !== null )
            // {
            //     this.player.destroy();
            //     this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y,'agent');
            //     this.player.anims.play('idle',true);
            //     camera.startFollow(this.player);
            // }
            // if (this.spikeLayer.visible && this.spikeLayer.getTileAtWorldXY(this.player.x, this.player.y) !== null )
            // {
            //     this.player.destroy();
            //     this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y,'agent');
            //     this.player.anims.play('idle',true);
            //     camera.startFollow(this.player);
            // }
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
            this.scene.pause(this.key);
            music.pause();
            //launch paused screen
            this.game.currentLevel = this.key;
            this.scene.launch('paused');

    
        }.bind(this));
        //setInterval(function(){ this.updateSpikeTiles(this.spikeTiles, [101,102,103,104,105,105,105,105,105,104,103,102,101]) }.bind(this), 100);
        //SPIKES
        //this.SpikeEvent = this.time.addEvent({delay:0, callback: function() {this.updateSpikeTiles(spikeTiles, [101,102,103,104,105])}.bind(this), callbackScope: this, loop: true});
        // //LASERS
    },
    update: function(time, delta){
        // this.scene.get('ingame').controls.update(delta);
        // if (this.dynamicTrapLayer.visible && this.dynamicTrapLayer.getTileAtWorldXY(this.player.x, this.player.y) !== null )
        // {
        //     this.player.destroy();
        //     this.player = this.physics.add.sprite(this.spawnPoint.x,this.spawnPoint.y,'agent');
        //     this.player.anims.play('idle',true);
        //     this.camera.startFollow(this.player);
        // }
        // if (this.spikeLayer.visible && this.spikeLayer.getTileAtWorldXY(this.player.x, this.player.y) !== null )
        // {
        //     this.player.destroy();
        //     this.player = this.physics.add.sprite(this.spawnPoint.x,this.spawnPoint.y,'agent');
        //     this.player.anims.play('idle',true);
        //     this.camera.startFollow(this.player);
        // }
        if (this.checkIfPlayerOnSpike (this.spikeIndicesArray, 105))
        {
            this.player.destroy();
            this.player = this.physics.add.sprite(this.spawnPoint.x,this.spawnPoint.y,'agent');
            this.player.anims.play('idle',true);
            this.camera.startFollow(this.player);
        }

        //level1.putTileAt(101 , level1.worldToTileX(this.player.x), level1.worldToTileY(this.player.y), true, this.trapsLayer);
        //console.log(this.backgroundLayer.getTileAtWorldXY(this.player.x, this.player.y));
        //console.log(this.objectsLayer);

        

    },

    findTileset(map, key)
    {
        for (var i = 0; i < map.objects.length; i++)
        {
            if (map.objects[i].name === key)
            {
                return map.objects[i].objects;
            }
        }
        window.alert("this shouldnt happen");

    },
    checkIfPlayerOnSpike: function (indicesArray, deathIndex)
    {
        if ( level1.getTileAtWorldXY( this.player.x, this.player.y * 2 - 64, true, this.cameras.main, this.spikeLayer).index === deathIndex)
        {
            return true;
        }
        return false;

    }
    ,
    prepareSpikeTiles: function(tileArray) //spikes are bigger than 64x64, so have to do some offset
    {
        tileArray.forEach(function(element) {
            element.renderX = element.x;
            element.renderY = element.y * 2 - 256;
            element.currentIndex = 0;
            element.counter = 0; //this is for the duration of the death frame of the trap
            //copy properties from tiled over
            for (var i = 0; i < element.properties.length; i ++)
            {
                element[element.properties[i].name] = element.properties[i].value;
            }
        
          }.bind(this));
    },
    updateSpikeTiles: function (tileArray, indicesArray, deathIndex)
    {
        //level1.putTileAtWorldXY(101, this.player.x, this.player.y * 2 - 64, true, this.cameras.main, this.spikeLayer);
        //for some reason, putTileAtWorldXY puts the tile based on the tile height / width, i.e. goes to the location at (width/ tilewidth, height/tileheight)

        //tileArray holds an array of objects representing tiles in the layer. they arent ACTUALLY tiles in the layer
        //they have all the custom properties we put in from TILED, and we render all the tiles based on these objects
        //currentIndex refers to index in the indicesArray
        tileArray.forEach(function(element) {
            if (element.delay > 0)
            {
                element.delay --;
            }
            else{
                    element.currentIndex %= indicesArray.length;
                    if (indicesArray[element.currentIndex] === deathIndex)
                    {
                        console.log(element);
                        if (element.counter === 0)
                        {
                            level1.putTileAtWorldXY( indicesArray[element.currentIndex], element.renderX, element.renderY, true, this.cameras.main, this.spikeLayer);
                            element.counter ++;
                        }
                        else if (element.counter === element.duration) //element properties are from TILED
                        {
                            element.counter = 0;
                            element.currentIndex ++;
                        }
                        else
                        {
                            element.counter ++;
                        }
                    }
                    else{
                        level1.putTileAtWorldXY( indicesArray[element.currentIndex], element.renderX, element.renderY, true, this.cameras.main, this.spikeLayer);
                        element.currentIndex ++;
                    }
                }
          }.bind(this));
        
    }

}
);

this.levels.level2 = level2;