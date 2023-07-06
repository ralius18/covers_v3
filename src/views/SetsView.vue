<template>
  <v-row>
    <v-spacer />
    <router-link to="/addset">
      <v-btn color="primary">Add Set</v-btn>
    </router-link>
  </v-row>
  <sets-list />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SetsList from '../components/SetsList.vue'

export default defineComponent({
  name: 'SetsView',

  components: {
    SetsList
  }
})
</script>