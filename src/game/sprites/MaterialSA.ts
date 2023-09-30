import type { Nft } from "@/models/nft";

export class MaterialSA extends Phaser.GameObjects.Container{
    
    resourceQuantity: Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene, x: number, y: number, item: Nft,group: string, callback: Function){
        super(scene, x,y);//scene.add.container(100, (index+1) * 100);
        scene.add.existing(this);
         
        this.setSize(150, 90);
        this.setData(group,true);
    
      const titolo =  scene.add.text(-40,-30, item.name, {
        fontSize: '16px',
      });
      let qtyTxt='';
      if(item.quantity!=undefined){
        qtyTxt=`Qty. ${item.quantity}`;
      }
       this.resourceQuantity =  scene.add.text(-40,30,qtyTxt , {
        fontSize: '16px',
      });
    
      const imagen = scene.add.sprite(0, 5, item.symbol);
      imagen.setDisplaySize(40,40);


      const border = scene.add.graphics();
      border.lineStyle(1, 0xffffff); // 2 píxeles de ancho, color blanco
      border.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    
      this.add([border,titolo,imagen,this.resourceQuantity]);
      
      this.setInteractive({draggable:true});
      
      this.on('pointerdown',callback, scene);

      /* this.on('drag', (pointer:Event, gameObject:any, dragX:number, dragY: number) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
      }); */
    }

    setTextPriceResouce(text: string){
        this.resourceQuantity.setText(text);
    }

}