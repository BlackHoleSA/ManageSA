import type { Nft } from "@/models/nft";
import { useStoreAtlas } from "@/stores/storeAtlas";
import { uniqueID } from "@/utils/uniqueID";
import type PlayNodeScene from "../scenes/nodes/PlayNodeScene";

export class BtnControls extends Phaser.GameObjects.Container{
    
    
    constructor( public scene: PlayNodeScene, x: number, y: number){
        super(scene, x,y);//scene.add.container(100, (index+1) * 100);
        scene.add.existing(this);
         
        //this.setSize(150, 90);
        this.setData('CONTROLS',true);
    
        const btnIniciar =  scene.add.text(0,0, 'Config', {
          fontSize: '16px',
          backgroundColor: '#0c09c8',
          padding: {
            x: 10,
            y: 10
          },
        })
        .setInteractive()
        .on('pointerup', () => {
          
          //scene.createJson();
          scene.openConfigWindow();
          
        });

        const btnCrearComponente =  scene.add.text(100,0, 'Crear Componente', {
          fontSize: '16px',
          backgroundColor: '#3498db',
          padding: {
            x: 10,
            y: 10
          }
        })
        .setInteractive()
        .on('pointerup', () => {
          console.log('Botón de inicio clickeado');
          alert('hola');
        });
      
      this.add([btnIniciar, btnCrearComponente,]);
      

      //this.on('pointerdown',callback, scene);

      
    }

    

}