this.levels = this.levels || {};

var level3 = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function level3 ()
    {
        this.key = "level3";
        Phaser.Scene.call(this, { key: 'level3' });
    },


    create: function ()
    {
        //variables for use
        var deathTime = 0;
        //this.add.image(0, 0, 'ingame').setOrigin(0);
        //make our map
        level1 = this.add.tilemap('level3');
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
        this.prepareSpikeTiles(this.spikeTiles);
        this.spikeGid = this.findTileset(level1, "spikes").firstgid;
        this.spikeIndicesArray = [this.spikeGid,this.spikeGid + 1,this.spikeGid + 2,this.spikeGid + 1,this.spikeGid];


        this.laserLayer = level1.createBlankDynamicLayer('laserLayer', lasers);
        this.pointerTiles = this.findTileLayerObjects(level1, "laserObjectLayer"); //have an array of laser pointers, with properties that tell us which way they point
        this.laserTiles = this.prepareLaserTiles(this.pointerTiles);
        this.laserGid = this.findTileset(level1, "lasers").firstgid;
        this.horizontalLaserArray = [ this.laserGid + 3, this.laserGid + 4, this.laserGid + 5];
        this.verticalLaserArray = [this.laserGid,this.laserGid + 1, this.laserGid + 2];


        this.objectLayer = level1.createBlankDynamicLayer('objectlayer', tileset);
        this.endPoint = level1.findObject("objectsLayer",obj => obj.name ==="End");
        console.log(this.endPoint);
        //level1.createFromObjects("objectsLayer", this.endPoint.id, {key: "agentsprite", frame: this.endPoint.gid});
        level1.putTileAtWorldXY( this.endPoint.gid, this.endPoint.x , this.endPoint.y - 64, true, this.cameras.main, this.objectLayer);

        //checkpoint
        this.check = -1;
        this.checkpoint = level1.findObject("objectsLayer", obj => obj.name === "Checkpoint");
        this.checkpoint2 = level1.findObject("objectsLayer", obj => obj.name === "Checkpoint2");
        this.backgroundLayer.getTileAtWorldXY(this.checkpoint.x, this.checkpoint.y).tint = 0x0f0ff00;
        this.backgroundLayer.getTileAtWorldXY(this.checkpoint2.x, this.checkpoint2.y).tint = 0x0f0ff00;

        this.checkDisplay = 0;

        //65344 green

         //music
         music = this.sound.add('level3audio',1,true);

         this.spikeDate = Date.now();
         this.laserDate = Date.now();
         //waits for delay ms, then calls, even for the first call
         this.spikeEvent = this.time.addEvent({delay: 150, callback: function(){ 
           // var temp = Date.now();
            //console.log("SPIKE " + (temp - this.spikeDate)); 
            //this.spikeDate = temp;
            this.updateSpikeTiles(this.spikeTiles, this.spikeIndicesArray, this.spikeGid + 2, this.spikeGid + 2) }.bind(this), callbackScope: this, loop: true });
         this.laserEvent = this.time.addEvent({delay: 150, callback: function()
            { 
                //var temp = Date.now();
                //console.log("LASER" + (Date.now() - this.laserDate));
                //this.laserDate = temp;
                this.updateLaserTiles(this.laserTiles, this.verticalLaserArray, this.horizontalLaserArray) 

            }.bind(this), callbackScope: this, loop: true });
         music.play('', {delay: 0.0,loop:true, seek: 0});
         music.volume = 2.5;
         console.log(music);
         var laserSound = this.sound.add('laser',1,true);
         laserSound.volume = 0.2;
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
            if (event.key === "1")
            {
            music.stop();
            this.scene.start('level1');
            }
            else if(event.key === "I" || event.key === "i")
            {
            this.invincible = !this.invincible;
            }

        }, this);
    

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
            this. checkIfPlayerCheckpoint();
            this.checkDeath(time);
        }

        //level1.putTileAt(101 , level1.worldToTileX(this.player.x), level1.worldToTileY(this.player.y), true, this.trapsLayer);, level1.worldToTileX(this.player.x), level1.worldToTileY(this.player.y), true, this.trapsLayer);
        //console.log(this.backgroundLayer.getTileAtWorldXY(this.player.x, this.player.y));
        //console.log(this.objectsLayer);

        

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
            var score = this.timeLabel.text;
            
            if(localStorage.getItem("level3scores") == null){
                localStorage.setItem("level3scores", score + " ");
            }else{
                localStorage.setItem("level3scores", localStorage.getItem("level3scores")+ score + " ");
            }
            
            this.scene.pause(this.key);
            this.scene.launch('win');

        }
    },
    checkIfPlayerCheckpoint: function() {
        if (this.check === 2) {
            return;
        }
        if (this.player.x >= 1920 && this.player.y >= 1280) {
            this.check = 2;
            this.checkDisplay = 2;
            console.log("checkpoint 2 reached");
            var style = { font: "30px jetset", fill: "#fff", align: "center" };
            var text = this.add.text(this.player.x - 150, this.player.y - 72, "Checkpoint Reached", style);
            setTimeout(function() {text.destroy(); }, 2000);
        }
        else if (this.player.x >= 1728 && this.player.y <= 448) {
            this.check = 1;
            this.checkDisplay = 1;
            console.log("checkpoint 1 reached");
            var style = { font: "30px jetset", fill: "#fff", align: "center" };
            var text = this.add.text(this.player.x - 150, this.player.y - 72, "Checkpoint Reached", style);
            setTimeout(function() {text.destroy(); }, 2000);
        }
    },
    checkDeath: function (time){
        if(this.player.dead == true){
            if(time - this.deathTime >= 1000){
                this.player.destroy();
                if (this.check === -1) { 
                    this.player = this.physics.add.sprite(this.spawnPoint.x,this.spawnPoint.y,'agent');
                }
                else {
                    if (this.check === 1)  {
                        this.player = this.physics.add.sprite(this.checkpoint.x,this.checkpoint.y,'agent');
                    }
                    else {
                        this.player = this.physics.add.sprite(this.checkpoint2.x,this.checkpoint2.y,'agent');
                    }
                }
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
        tileArray.forEach(function(element) {
            element.renderX = element.x;
            element.renderY = element.y * 2 - 256;
            element.currentIndex = 1;
            element.counter = 0; //this is for the duration of the death frame of the trap
            element.currentDurationIndex = 0;
            element.currentWaitIndex = 0;
            //copy properties from tiled over
            for (var i = 0; i < element.properties.length; i ++)
            {
                element[element.properties[i].name] = element.properties[i].value;
            }
            element.wait = element.wait.split(" ");
            element.duration = element.duration.split(" ");
            for (var i = 0; i < element.wait.length; i ++) {element.wait[i] = parseInt(element.wait[i]); }
            for (var i = 0; i < element.duration.length; i ++) {element.duration[i] = parseInt(element.duration[i]); }

          }.bind(this));
    },
    //ASSUMES tilearray is no spikes, little spikes, spikes, little spikes no spikes
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
                level1.putTileAtWorldXY( indicesArray[0], element.renderX, element.renderY, true, this.cameras.main, this.spikeLayer);
                element.delay --;
                element.currentIndex = 1;
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
                        else if (element.counter === element.duration[element.currentDurationIndex]) //element properties are from TILED
                        {
                            element.counter = 0;
                            element.currentIndex ++;
                            element.currentindex %= indicesArray.length;

                            level1.putTileAtWorldXY( indicesArray[element.currentIndex], element.renderX, element.renderY, true, this.cameras.main, this.spikeLayer);
                            element.currentIndex ++;
                            element.currentDurationIndex ++;
                            element.currentDurationIndex %= element.duration.length;
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
                        else if (element.counter >= element.wait[element.currentWaitIndex]) //element properties are from TILED
                        {
                            element.counter = 0;
                            element.currentIndex = 2;
                            level1.putTileAtWorldXY( indicesArray[1], element.renderX, element.renderY, true, this.cameras.main, this.spikeLayer);
                            element.currentWaitIndex++;
                            element.currentWaitIndex %= element.wait.length;
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
            element.wait = element.wait.split(" ");
            element.duration = element.duration.split(" ");
            for (var i = 0; i < element.wait.length; i ++) {element.wait[i] = parseInt(element.wait[i]); }
            for (var i = 0; i < element.duration.length; i ++) {element.duration[i] = parseInt(element.duration[i]); }

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
                    object.currentDurationIndex = 0;
                    object.currentWaitIndex = 0;
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
                    object.currentDurationIndex = 0;
                    object.currentWaitIndex = 0;                                                        
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
                    object.currentDurationIndex = 0;
                    object.currentWaitIndex = 0;
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
                    object.currentDurationIndex = 0;
                    object.currentWaitIndex = 0;
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
                            else if (element.counter >= element.wait[element.currentWaitIndex])
                            {
                                element.counter = 1; 
                                element.fireLaser = true;
                                if (element.direction === "horizontal")
                                {
                                    level1.putTileAtWorldXY( horizontalLaserArray[randomIndex], element.x, element.y, true, this.cameras.main, this.laserLayer);
                                }
                                else //else vertical
                                {
                                    level1.putTileAtWorldXY( verticalLaserArray[randomIndex], element.x, element.y, true, this.cameras.main, this.laserLayer);
                                }
                                element.currentWaitIndex ++;
                                element.currentWaitIndex %= element.wait.length;

                            }
                            else{
                                element.counter ++;
                            }
                        }
                        else //firelaser is true
                        {
                            if (element.counter < element.duration[element.currentDurationIndex])
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
                                element.counter = 1; 
                                element.fireLaser = false;
                                level1.putTileAtWorldXY( -1, element.x, element.y, true, this.cameras.main, this.laserLayer);
                                element.currentDurationIndex ++;
                                element.currentDurationIndex %= element.duration.length;
                            }

                    }
                    }
          }.bind(this));
    }

}
);

this.levels.level3 = level3;