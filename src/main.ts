import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { VueFire, VueFireAuth, VueFireFirestoreOptionsAPI } from 'vuefire'
import { firebaseApp } from './firebase'

loadFonts()

createApp(App)
  .use(store)
  .use(VueFire, {
    firebaseApp,
    modules: [
      VueFireAuth(),
      VueFireFirestoreOptionsAPI()
    ]
  })
  .use(router)
  .use(vuetify)
  .mount('#app')

router.beforeEach((to, from, next) => {
  if ((store as any).state.auth.user.loggedIn && to.path === '/login') {
    next()
  } else if (!(store as any).state.auth.user.loggedIn && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})