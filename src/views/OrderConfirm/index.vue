<!--
 * @author: chendaokuan
 * @since: 2022-05-28
 * Path: src\views\OrderConfirm\index.vue
-->
<template>
  <!-- 导航 -->
  <van-nav-bar
    title="订单确认页"
    left-text="返回"
    left-arrow
  />
  <!-- 主体内容 -->
  <div class="container">
    <!-- 1. 地址区域 -->
    <div
      class="address-card"
      @click="triggerPopup"
    >
      <p class="info">
        <span
          class="username"
          v-text="currentAddress.name"
        />
        <span v-text="currentAddress.tel" />
      </p>
      <p class="detail">
        <span
          class="default"
          v-if="currentAddress.isDefault"
        >[默认]</span>
        <span v-text="currentAddress.address" />
      </p>
    </div>
    <!-- 2. 地址弹出层 -->
    <van-popup
      v-model:show="popupStatus"
      position="bottom"
    >
      <van-address-list
        v-model="chosenAddressId"
        :list="addresslist"
        default-tag-text="默认"
        @click-item="chosenAddress"
        @add="onAdd"
        @edit="onEdit"
      >
        <template
          #top
          v-if="isEmpty"
        >
          <van-empty description="还没有地址噢" />
        </template>
      </van-address-list>
    </van-popup>
    <!-- 3. 商品列表  -->
    <div class="product-list">
      <!-- 标题区域 -->
      <van-cell-group>
        <van-cell :title="cartItemCount" />
      </van-cell-group>
      <!-- 内容区域 -->
      <van-cell-group>
        <!-- 单个商品 -->
        <van-cell
          class="product"
          v-for="item in cartInfo"
          :key="item.id"
        >
          <img
            :src="item.productInfo.image"
            alt=""
          >
          <div class="info">
            <p
              class="title"
              v-text="item.productInfo.store_name"
            />
            <p class="price">
              {{ item.truePrice }}
            </p>
          </div>
          <span class="count">X{{ item.cart_num }}</span>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
  <!-- 提交订单区域 -->
  <van-submit-bar
    :price="totalPrice"
    label="订单总结："
    button-text="立即付款"
    @submit="showPayPanel = true"
  />
  <!-- 弹出付款区域 -->
  <van-action-sheet
    v-model:show="showPayPanel"
    title="请选择支付方式"
    cancel-text="取消"
    close-on-click-action
  >
    <!-- 付款列表区域 -->
    <template #default>
      <van-radio-group v-model="paymentMethod">
        <van-cell-group>
          <!-- 余额支付 -->
          <van-cell
            clickable
            title="微信支付"
            label="微信快捷支付"
            @click="paymentMethod = 'wechat'"
            size="large"
            center
          >
            <template #icon>
              <van-icon
                name="http://www.lgstatic.com/lg-app-fed/pay/images/wechat_b787e2f4.png"
                size="30"
                :style="{ marginRight: '12px' }"
              />
            </template>
            <template #right-icon>
              <van-radio
                name="wechat"
                checked-color="#ee0a24"
              />
            </template>
          </van-cell>
          <!-- 支付宝 -->
          <van-cell
            clickable
            title="支付宝"
            label="支付宝快捷支付"
            @click="paymentMethod = 'alipay'"
            size="large"
            center
          >
            <template #icon>
              <van-icon
                name="http://www.lgstatic.com/lg-app-fed/pay/images/ali_ed78fdae.png"
                size="30"
                :style="{ marginRight: '12px' }"
              />
            </template>
            <template #right-icon>
              <van-radio
                name="alipay"
                checked-color="#ee0a24"
              />
            </template>
          </van-cell>
          <!-- 余额支付 -->
          <van-cell
            clickable
            title="余额支付"
            :label="`可用余额为：${ yue }元`"
            @click="paymentMethod = 'yue'"
            size="large"
            center
          >
            <template #icon>
              <van-icon
                name="gold-coin"
                color="#FF9900"
                size="30"
                :style="{ marginRight: '12px' }"
              />
            </template>
            <template #right-icon>
              <van-radio
                name="yue"
                checked-color="#ee0a24"
              />
            </template>
          </van-cell>
          <van-cell>
            <van-button
              round
              type="danger"
              block
              @click="handlePay"
            >
              去支付
            </van-button>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </template>
  </van-action-sheet>
</template>

<script setup>
import {
  NavBar as VanNavBar,
  Popup as VanPopup,
  Radio as VanRadio,
  RadioGroup as VanRadioGroup,
  ActionSheet as VanActionSheet,
  Cell as VanCell,
  CellGroup as VanCellGroup,
  Button as VanButton,
  Icon as VanIcon,
  SubmitBar as VanSubmitBar,
  Empty as VanEmpty,
  AddressList as VanAddressList
  , Toast
} from 'vant'

import { ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { computed } from '@vue/reactivity'
import {
  getAddressList,
  confirmOrder,
  createOrder
} from '@/api/order'

// ---------1. 地址区域-----------
// 弹出层显示状态控制
const popupStatus = ref(false)
const triggerPopup = () => {
  popupStatus.value = true
}
const chosenAddress = (item) => {
  // 1. 更改弹出层显示状态
  popupStatus.value = false
  // 2. 更新当前显示的数据
  console.log(item)
  // toRaw是Vue提供的响应式API，返回 reactive 或 readonly 代理的原始对象
  console.log(toRaw(item))
  // 写法一：推荐
  currentAddress.value = item
  // 写法二：
  // currentAddress.value = toRaw(item)
}

// - 选中状态(从addresslist数据列表里选取id)
const chosenAddressId = ref('')
// 地址数据
const currentAddress = ref({})
const addresslist = ref([])
const isEmpty = computed(() => addresslist.value.length === 0)

// 数据转换函数
const convertData = data => {
  return data.map(item => {
    const temp = {
      id: item.id,
      name: item.real_name,
      tel: item.phone,
      address: item.province + item.city + item.district + item.detail,
      isDefault: item.is_default
    }

    if (item.is_default === 1) {
      // 记录勾选的ID
      chosenAddressId.value = item.id
      // 记录当期展示的数据
      currentAddress.value = temp
    }
    return temp
  })
}

// - 请求数据
const initAddressList = async () => {
  const { data } = await getAddressList({
    limit: 5,
    page: 1
  })
  console.log(data)
  if (data.status !== 200) return
  addresslist.value = convertData(data.data)
}
initAddressList()
// 地址操作
// const onAdd = () => Toast('新增地址')
const router = useRouter()
const { cartId } = defineProps({
  cartId: {
    type: String,
    required: true
  }
})
const onAdd = () => {
  // 因为新增地址后还要回到订单确认页，这时需要传递 cartId
  router.push({
    name: 'address',
    params: {
      cartId
    }
  })
}

const onEdit = (item, index) => Toast('编辑地址:' + index)

// -----------2. 初始化订单数据-------------
// 2.1 存储数据
const orderConfirmData = ref({})
// 2.3 计算属性处理数据
const cartInfo = computed(() => orderConfirmData.value?.cartInfo)
const cartItemCount = computed(() => `共${cartInfo.value?.length || 0}件`)
const totalPrice = computed(() => (orderConfirmData.value?.priceGroup?.totalPrice || 0) * 100)
// 2.2 接收组件传参（在前面引入过）

const initOrderInfo = async () => {
  const { data } = await confirmOrder({
    cartId,
    new: 0
  })
  console.log(data)

  if (data.status !== 200) return
  orderConfirmData.value = data.data
}
initOrderInfo()
// -----------3. 订单确认区域-------------
const showPayPanel = ref(false)
const paymentMethod = ref('yue')
const yue = computed(() => orderConfirmData.value?.userInfo.now_more || 0)

const handlePay = async () => {
  const { data } = await createOrder(orderConfirmData.value.orderKey, {
    addressId: currentAddress.value.id,
    payType: paymentMethod.value
  })
  if (data.status !== 200) return
  // 提示并跳转
  Toast.success('支付成功，自动跳转登录页...')
  router.push({
    name: 'order'
  })
}
</script>

<style lang="scss" scoped>
.van-nav-bar {
  position: fixed !important;
  width: 100%;
}

.container {
  padding: 50px 0;

  // 地址卡片
  .address-card {
    padding: 20px 25px;
    font-size: 16px;
    position: relative;

    // 径向渐变
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: repeating-linear-gradient(90deg,
          #ff6c6c 0,
          #ff6c6c 20%,
          transparent 20%,
          transparent 25%,
          #0084ff 25%,
          #0084ff 45%,
          transparent 45%,
          transparent 50%);
      background-size: 80px;
    }

    .info {
      span:first-child {
        padding-right: 20px;
      }
    }

    .detail {
      padding-top: 5px;

      .default {
        padding-right: 5px;
        background: #D6251f;
        color: #fff;
        font-size: 12px;
        margin-right: 17px;
        border-radius: 3px;
      }
    }
  }

  // 商品列表
  .product-list {
    :deep(.van-cell__value) {
      display: flex;
      align-items: center;

      img {
        width: 70px;
        height: 70px;
      }
      .info{
        padding-left: 5px;

        .title{
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp:1;
          overflow: hidden;
          padding: 0 15px 5px 0;
        }
        .price{
          color: #F2270C;
        }
      }
      .count{
        color: #aaa;
      }
    }
  }
}
</style>
