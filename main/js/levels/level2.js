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
        //variables for use
        var deathTime = 0;
        //this.add.image(0, 0, 'ingame').setOrigin(0);
        //make our map
        //pause var
        level1 = this.add.tilemap('level2');
        level1.setBaseTileSize(64,64);
        this.level1 = level1;
        console.log(level1);
        //add the tileset
        const tileset = level1.addTilesetImage('tileset'); //covers indices 1 - 100
        const spikes = level1.addTilesetImage('spikes'); //covers indices 101 - 105
        const agentstuff = level1.addTilesetImage('agentsprite');
        const lasers = level1.addTilesetImage('lasers'); //covers indices 206 - 211 206 - 208 vertical lasers, 209 - 211 horizontal lasers
        
        //make the layer(s) from tileset
        this.backgroundLayer = level1.createDynamicLayer('backgroundLayer',tileset);
        this.blockedLayer = level1.createDynamicLayer('blockedLayer',[tileset,agentstuff]);
        //spike layer is made on the spot in this code, NOT in tiled;
        //render spikes
        this.spikeLayer = level1.createBlankDynamicLayer('spikeLayer',spikes);
        this.spikeTiles = this.findTileLayerObjects(level1, "spikeObjectLayer");
        this.spikeGid = this.findTileset(level1, "spikes").firstgid;
        this.spikeIndicesArray = [this.spikeGid,this.spikeGid + 1,this.spikeGid + 2,this.spikeGid + 1,this.spikeGid];
        this.prepareSpikeTiles(this.spikeTiles);
       // this.spikeEvent = this.time.addEvent({delay: 25, callback: function(){ this.updateSpikeTiles(this.spikeTiles, this.spikeIndicesArray, 103) }.bind(this), callbackScope: this, loop: true });


        this.laserLayer = level1.createBlankDynamicLayer('laserLayer', lasers);
        this.pointerTiles = this.findTileLayerObjects(level1, "laserObjectLayer"); //have an array of laser pointers, with properties that tell us which way they point
        this.laserTiles = this.prepareLaserTiles(this.pointerTiles);
        const musicLaser = this.laserTiles;
        this.laserGid = this.findTileset(level1, "lasers").firstgid;
        this.horizontalLaserArray = [ this.laserGid + 3, this.laserGid + 4, this.laserGid + 5];
        const musicLaserArrayX = this.horizontalLaserArray;
        this.verticalLaserArray = [this.laserGid,this.laserGid + 1, this.laserGid + 2];
        const musicLaserArrayY = this.verticalLaserArray;
        
       // this.laserEvent = this.time.addEvent({delay: 50, callback: function(){ this.updateLaserTiles(this.laserTiles, this.verticalLaserArray, this.horizontalLaserArray) }.bind(this), callbackScope: this, loop: true });
        //making our music
        Tone.Transport.bpm.value = 107;
        Tone.Transport.swing = 0.5;
        Tone.Transport.swingSubdivision = "16t"; //16t or 32n sounds great
        
        //variables for trap delays
        var me = this;
        this.trapGroups = [
            {laserDuration:0,laserCounter:0,maxLaserCounter:2,spikeDuration:7,spikeCounter:-1,maxSpikeCounter:10},
            {laserDuration:0,laserCounter:0,maxLaserCounter:2,spikeDuration:7,spikeCounter:-1,maxSpikeCounter:1},
            {laserDuration:0,laserCounter:0,maxLaserCounter:2,spikeDuration:7,spikeCounter:-1,maxSpikeCounter:3}
        ];
        // this.laserDuration = 0;
        // this.laserCounter = 0;
        // this.maxLaserCounter = 2;
        // this.spikeDuration = 7;
        // this.spikeCounter = 0;
        // this.maxSpikeCounter = 1;
        var synth = new Tone.FMSynth({
            harmonicity: 1,
            detune : -0,
            
            modulationIndex: 50, //50
            oscillator: { 
            type: "sawtooth"
            },
            modulation  : {
            type  : "sawtooth"
            }  ,
            modulationEnvelope  : {
            attack  : 1 ,
            decay  : 0 ,
            sustain  : 1 ,
            release  : 0.5
            },
        });
        
        var reverb = new Tone.Freeverb();
        var bdreverb = new Tone.Freeverb();
        var feedbackDelay = new Tone.FeedbackDelay("16n",0.3);
        var eq = new Tone.EQ3(-10,0,-10);
        
        var bell = new Tone.MetalSynth({
                    "harmonicity" : 100, // 200 sounds like a timbali
                    "resonance" : 200, // 200 is nice
                    "modulationIndex" : 250,
                    "envelope" : {
                //attack  : 0.1 ,
                "decay" : 0.4, // 0.2 gives some percusive snare sounds
                    },
                
                    "volume" : -20
                });
        bell.chain(feedbackDelay, reverb, eq, Tone.Master);
        bell.chain(eq, Tone.Master);
            
        
        synth.chain(feedbackDelay, reverb,  eq, Tone.Master);
        synth.chain(eq, Tone.Master);
        
        var bellPart = new Tone.Sequence(function(time, freq){
                    bell.frequency.setValueAtTime(50,time);
                    bell.triggerAttack(time,.7);
                    me.shootSpikes(me.spikeTiles, 2);
            
                    me.fireSpikes = me.time.addEvent({delay:30, callback: function(){me.animateSpikes(me.spikeTiles,me.spikeIndicesArray, 103,2)}.bind(me), callbackScope: me, repeat: 11});
                    if(me.trapGroups[2].spikeCounter == me.trapGroups[2].maxSpikeCounter){
                        me.trapGroups[2].spikeCounter = 1;
                    }
                    else{
                        me.trapGroups[2].spikeCounter++;
                    }
            }, [null,50], "4n");
        //}, [50,50,50,50,50,50,55,50,50,50,55,50,50,51,50,50], "16n");
                //}, [50,null,50,null,50,null,50,null,50,null,50,null,55,null,50,null,50,null,50,null,55,null,50,null,50,50,51,50,50,51,50,50], "32n");
        bellPart.start();
        
        var snare = new Tone.MetalSynth({
                    "harmonicity" : 200, // 200 sounds like a timbali
                    "resonance" : 100, // 200 is nice
                    "modulationIndex" : 250,
                    "envelope" : {
                        "decay" : 0.2, // 0.2 gives some percusive snare sounds
                    },
                    "volume" : -15
                });
        
        snare.chain(eq, Tone.Master);
        
        var snarePart =  new Tone.Sequence(function(time, freq){
            snare.frequency.setValueAtTime(freq ,time);
            snare.triggerAttack(time,Math.random()*1);
        },[null,null,null,55,55,null,55,55,null,55,55,null,55,null,55,55],"8n").start();
        
        
        
        var chain = new Tone.CtrlMarkov({
            "beginning" : ["A1","F1","E1","D1"],
            "middle":"end"
        });
        //chain.value = "beginning";
        
        //trapGroup 1
        var bassPart = new Tone.Sequence(function(time, note) {
            chain.value = "beginning";
            
            synth.triggerAttackRelease(chain.next(),"4n",time,0.5);
            me.shootSpikes(me.spikeTiles, 1);
            
            me.fireSpikes = me.time.addEvent({delay:30, callback: function(){me.animateSpikes(me.spikeTiles,me.spikeIndicesArray, 103,1)}.bind(me), callbackScope: me, repeat: 11});
            if(me.trapGroups[1].spikeCounter == me.trapGroups[1].maxSpikeCounter){
                me.trapGroups[1].spikeCounter = 0;
            }
            else{
                me.trapGroups[1].spikeCounter++;
            }
            me.shootLaser(me.laserTiles, 1);
                me.fireLaser = me.time.addEvent({delay:20, callback: function(){me.animateLaser(musicLaser, musicLaserArrayY, musicLaserArrayX,1)}.bind(me), callbackScope: me, repeat: 6});
                if(me.trapGroups[1].laserCounter == me.trapGroups[1].maxLaserCounter){
                    me.trapGroups[1].laserCounter = 0;
                }
                else{
                    me.trapGroups[1].laserCounter++;
                }
                me.trapGroups[1].laserDuration = 0;
        }, ["A1","A1","F1","F1"],"1n");
        
        bassPart.start();
        
        var drum = new Tone.MembraneSynth({
                    "pitchDecay" : 0.008,
                    "octaves" : 2,
                    "envelope" : {
                        "attack" : 0.0006,
                        "decay" : 0.5,
                        "sustain" : 0
                    }
                });
        
        
        //drum.chain(reverb, Tone.Master);
        drum.chain(bdreverb, Tone.Master);
        drum.chain(Tone.Master);
        
        //trapGroup 0
        var reverse = false;
        var drumPart = new Tone.Sequence(function(time, pitch){
            drum.triggerAttack(pitch, time,1); 
            //		}, ["G1",null,null,null,"G1","G1",null,null], "8n").start(0);
            me.shootSpikes(me.spikeTiles, 0);
            
            me.fireSpikes = me.time.addEvent({delay:30, callback: function(){me.animateSpikes(me.spikeTiles,me.spikeIndicesArray, 103, 0)}.bind(me), callbackScope: me, repeat: 11});
            if(me.trapGroups[0].spikeCounter == me.trapGroups[0].maxSpikeCounter){
                me.trapGroups[0].spikeCounter--;
                reverse = true;
            }
            else if(me.trapGroups[0].spikeCounter == 1){
                me.trapGroups[0].spikeCounter++;
                reverse = false;
            }
            else{
                if(reverse){
                    me.trapGroups[0].spikeCounter--;
                }
                else{
                    me.trapGroups[0].spikeCounter++;
                }
            }
        }, ["G1"], "2n");
        drumPart.start();
                
                
        
        Tone.Transport.start();
        //Tone.Transport.stop(10);
        
        
        //end music creation

        this.objectLayer = level1.createBlankDynamicLayer('objectlayer', tileset);
        this.endPoint = level1.findObject("objectsLayer",obj => obj.name ==="End");
        //level1.createFromObjects("objectsLayer", this.endPoint.id, {key: "agentsprite", frame: this.endPoint.gid});
        level1.putTileAtWorldXY( this.endPoint.gid, this.endPoint.x , this.endPoint.y - 64, true, this.cameras.main, this.objectLayer);


         //music
         music = this.sound.add('level1audio',1,true);
         //music.play('', {delay: 0.3,loop:true});

        //spawn point of player from tiled
        this.spawnPoint = level1.findObject("objectsLayer",obj => obj.name ==="Spawn Point");

        this.player = this.physics.add.sprite(this.spawnPoint.x,this.spawnPoint.y,'agent');
        this.player.dead = false;
        //create animations for the sprites
        this.anims.create({
            key: 'idleright',
            frames: this.anims.generateFrameNumbers('agent',{start:0, end: 1}),
            frameRate: 4,
            //repeat -1 means loop
            repeat: -1
        });
        this.anims.create({
            key: 'idleleft',
            frames: this.anims.generateFrameNumbers('agent',{start:2, end: 3}),
            frameRate: 4,
            repeat: -1
        });

        this.anims.create({
            key: 'dead',
            frames: this.anims.generateFrameNumbers('agent',{start:4, end: 4}),
            frameRate: 4,
            repeat: -1
        });
        this.player.anims.play('idleright');
        //set up key input

        var arrowkeyCallback = function (event) { 
            if(this.player.dead == true){
                return;
            }
            switch (event.keyCode)
            {
                case 37:
                this.player.anims.play('idleleft');
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
                this.player.anims.play('idleright');
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
            this.checkIfPlayerWin();
            //TIMER COORD
            me.timeLabel.setX(this.player.x-20);
            me.timeLabel.setY(this.player.y-200);
        }.bind(this);

        this.input.keyboard.addKey(37);
        this.input.keyboard.addKey(38);
        this.input.keyboard.addKey(39);
        this.input.keyboard.addKey(40);
        this.input.keyboard.on('keydown-LEFT', arrowkeyCallback);
        this.input.keyboard.on('keydown-RIGHT', arrowkeyCallback);
        this.input.keyboard.on('keydown-UP', arrowkeyCallback);
        this.input.keyboard.on('keydown-DOWN', arrowkeyCallback);

        //CHEATS
        this.invincible = false;
        this.input.keyboard.on('keydown', function (event) {
            if (event.key === "2")
            {
            music.stop();
            Tone.Transport.stop();
            this.scene.start('level2');
            }
            else if(event.key === "I" || event.key === "i")
            {
            this.invincible = !this.invincible;
            }
        }, this);

        document.onkeydown = function(evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                pause = true;
                this.scene.pause(this.key);
                music.pause();
            
                Tone.Transport.pause();
                //launch paused screen
                this.game.currentLevel = this.key;
                this.scene.launch('paused');
                
                //pause itself
            }
        }.bind(this);

    

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
            
            Tone.Transport.pause();
            //launch paused screen
            this.game.currentLevel = this.key;
            this.scene.launch('paused');

    
        }.bind(this));
        //TIMER
        var me = this;
	    me.startTime = new Date();
	    me.totalTime = 120;
	    me.timeElapsed = 0;

	    me.createTimer();

        this.gameTimer = this.time.addEvent({ delay: 100, callback: this.updateTimer, callbackScope: this, loop: true });
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
        if (!this.invincible)
        {
            if (this.checkIfPlayerOnSpike (this.spikeIndicesArray, this.spikeGid + 2) && this.player.dead == false)
            {
                this.player.dead = true;
                this.player.anims.play("dead");
                this.deathTime = time;
                this.camera.zoomTo(0.5,500);
            }
            if (this.checkIfPlayerOnLaser (this.verticalLaserArray) && this.player.dead == false)
            {
                this.player.dead = true;
                this.player.anims.play("dead");
                this.deathTime = time;
                this.camera.zoomTo(0.5,500);
            }
        
        this.checkDeath(time);
        
       // this.animateLaser(this.laserTiles,this.verticalLaserArray,this.horizontalLaserArray);
       }
        //level1.putTileAt(101 , level1.worldToTileX(this.player.x), level1.worldToTileY(this.player.y), true, this.trapsLayer);, level1.worldToTileX(this.player.x), level1.worldToTileY(this.player.y), true, this.trapsLayer);
       
        

    },
    createTimer: function() {
        var me = this;
        me.timeLabel = me.add.text(this.player.x-20, this.player.y-200, "00:00", {font: "20px jetset", fill: "#fff"}); 
        me.timeLabel.align = 'center';
    },
    updateTimer: function(){

        var me = this;
        
        var currentTime = new Date();
        var timeDifference = me.startTime.getTime() - currentTime.getTime();

        //Time elapsed in seconds
        me.timeElapsed = Math.abs(timeDifference / 1000);

        //Convert seconds into minutes and seconds
        var minutes = Math.floor(me.timeElapsed / 60);
        var seconds = Math.floor(me.timeElapsed) - (60 * minutes);

        //Display minutes, add a 0 to the start if less than 10
        var result = (minutes < 10) ? "0" + minutes : minutes; 

        //Display seconds, add a 0 to the start if less than 10
        result += (seconds < 10) ? ":0" + seconds : ":" + seconds; 

        me.timeLabel.text = result;
    },

    findTileLayerObjects(map, key)
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
    findTileset(map, key)
    {
        for (var i = 0; i < map.tilesets.length; i++)
        {
            if (map.tilesets[i].name === key)
            {
                return map.tilesets[i];
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

    },
    checkIfPlayerOnLaser: function (indicesArray)
    {
        var index = level1.getTileAtWorldXY( this.player.x, this.player.y, true, this.cameras.main, this.laserLayer).index;
        if ( index === 1 || index === -1)
        {
            return false;
        }
        return true;

    },
    checkIfPlayerWin: function()
    {
        if (level1.getTileAtWorldXY( this.player.x, this.player.y, true, this.cameras.main, this.objectLayer).index !== -1)
        {
            
            this.game.nextLevel = "level3";
            this.game.currentLevel = this.key;
            music.pause();
            
            Tone.Transport.stop();
            this.scene.pause(this.key);
            this.scene.launch('win');

        }
    },
    checkDeath: function (time){
        if(this.player.dead == true){
            if(time - this.deathTime >= 1000){
                this.player.destroy();
                this.player = this.physics.add.sprite(this.spawnPoint.x,this.spawnPoint.y,'agent');
                this.player.anims.play('idleright',true);
                this.player.dead = false;
                this.cameras.main.pan(0,0,1000,'Linear',false, function(){this.camera.startFollow(this.player)});
                this.camera.zoomTo(1,500);
                //reset timer
                var me = this;
                me.timeLabel.setX(this.player.x-20);
                me.timeLabel.setY(this.player.y-200);
                //restore keyboard use

            }
        }
    },
    prepareSpikeTiles: function(tileArray) //spikes are bigger than 64x64, so have to do some offset
    {
        console.log(tileArray);
        var me = this;
        tileArray.forEach(function(element) {
            element.renderX = element.x;
            element.renderY = element.y * 2 - 256;
            element.currentIndex = 0;
            element.counter = 0; //this is for the duration of the death frame of the trap
            //put empty spike holes
            level1.putTileAtWorldXY(me.spikeIndicesArray[0], element.renderX,element.renderY,true, me.cameras.main, me.spikeLayer);
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
                level1.putTileAtWorldXY( indicesArray[element.currentIndex], element.renderX, element.renderY, true, this.cameras.main, this.spikeLayer);
                element.delay --;
            }
            else{
                    element.currentIndex %= indicesArray.length;
                    if (indicesArray[element.currentIndex] === deathIndex)
                    {
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
                    else if (element.currentIndex === indicesArray.length - 1)
                    {
                        if (element.counter === 0)
                        {
                            level1.putTileAtWorldXY( indicesArray[element.currentIndex], element.renderX, element.renderY, true, this.cameras.main, this.spikeLayer);
                            element.counter ++;
                        }
                        else if (element.counter >= element.wait) //element properties are from TILED
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
        
    },

    prepareLaserTiles: function (pointerArray) //array of laser pointer objects
    {
        //go through, make new array of lasertiles that will then render
        var laserTiles = [];

        pointerArray.forEach(function(element) {
            for (var i = 0; i < element.properties.length; i ++)
            {
                element[element.properties[i].name] = element.properties[i].value;
            }
          }.bind(this));

          //this.agentGid = this.findTileset(level1, "agentsprite").firstgid;

          pointerArray.forEach(function(element) { // agentgid + 30
            if (element.direction === "down")
            {
                level1.putTileAtWorldXY( element.gid, element.x, element.y - 64 , true, this.cameras.main, this.blockedLayer);
                var x = element.x;
                var y = element.y - 64;
                while (this.blockedLayer.getTileAtWorldXY(x, y + 64) === null)
                {
                    var object = {};
                    object.x = x
                    object.y = y + 64;
                    object.duration = element.duration;
                    object.delay = element.delay;
                    object.wait = element.wait;
                    object.direction = "vertical";
                    object.currentIndex = 0;
                    object.counter = 0;
                    object.fireLaser = true;
                    laserTiles.push(object);
                    y += 64;
                }
            }
            else if (element.direction === "up") //agentgid + 10
            {
                level1.putTileAtWorldXY( element.gid, element.x, element.y - 64 , true, this.cameras.main, this.blockedLayer);
                var x = element.x;
                var y = element.y - 64;
                while (this.blockedLayer.getTileAtWorldXY(x , y - 64) === null)
                {
                    var object = {};
                    object.x = x
                    object.y = y - 64;
                    object.duration = element.duration;
                    object.delay = element.delay;
                    object.wait = element.wait;
                    object.direction = "vertical";
                    object.currentIndex = 0;
                    object.counter = 0;
                    object.fireLaser = true;                                                             
                    laserTiles.push(object);
                    y -= 64;
                }
            }
            else if (element.direction === "right") // agentgid + 20
            {
                level1.putTileAtWorldXY( element.gid, element.x, element.y - 64 , true, this.cameras.main, this.blockedLayer);
                var x = element.x;
                var y = element.y - 64;
                while (this.blockedLayer.getTileAtWorldXY(x + 64, y) === null)
                {
                    var object = {};
                    object.x = x + 64;
                    object.y = y;
                    object.duration = element.duration;
                    object.delay = element.delay;
                    object.wait = element.wait;
                    object.direction = "horizontal";
                    object.currentIndex = 0;
                    object.counter = 0;
                    object.fireLaser = true;
                    laserTiles.push(object);
                    x += 64;
                }
            }
            else // left,  agentgid + 40
            {
                level1.putTileAtWorldXY( element.gid, element.x, element.y - 64 , true, this.cameras.main, this.blockedLayer);
                var x = element.x;
                var y = element.y - 64;
                while (this.blockedLayer.getTileAtWorldXY(x - 64, y) === null)
                {
                    var object = {};
                    object.x = x - 64;
                    object.y = y;
                    object.duration = element.duration;
                    object.delay = element.delay;
                    object.wait = element.wait;
                    object.direction = "horizontal";
                    object.currentIndex = 0;
                    object.counter = 0;
                    object.fireLaser = true;
                    laserTiles.push(object);
                    x -= 64;
                }
            }
          }.bind(this));

        return laserTiles;
    },
    updateLaserTiles: function(tileArray, verticalLaserArray, horizontalLaserArray)
    {
        var randomIndex = Math.floor(Math.random()*verticalLaserArray.length);
        tileArray.forEach(function(element) {
            if (element.delay > 0)
            {
                element.delay --;
            }
            else{
                        if (!element.fireLaser)
                        {
                            if (element.counter === 0)
                            {
                                level1.putTileAtWorldXY( -1, element.x, element.y, true, this.cameras.main, this.laserLayer);
                                element.counter ++;
                            }
                            else if (element.counter >= element.wait)
                            {
                                element.counter = 0; 
                                element.fireLaser = true;
                            }
                            else{
                                element.counter ++;
                            }
                        }
                        else //firelaser is true
                        {
                            if (element.counter < element.duration)
                            {
                                if (element.direction === "horizontal")
                                {
                                    level1.putTileAtWorldXY( horizontalLaserArray[randomIndex], element.x, element.y, true, this.cameras.main, this.laserLayer);
                                }
                                else //else vertical
                                {
                                    level1.putTileAtWorldXY( verticalLaserArray[randomIndex], element.x, element.y, true, this.cameras.main, this.laserLayer);
                                }
                                element.counter ++;
                            }
                            else // (element.counter >= element.duration)
                            {
                                element.counter = 0; 
                                element.fireLaser = false;
                            }

                    }
                    }
          }.bind(this));
    },
    //new laser functions
    //toggles laser on and off. put this in music callback
    shootLaser: function(tileArray, trapGroupIndex)
    {
        var me = this;
        for(let element of tileArray){
            if(element.delay > me.trapGroups[trapGroupIndex].laserCounter)
            {
                continue;
            }
            else{
                element.fireLaser = true;
            }
        }
    },
    
    animateLaser: function(tileArray, verticalLaserArray, horizontalLaserArray, trapGroupIndex)
    {
        
        var camera = this.cameras.main;
        var laserLayer = this.laserLayer;
        var randomIndex = Math.floor(Math.random()*verticalLaserArray.length);
        var me = this;
        for(let element of tileArray){
            
           if(element.fireLaser){
               
            if(me.trapGroups[trapGroupIndex].laserDuration < 6){
                
                if (element.direction === "horizontal"){
                    
                    level1.putTileAtWorldXY(horizontalLaserArray[randomIndex], element.x, element.y, true, camera, laserLayer);
                }
                else
                {

                    level1.putTileAtWorldXY( verticalLaserArray[randomIndex], element.x, element.y, true, camera, laserLayer);
                }
            }
            else{
                element.fireLaser = false;
                level1.putTileAtWorldXY( -1, element.x, element.y, true, camera, laserLayer);
            }
        }
            else{
                //if laser not being fired
                
                element.fireLaser = false;
                level1.putTileAtWorldXY( -1, element.x, element.y, true, camera, laserLayer);
            }
        }
        me.trapGroups[trapGroupIndex].laserDuration++;
    },
    //new spike function
    //counter should loop up to number of frames in spikearray + duration of deathframe
    shootSpikes: function(tileArray, trapGroupIndex){
        for(let element of tileArray){
            if(element.group == trapGroupIndex){
                
                element.continue =true;
            }
            else{
                continue;
            }
        }
    },
    animateSpikes: function (tileArray, indicesArray, deathIndex, trapGroupIndex)
    {
        
        var me = this;
        for(let element of tileArray){
            if(element.group == trapGroupIndex){
                if(element.wait > 0){
                    element.wait--;
                    element.continue = false;
                    continue;
                }
                if(element.delay > me.trapGroups[trapGroupIndex].spikeCounter){
                    
                    continue;
                }
                if(element.hold <= me.trapGroups[trapGroupIndex].spikeCounter){
                    continue;
                }
                if(element.continue == true){
                    
                    if(indicesArray[element.currentIndex] == deathIndex){

                        if(element.counter == 0){
                        level1.putTileAtWorldXY(indicesArray[element.currentIndex], element.renderX,element.renderY, true, me.cameras.main, me.spikeLayer);
                        element.counter++;
                        }
                        else if (element.counter == me.trapGroups[trapGroupIndex].spikeDuration){
                            element.counter = 0;
                            element.currentIndex++;
                        }
                        else{
                            element.counter++;
                        }
                    }
                    else if (element.currentIndex == indicesArray.length-1){
                        level1.putTileAtWorldXY(indicesArray[element.currentIndex], element.renderX, element.renderY, true, me.cameras.main, me.spikeLayer);
                        element.currentIndex = 0;
                        element.continue = false;
                    }
                    else{
                        level1.putTileAtWorldXY(indicesArray[element.currentIndex], element.renderX, element.renderY, true, me.cameras.main, me.spikeLayer);
                        element.currentIndex++;
                    }
            }
        }
        else{
            continue;
        }
    }
        
    }

}
);

this.levels.level2 = level2;