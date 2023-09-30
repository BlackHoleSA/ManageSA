import { BtnControls } from '@/game/sprites/BtnControls';
import { MaterialSA } from '@/game/sprites/MaterialSA';
import type { Nft } from '@/models/nft';
import { useStoreAtlas } from '@/stores/storeAtlas';
import { Scene } from 'phaser';



export default class PlayNodeScene extends Scene {
  assets:Nft[]=[];
 constructor(public stateRtsSA=useStoreAtlas()) {
  
    super({ key: 'PlayNodeScene' });
    
  }

  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  keyA?: Phaser.Input.Keyboard.Key;
  keyS?: Phaser.Input.Keyboard.Key;
  keyD?: Phaser.Input.Keyboard.Key;
  keyW?: Phaser.Input.Keyboard.Key;

  player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

   cameraSpeed = 5;

   disabledKeyBoard=false; 

  preload() {
    
    this.assets=this.stateRtsSA.getNfts();
    //this.assets=this.stateRtsSA.getCraftShips() ;
    //this.assets=this.stateRtsSA.getResourceMaterialRaw();

    this.loadAssets(this.assets);

    this.assets=this.stateRtsSA.getCraftShips();
  }


  create() {

    //this.cameras.main.(0, 0);

    const controls= new BtnControls(this,0,0)


    this.createJson();

    this.assets.forEach((item, index) => {
      const nft = new MaterialSA(this, 100, (index + 1) * 100, item,'MATERIALSA', () => {
        
        this.stateRtsSA.setEditNftByid(item.id);

        //const editNft=this.stateRtsSA.getEditNft();
        
        //this.stateRtsSA.updateNftComponent();
        this.createJson();
        
        
      });

    });

    this.input.on('drag', (pointer: Event, gameObject: Phaser.GameObjects.Container, dragX: number, dragY: number) => {
      if (gameObject.getData('NODE-EDIT-NFT')) {
        gameObject.x = dragX;
        gameObject.y = dragY;
        const nft=gameObject.getData('item');
        if(nft){
            nft.x=dragX;
            nft.y=dragY;
        }
      }

    });


    this.cursors= this.input.keyboard?.createCursorKeys();

      
    this.activeKeyBoard();


  }

  activeKeyBoard(sw: boolean=true){
    
      /* this.keyA = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyW = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W); */
    
    
  }


  loadAssets(assets: Nft[]) {
    assets.forEach((item, index) => {

      this.load.image(item.symbol, item.image);
    });


  }

  update() {
    
      if((this.cursors && this.cursors.up.isDown==true) /* || ( this.keyW && this.keyW.isDown) */ ){
        this.cameras.main.scrollY -= this.cameraSpeed;
        
      }
      if((this.cursors && this.cursors.down.isDown==true) /* || (this.keyS && this.keyS.isDown) */){
        this.cameras.main.scrollY += this.cameraSpeed;
      }
      if((this.cursors && this.cursors.right.isDown==true) /* || (this.keyD && this.keyD.isDown) */){
        this.cameras.main.scrollX += this.cameraSpeed;
      }
      if((this.cursors && this.cursors.left.isDown==true) /* || (this.keyA && this.keyA.isDown) */){
        this.cameras.main.scrollX -= this.cameraSpeed;
      }
    
  }


  initialX = 1000;
  initialY = 50;
  horizontalSpacing = 100;
  verticalSpacing = 80;


  createJson() {
    this.clearChildrenByDataKey('NODE-EDIT-NFT');
    this.clearChildrenByDataKey('NODES');
    this.connections.forEach((connection: Phaser.GameObjects.Graphics) => {
      connection.clear();
    });

    //const talentData=this.stateRtsSA.getShips();
    
    const editNft=this.stateRtsSA.getEditNft();
    const totalGroupMaterialRaw= this.stateRtsSA.getTotalMaterialRaw();
    console.log(totalGroupMaterialRaw);
    let resultResourceraw='Recursos Necesarios  { \n ';
    if(totalGroupMaterialRaw!=null){
      for (const symbol in totalGroupMaterialRaw) {
        console.log(`${symbol} : ${totalGroupMaterialRaw[symbol]}`);
        resultResourceraw+=`${symbol} : ${totalGroupMaterialRaw[symbol]}\n `
      }
    }

    resultResourceraw+= " }";

    if(editNft){
      //this.disabledKeyBoard=false;
      const btnIniciar =  this.add.text(300,0, resultResourceraw, {
        fontSize: '16px',
        //backgroundColor: '#0c09c8',
        padding: {
          x: 10,
          y: 10
        },
      });
      
      
      this.createNode(editNft);
    }
      
  }


  clearChildrenByDataKey(data: string){
    this.children.getChildren().forEach(item=>{
      
      const customData = item.getData(data);
      if (customData) {
        item.destroy();
      }
      
    })
  }
  
   lastClickTime: number = 0;
   talentNodes: Record<string, Phaser.GameObjects.Container> = {};
   connections: Phaser.GameObjects.Graphics[] = [];
  createNode(talentData: Nft) {
    

    // Función recursiva para crear nodos de talento
    const createTalentNodes = (data: Nft, x: number, y: number, xOffset: number): Phaser.GameObjects.Container => {
      //const node = this.add.image(x + xOffset, y, 'talentNode') as Phaser.GameObjects.Image;
      
          let defaultSubX=x + xOffset;
          
          if(data.x!=undefined && data.y!=undefined){
            defaultSubX=data.x;
            
          }

      const node=new MaterialSA(this, defaultSubX, y, data,'NODES' ,() => {
        const currentTime = this.time.now;

        // Calcula la diferencia de tiempo entre el último clic y el clic actual
        const timeDiff = currentTime - this.lastClickTime;
      
        // Si el tiempo entre clics es menor a un cierto umbral, consideramos que es un doble clic
        const doubleClickThreshold = 300; // Ajusta este valor según tus necesidades
        if (timeDiff < doubleClickThreshold) {
          //text.setText('Doble clic detectado');
          this.stateRtsSA.setEditPart(data);
          this.stateRtsSA.setShowComposition(true);
          
        } else {
          //text.setText('Clic simple');
        }
      
        // Actualiza el tiempo del último clic
        this.lastClickTime = currentTime;
        
      });

      node.setInteractive({ draggable: true }); // Habilita la capacidad de arrastrar


      // Guarda los datos del talento en el nodo
      node.setData('name', data.name);
      node.setData('NODE-EDIT-NFT', true);
      node.setData('unlocked', false); // Para rastrear si el talento está desbloqueado o no
      node.setData('item', data);
      this.talentNodes[data.part_id] = node;

      if (data.ingredients && data.ingredients.length > 0) {
        let subXOffset = -Math.floor(data.ingredients.length / 2) * 150; // Ajusta el espaciado horizontal de los subnodos
        data.ingredients.forEach((ingredient: Nft) => {
          

          let defaultSubX=x;
          let defaultSubY=y + 200;
          if(ingredient.x!=undefined && ingredient.y!=undefined){
            defaultSubX=ingredient.x;
            defaultSubY=ingredient.y;
          }else{
            if(data.ingredients && data.ingredients.length==1){
              x-=150*2;
            }
          }
          
          const subNode = createTalentNodes.call(this, ingredient, defaultSubX, defaultSubY, subXOffset);
          subXOffset += 150; // Aumenta la posición horizontal para el siguiente subnodo


          // Conexiones entre nodos de talento
          const connection = this.add.graphics();
          this.connections.push(connection);
          connection.lineStyle(2, 16777215);
          connection.beginPath();
          connection.moveTo(node.x, node.y + 44);
          connection.lineTo(subNode.x, subNode.y - 44);
          connection.strokePath();
        });
      }

      // Evento para detener el arrastre si se suelta
      node.on('dragend', () => {
        updateConnections();
      });

      return node;
    };

    // Función para actualizar las conexiones cuando se arrastra un nodo
    const updateConnections = () => {
      this.connections.forEach((connection: Phaser.GameObjects.Graphics) => {
        connection.clear();
      });

      for (const key in this.talentNodes) {
        const node = this.talentNodes[key];
        const x1 = node.x;
        const y1 = node.y + 44;

        //if (node.getData('unlocked')) {
        // Vuelve a dibujar las conexiones actualizadas
        //const ingredients = data.ingredients;
        const item = node.getData('item');
        if (item && item.ingredients && item.ingredients.length > 0) {
          item.ingredients.forEach((ingredient: Nft) => {
            const subNode = this.talentNodes[ingredient.part_id];
            if (subNode) {
              const x2 = subNode.x;
              const y2 = subNode.y - 44;

              const connection = this.add.graphics();
              connection.setData('NODE-EDIT-NFT',true);
              this.connections.push(connection);
              connection.lineStyle(2, 16777215);
              connection.beginPath();
              connection.moveTo(x1, y1);
              connection.lineTo(x2, y2);
              connection.strokePath();
            }
          });
        }
        //}
      }
    };

    // Llama a la función recursiva para crear los nodos de talento
    let defaultX=700;
    let defaultY=100;
    if(talentData.x!=undefined && talentData.y!=undefined){
      defaultX=talentData.x;
      defaultY=talentData.y;
    }
    createTalentNodes.call(this, talentData, defaultX, defaultY, 0);

    // Agrega interactividad para seleccionar y desbloquear talentos
    for (const key in this.talentNodes) {
      const node = this.talentNodes[key];
      node.on('pointerdown', () => {
        const unlocked = node.getData('unlocked');
        const item = node.getData('item');
        //this.stateRtsSA.setShowComposition(true);
        //this.createWindow();//crea un posible un modal
        
        if (!unlocked) {
          // Implementa la lógica para desbloquear el talento
          node.setData('unlocked', true);
          console.log(`Talento desbloqueado: ${node.getData('name')}`);
          //node.setTint(65280); // Cambia el color para indicar que está desbloqueado
        }

        updateConnections();
      });
    }
  }

  openConfigWindow(){    
    this.stateRtsSA.setShowConfig(true);
  }
  openUpdateComponent(){    
    this.stateRtsSA.setShowComponent(true);
  }

  updateNftComponent(){
    this.stateRtsSA.updateNftComponent();
    this.createJson();

  }

}
