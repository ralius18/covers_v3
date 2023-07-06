<template>
  <v-row v-if="songs.length === 0" justify="center">
    <v-progress-circular indeterminate />
  </v-row>
  
  <v-data-table
    v-else
    v-model="selection"
    :headers="headers"
    :items="songs"
    :sortBy="sortBy"
    :search="search"
    @update:page="updatePage"
    :page="currentListPage"
    :show-select="forSetList"
    multi-sort
  >
    <template #top>
      <v-row class="mb-2 d-flex" :class="mobile ? 'flex-column' : ''">
        <v-text-field
          v-model="search"
          class="search"
          label="Search"
          variant="outlined"
          density="compact"
          clearable
        />

        <v-spacer />

        <router-link to="/sets" v-if="!forSetList">
          <v-btn color="secondary" class="ma-1">Set Lists</v-btn>
        </router-link>
        <router-link to="/add" v-if="!forSetList">
          <v-btn color="primary" class="ma-1">Add Song</v-btn>
        </router-link>
      </v-row>
    </template>

    <template #item.title="{ item }">
      <router-link :to="`/song/${item.raw.doc_id}`">
        {{ item.raw.title }}
      </router-link>
      <div v-if="mobile">
        {{ item.raw.artist }}
      </div>
    </template>

    <template #item.has_tab="{ item }">
      <v-icon v-if="hasTab(item)" color="primary">mdi-check</v-icon>
    </template>

    <!-- <template #item.capo="{ item }">
      {{ parseInt(item.columns.capo) > -1 ? item.columns.capo : '' }}
    </template> -->

    <template #item.duration_seconds="{ item }">
      {{ convertSeconds(item.columns.duration_seconds) }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import { mapState } from 'vuex'
import { secondsToMinutes } from '../composables/time'
import { useDisplay } from 'vuetify'
import type { PropType } from 'vue'
import { useCollection } from 'vuefire'
import { songsRef, setsRef } from '@/firebase'

export default defineComponent({
  name: 'SongList',

  setup() {
    const { mobile } = useDisplay()

    return { mobile }
  },

  props: {
    forSetList: {
      type: Boolean,
      default: false
    },
    initSelection: {
      type: Array as PropType<Array<string>>,
      default: undefined
    }
  },

  data() {
    return {
      search: '',
      sortBy: [{ key: 'artist' }, { key: 'title' }],
      selection: this.initSelection
    }
  },

  created () {
    // if (this.user.loggedIn) {
    this.loadAll()
    // }
  },

  methods: {
    convertSeconds: function (value: number): string {
      return secondsToMinutes(value)
    },

    hasTab(item: any) {
      return item.raw.tab && item.raw.tab !== ''
    },

    updatePage(page: number) {
      this.$store.commit('setPage', page)
    },

    loadAll: function () {
      const songs = toRef(this.$store.state.songs, 'songList')
      useCollection(songsRef, { target: songs })
    }
  },

  computed: {
    ...mapState({
      songs: (state: any) => state.songs.songList,
      currentListPage: (state: any) => state.songs.currentListPage,
      user: (state: any) => state.auth.user
      // TODO: Save sort state & search in store?
    }),
    listPage (): number {
      return this.currentListPage
    },
    headers () {
      let arr = [{ title: "Title", key: "title" }] as any
      if (this.mobile) {
        arr.push(...[
          { title: "Tab", key: "has_tab", width: 70 }
        ])
      } else {
        arr.push(...[
          { title: "Artist", key: "artist" },
          { title: "Tab", key: "has_tab", width: 70 },
          { title: "Genre", key: "genre", width: 130 },
          { title: "Capo", key: "capo", width: 70 },
          { title: "Key", key: "song_key", width: 70 },
          { title: "Tuning", key: "tuning", width: 120 },
          { title: "Duration", key: "duration_seconds", width: 100 }
        ])
      }
      return arr
    }
  }
})
</script>

<style lang="scss">
th, td {
  background: unset !important;
}
</style>