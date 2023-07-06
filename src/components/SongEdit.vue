<template>
  <div v-if="!loading" class="song-edit">
    <v-row justify="center">
      <v-btn @click="cancelEdit" color="secondary" class="mr-2">Cancel</v-btn>
      <v-btn @click="saveSong" color="primary">Save</v-btn>
    </v-row>
    <v-form v-model="valid">
      <v-row>
        <v-col>
          <v-text-field v-model="title" variant="outlined" density="compact" label="Title" />
          <v-text-field v-model="artist" variant="outlined" density="compact" label="Artist" />
          <v-text-field v-model="capo" variant="outlined" density="compact" label="Capo" />
        </v-col>
        <v-col>
          <v-text-field v-model="key" variant="outlined" density="compact" label="Key" />
          <v-text-field v-model="tuning" variant="outlined" density="compact" label="Tuning" />
          <v-text-field v-model="duration" variant="outlined" density="compact" label="Duration" />
        </v-col>
      </v-row>
      <v-textarea v-model="tab" variant="outlined" label="Tab" auto-grow class="tab" @blur="tabInput" />
    </v-form>
    <v-row justify="center">
      <v-btn @click="cancelEdit" color="secondary" class="mr-2">Cancel</v-btn>
      <v-btn @click="saveSong" color="primary">Save</v-btn>
      <v-btn v-if="song" @click="confirmDelete = true" color="error" class="ml-2">Delete</v-btn>
    </v-row>

    <v-dialog
      v-model="confirmDelete"
      width="auto"
    >
      <v-card>
        <v-card-title><div class="text-error">Delete Song</div></v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ title }}" by {{ artist }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn secondary="primary" variant="elevated" @click="confirmDelete = false">No</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteSong">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else>
    <v-row justify="center">
      <v-progress-circular indeterminate />
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { secondsToMinutes, minutesToSeconds } from '../composables/time'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export default defineComponent({
  name: 'SongDetails',

  props: {
    song: {
      type: Object as any,
      default: null
    }
  },

  data() {
    return {
      loading: true,
      valid: false,
      title: '',
      artist: '',
      capo: '',
      tab: '',
      key: '',
      tuning: '',
      duration: '',
      confirmDelete: false
    }
  },

  created() {
    if (this.song) {
      this.title = this.song.title
      this.artist = this.song.artist
      this.capo = this.song.capo || ''
      this.tab = this.song.tab || ''
      this.key = this.song.key || ''
      this.tuning = this.song.tuning || ''
      this.duration = this.convertSeconds(this.song.duration_seconds)
    }
    this.loading = false
  },

  methods: {
    convertSeconds: function (value: number): string {
      return secondsToMinutes(value)
    },

    cancelEdit: function () {
      this.$emit('done')
    },

    saveSong: async function() {
      this.loading = true
      const data = {
        title: this.title,
        artist: this.artist,
        capo: this.capo === '' ? null : this.capo,
        tab: this.tab,
        key: this.key,
        tuning: this.tuning,
        duration_seconds: minutesToSeconds(this.duration)
      }
      if (this.song) {
        await updateDoc(doc(db, 'songs', this.song.doc_id), data).then(() => {
          this.loading = false
          this.$emit('done')
        })
      } else {
        const newDoc = await addDoc(collection(db, 'songs'), data)
        this.$router.push(`/song/${newDoc.id}`)
      }
    },

    deleteSong: async function() {
      // TODO: Remove from any sets
      await deleteDoc(doc(db, 'songs', this.song.doc_id)).then(() => {
        this.$router.push('/')
      }).then(() => this.confirmDelete = false)
    },

    tabInput() {
      this.tab = this.tab && this.tab.replace(/^\n/gm, '') || ''
    }
  }
})
</script>

<style lang="scss">
.song-edit {
  width: 100%;
}

.tab textarea {
  font-family: monospace;
  white-space:pre;
}
</style>