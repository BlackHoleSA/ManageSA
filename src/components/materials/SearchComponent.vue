<template>
    <Modal :show="showSearchComponent" :header="true" :stylemodal="'modal-md'"
        @onchange="stateRtsSA.setShowComponent($event)">
        <template v-slot:header>
            <div class="d-flex ms-2">
                <h5 class="ms-0" >
                    Buscar componente para actualizalo
                </h5>
            </div>
        </template>


        <div class="row">
            
            <div class="col-12">
                <input type="text" v-model="search">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Foto</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item of materials">
                            <td>{{ item.name }}</td>
                            <td>
                                <img :src="item.image" class="img-thumbnail">
                            </td>
                            <td>
                                <button class="btn btn-xs" @click="onSelectComponent(item)">
                                    Seleccionar
                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

        <template v-slot:footer>
                <button type="button" @click="stateRtsSA.setShowComponent(false)" class="btn btn-default"
                data-dismiss="modal">Close</button>
        
            

        </template>
    </Modal>
</template>
<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import Modal from './../../widgets/modal.vue';
import { useStoreAtlas } from '@/stores/storeAtlas';
import type { Nft } from '@/models/nft';

const stateRtsSA = useStoreAtlas();
const search = ref('')
const showSearchComponent = computed(() => stateRtsSA.getShowComponent());

const materials = ref<Nft[]>([]);


const emit = defineEmits<{
  (e: 'onchange', sw: boolean): void
}>()

watch(search, (newVal, _) => {
    materials.value = stateRtsSA.getComponents().filter(item=>item.name.toUpperCase().includes(newVal.toUpperCase()));
})

const onSelectComponent=(editComponent: Nft)=>{
    
    if(editComponent){
        stateRtsSA.setEditNft(editComponent);
        //stateRtsSA.setEditPart(editComponent);
        stateRtsSA.setShowComponent(false);
        emit("onchange",true);
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