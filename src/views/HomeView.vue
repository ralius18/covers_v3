<template>
  <song-list />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDisplay } from 'vuetify'

// Components
import SongList from '../components/SongList.vue';

export default defineComponent({
  name: 'HomeView',

  setup() {
    const { mobile } = useDisplay()

    return { mobile }
  },

  components: {
    SongList
  },

  mounted () {
    document.title = "Brad's Covers"
  },

  data () {
    return {
      search: ''
    }
  }
});
</script>
