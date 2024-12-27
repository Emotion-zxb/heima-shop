<template>
  <view class="index">
    <!-- 自定义的导航栏 -->
    <CustomNavbar></CustomNavbar>
    <scroll-view
      scroll-y="true"
      class="scroll-view"
      @scrolltolower="onScrollToLower"
      refresher-enabled
      :refresher-triggered="triggered"
      @refresherrefresh="onRefresherrefresh"
    >
      <Skeleton v-if="isLoading"></Skeleton>
      <template v-else>
        <!-- 轮播图 -->
        <XtxSwiper :list="BannerData"></XtxSwiper>
        <!-- 分类 -->
        <CategoryPanel :list="categoryData"></CategoryPanel>
        <!-- 热门推荐 -->
        <HotPanel :list="hotData"></HotPanel>
        <!-- 猜你喜欢 -->
        <XtxGuess ref="guessRef"></XtxGuess>
      </template>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import Skeleton from './components/Skeleton.vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home/home'
import type { XtxGuessInstance } from '@/types/component'

// ref是一个泛型函数！！！
const BannerData = ref<BannerItem[]>([]) // 轮播图数据
const categoryData = ref<CategoryItem[]>([]) // 分类数据
const hotData = ref<HotItem[]>([]) // 热门推荐

const guessRef = ref<XtxGuessInstance>() // XtxGuessInstance 是组件的实例类型

let triggered = ref(false) // 下拉刷新的状态

let isLoading = ref(true) // 控制骨架屏是否展示

async function getHomeBannerData() {
  // 删除了 .then的写法

  const res = await getHomeBannerAPI()
  BannerData.value = res.result
}

async function getHomeCategoryData() {
  const res = await getHomeCategoryAPI()
  categoryData.value = res.result
}

async function getHomeHotData() {
  const res = await getHomeHotAPI()
  hotData.value = res.result
}

// scroll-view组件滚动到底
function onScrollToLower() {
  // guessRef.value.getHomeGoodsGuessLikeData
  guessRef.value?.getHomeGoodsGuessLikeData() // 调子组件的函数
}
// 下拉刷新
function onRefresherrefresh() {
  triggered.value = true
  guessRef.value?.resetData() // 重置子组件的数据
  // await getHomeBannerData()
  // await getHomeCategoryData()
  // await getHomeHotData()
  // 优化
  Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotData(),
    guessRef.value?.getHomeGoodsGuessLikeData(),
  ])
    .then(() => {
      triggered.value = false // 关闭下拉刷新
    })
    .catch((error) => {
      triggered.value = false // 关闭下拉刷新，即使发生错误
      console.error(error)
    })
}

onLoad(() => {
  isLoading.value = true

  Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotData()])
    .then(() => {
      isLoading.value = false
    })
    .catch((error) => {
      isLoading.value = false
      console.error(error)
    })
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
}

.index {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// 看一下
.scroll-view {
  flex: 1;
}
</style>
