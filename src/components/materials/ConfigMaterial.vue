<template>
    <Modal :show="showConfig" :header="true" :stylemodal="'modal-md'"
        @onchange="stateRtsSA.setShowConfig($event)">
        <template v-slot:header>
            <div class="d-flex ms-2">
                <h5 class="ms-0" >
                    Configuration materials
                </h5>
            </div>
        </template>


        <div class="row">
            <div class="col-6">
                <div class="card-group" >
                    <div class="card" >
                        <div class="card-header"> Upload</div>
                        <!-- <img :src="part.image" class="card-img-top maximage" alt="..."> -->
                        <div class="card-body">
                            <p>Carga una configuracio'n existente</p>
                            <input type="file" @change="changeFile($event)">
                        </div>
                    </div>
                    
                </div>

            </div>
            <div class="col-6">
                <div class="card-group" >
                    <div class="card" >
                        <div class="card-header"> Download</div>
                        <!-- <img :src="part.image" class="card-img-top maximage" alt="..."> -->
                        <div class="card-body">
                            <button class="btn btn-primary" @click="stateRtsSA.downloadNftEditAsJson()">
                                Guarda tu configuracio'n
                            </button>
                        </div>
                    </div>
                    
                </div>

            </div>
            
        </div>

        <template v-slot:footer>
                <!-- <button type="button" @click="stateRtsSA.setShowComposition(false)" class="btn btn-default"
                data-dismiss="modal">Close</button>
        
                <button type="button" v-if="partNft" @click="addEditNft(partNft)" class="btn btn-default"
                data-dismiss="modal">Save</button> -->


        </template>
    </Modal>
</template>
<script setup lang="ts">

import Modal from './../../widgets/modal.vue';
import { useStoreAtlas } from '@/stores/storeAtlas';
import type { Nft } from '@/models/nft';
import { computed } from 'vue';


const stateRtsSA = useStoreAtlas();

const showConfig=computed(()=>stateRtsSA.getShowConfig());
//defineProps<{}>()

const emit = defineEmits<{
  (e: 'onchange', sw: boolean): void
  //(e: 'update', value: string): void
}>()


const changeFile=(e:Event)=>{
    const fileInput = e.target as HTMLInputElement;

    // Verifica si se seleccionó un archivo
    if (fileInput.files && fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        
        // Crea un objeto FileReader para leer el archivo
        var reader = new FileReader();

        // Define una función de retrollamada cuando se complete la lectura
        reader.onload = (event:ProgressEvent)=> {
            
            
            const jsonContent = (event.target as any).result;

            // Analiza el contenido JSON y almacénalo en una variable
            try {
                const jsonData = JSON.parse(jsonContent);
                stateRtsSA.setEditNft(jsonData);
                emit("onchange", true);
            } catch (error) {
                console.error("Error al analizar el archivo JSON:", error);
            }
        };

        // Lee el contenido del archivo como texto
        reader.readAsText(selectedFile);
    } else {
        console.log("No se seleccionó ningún archivo.");
    }
}



</script>
<style>
.img-thumbnail {
    height: 50px;
}
.maximage{
    max-width: 240px;
}
</style>