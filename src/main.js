import { createApp } from 'vue'
import App from './App.vue'
// 引入router
import router from './router'
import 'amfe-flexible'
import '@/styles/base.css'

// 引入Vuex
import store from './store'
// 全局引入Vant 组件库
// import Vant from 'vant'
// import 'vant/lib/index.css'

const app = createApp(App)
app.use(router)
app.use(store)
// app.use(Vant)

app.mount('#app')
