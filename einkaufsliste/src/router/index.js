import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GroceryListView from "@/views/GroceryListView";

let AboutView;
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },

  {
    path: '/grocerylistview',
    name: 'grocerylistview',
    component: GroceryListView

  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
