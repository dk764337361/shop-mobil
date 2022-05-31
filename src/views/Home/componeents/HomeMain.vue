<!--
 * HomeMain.vue
-->
<template>
  <van-pull-refresh
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <div class="home-main">
      <!-- 区域一：轮播图 -->
      <van-swipe
        class="my-swipe"
        :autoplay="3000"
        indicator-color="white"
      >
        <van-swipe-item
          v-for="(itme, index) in swipeData"
          :key="index"
        >
          <img :src="itme.img">
        </van-swipe-item>
      </van-swipe>
      <!-- 区域二：菜单列表 -->
      <van-grid icon-size="40">
        <van-grid-item
          v-for="(item, index) in menuData"
          :key="index"
          :icon="item.img"
          :text="item.info[0].value"
        />
      </van-grid>
      <!-- 区域三：公告栏 -->
      <van-notice-bar
        left-icon="fire-o"
        :scrollable="false"
      >
        <span>热点资讯公告：</span>
        <van-swipe
          vertical
          class="notice-swipe"
          :autoplay="3000"
          :show-indicators="false"
        >
          <van-swipe-item
            v-for="(item,index) in newsData"
            :key="index"
            v-text="item.chiild[0].val"
          />
        </van-swipe>
      </van-notice-bar>
      <!-- 区域四：商品列表 -->
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="initProductsData"
      >
        <product-list :products-data="productsData" />
      </van-list>
    </div>
  </van-pull-refresh>
</template>

<script setup>
import {
  PullRefresh as VanPullRefresh,
  List as VanList,
  NoticeBar as VanNoticeBar,
  Swipe as VanSwipe,
  SwipeItem as VanSwipeItem,
  Grid as VanGrid,
  GridItem as VanGridItem
} from 'vant'

import ProductList from '@/components/ProductList.vue'
import { ref, computed } from 'vue'

import { getDefaultData } from '@/api/index'
import { getProductsData } from '@/api/product'

// --------------首页功能--------------------
// 存储首页的所有数据（声明响应式数据）
const indexData = ref({})

// 封装首页数据初始化功能
const initIndexData = async () => {
  const { data } = await getDefaultData()
  // console.log(data)
  if (data.status !== 200) return
  indexData.value = data.data

  // 加载完毕，将下拉刷新状态更改为完成
  refreshing.value = false
}
initIndexData()

// 通过计算属性保存需要使用的数据
// 1. 轮播图数据
const swipeData = computed(() => indexData.value.swiperBg?.default.imgList.list)
// 2. 菜单列表数据
const menuData = computed(() => indexData.value.menus?.default.imgList.list)
// 3. 公告栏数据
const newsData = computed(() => indexData.value.news?.default.newList.list)

// --------------商品功能--------------------
const productsData = ref([])
// 引入van-list组件的JS参数
const loading = ref(false)
const finished = ref(false)

let page = 1
// eslint-disable-next-line prefer-const
let limit = 4
// 请求指定页的商品数据
const initProductsData = async () => {
  const { data } = await getProductsData({
    limit,
    page
  })
  if (data.status !== 200) return
  // 请求每次得到的是新一段数据，需要将新数据添加到productsData中
  productsData.value.push(...data.data)

  // 1. 将本次加载状态更改为完成
  loading.value = false
  // console.log(data.data)
  // console.log(data.data.length)

  // 2. 判断是否已经加载完全部数据
  // - 每次加载加载的数据长度为4，最后一次到底了，数据为长度0。
  if (data.data.length < limit) {
    finished.value = true
    return
  }

  // 变更页数，准备下次数据请求
  page++
}
// 使用List组件后，会根据触底情况加载首屏一级后续数据
// initProductsData()

// -----------------下拉刷新功能-----------------
const refreshing = ref(false)

const onRefresh = () => {
  // 1. 清空列表数据
  indexData.value = {}
  productsData.value = []
  // 2. 页码还原
  page = 1
  // 3. 触底加载的状态还原
  loading.value = false
  finished.value = false
  // 4. 重新发送请求
  initIndexData()
  initProductsData()
}
</script>

<style lang="scss" scoped>
.home-main {

  // 区域一：轮播图
  .my-swipe img {
    width: 100%;
  }
}

// 区域三：公告区域
:deep(.van-notice-bar__content) {
  display: flex;
  align-items: center;
}

.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>
