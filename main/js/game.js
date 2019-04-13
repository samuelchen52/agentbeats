// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');
// load asset files for our game
gameScene.preload = function() {

    this.load.image('background','assets/sci_fi_bg1.jpg');

};

//executed once, after assets were loaded

gameScene.create = function(){
    let bg = this.add.sprite(0,0,'background');
    bg.setScale(0.5);
    //change origin to the top-left of the sprite
    //default origin is the center
    bg.setOrigin(0,0);

}

//our game's configuration
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: gameScene
};


//create the game and pass it to the configuration
let game = new Phaser.Game(config);

