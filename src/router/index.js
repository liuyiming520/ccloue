import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 前台页面
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Products from '@/views/Products.vue'
import News from '@/views/News.vue'
import Contact from '@/views/Contact.vue'

// 后台页面
import Login from '@/views/admin/Login.vue'
import AdminLayout from '@/views/admin/Layout.vue'
import Dashboard from '@/views/admin/Dashboard.vue'
import ContentManage from '@/views/admin/ContentManage.vue'
import ProductManage from '@/views/admin/ProductManage.vue'
import NewsManage from '@/views/admin/NewsManage.vue'
import UserManage from '@/views/admin/UserManage.vue'
import Analytics from '@/views/admin/Analytics.vue'

const routes = [
  // 前台路由
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/news',
    name: 'News',
    component: News
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  
  // 后台登录
  {
    path: '/admin/login',
    name: 'Login',
    component: Login
  },
  
  // 后台管理路由
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'content',
        name: 'ContentManage',
        component: ContentManage
      },
      {
        path: 'products',
        name: 'ProductManage',
        component: ProductManage
      },
      {
        path: 'news',
        name: 'NewsManage',
        component: NewsManage
      },
      {
        path: 'users',
        name: 'UserManage',
        component: UserManage
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: Analytics
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/admin/login')
  } else {
    next()
  }
})

export default router