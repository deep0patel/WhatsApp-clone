<template>
  <div>
    <iframe
      :src="`https://open.spotify.com/embed/track/${trackId}`"
      width="300"
      height="80"
      frameborder="0"
      allowtransparency="true"
      allow="encrypted-media"
    ></iframe>
  </div>
</template>


<script setup>
import { toRefs } from 'vue';

const props = defineProps({ trackId: String })
const { trackId } = toRefs(props)


// console.log(trackId); 
</script>
