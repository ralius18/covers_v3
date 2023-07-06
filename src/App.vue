<template>
  <v-app>
    <v-main>
      <header-bar />
      <router-view @login="loadData"/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapActions, mapState, useStore } from 'vuex'
import HeaderBar from './components/HeaderBar.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { toRef } from 'vue'
import { useCollection } from 'vuefire'
import { songsRef, setsRef } from './firebase'

export default defineComponent({
  name: 'App',
  
  components: {
    HeaderBar
  },

  data () {
    return {
      //
    }
  },

  beforeCreate() {
    document.title = "Brad's Covers"

    const auth = getAuth();
    onAuthStateChanged(auth, (userDetails) => {
      this.fetchUser(userDetails)
      if (this.user.loggedIn && this.$route.path === '/login') {
        this.$router.replace('/')
        // this.loadData()
      } else if (!this.user.loggedIn && this.$route.path !== '/login') {
        this.$router.replace('/login')
        this.unloadData()
      }
    });
  },

  mounted () {
    if (this.user.loggedIn) {
      // this.loadData()
    } else {
      this.$router.replace('/login')
    }
  },

  computed: {
    ...mapState({
      user: (state: any) => state.auth.user
    })
  },

  methods: {
    ...mapActions([
      'fetchUser',
      'fetchSongs'
    ]),

    loadData: async function () {
      const songs = toRef(this.$store.state.songs, 'songList')
      useCollection(songsRef, { target: songs })

      const sets = toRef(this.$store.state.sets, 'sets')
      useCollection(setsRef, { target: sets })
    },

    unloadData: async function () {
      this.$store.dispatch('fetchSongs', [])
    }
  }
})
</script>

<style lang="scss">
@import 'assets/base.scss';

.v-main {
  width: 1200px;
  margin: 0 auto 64px;
  padding: 8px
}

.v-application {
  min-height: 100vh;
}

a {
  text-decoration: none;
  color: rgb(var(--v-theme-primary-lighten-2));

  &:hover {
    color: rgb(var(--v-theme-primary));
  }
}

.v-row {
  margin: unset;
}
</style>