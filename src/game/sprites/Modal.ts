import { Scene } from "phaser";

export default class ModalScene extends Scene {
  

    parent: Phaser.GameObjects.Zone;
    constructor (handle:string , parent:Phaser.GameObjects.Zone)
    {
        
        super(handle);
        this.parent = parent;
        //this.popup = this.add.graphics();
    }


    popup?: Phaser.GameObjects.Graphics;
    create(){

        var bg = this.add.image(0, 0, 'LUMAN').setOrigin(0);
        this.cameras.main.setViewport(this.parent.x, this.parent.y, 400, 400);
    // Agregar un botón dentro del popup
    const button = this.add.text(20, 20, 'Cerrar', {
      fontSize: '24px',
      //fill: '#000000'
    });
  
    // Hacer que el botón sea interactivo (clickeable)
    button.setInteractive();
  
    // Manejar el evento de clic en el botón
    button.on('pointerdown', () => {
      this.closePopup();
    });
  
    // Ocultar la ventana emergente al inicio
    //this.popup.setVisible(false);
  
    // Crear una capa para los objetos en la parte delantera
  
  
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }


    openPopup() {
        this.popup!.setVisible(true);
      }
      
      // Función para cerrar el popup
      closePopup() {
        this.scene.remove('window');
        //this.popup!.setVisible(false);
      }
}