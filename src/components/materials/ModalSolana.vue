<template>
    <Modal :show="showModalSolana" :header="true" :stylemodal="'modal-md'"
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
                        <div class="card-header"> Download</div>
                        <!-- <img :src="part.image" class="card-img-top maximage" alt="..."> -->
                        <div class="card-body">
                            <input type="text" v-model="programId">
                            <button class="btn btn-primary" @click="checkSolana(programId)">
                                Check solana
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
import { computed, ref } from 'vue';

const programId=ref('')
const stateRtsSA = useStoreAtlas();

const showModalSolana=computed(()=>stateRtsSA.stateAtlas.showSolana);
//defineProps<{}>()

const emit = defineEmits<{
  (e: 'onchange', sw: boolean): void
  //(e: 'update', value: string): void
}>()


const checkSolana=(program: string)=>{
    stateRtsSA.actionGetProgramIDSolana(program)
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