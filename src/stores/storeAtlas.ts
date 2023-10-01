
import { defineStore } from 'pinia'
import type { Nft } from '@/models/nft';
import { downloadJson, fecthResourceSA } from './api';
import { reactive } from 'vue';
import { uniqueID } from '@/utils/uniqueID';
import * as web3 from "@solana/web3.js";

interface State {
  items: Nft[]; 
  //materials:Nft[];//compount, material , material raw and ships
  selected?: Nft;
  editNft: Nft | undefined;
  partComponent?:Nft;
  showComposition: boolean;
  showConfig: boolean
  showUpdateComponent:boolean;
  showSolana:boolean;
  message?: string;
}

export const useStoreAtlas = defineStore('staratlas',()=> {
  /**STATE */
  const SHIPSYMBOLS=["CALMAX","FBLMEX","VZUSSO","FBLBBU","PX4","FBLMAM"];
  const stateAtlas = reactive<State>({
    items:[],
    //materials:[],
    selected: undefined,
    editNft: undefined,
    partComponent:undefined,
    showComposition: false,
    showUpdateComponent:false,
    showSolana: false,
    showConfig: false
  });

  /**GETTERS */
  const getNfts=(search:string='')=>search=='' ? stateAtlas.items : stateAtlas.items.filter(item=>item.name.toUpperCase().includes(search.toUpperCase()));
  const getResources=()=>stateAtlas.items.filter(item=>item.attributes.category=="resource");
  const getResourceMaterialRaw=()=>stateAtlas.items.filter(item=>item.attributes.class=="raw material");
  const getComponents=()=>stateAtlas.items.filter(item=>item.attributes.class!="raw material" && item.attributes.class!="ship" && !SHIPSYMBOLS.includes(item.symbol));
  const getCraftShips=()=>stateAtlas.items.filter(item=>SHIPSYMBOLS.includes(item.symbol));

  const getShowComposition=()=>{return stateAtlas.showComposition};
  const getShowConfig=()=>{return stateAtlas.showConfig};
  const getShowComponent=()=>{return stateAtlas.showUpdateComponent};
  const getNft=()=>{return stateAtlas.selected};
  const getEditNft=()=>{return stateAtlas.editNft};
  const getPartComponent=()=>{return stateAtlas.partComponent};
  const getTotalMaterialRaw=()=>stateAtlas.editNft ? sumValuesBySymbolGroups(stateAtlas.editNft): null;
  
  
    
  /**ACTIONS */
  const loadNftSA=()=>{
      fecthResourceSA('raw material').then(res=>{
        if(res instanceof Array){

          stateAtlas.items=res.filter(item=>
              SHIPSYMBOLS.includes(item.symbol) ||
              item.attributes.category=="resource" 
          );

          //stateAtlas.materials=stateAtlas.items.filter(item=>item.attributes.category=="resource");
        }
      });
    };
  
  const setEditNft=(nft:Nft)=>{
    
    if(nft.attributes.category!="material raw"){
      updateRecursive(nft);
      if(nft.part_id==null){
        nft.part_id=uniqueID();
      }
      stateAtlas.editNft=nft;
      //
    }else{
      stateAtlas.message='No se puede editar este nft';
    }
    
  }

  const setEditNftByid=(nft_id: string)=>{
    const index = stateAtlas.items.findIndex(item=>item.id==nft_id);
      if(index>-1){
        setEditNft(stateAtlas.items[index]);
        
      }
  }

  const setEditPart=(nft:Nft)=>{
    stateAtlas.partComponent=nft;
  }


  const addIngredientToNft=(recipe: Nft, nft_id: string, newIngredient: Nft): boolean =>{
    debugger
    if (recipe.id === nft_id) {
      // La receta deseada se encontró, agregamos el nuevo ingrediente
      if (!recipe.ingredients) {
        recipe.ingredients = []; // Inicializamos la lista de ingredientes si no existe
      }
      recipe.ingredients.push(newIngredient);
      return true; // Ingredientes agregados exitosamente
    }
  
    if (recipe.ingredients) {
      for (const subRecipe of recipe.ingredients) {
        if (addIngredientToNft(subRecipe, nft_id, newIngredient)) {
          return true; // Ingredientes agregados exitosamente en una subreceta
        }
      }
    }
  
    return false; // La receta deseada no se encontró en esta receta ni en sus subrecetas
  }


  const updateNftComponent=()=>{
    if(stateAtlas.editNft!=undefined){
      updateRecursive(stateAtlas.editNft!);
      
      const index = stateAtlas.items.findIndex(item=>item.id==stateAtlas.editNft!.id);
      if(index>-1){
        stateAtlas.items[index]=stateAtlas.editNft!
      }
      
    }
    
  }


  const  updateRecursive=(nft: Nft): void =>{
    
    if(nft.ingredients==undefined){
      nft.ingredients=[];
    }
    nft.ingredients.forEach(item=>{
      if(nft.quantity==undefined){
        nft.quantity=1;
      }
      if( typeof (item.qtyRequired as any) === 'string'){
        item.qtyRequired=Number.parseInt(`${item.qtyRequired}`);
      }
      if(item.attributes.class=='raw material'){
        item.x=undefined;
        item.y=undefined;
      }
      item.quantity = nft.quantity * item.qtyRequired;
      updateRecursive(item);
    })
    
}


  const groupLeafNodesBySymbol=(node: Nft): Record<string, Nft[]> =>{
    if (node.ingredients!.length === 0) {
      return { [node.symbol]: [node] }; // Si el nodo no tiene hijos, lo agrupa por "symbol"
    } else {
      let groupedNodes: Record<string, Nft[]> = {};
      for (const child of node.ingredients!) {
        const childGroups = groupLeafNodesBySymbol(child); // Llama recursivamente para los hijos
        for (const symbol in childGroups) {
          if (groupedNodes[symbol]) {
            groupedNodes[symbol] = groupedNodes[symbol].concat(childGroups[symbol]);
          } else {
            groupedNodes[symbol] = childGroups[symbol];
          }
        }
      }
      return groupedNodes;
    }
  }

  const   sumValuesBySymbolGroups=(node: Nft): Record<string, number> =>{
    if(node.ingredients==undefined){
      node.ingredients=[];
    }

    if (node.ingredients!.length === 0) {
      return { [node.name]: node.quantity??1 }; // Si el nodo no tiene hijos, devuelve su valor en un objeto
    } else {
      let groupedSums: Record<string, number> = {};
      for (const child of node.ingredients!) {
        const childSums = sumValuesBySymbolGroups(child); // Llama recursivamente para los hijos
        for (const symbol in childSums) {
          if (groupedSums[symbol]) {
            groupedSums[symbol] += childSums[symbol];
          } else {
            groupedSums[symbol] = childSums[symbol];
          }
        }
      }
      return groupedSums;
    }
  }


  


  const setShowComposition=(sw:boolean)=>stateAtlas.showComposition=sw;
  const setShowConfig=(sw:boolean)=>stateAtlas.showConfig=sw;
  const setShowComponent=(sw:boolean)=>stateAtlas.showUpdateComponent=sw;

  const downloaItemsAsJson = (filename:string= "miarchivo.json")=>downloadJson(stateAtlas.items,filename);

  const downloadComponentsAsJson = (filename:string= "materialsAndShips.json")=>downloadJson(stateAtlas.items,filename);



  const actionGetProgramIDSolana=async (programIsString: string)=>{
    const connection = new web3.Connection('https://snowy-empty-friday.solana-mainnet.discover.quiknode.pro/38a93b3f889c0fbeaf6df2df65de02fbbbc14c5a/');
    //const programId = new web3.PublicKey("hUSpKkJ15sHZnzoLc5ocmHUTZ2djGx1Anyh12JEZVLX");
    //hUSpKkJ15sHZnzoLc5ocmHUTZ2djGx1Anyh12JEZVLX
    //const walletAddressOwner = new web3.PublicKey('hUSpKkJ15sHZnzoLc5ocmHUTZ2djGx1Anyh12JEZVLX'); // esta configuracion permite vizualizar el 
    const walletAddressOwner = new web3.PublicKey('hUSpKkJ15sHZnzoLc5ocmHUTZ2djGx1Anyh12JEZVLX'); // esta configuracion permite vizualizar el 
    const accountFilter:web3.TokenAccountsFilter= {
      programId:new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      
    } 
    const commited:web3.Commitment='confirmed'
    //connection._buildArgs(connection)
    /* connection._buildArgs(
      [walletAddressOwner.toBase58()],
      undefined,
      'jsonParsed',
      undefined
    ); */
    try {
      //getTokenAccountsByOwner
      const accountInfo = await connection.getParsedTokenAccountsByOwner(walletAddressOwner,accountFilter,commited);

     /*  "params": [
        "hUSpKkJ15sHZnzoLc5ocmHUTZ2djGx1Anyh12JEZVLX",
        {
            "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
            "encoding": "jsonParsed",
            "commitment": "confirmed"
        }
    ] */
  
      if (accountInfo) {
        // Inspecciona el contenido de la cuenta para identificar tus NFTs
        // Dependiendo de cómo estén almacenados, tendrás que analizar los datos de la cuenta

        console.log(accountInfo);
        alert(`'Información de la cuenta:', ${JSON.stringify(accountInfo)}`)
      } else {
        alert('No se encontró información de la cuenta.');
      }
    } catch (error) {
      alert(`'Error al obtener información de la cuenta:', ${error}`);
    }
/*     const programAccounts = await connection.getProgramAccounts(programId);

      if (programAccounts.length > 0) {
        console.log('Cuentas asociadas al programa:', programAccounts);
        alert(`Cuentas asociadas al programa:, ${programAccounts}`)
      } else {
        console.log('No se encontraron cuentas asociadas al programa.');
        alert(`No se encontraron cuentas asociadas al programa.`)
      } */

  }



  return {
    stateAtlas,
    //GETTERS
    getNft,
    getNfts,
    getResourceMaterialRaw,
    getResources:getResources,
    getCraftShips,
    getComponents,
    getShowComposition,
    getShowConfig,
    getShowComponent,
    getEditNft,
    getPartComponent,
    getTotalMaterialRaw,

    

    //ACTIONS
    loadNftSA,
    setEditNft,
    setEditNftByid,
    setEditPart,
    setShowComposition,
    setShowConfig,
    setShowComponent,
    addIngredientToNft,
    downloaItemsAsJson,
    updateNftComponent,

    actionGetProgramIDSolana
  }
})