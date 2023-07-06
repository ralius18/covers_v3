import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import SongView from '../views/SongView.vue'
import AddView from '../views/AddView.vue'
import SetsView from '../views/SetsView.vue'
import SetView from '../views/SetView.vue'
import AddSetView from '../views/AddSetView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    // component: import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
    component: LoginView
  },
  {
    path: '/song/:id',
    name: 'song',
    // component: import(/* webpackChunkName: "song" */ '../views/SongView.vue'),
    component: SongView
  },
  {
    path: '/add',
    name: 'add',
    // component: import(/* webpackChunkName: "add" */ '../views/AddView.vue'),
    component: AddView
  },
  {
    path: '/sets',
    name: 'sets',
    // component: import(/* webpackChunkName: "sets" */ '../views/SetsView.vue'),
    component: SetsView
  },
  {
    path: '/set/:id',
    name: 'set',
    // component: import(/* webpackChunkName: "set" */ '../views/SetView.vue'),
    component: SetView
  },
  {
    path: '/addset',
    name: 'addset',
    // component: import(/* webpackChunkName: "addset" */ '../views/AddSetView.vue'),
    component: AddSetView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
