import { Scene } from 'phaser'

export default class BootNodeScene extends Scene {
  constructor () {
    super({ key: 'BootNodeScene' })
  }

  preload () {

  }

  create () {
    this.scene.start('PlayNodeScene',)
    
  }
}