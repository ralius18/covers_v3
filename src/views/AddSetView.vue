<template>
  <v-form class="mb-4">
    <v-row>
      <v-col>
        <v-text-field v-model="location" variant="outlined" density="compact" label="Location" />
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
    <v-row justify="center">
        <v-btn @click="save" color="primary">Save</v-btn>
    </v-row>
  </v-form>

  <song-list for-set-list @update:modelValue="updateSelection">
  </song-list>
</template>

<script lang="ts">
import { db } from '@/firebase';
import { addDoc, collection, doc } from 'firebase/firestore';
import { defineComponent } from 'vue';
import SongList from '../components/SongList.vue';

export default defineComponent({
  name: 'AddSetView',

  components: { SongList },

  data () {
    return {
      location: '',
      menu: false,
      date: [new Date(Date.now())],
      selection: []
    }
  },

  computed: {
    dateFormatted (): string {
      return this.date[0].toLocaleString('en-NZ', { dateStyle: 'full' })
    }
  },

  methods: {
    save: async function () {
      const data = {
        location: this.location,
        date: this.date[0],
        songs: this.selection.map(s => {
          return doc(db, `/songs/${s}`)
        })
      }
      const newDoc = await addDoc(collection(db, 'setlists'), data)
      this.$router.push(`/set/${newDoc.id}`)
    },

    updateSelection: function (array) {
      this.selection = array
    }
  }
})
</script>

<style lang="scss">
.v-date-picker-header {
  display: none;
}
</style>