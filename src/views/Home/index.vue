<!--
 * index.vue
-->
<template>
  <!-- 顶部导航 -->
  <home-nav />
  <!-- 主体区域 -->
  <home-main class="home-main" />
  <!-- 公共底部 -->
  <layout-footer />
</template>

<script setup>
import HomeNav from './componeents/HomeNav.vue'
import HomeMain from './componeents/HomeMain.vue'
import LayoutFooter from '@/components/LayoutFooter.vue'
</script>

<style lang="scss" scoped>
// 增加fixed 样式的权重
.vant-tabbar{
  position: fixed !important;
}
.home-main{
  background-color: #f7f7f7;
  //滚动条在内部区域滚动
  padding: 50px 0;
}
</style>
