<template>
    <Modal :show="showComposition" :header="true" :stylemodal="'modal-xl'"
        @onchange="stateRtsSA.setShowComposition($event)">
        <template v-slot:header>
            <div class="d-flex ms-2">
                <h5 class="ms-0" v-if="partNft">
                    Compositions {{ partNft.name }}
                </h5>
            </div>
        </template>


        <div class="row">
            <div class="col-8">
                <div class="card-group" v-if="partNft">
                    <div class="card" v-for="part of partNft.ingredients">
                        <div class="card-header">{{part.name}}</div>
                        <img :src="part.image" class="card-img-top maximage" alt="...">
                        
                    </div>
                    
                </div>

            </div>
            <div class="col-4">
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
                                <button class="btn btn-xs" @click="addIngredient(item)">
                                    Add
                                </button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>

        <template v-slot:footer>
                <button type="button" @click="stateRtsSA.setShowComposition(false)" class="btn btn-default"
                data-dismiss="modal">Close</button>
        
                <button type="button" v-if="partNft" @click="addEditNft(partNft)" class="btn btn-default"
                data-dismiss="modal">Save</button>


        </template>
    </Modal>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Modal from './../../widgets/modal.vue';
import { useStoreAtlas } from '@/stores/storeAtlas';
import type { Nft } from '@/models/nft';
import { uniqueID } from '@/utils/uniqueID';

const stateRtsSA = useStoreAtlas();
const search = ref('')
const showComposition = computed(() => stateRtsSA.getShowComposition());
const partNft = computed(() => stateRtsSA.getPartComponent());
const materials = ref<Nft[]>([]);
const editNft= computed(()=>stateRtsSA.getEditNft())

//defineProps<{}>()

const emit = defineEmits<{
  (e: 'onchange', sw: boolean): void
  //(e: 'update', value: string): void
}>()

watch(search, (newVal, _) => {
    materials.value = stateRtsSA.getNfts(newVal);
})

const addIngredient = (nft: Nft) => {
    debugger
    const cloneNft= Object.assign({},nft)
    if (partNft.value && cloneNft.attributes.category == "resource") {
        if(partNft.value.ingredients==undefined){
            partNft.value.ingredients=[];
        }
        const partId= uniqueID();
        cloneNft.part_id=partId;
        partNft.value.ingredients!.push(cloneNft);
    }

    //stateRtsSA.addIngredientToNft(partNft.value,)
}

const addEditNft=(part: Nft)=>{
    
    if(editNft.value && part.part_id==editNft.value?.part_id){
        stateRtsSA.setEditNft(part);
        stateRtsSA.setShowComposition(false);
        emit("onchange",true);
    }else{
        stateRtsSA.addIngredientToNft(editNft.value!,editNft.value!.part_id,editNft.value!)
        stateRtsSA.setShowComposition(false);
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