export default {
  state: () => ({
    user: {
      loggedIn: false,
      details: null as null | object
    }
  }),
  mutations: {
    setLoggedIn(state, value) {
      state.user.loggedIn = value
    },
    setUser(state, userDetails) {
      state.user.details = userDetails
    }
  },
  actions: {
    fetchUser(context, userDetails) {
      context.commit('setLoggedIn', userDetails !== null)
      if (userDetails) {
        context.commit('setUser', userDetails)
      } else {
        context.commit('setUser', null)
      }
    }
  }
}