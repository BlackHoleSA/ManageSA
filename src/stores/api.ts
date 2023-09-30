import type { Nft } from "@/models/nft";

const url = 'https://galaxy.staratlas.com/nfts';
export const  fecthResourceSA=async(materialClass: 'raw material' | 'material')=>{
    return await fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud GET: ' + response.status);
        }
        return response.json();
      })
      .then((data: Nft[]) => {
        if(data){
          //const materials= data;//.filter(item=>item.attributes.category=="resource" && item.attributes.class==materialClass);
            return data;
        }
      })
      .catch(error => {
        // Manejar errores de la solicitud
        console.error('Error en la solicitud GET:', error);
      }); 
}

export const downloadJson=(data:any, fileName: string)=>{
    // Convierte el array en una cadena JSON
    debugger
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    // Crea una URL para el Blob
    const url = URL.createObjectURL(blob);
    // Crea un elemento <a> para el enlace de descarga
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    // Simula un clic en el enlace para iniciar la descarga
    a.click();
    // Libera la URL del Blob
    URL.revokeObjectURL(url);
}

/* // Ejemplo de uso:
var myArray = [1, 2, 3, 4, 5];
downloadArrayAsJson(myArray, "miarchivo.json");
 */