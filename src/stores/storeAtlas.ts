
import { defineStore } from 'pinia'
import type { Nft } from '@/models/nft';
import { downloadJson, fecthResourceSA } from './api';
import { reactive } from 'vue';
import { uniqueID } from '@/utils/uniqueID';
import * as web3 from "@solana/web3.js";


const fleetCargo='B6PK8g2bHZ4y7qk15Tk4YocZCdCzWsJDUniML5jUs27U'; // usarlo con el programaid
// programID = TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

const inventoryStationCSSOni='hUSpKkJ15sHZnzoLc5ocmHUTZ2djGx1Anyh12JEZVLX'; // usarlo con elcon el metodo getTokenAccountsByOwner y programID 
  //TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
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
  const SHIPSYMBOLS=["CALMAX","FBLMEX","VZUSSO","FBLBBU","PX4","FBLMAM","OGKATU","PR6","FBLEUN"];
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
  const getComponents=()=>stateAtlas.items.filter(item=>item.attributes.class!="raw material" && item.attributes.category!="ship" && !SHIPSYMBOLS.includes(item.symbol));
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

  const setEditNftByid=(nft: Nft)=>{
    const index = stateAtlas.items.findIndex(item=>item.id==nft.id);
      if(index>-1){
        setEditNft(stateAtlas.items[index]);
      }else{
        stateAtlas.items.push(nft);
        setEditNft(nft);
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
    const walletAddressOwner = new web3.PublicKey('5DYezsj67Wo6MnNuck691iXEZ47cHxHsBXwgwSLEDRkQ'); // este es el carico de municiones de mi flota
    //const walletAddressOwner = new web3.PublicKey('hUSpKkJ15sHZnzoLc5ocmHUTZ2djGx1Anyh12JEZVLX'); // esta configuracion permite vizualizar el 
    const accountFilter:web3.TokenAccountsFilter= {
      programId:new web3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    } 

    
    const acconts=  [
      
        "M7cvT3qkNRkhG3YmQ3sTe2T46q4JKWH9mWK39UarxYv",
        "FMwvZPFGvmjjTQ9ZhePd4kB9WqK3YkyBGcHkYQp45TW1",
        "5jFnsfx36DyGk8uVGrbXnVUMTsBkPXGpx6e69BiGFzko",
        "B5tfnYmVAJLtLomvcSUYwjTz5Rds1psi4Gi6TrWjn2jf",
        "4dmKkXNHdgYsXqBHCuMikNQWwVomZURhYvkkX5c4pQ7y",
        "7gJenN7qBMP3yZeg7ULq5t7BCk5wYmvEtaqL9t9WkkAF",
        "9yoGvCPSFqfgHCyyhb7iVQcNTscFbAqRTbn6XuGUi8xa",
        "6bD8mr8DyuVqN5dXd1jnqmCL66b5KUV14jYY1HSmnxTE",
        "FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf",
        "GEBRghyfoFfFdvb4q2kb6DCczKtPvDBSjdMPFtweVxLj",
        "2eibTj6LtqF6DyabpmUZH8EhzZJFvoxcApyzArHt24G6",
        "3d6PSsH62oTcrr2Fa4nxvm9xJ7jJXdJeQbJhjt6NdT2m",
        "HAWy8kV3bD4gaN6yy6iK2619x2dyzLUBj1PfJiihTisE",
        "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx",
        "9mzHfeQ13jh96tWj2gqBhtnitqAAMnu3RVUDw3UZWqhN",
        "BX9FrvAXfDdFKDcgkRPhq38wCn9SDggg9pN2V9qAup5C",
        "267DbhCypYzvTqv72ZG5UKHeFu56qXFsuoz3rw832eC5",
        "cxxShYRVcepDudXhe7U62QHvw8uBJoKFifmzggGKVC2",
        "fueL3hBZjLLLJHiFH9cqZoozTG3XQZ53diwFPwbzNim",
        "9ABNesWj7NVdkDgko7UjVaDp5pTh8a6wfXHLWz3bZM6W",
        "XzR7CUMqhDBzbAm4aUNvwhVCxjWGn1KEvqTp3Y8fFCD",
        "poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk",
        "8M1JTGxTSY13eiW2KzN9AiNd8m3XWMu38LxU7KHgzA7T",
        "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk",
        "8upjSpvjcdpuzhfR1zriwg5NXkwDruejqNE9WNbPRtyA",
        "7GBfZq24jHXmp6bQ988yhgV2bQiZjZx7Fj1E2xSg8ytU",
        "ammoK8AkX2wnebQb35cDAZtTkvsXQbi82cGeTnUvvfK",
        "AghzYPEuof6Q8WqEG8AUDUVwqtT2aEyZxBkWk9mJnBv6",
        "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj",
        "B9xkxYMfv1TuPu2BFRuGNcd9XqX8YTCvdrG9ozAE3a9d",
        "5LiAUHfvRpkvrNTZe5CNgoQpdn4VFM5KfX5jDJKAjTSS",
        "C2Dp7WwPnT7ZgY6MNyg7g7hVguk31HPtRe9EgP2m9vpJ",
        "RDGgGBxJ8mWKrMrsiS1VkPjXTNianRdikYJhGYqyZfF",
        "9iHQcYQR3qfqUh1HsTvRu2K1QZSCW3M6DXCY7HcwFGJn",
        "7V9C2XUQgCb31n7hGKqKGu4ENcvqXhJLJzU77CAQtXhw",
        "EEUxpQngyvrtnRzppHLSVdVvpsoHFfY25fh72cLQ8NBn",
        "7dr7jVyXf1KUnYq5FTpV2vCZjKRR4MV94jzerb8Fi16Q",
        "4dmKkXNHdgYsXqBHCuMikNQWwVomZURhYvkkX5c4pQ7y",
        "D5qtZURrR8hs1V1oTuSFu7tMe5pt1XKWWqqK34CHF5ZA",
        "H9gji7B9ePpyjFtfn9T1NN1MkAXVpGWFiExmeBPgN5Sy",
        "HAWy8kV3bD4gaN6yy6iK2619x2dyzLUBj1PfJiihTisE",
        "BgiTVxW9uLuHHoafTd2qjYB5xjCc5Y1EnUuYNfmTwhvp",
        "36s6AFRXzE9KVdUyoJQ5y6mwxXw21LawYqqwNiQUMD8s",
        "3SXkwBEKcTYQ3Ahg4zvrcQzNfghcti5XwuH7qCJjsrqN",
        "5qNrCUQZMCFdmomDi9Qfg7pBEmuTXozd24vNB9b1Pss",
        "BswdGxfurGpSKPPhHUP6d9uzdY3bAG8o3CJnFUQLanzw",
        "BaBtne4AUw3z9NNxDxTPmYXzQgJZrEW55fM81XeL7zhR",
        "FJEEHRAKPcVUBfitPZDsmR8PtYfeg1Cy8RusVb7PuPgw",
        "ANKEQ5zQdBhTbdZCNeTiMP6LsLduzEXL61kwtBHyYmSL",
        "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
        "EtGUMTG82Z3FpcrYY4AYYcRS1WPfJK9rBygxVNDdxXgJ",
        "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
        "9MvZS3TVfv4DZL9W2pT12po384aBHf7wi89KXQ9Z7uwW",
        "ATSPo9f9TJ3Atx8SuoTYdzSMh4ctQBzYzDiNukQDmoF7",
        "ATSPo9f9TJ3Atx8SuoTYdzSMh4ctQBzYzDiNukQDmoF7",
        "BhsbcuW7iDEthrh6noja7ZFJ9yMqtu9QnuzpK38wv3r9",
        "PhiLR4JDZB9z92rYT5xBXKCxmq4pGB1LYjtybii7aiS",
        "79dPEcuwqXb7LStZCcPCgiwJi8D7a29Uo4uGjnq2k2aR",
        "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp",
        "BgiTVxW9uLuHHoafTd2qjYB5xjCc5Y1EnUuYNfmTwhvp",
        "2piSPCxbuibsraBnnK4M5rGeHSraNe2oiD8hDw42bPKq",
        "eUkSbazTfDir4jjYth6fwayGh2gSQ2zNaHLfoKud97L",
        "5LkYStW5K4dPkYDzMFw5smUZ3qNJ8v1fG4gwbHbDfNV2",
        "7P5Thr9Egi2rvMmEuQkLn8x8e8Qro7u2U7yLD2tU2Hbe",
        "7MC1kwNJaScpMw1QukdeD48rSp7cE3NgxZ2yKdDBPqQe",
        "YAWtS7vWCSRPckx1agB6sKidVXiXiDUfehXdEUSRGKE",
        "9cUzV49LN8AJXSwrhgKzZvSSaHyk6pdwLYBJXPjK2JFA",
        "7gst7LVB9KQtWNorB2LsoN9g4EHASHkdHAaU1jbMY3KR",
        "foodQJAztMzX1DKpLaiounNe2BDMds5RNuPC6jsNrDG",
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
        "4G85c5aUsRTrRPqE5VjY7ebD9b2ktTF6NEVGiCddRBDX",
        "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        "9bccaxs8YihGCRkPqcFMPkPbVBwNNjzHc4iHvsfQNs6x",
        "2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk",
        "9czEqEZ4EkRt7N3HWDcw9qqwys3xRRjGdbn8Jhk8Khwj",
        "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        "tooLsNYLiVqzg8o4m3L2Uetbn62mvMWRqkog6PQeYKL",
        "7eJ7Mvc4MKQ128e5CJXHJFpvpbPhdKUhBgNyDMC3xnpu",
        "2iMhgB4pbdKvwJHVyitpvX5z1NBNypFonUgaSAt9dtDt",
        "HzUBawF9xxTy4mTuvSkk1a4voJcm65tSHZz6voCDUB33",
        "2yQJdxJy4tGeeXK2u8Lwdy9oY6Ks5shVH9gYtRH9zdDw",
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        "AxiSgYMhYjSwLhyLMvxixWNEbD2iVXHWr5LRmp9UEXcM",
        "4kSaSFRuJ6gV1QcqvjvLnAQ1QcGu7SouDPF5DidKJAn2",
        "AGetZxAHPBaz3hsd4kugtC3sJrUu6vmhzCc5c1azaN4n",
        "6JnRMJGUvnZwR1FSEYazKnMbEGTvrpufuKZ3HW86DXVc",
        "9Qpe56yDLcUddhU6mJowdhcDkqPXXYZNn7VEjz8yUxNv",
        "CVy9zWnF7y15FeqEvV3ZsMdnMDG25na3NWHzx8xQvcG2",
        "GENEtH5amGSi8kHAtQoezp1XEXwZJ8vcuePYnXdKrMYz",
        "BSvv8YhJZfAd5BkHi4E593C2hWfsotMmch2wmaudJDFX",
        "AuxCj2T4Mdb6h5i1pZd2yDJy5pdiEpZCPtTHAR1DqKdT",
        "4G85c5aUsRTrRPqE5VjY7ebD9b2ktTF6NEVGiCddRBDX",
        "C2uF4fECabWryVCV1bDuxP7jMspbf2gei3YAP2UBn292",
        "9ysGKUH6WqzjQEUT4dxqYCUaFNVK9QFEa24pGzjFq8xg",
        "2poo1w1DL6yd2WNTCnNTzDqkC6MBXq7axo77P16yrBuf",
        "7Yeihi147ynkw58UP6W5AetBgotn6gFxV8UWsNPhfrkZ",
        "3HzXnc1qZ8mGqun18Ck3KA616XnZNqF1RWbgYE2nGRMA",
        "BKipkearSqAUdNKa1WDstvcMjoPsSKBuNyvKDQDDu9WE"
      
      ];
     
      const arr=acconts.map(item=>new web3.PublicKey(item))
    const commited:web3.Commitment='confirmed'
    try {
      //getTokenAccountsByOwner
      //const accountInfo = await connection.getParsedTokenAccountsByOwner(walletAddressOwner,accountFilter,commited);
      const accountInfo = await connection.getMultipleParsedAccounts(arr);

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