<template>
    <Materials @onchange="refreshNodes($event)"></Materials>
    <ModalSearchComponent @onchange="refreshNodes($event)"></ModalSearchComponent>
    <ConfigMaterials @onchange="refreshNodes($event)"></ConfigMaterials>
    <ModalSolana></ModalSolana>
    <div :id="containerId" >
    </div>
  </template>
<script setup lang="ts">
import {  onMounted, onUnmounted, ref} from 'vue'
import Game from './../phaser/game';
import  PlayNodeScene from '@/game/scenes/nodes/PlayNodeScene';

import Materials from './materials/MaterialList.vue'
import ConfigMaterials from './materials/ConfigMaterial.vue'
import ModalSearchComponent from './materials/SearchComponent.vue';
import ModalSolana from './materials/ModalSolana.vue'

const  gameInstance = ref<Game>();
const containerId = 'game-container'


onMounted(() => {
  gameInstance.value = new Game({parent: containerId});
})


const refreshNodes= (sw: boolean)=>{
  if(gameInstance.value){
    const scenaPlay = gameInstance.value.scene.getScene('PlayNodeScene') as PlayNodeScene;  
    scenaPlay.createJson()
    
  }
  
}

onUnmounted(() => {
  if(gameInstance.value){
    gameInstance.value.destroy(false)
  }
  
})
</script>


