
import { defineStore } from 'pinia'
import type { Nft } from '@/models/nft';
import { downloadJson, fecthResourceSA } from './api';
import { reactive } from 'vue';
import { uniqueID } from '@/utils/uniqueID';


interface State {
  items: Nft[];
  selected?: Nft;
  editNft: Nft | undefined;
  partComponent?:Nft;
  showComposition: boolean;
  showConfig: boolean
  message?: string;
}

export const useStoreAtlas = defineStore('staratlas',()=> {
  /**STATE */
  const stateAtlas = reactive<State>({
    items:[],
    selected: undefined,
    editNft: undefined,
    partComponent:undefined,
    showComposition: false,
    showConfig: false
  });

  /**GETTERS */
  const getNfts=(search:string='')=>search=='' ? stateAtlas.items : stateAtlas.items.filter(item=>item.name.toUpperCase().includes(search.toUpperCase()));
  const getResources=()=>stateAtlas.items.filter(item=>item.attributes.category=="resource");
  const getResourceMaterialRaw=()=>stateAtlas.items.filter(item=>item.attributes.category=="resource" && item.attributes.class=="raw material");
  const getCraftShips=()=>stateAtlas.items.filter(item=>["CALMAX","FBLMEX","VZUSSO","X4YT0","PX4","FBLMAM"].includes(item.symbol));

  const getShowComposition=()=>{return stateAtlas.showComposition};
  const getShowConfig=()=>{return stateAtlas.showConfig};
  const getNft=()=>{return stateAtlas.selected};
  const getEditNft=()=>{return stateAtlas.editNft};
  const getPartComponent=()=>{return stateAtlas.partComponent};
    
  
  
    
  /**ACTIONS */
  const loadNftSA=()=>{
      fecthResourceSA('raw material').then(res=>{
        if(res instanceof Array){
          stateAtlas.items=res;
        }
      });
    };
  
  const setEditNft=(nft:Nft)=>{
    if(nft.attributes.category=="ship"){
      if(nft.part_id==null){
        nft.part_id=uniqueID();
      }
      stateAtlas.editNft=nft;
    }else{
      stateAtlas.message='No se puede editar este nft';
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

  const setShowComposition=(sw:boolean)=>stateAtlas.showComposition=sw;
  const setShowConfig=(sw:boolean)=>stateAtlas.showConfig=sw;

  const downloadNftEditAsJson = (filename:string= "miarchivo.json")=>downloadJson(stateAtlas.editNft,filename);


  return {
    stateAtlas,
    //GETTERS
    getNft,
    getNfts,
    getResourceMaterialRaw,
    getResources:getResources,
    getCraftShips,
    getShowComposition,
    getShowConfig,
    getEditNft,
    getPartComponent,
    

    //ACTIONS
    loadNftSA,
    setEditNft,
    setEditPart,
    setShowComposition,
    setShowConfig,
    addIngredientToNft,
    downloadNftEditAsJson
  }
})