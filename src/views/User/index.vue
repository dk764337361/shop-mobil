<!--
 * @author: chendaokuan
 * @since: 2022-05-17
 * index.vue
-->
<template>
  <div class="container">
    <!-- 头部 -->
    <div class="header">
      <img
        class="logo"
        :src="userAvatar"
        alt=""
      >
      <div class="user-info">
        <div
          class="user-name"
          v-text="usrename"
        />
        <div
          class="user-id"
          v-text="userID"
        />
      </div>
      <van-icon name="setting-o" />
    </div>
    <!-- 主体菜单区域 -->
    <div class="main">
      <van-cell-group
        inset
        class="user-detail"
      >
        <van-cell>
          <van-grid :border="false">
            <van-grid-item :text="collectCount">
              <template #icon>
                收藏
              </template>
            </van-grid-item>
            <van-grid-item :text="integral">
              <template #icon>
                积分
              </template>
            </van-grid-item>
            <van-grid-item :text="couponCount">
              <template #icon>
                优惠券
              </template>
            </van-grid-item>
            <van-grid-item :text="now_money">
              <template #icon>
                余额
              </template>
            </van-grid-item>
          </van-grid>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset>
        <van-cell
          title="订单中心"
          value="查看全部"
          is-link
          to="/order"
        />
        <van-grid
          column-num="5"
          :border="false"
        >
          <van-grid-item
            icon="bill-o"
            text="待付款"
          />
          <van-grid-item
            icon="tosend"
            text="待发货"
          />
          <van-grid-item
            icon="logistics"
            text="待收货"
          />
          <van-grid-item
            icon="comment-o"
            text="待评价"
          />
          <van-grid-item
            icon="sign"
            text="已完成"
          />
        </van-grid>
      </van-cell-group>
    </div>
    <!-- 公共底部 -->
    <layout-footer />
  </div>
</template>

<script setup>
import {
  Cell as VanCell,
  CellGroup as VanCellGroup,
  Grid as VanGrid,
  GridItem as VanGridItem
} from 'vant'

import LayoutFooter from '@/components/LayoutFooter.vue'
import { ref } from 'vue'

import { getUserInfo } from '@/api/user'
import { computed } from '@vue/reactivity'

// 数据处理
const userData = ref({})
// 用户头像
const userAvatar = computed(() => userData.value?.switchUserInfo?.[0].avatar || 'https://pic1.zhimg.com/80/v2-62737246ecd625f0a78377432f475060_1440w.jpg')
// 用户昵称
const usrename = computed(() => userData.value?.nickname || '')
// 用户ID
const userID = computed(() => 'ID:' + (userData.value?.uid || ''))
// 用户详情信息
const collectCount = computed(() => userData.value?.collectCount?.toString() || '')
const integral = computed(() => userData.value?.integral?.toString() || '')
const couponCount = computed(() => userData.value?.couponCount?.toString() || '')
const now_money = computed(() => userData.value?.now_money?.toString() || '')

// 初始化用户数据
const initUserInfo = async () => {
  const { data } = await getUserInfo()
  console.log('用户数据:', data)

  if (data.status !== 200) { return }
  userData.value = data.data
}
initUserInfo()
</script>

<style lang="scss" scoped>
.container {
  height: 600px;
  padding: 15px 0;
  background: radial-gradient(circle at 50% -10%, #FBC546 72%, #F6F7F9 72%) #F6F7F9 0 -300px no-repeat;

  // 头部
  .header {
    padding: 0 15px 15px;
    display: flex;
    align-items: center;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;

      .user-name {
        font-size: 14px;
        font-weight: 700;
        padding-bottom: 10px;
      }

      .user-id {
        font-size: 10px;
      }
    }
  }

  // 主体
  .van-cell-group {
    margin-bottom: 10px;
  }

  // 用户账户信息卡片设置样式
  .user-detail {
    .van-cell {
      padding: 0;
      // 避免内容没有加载出来时出现短暂的塌陷
      min-height: 74px;
    }
  }
}
</style>
