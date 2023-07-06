export default {
  state: () => ({
    sets: []
  }),

  getters: {
    findSet: (state) => (id: string)  => {
      return state.sets.find((set: any) => set.doc_id === id)
    }
  }
}