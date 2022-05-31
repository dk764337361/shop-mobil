<!--
 * @author: chendaokuan
 * @since: 2022-05-17
 * src\views\Cart\index.vue
-->
<template>
  <!-- 顶部导航 -->
  <van-nav-bar
    title="购物车"
    left-arrow
  />
  <!-- 购物车列表 -->
  <div
    class="cart-list"
    v-if="hasItem"
  >
    <cart-item
      v-for="item in cartList"
      :key="item.id"
      :item-data="item"
    />
  </div>
  <!-- 当购物车为空展示 -->
  <van-empty
    description="购物车还没有商品噢"
    v-else
  />

  <!-- 总计区域 -->
  <!-- <van-submit-bar
    :price="store.getters.totalPrice*100"
    button-text="去结算"
  > -->
  <van-submit-bar
    :price="store.getters['cart/totalPrice']*100"
    button-text="去结算"
    @submit="handleClick"
  >
    <van-checkbox v-model="checkedAll">
      全选
    </van-checkbox>
  </van-submit-bar>

  <!-- 公共底部 -->
  <layout-footer />
</template>

<script setup>
import {
  Checkbox as VanCheckbox,
  SubmitBar as VanSubmitBar,
  Empty as VanEmpty,
  NavBar as VanNavBar
} from 'vant'

import LayoutFooter from '@/components/LayoutFooter.vue'
import { nextTick, ref, computed } from 'vue'
import CartItem from './componeents/CartItem.vue'
// 引入接口
import { getCartList } from '@/api/cart'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
const store = useStore()

// ------1. 列表数据处理------
// 存储数据
// const cartList = computed(() => store.state.cartList)
const cartList = computed(() => store.state.cart.cartList)
// 检测购物车是否为空
const hasItem = computed(() => cartList.value.length !== 0)

// 初始化购物车数据
const initCartList = async () => {
  const { data } = await getCartList()
  console.log(data)
  if (data.status !== 200) return

  // 请求到新数据后，将原始数据清空，随后更新为新数据
  // store.commit('clear')
  store.commit('cart/clear')

  await nextTick()

  // 数据处理，将处理后需要的数据通过vuex进行状态管理
  data.data.valid.forEach(item => {
    // 提交给store里的addToCart() 的数据必须复合要求
    // (sku的id,checked,count,title,price,stock,productId)
    // store.commit('addToCart', {
    store.commit('cart/addToCart', {
      id: item.id,
      checked: true,
      count: item.cart_num,
      image: item.productInfo.image,
      title: item.productInfo.store_name,
      price: item.truePrice,
      stock: item.trueStock,
      product_id: item.product_id
    })
  })
}
initCartList()

// const checkedAll = ref(true)
// -------2. 全选处理---------
const checkedAll = computed({
  // get: () => store.getters.checkedAll,
  get: () => store.getters['cart/checkedAll'],
  set: (newStatus) => {
    // store.commit('changeAll', { checked: newStatus })
    store.commit('cart/changeAll', { checked: newStatus })
  }
})

// ------3. 跳转--------
const router = useRouter()
const handleClick = () => {
  router.push({
    name: 'order-confirm',
    // cartId 指的是要结算的所有sku的集合，以逗号连接后传递即可
    params: {
      cartId: store.getters['cart/checkedItems'].map(item => item.id).toString()
    }
  })
}
</script>
<style lang="scss" scoped>
// 导航区域
.van-nav-bar{
  position: fixed !important;
  width: 100%;
  top:0;
}
// 列表区域
.cart-list{
  // 为了留出顶部和底部导航等区域的位置
  margin: 50px 0 100%;
  background-color: #F2F2F2;
}

// 提交总计区域
.van-submit-bar {
  bottom: 48px;
}
</style>
