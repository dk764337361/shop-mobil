<!--
 * @author: chendaokuan
 * @since: 2022-05-17
 * LayoutFooter.vue
-->
<template>
  <van-tabbar route>
    <van-tabbar-item
      icon="home-o"
      to="/"
    >
      首页
    </van-tabbar-item>
    <van-tabbar-item
      icon="apps-o"
      to="/category"
    >
      分类
    </van-tabbar-item>
    <van-tabbar-item
      icon="gift-o"
      to="/recommend"
    >
      推荐
    </van-tabbar-item>
    <van-tabbar-item
      icon="cart-o"
      to="/cart"
    >
      购物车
    </van-tabbar-item>
    <van-tabbar-item
      icon="user-o"
      to="/user"
    >
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import {
  Tabbar as VanTabbar,
  TabbarItem as VanTabbarItem
} from 'vant'
</script>

<style lang="scss" scoped></style>
