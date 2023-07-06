import { createStore } from 'vuex'
import songStore from './songs'
import userStore from './user'
import setsStore from './sets'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  modules: {
    songs: songStore,
    sets: setsStore,
    auth: userStore
  },
  plugins: [
    createPersistedState({
      paths: ['auth'],
      storage: window.localStorage,
    }),
  ]
})