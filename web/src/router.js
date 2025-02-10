import Vue from 'vue'
import VueRouter from 'vue-router'
import WorkbenchePage from '@/pages/Workbenche/Index'
import WorkbencheHomePage from '@/pages/Workbenche/views/Home'
import WorkbencheEditPage from '@/pages/Workbenche/views/Edit'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/workbenche'
  },
  {
    path: '/workbenche',
    name: 'Workbenche',
    component: WorkbenchePage,
    redirect: '/workbenche/home',
    children: [
      {
        path: 'home',
        name: 'WorkbencheHome',
        component: WorkbencheHomePage
      },
      {
        path: 'edit/:id',
        name: 'WorkbencheEdit',
        component: WorkbencheEditPage
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
