<template>
  <header>
    <v-row>
      <h1 class="text-primary-lighten-1">
        <router-link to="/">Brad's Covers</router-link>
      </h1>
      <v-spacer />
      <v-btn v-if="user.loggedIn" @click="logOut">Log Out</v-btn>
      <router-link v-else to="/login">
        <v-btn>Log In</v-btn>
      </router-link>
    </v-row>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import {getAuth } from 'firebase/auth';

export default defineComponent({
  name: "HeaderBar",

  methods: {
    logOut() {
      const auth = getAuth()
      auth.signOut()
    }
  },
  
  computed: {
    ...mapState({
      user: (state: any) => state.auth.user
    })
  }
})
</script>

<style scoped type="scss">
header {
  padding: 64px 0 32px;
}
</style>
