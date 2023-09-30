import type { Nft } from "@/models/nft";

export class MaterialSA extends Phaser.GameObjects.Container{
    
    priceResouce: Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene, x: number, y: number, item: Nft,group: string, callback: Function){
        super(scene, x,y);//scene.add.container(100, (index+1) * 100);
        scene.add.existing(this);
         
        this.setSize(150, 90);
        this.setData(group,true);
    
      const titolo =  scene.add.text(-40,-30, item.name, {
        fontSize: '16px',
      });
      
       this.priceResouce =  scene.add.text(-40,30,'' , {
        fontSize: '16px',
      });
    
      const imagen = scene.add.sprite(0, 5, item.symbol);
      imagen.setDisplaySize(40,40);


      const border = scene.add.graphics();
      border.lineStyle(1, 0xffffff); // 2 píxeles de ancho, color blanco
      border.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    
      this.add([border,titolo,imagen,this.priceResouce]);
      
      this.setInteractive({draggable:true});
      
      this.on('pointerdown',callback, scene);

      /* this.on('drag', (pointer:Event, gameObject:any, dragX:number, dragY: number) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }); */
    }

    setTextPriceResouce(text: string){
        this.priceResouce.setText(text);
    }

}