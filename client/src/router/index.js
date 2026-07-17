import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    redirect: '/students',
    children: [
      {
        path: 'students',
        name: 'Students',
        component: () => import('../views/Students.vue'),
        meta: { title: '学生管理' }
      },
      {
        path: 'classes',
        name: 'Classes',
        component: () => import('../views/Classes.vue'),
        meta: { title: '班级管理' }
      },
      {
        path: 'majors',
        name: 'Majors',
        component: () => import('../views/Majors.vue'),
        meta: { title: '专业管理' }
      },
      {
        path: 'dormitories',
        name: 'Dormitories',
        component: () => import('../views/Dormitories.vue'),
        meta: { title: '宿舍管理' }
      },
      {
        path: 'menus',
        name: 'Menus',
        component: () => import('../views/Menus.vue'),
        meta: { title: '菜单管理' }
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('../views/System.vue'),
        meta: { title: '系统管理' }
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
  const userStore = useUserStore()
  if (to.path !== '/login' && !userStore.token) {
    next('/login')
  } else if (to.path === '/login' && userStore.token) {
    next('/')
  } else {
    next()
  }
})

export default router
