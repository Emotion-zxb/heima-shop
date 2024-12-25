<template>
  <view class="index">
    <!-- 自定义的导航栏 -->
    <CustomNavbar></CustomNavbar>
    <XtxSwiper :list="list"></XtxSwiper>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import CustomNavbar from './components/CustomNavbar.vue'
import { getHomeBannerAPI } from '@/services/home'
import { ref } from 'vue'
import type { BannerItem } from '@/types/home/home'

// ref是一个泛型函数！！！
const list = ref<BannerItem[]>([])
onLoad(() => {
  getHomeBannerAPI().then((res) => {
    list.value = res.result
  })
})
</script>

<style lang="scss">
//
</style>
