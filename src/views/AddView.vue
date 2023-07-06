<template>
  <song-edit :song="null" @done="cancelAdd" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SongEdit from '../components/SongEdit.vue'

export default defineComponent({
  name: 'AddView',

  components: {
    SongEdit
  },

  methods: {
    cancelAdd () {
      this.$router.push('/')
    }
  }
})
</script>