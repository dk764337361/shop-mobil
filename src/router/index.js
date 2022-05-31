import {
  createRouter,
  createWebHashHistory
  //  createWebHistory
} from 'vue-router'

// 引入Vuex中的组合API：useStore
import store from '@/store'

// 路由规则配置

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/index.vue')
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/Category/index.vue')
  },
  {
    path: '/category-detail/:categoryId',
    name: 'category-detail',
    component: () => import('@/views/CategoryDetail/index.vue'),
    props: true
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('@/views/Address/index.vue'),
    props: true,
    meta: { requireAuth: true }
  },
  {
    path: '/order-confirm',
    name: 'order-confirm',
    component: () => import('@/views/OrderConfirm/index.vue'),
    props: true,
    meta: { requireAuth: true }
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/Order/index.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/order-detail/:orderId',
    name: 'order-detail',
    component: () => import('@/views/OrderDetail/index.vue'),
    props: true,
    meta: { requireAuth: true }
  },
  {
    path: '/pay',
    name: 'pay',
    component: () => import('@/views/Pay/index.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/product/:productId',
    name: 'product',
    component: () => import('@/views/Product/index.vue'),
    props: true
  },
  {
    path: '/comment/:productId',
    name: 'comment',
    component: () => import('@/views/Comment/index.vue'),
    props: true
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import('@/views/Recommend/index.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart/index.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search/index.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User/index.vue'),
    meta: { requireAuth: true }
  },
  {
    // 注意：与webpack不同，vite不能以*为标识了，需要pathMatch进行处理
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound/index.vue')
  }
]

// 创建router 实例
const router = createRouter({
// history: createWebHistory() // History 模式
  history: createWebHashHistory(), // hash 模式
  routes
})

// 通过导航守卫检测登陆状态
// to （目标路由）
router.beforeEach(to => {
  // 1.对无需登陆的页面进行放行
  if (!to.meta.requireAuth) {
    return true
  }
  // 校验登陆状态
  // 情况1：如果Token没有就做登录页跳转
  // 情况2：用户登陆过，登陆完毕后刷新页面了（此时vuex数据被清除了，但本地token没有清除）。
  //  然后用户并没有访问需要登陆的页面，此时不能从vuex里读取数据，且uesr里没有值。
  if (!store.state.user.token || !window.localStorage.getItem('USER_TOKEN')) {
    // 2. 如果Vuex或本地存储里都没有数据，跳转登陆页
    // return 是to的返回值
    return {
      name: 'login',
      // 3.通过重定向，跳转到登陆访问前的页面
      //  - 比如开始点击购物车页，但此时没有登陆，登陆成功后，跳转回购物车页
      query: {
        redirect: to.fullPath
      }
    }
  }
})

export default router
