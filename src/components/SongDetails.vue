<template>
  <div v-if="song" class="ma-4 details">
    <v-row id="title" class="text-h5">{{ song.title }}</v-row>
    <v-row class="text-h6">{{ song.artist }}</v-row>
    <v-row v-if="song.capo" class="font-italic">Capo {{ song.capo }}</v-row>
    <v-row><pre class="tab" :class="mobile ? 'mobile' : ''">{{ song.tab }}</pre></v-row>

    <v-snackbar
      v-model="snack"
      color="primary"
      position="sticky"
      location="bottom right"
      variant="outlined"
      :timeout="-1"
      min-width="0"
      min-height="0"
      class="pa-0"
    >
      <div v-if="scrolling">
        <v-btn
          icon="mdi-minus"
          variant="text"
          :disabled="speed <= Math.abs(increment)"
          @click="adjustSpeed(-increment)"
        />
        <v-btn
          icon="mdi-pause"
          variant="text"
          @click="scrolling = false"
        />
        <v-btn
          icon="mdi-plus"
          variant="text"
          @click="adjustSpeed(increment)"
        />
      </div>
      
      <v-btn
        v-else
        icon="mdi-play"
        variant="text"
        @click="pageScroll(true)"
      />
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { secondsToMinutes } from '../composables/time'
import { useDisplay } from 'vuetify'
import { db } from '@/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export default defineComponent({
  name: 'SongDetails',

  setup() {
    const { mobile } = useDisplay()

    return { mobile }
  },

  mounted () {
    const titleElem = document.getElementById('title')
    titleElem && titleElem.scrollIntoView()
  },

  props: {
    song: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      // songDetails: null as any
      snack: true,
      scrolling: false,
      speed: this.song.scroll_speed || 5,
      increment: 1
    }
  },

  methods: {
    convertSeconds: function (value: number): string {
      return secondsToMinutes(value)
    },

    pageScroll: function (value) {
      this.scrolling = value
        setInterval(() => {
          if (this.scrolling) {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
              this.scrolling = false
            } else {
              window.scrollBy({
                top: this.speed,
                behavior: 'smooth'
              })
            }
          }
        }, 100);
    },

    adjustSpeed: async function(increment) {
      if ((increment < 0 && this.speed > Math.abs(increment)) || increment > 0) {
        this.speed += increment
        await updateDoc(doc(db, 'songs', this.song.doc_id), {
          scroll_speed: this.speed
        })
      }
    }
  }
})
</script>

<style lang="scss">
.details {
  max-width: 95%;
}

.tab {
  max-width: 100%;
  overflow-x: auto;

  &.mobile {
    font-size: small;
  }
}

.v-snackbar__content {
  padding: 0;
}
</style>