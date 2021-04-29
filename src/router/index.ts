import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'
import Management from '../views/Management.vue'
import Teams from '../views/Teams.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/management',
    name: 'Home',
    component: Home
  },
  {
    path: '/management',
    name: 'Management',
    component: Management,
    children: [
      {
        path: '',
        redirect: 'teams' // Route par defaut
      },
      {
        path: 'teams',
        component: Teams
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
