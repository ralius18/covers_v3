<template>
  <v-data-table
    :headers="headers"
    :items="sets"
    :sortBy="sort"
  >
    <template #item.location="{ item }">
      <router-link :to="`/set/${item.raw.doc_id}`">{{ item.raw.location }}</router-link>
    </template>

    <template #item.date="{ item }">
      <router-link :to="`/set/${item.raw.doc_id}`">{{ getDate(item) }}</router-link>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import { mapState } from 'vuex'
import { useCollection } from 'vuefire'

import { setsRef } from '@/firebase'
import { epochToDate } from '../composables/time'

export default defineComponent({
  name: 'SetsList',

  data () {
    return {
      headers: [
        { title: 'Location', key: 'location' },
        { title: 'Date', key: 'date' }
      ],
      sort: [{
        key: 'date',
        order: 'asc'
      }]
    }
  },

  created () {
    this.loadSets()
  },

  computed: {
    ...mapState({
      sets: (state: any) => state.sets.sets
    })
  },

  methods: {
    getDate: function (item) {
      return epochToDate(item.raw.date.seconds * 1000).toLocaleDateString('en-NZ', { dateStyle: 'full' })
    },

    loadSets: function () {
      const sets = toRef(this.$store.state.sets, 'sets')
      useCollection(setsRef, { target: sets })
    }
  }
});
</script>