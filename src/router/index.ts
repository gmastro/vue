import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Users from '../views/Users.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    }, {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue')
      component: _ => import('../views/AboutView.vue')
    }, {
      path: '/users',
      name: 'users',
      component: Users,
    }, {
      path: '/moufa',
      name: 'moufa',
      component: HomeView
    }, {
      path: '/moufa/foo',
      name: 'foo',
      component: HomeView
    }, {
      path: '/moufa/bar',
      name: 'bar',
      component: HomeView
    }, {
      path: '/moufa/bar/foo',
      name: 'barfoo',
      component: HomeView
    }
  ]
})

export default router
