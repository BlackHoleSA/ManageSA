<template>
    <Teleport to="body">
        <Transition mode="in-out">
            <div v-if="open" class="modal fade show" id="modal-sm" style="display: block; background-color: #a1a1a187;"
                aria-modal="true" role="dialog">
                
                <div class="modal-dialog " :class="stylemodal">
                    <div class="modal-content" >
                        <div class="overlay" v-if="loading">
                            <slot name="overlay">
                                <i class="fas fa-2x fa-sync fa-spin"></i>
                            </slot>
                            <i class="fas fa-2x fa-sync fa-spin"></i>
                        </div>
                        <div class="modal-header p-2 mb-2 bg-success text-white"  v-if="header">
                            <slot name="header">
                                <h4 class="modal-title"> Title </h4>
                            </slot>
                            
                            <button type="button" class="btn" @click="emit('onchange',false)" aria-label="Close">
                                <!-- <span aria-hidden="true">×</span> -->
                                <i class="fa fa-times" aria-hidden="true"></i>

                            </button>
                        </div>
                        <div class="modal-body ">
                            <slot></slot>
                        </div>
                        <div class="modal-footer justify-content-between">
                            <slot name="footer">
                                <button type="button" @click="emit('onchange',false)" class="btn btn-default"
                                data-dismiss="modal">Close</button>
                            
                                
                            </slot>
                            
                            
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';



const props = defineProps<{show: boolean, stylemodal?: string, header?: boolean, loading?: boolean}>();
const open = computed(()=>props.show);

const emit = defineEmits<{
  (e: 'onchange', show: boolean): void
  //(e: 'update', value: string): void
}>()

</script>

<style scoped>
.bg-success {
    --bs-bg-opacity: 1;
    background-color: #306a65 !important;
}
</style>