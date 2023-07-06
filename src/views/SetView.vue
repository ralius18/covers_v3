<template>
  <div v-if="set || saving">
    <div v-if="!editing">
      <v-row>
        <v-col class="text-h5">{{ set.location }}</v-col>
        <v-col>Total Duration - {{ convertSeconds(totalDuration) }}</v-col>
      </v-row>
      <v-row class="text-h6">
        <v-col>{{ getDateString(set.date) }}</v-col>
      </v-row>

      <v-table class="mb-4" v-if="set.songs && !editing">
        <thead>
          <tr>
            <th>Title</th>
            <th v-if="!mobile">Artist</th>
            <th>Capo</th>
            <th>Tuning</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(song, index) in set.songs" :key="index">
            <td>
              <router-link :to="`/song/${song.doc_id}`">
                {{ song.title }}
              </router-link>
              <div v-if="mobile">{{ song.artist }}</div>
            </td>
            <td v-if="!mobile">{{ song.artist }}</td>
            <td>{{ song.capo }}</td>
            <td>{{ song.tuning }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-row justify="center">
        <v-btn color="primary" @click="editing = !editing">Edit</v-btn>
      </v-row>
    </div>
    
    <div v-else>
      <v-row justify="center">
        <v-row>
          <v-col>
            <v-text-field v-model="location" variant="outlined" density="compact" label="Location" />
          </v-col>
          <v-col>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="dateFormatted"
                  label="Date"
                  variant="outlined"
                  density="compact"
                  readonly
                  v-bind="props"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                title=""
                @click:save="menu = false"
                @click:cancel="menu = false"/>
            </v-menu>
          </v-col>
        </v-row>
        <v-divider color="primary" class="border-opacity-50 pb-4" />
        <song-list for-set-list @update:modelValue="updateSelection" :initSelection="selectedIds"></song-list>
        <v-row class="mt-4" justify="center">
          <v-btn v-if="set" @click="confirmDelete = true" color="error" class="mr-2">Delete</v-btn>
          <v-btn color="secondary" @click="cancel" class="mr-2">Cancel</v-btn>
          <v-btn color="primary" @click="save" :loading="saving">Save</v-btn>
        </v-row>
      </v-row>
    </div>

    <v-dialog
      v-model="confirmDelete"
      width="auto"
    >
      <v-card>
        <v-card-title><div class="text-error">Delete Set</div></v-card-title>
        <v-card-text>
          Are you sure you want to delete this set?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn secondary="primary" variant="elevated" @click="confirmDelete = false">No</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteSet">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <v-row v-else justify="center">
    <v-progress-circular indeterminate />
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useDisplay } from 'vuetify'
import { collection, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { secondsToMinutes } from '../composables/time';
import { useDocument } from 'vuefire'

import { epochToDate } from '../composables/time'
import SongList from '../components/SongList.vue';
import { db } from '@/firebase';

// TODO: Ordering
// TODO: Play set
export default defineComponent({
  name: 'SetView',

  components: { SongList },

  setup() {
    const { mobile } = useDisplay()

    return { mobile }
  },

  data () {
    return {
      editing: false,
      menu: false,
      location: '',
      date: [new Date(Date.now())],
      selection: [],
      saving: false,
      confirmDelete: false,
      set: null as any
    }
  },

  created () {
    // TODO: Use store for current set
    const docId = this.$route.params.id as string
    const storeSet = this.$store.getters.findSet(this.$route.params.id)
    if (storeSet) {
      this.set = storeSet
    } else {
      this.set = useDocument(doc(collection(db, 'setlists'), docId))
    }
  },

  computed: {

    totalDuration (): any {
      return this.set.songs && this.set.songs.reduce((partialSum, song) => partialSum + (Number.isInteger(song.duration_seconds) ? song.duration_seconds : 0), 0)
    },

    selectedIds (): any {
      return this.set.songs && this.set.songs.map(s => s.doc_id)
    },

    dateFormatted(): string {
      return this.date[0].toLocaleString('en-NZ', { dateStyle: 'full' })
    }
  },

  methods: {
    convertSeconds: function (value: number): string {
      return secondsToMinutes(value)
    },

    getDateString: function (date) {
      return this.getDate(date).toLocaleDateString('en-NZ', { dateStyle: 'full' })
    },

    getDate: function (date) {
      return date && epochToDate(date.seconds * 1000)
    },

    updateSelection: function (array) {
      this.selection = array
    },

    save: async function () {
      this.saving = true
      const docs = this.selection.map(s => {
        return doc(db, `/songs/${s}`)
      })
      await updateDoc(doc(db, 'setlists', this.set.doc_id), {
        location: this.location,
        date: this.date[0],
        songs: docs
      }).then(() => {
        this.editing = false
        this.saving = false
      })
    },

    cancel: function () {
      this.setData(this.set)
      this.editing = false
    },

    deleteSet: async function () {
      await deleteDoc(doc(db, 'setlists', this.set.doc_id)).then(() => {
        this.$router.push('/sets')
      }).then(() => this.confirmDelete = false)
    },

    setData: function (set) {
      document.title = `${set.location} - Brad's Covers`
      this.selection = set.songs.map(s => s.doc_id)
      this.location = set.location
      this.date[0] = this.getDate(set.date)
    }
  },

  watch: {
    set(value) {
      if (this.set) {
        this.setData(this.set)
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
</style>