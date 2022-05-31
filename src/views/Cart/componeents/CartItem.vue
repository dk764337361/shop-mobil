<!--
src\views\Cart\componeents\CartItem.vue
-->
<template>
  <div class="cart-item">
    <!-- 状态选框 -->
    <van-checkbox
      checked-color="#ee0a24"
      v-model="itemChecked"
    />
    <!-- 右侧点击跳转 -->
    <div
      class="link"
      @click="handleRouter"
    >
      <img
        class="logo"
        :src="itemData.image"
        alt=""
      >
      <div class="info">
        <p
          class="title"
          v-text="itemData.title"
        />
        <p class="detail">
          <span class="price">{{ itemData.price }}</span>
          <van-stepper
            v-model="itemCount"
            :max="itemData.stock"
            button-size="26px"
            @click="$event.stopPropagation()"
            @click.stop
          />
        </p>
        <p class="del">
          <span>删除</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Stepper as VanStepper,
  Checkbox as VanCheckbox
} from 'vant'

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// 接收父组件传递的数据
const { itemData } = defineProps({
  itemData: {
    type: Object,
    require: true
  }
})
// 通过计算属性，来分别处理v-model 的获取与设置操作
const store = useStore()
const itemChecked = computed({
  get: () => itemData.checked,
  set: newChecked => {
    // 通过vuex的手段进行状态更新
    // console.log(newChecked)
    // store.commit('checkedChange', {
    store.commit('cart/checkedChange', {
      checked: newChecked,
      id: itemData.id
    })
  }
})

// 个数变化处理
const itemCount = computed({
  get: () => {
    return itemData.count
  },
  set: (newCount) => {
    // 通过action 进行处理
    // commit调用mutations，dispatch调用actions
    // store.dispatch('countChange', {
    store.dispatch('cart/countChange', {
      count: newCount,
      id: itemData.id
    })
  }
})

// 点击商品跳转
const router = useRouter()
const handleRouter = () => {
  router.push({
    name: 'product',
    params: {
      productId: itemData.product_id
    }
  })
}
</script>

<style lang="scss" scoped>
.cart-item {
  height: 90px;
  padding: 10px 20px;
  display: flex;
  // 下面的样式用于设置多个商品间的分割线
  background-color: #fff;
  margin-bottom: 1px;

  .link {
    width: 100%;
    display: flex;

    img {
      width: 88px;
      height: 88px;
      align-self: center;
    }

    .info {
      font-size: 14px;

      .title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
        margin: 5px 0 15px;
      }

      .detail {
        margin-bottom: 10px;

        .price {
          font-size: 16px;
          color: #F2270C;
        }

        .van-stepper {
          float: right;
        }
      }

      .del {
        direction: rtl;
      }
    }
  }
}
</style>
