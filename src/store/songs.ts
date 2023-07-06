export default {
  state: () => ({
    songList: [],
    currentListPage: 1
  }),
  getters: {
    getSongs(state) {
      return state.songList
    },

    findSong: (state) => (id: string) => {
      return state.songList.find((song: any) => song.doc_id === id)
    },

    // findSongs: (state) => (ids: string[]) => {
    //   return state.songList.find((song: any) => ids.includes(song.doc_id))
    // }
  },
  mutations: {
    setSongs(state, songs) {
      state.songList = songs
    },
    setPage(state, page) {
      state.currentListPage = page
    }
  },
  actions: {
    fetchSongs(context, songs) {
      context.commit('setSongs', songs)
    }
  },
  strict: false
}