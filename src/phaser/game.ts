import Phaser from 'phaser'
import { SCALING_FACTOR } from './constants'
import PlayNodeScene from '@/game/scenes/nodes/PlayNodeScene'



class Game extends Phaser.Game {
  constructor( options: Phaser.Types.Core.GameConfig) {
    super({
      width: window.innerWidth,
      height: window.innerHeight,
      /* width: 24 * 16 * SCALING_FACTOR,
      height: 20 * 16 * SCALING_FACTOR, */
      /* width:'100%',
      height: '100%', */
      type: Phaser.AUTO,
      
      transparent: true,
      antialias: false,
      physics: {
        default: 'arcade',
        arcade: {
          //gravity: { y: 0 } // Top down game, so no gravity
          //gravity:{y:300},
          debug:true
        }
      },
      /* physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
          debug: false
        }
      }, */
      //scene: [BootScene, PlayScene],
      plugins:{
        scene: [
          
        ],
      },
      scene: [ PlayNodeScene],
      ...options,
    });
    //debugger
    //this.scene.start('PlayNodeScene',assets);
  }
}

export default Game