import { Scene } from 'phaser'

export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
  }

  cursors?:Phaser.Types.Input.Keyboard.CursorKeys;
  keyA?:Phaser.Input.Keyboard.Key;
  keyS?:Phaser.Input.Keyboard.Key;
  keyD?:Phaser.Input.Keyboard.Key;
  keyW?:Phaser.Input.Keyboard.Key;

  player?:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  create () {
    this.add.image(400, 300, 'sky')

    this.player = this.physics.add.sprite(400, 200, 'bomb')
    this.player.setCollideWorldBounds(true);
    this.player.body.onWorldBounds = true; // enable worldbounds collision event
    this.player.setBounce(1);
    this.player.setVelocity(200, 20);

    //this.sound.add('thud')
    this.physics.world.on('worldbounds', () => {
      this.sound.play('thud', { volume: 0.75 })
    });

    
    ///this.player.setDisplaySize(20,20);

    this.cursors= this.input.keyboard?.createCursorKeys();

      this.keyA = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyW = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    
  }
  

  update () {
    this.player?.setVelocityY(0);
    this.player?.setVelocityX(0);
    
    if((this.cursors && this.cursors.up.isDown==true) || ( this.keyW && this.keyW.isDown) ){
      this.player?.setVelocityY(-100);
    }
    if((this.cursors && this.cursors.down.isDown==true) || (this.keyS && this.keyS.isDown)){
      this.player?.setVelocityY(100);
    }
    if((this.cursors && this.cursors.right.isDown==true) || (this.keyD && this.keyD.isDown)){
      this.player?.setVelocityX(100);
    }
    if((this.cursors && this.cursors.left.isDown==true) || (this.keyA && this.keyA.isDown)){
      this.player?.setVelocityX(-100);
    }
    
  }
}