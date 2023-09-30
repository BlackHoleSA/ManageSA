<template>
  <main>
    <Suspense >
      <GameContainer v-if="assets.length>0"></GameContainer>

    <template #fallback>
      <div class="placeholder">
        Downloading ...
      </div>
    </template>
  </Suspense>
  </main>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import GameContainer from './../components/GameContainer.vue'

import { useStoreAtlas } from '@/stores/storeAtlas';


const stateRtsSA= useStoreAtlas();

const assets=computed(()=>stateRtsSA.getNfts());

onMounted(()=>{
  stateRtsSA.loadNftSA();
})

</script>


