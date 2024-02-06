<template>
  <div class="ml-1 overflow-auto">
    <div class="bg-gray-100 p-1 rounded-md shadow-md">
      <div class="flex items-center">
        <button
          class="bg-white p-2 rounded-md mr-1 shadow-md"
          @click="constructSearchQuery"
        >
          <MagnifyIcon fillColor="#515151" :size="18" />
        </button>

        <input
          id="trackSearch"
          class="appearance-none bg-white p-2 rounded-md shadow-md w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder:text-sm placeholder:text-gray-500"
          autocomplete="off"
          type="text"
          placeholder="Search a song"
        />
      </div>

      <div v-if="trackIds.length > 0" class="mt-2">
        <div
          v-for="track in trackIds"
          :key="track.index"
          class="flex justify-between relative overflow-y-auto"
        >
          <div class="w-1/3 relative" @dblclick="selectedTrackUri(track.index)">
            <iframe
              :src="`https://open.spotify.com/embed/track/${track.trackId}`"
              width="300"
              height="100"
              frameborder="0"
              allowtransparency="true"
              allow="encrypted-media"
            ></iframe>
          </div>
          <div class="w-1/3 text-right">
            <button
              @click="selectedTrackUri(track.index)"
              class="bg-white p-2 rounded-md shadow-md mt-5 ml-0.5"
            >
              <SendIcon fillColor="#515151" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import MagnifyIcon from "vue-material-design-icons/Magnify.vue";
import SendIcon from "vue-material-design-icons/Send.vue";
import { ref, defineEmits } from "vue";
import { useUserStore } from "../store/user-store";
import { storeToRefs } from "pinia";
import axios from "axios";
const userStore = useUserStore();
// const { spotifyToken } = storeToRefs(userStore);
let trackUris = ref([]);
let trackIds = ref([]);

const emit = defineEmits("sendSelectedTrackUri");

const selectedTrackUri = (index) => { 
    if (trackUris.value.length > 0 && index >= 0 && index < trackUris.value.length) {
    // console.log(trackUris.value[index]);
    emit("sendSelectedTrackUri", trackUris.value[index] )
    return trackUris.value[index];
  }
};

const constructSearchQuery = async () => {
  trackIds.value = [];
  let spotifyToken = await userStore.getSpotifyToken();

  var searchText = document.getElementById("trackSearch").value;
  var queryString =
    "https://api.spotify.com/v1/search?q=" + searchText + "&type=track&limit=5";

  try {
    const res = await axios.get("/api/spotifySearch", {
      params: { queryString: queryString },
      headers: {
        Authorization: `${spotifyToken}`,
      },
    });

    // Handle the response data asynchronously
    handleResponseData(res.data);
  } catch (error) {
    console.log(error);
  }
};

const handleResponseData = (data) => {
  data.tracks.items.forEach((item, index) => {

    trackUris.value.push({ index: index, trackUri: item.uri });
    trackIds.value.push({
      index: index,
      trackId: item.uri.split(":")[2],
    });

  });
};


</script>

<style lang="scss" scoped>
</style>