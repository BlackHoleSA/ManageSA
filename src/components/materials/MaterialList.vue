<template>
    <Modal :show="showComposition" :header="true" :stylemodal="'modal-xl'"
        @onchange="stateRtsSA.setShowComposition($event)">
        <template v-slot:header>
            <div class="d-flex ms-2" v-if="partNft">
                <h5 class="ms-0">
                    Compositions {{ partNft.name }} units {{ partNft.quantity }}
                </h5>
                <button class="btn btn-primary btn-sm ms-3" @click="setEditComponent(partNft)">Editar componente</button>
            </div>
        </template>


        <div class="row">
            <div class="col-8">
                <div class="d-flex flex-wrap" v-if="partNft">
                    <div class="card" v-for="(part, index) of partNft.ingredients">
                        <div class="card-header">
                            <h3 class="card-title">{{ part.name }}
                                <button type="button" class="btn btn-default" @click="deleteIngredient(part.id)">
                                    <i class="fas fa-trash"></i> X
                                </button>
                            </h3>
                            
                            
                        </div>
                        <img :src="part.image" class="card-img-top maximage" alt="...">
                        <div class="card-body">
                            <div class="form-group">
                                <label for="inputForUnit">Required for unit.</label>
                                {{ part.qtyRequired }}
                                <input type="number" class="form-control" id="inputForUnit" v-model="part.qtyRequired"
                                    v-on:keyup="changeIngredient(index, part.qtyRequired)" placeholder="Quantity for unit">
                            </div>
                            <div class="form-group">
                                <label for="inputAmmount">Quantity for crafting</label>
                                <input type="number" readonly class="form-control" id="inputAmmount" :value="part.quantity"
                                    placeholder="Quantity">
                            </div>
                        </div>
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
import { computed, ref, watch, watchEffect } from 'vue';
import Modal from './../../widgets/modal.vue';
import { useStoreAtlas } from '@/stores/storeAtlas';
import type { Nft } from '@/models/nft';
import { uniqueID } from '@/utils/uniqueID';

const stateRtsSA = useStoreAtlas();
const search = ref('')
const showComposition = computed(() => stateRtsSA.getShowComposition());
const partNft = computed(() => stateRtsSA.getPartComponent());
const materials = ref<Nft[]>([]);
const editNft = computed(() => stateRtsSA.getEditNft())

//defineProps<{}>()

const emit = defineEmits<{
    (e: 'onchange', sw: boolean): void
    //(e: 'update', value: string): void
}>()

watch(search, (newVal, _) => {
    materials.value = stateRtsSA.getNfts(newVal);
})

/* watch(()=>partNft.value?.ingredients,(newVal,_)=>{
    console.log('modificado')
    if(newVal ){
        newVal.forEach(item=>{
            item.quantity=(partNft.value!.quantity??1) * (item.qtyRequired??1);
        });
    }
}) */
watchEffect(() => {
    if (partNft.value) {
        // do something when data is loaded
        console.log('modificadoss');

    }
    console.log('hahah');
})

const changeIngredient = (index: number, rateQty: number, e?: Event) => {
    console.log(e);
    partNft.value!.ingredients![index].quantity = (partNft.value!.quantity ?? 1) * rateQty;
    /* partNft.value!.ingredients!.forEach(item=>{
        item.quantity=(partNft.value!.quantity??1) * (item.qtyRequired??1);
    }); */
}

const addIngredient = (nft: Nft) => {
    const cloneNft = Object.assign({}, nft)
    if (partNft.value && cloneNft.attributes.category == "resource") {
        if (partNft.value.ingredients == undefined) {
            partNft.value.ingredients = [];
        }
        const partId = uniqueID();
        cloneNft.part_id = partId;
        partNft.value.ingredients!.push(cloneNft);
    }
}


const deleteIngredient = (nft_id: string) => {
    partNft.value!.ingredients = partNft.value!.ingredients!.filter(item => item.id != nft_id);
}


const addEditNft = (part: Nft) => {

    if (editNft.value && part.part_id == editNft.value?.part_id) {
        stateRtsSA.setEditNft(part);
        stateRtsSA.setShowComposition(false);
        emit("onchange", true);
    } else {
        stateRtsSA.addIngredientToNft(editNft.value!, editNft.value!.part_id, editNft.value!)
        stateRtsSA.setShowComposition(false);
        emit("onchange", true);
    }

}

const setEditComponent = (nft: Nft) => {
    stateRtsSA.setEditNft({ ...nft, qtyRequired: 1, quantity: 1, x: undefined, y: undefined });

    stateRtsSA.setShowComposition(false);
    emit("onchange", true);
}

</script>
<style>
.img-thumbnail {
    height: 50px;
}

.maximage {
    max-width: 240px;
}</style>