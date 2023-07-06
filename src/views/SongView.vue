<template>
  <v-row v-if="!song" justify="center">
    <v-progress-circular indeterminate />
  </v-row>

  <div v-else>
    <div v-if="editing">
      <v-row justify="center">
        <song-edit :song="song" @done="editing = !editing" />
      </v-row>
    </div>

    <div v-else>
      <v-row justify="center" class="mb-8">
        <v-btn color="primary" @click="editing = true">Edit</v-btn>
      </v-row>
      <v-row>
        <song-details :song="song" @done="editing = !editing" />
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SongDetails from '../components/SongDetails.vue'
import SongEdit from '../components/SongEdit.vue'
import { useDocument } from 'vuefire'
import { doc, collection } from 'firebase/firestore'
import { db } from '../firebase'

export default defineComponent({
  name: 'SongView',

  components: {
    SongDetails,
    SongEdit
  },

  data () {
    return {
      editing: false,
      song: null as any
    }
  },

  created () {
    // TODO: Use store for current song
    const docId = this.$route.params.id as string
    const storeSong = this.$store.getters.findSong(docId)
    // Try getting from store if loaded, otherwise just load this one
    if (storeSong) {
      this.song = storeSong
    } else {
      this.song = useDocument(doc(collection(db, 'songs'), docId))
    }
  },

  // computed: {
    // ...mapGetters([
    //   'store.findSong'
    // ]),
    // song () {
    //   return this.$store.getters.findSong(this.$route.params.id)
    // }
  // },

  // methods: {
  //   cancelEdit: function () {
  //     this.editing = false
  //   }
  // }

  watch: {
    song (value) {
      if (this.song) {
        document.title = `${this.song.title} - Brad's Covers`
      }
    }
  }
})
</script>