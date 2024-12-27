<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPicture"> </image>
    </view>
    <!-- 推荐选项 -->
    <view class="tabs">
      <text
        class="text"
        :class="{ active: activeIndex === index }"
        v-for="(item, index) in subTypes"
        :key="item.id"
        @tap="activeIndex = index"
        >{{ item.title }}</text
      >
    </view>
    <!-- 推荐列表 -->
    <scroll-view
      scroll-y
      class="scroll-view"
      v-for="(item, index) in subTypes"
      :key="item.id"
      v-show="activeIndex === index"
      @scrolltolower="onScrolltolower"
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.desc }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text">{{ item.finish ? '没有更多数据了~' : '数据加载中...' }}</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { getHotRecommendAPI } from '@/services/hot'
import { ref } from 'vue'
import type { SubTypeItem } from '@/types/hot.d.ts'
// 热门推荐页 标题和url
const hotMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]
let bannerPicture = ref()
const subTypes = ref<(SubTypeItem & { finish?: boolean })[]>([])
// query是路径上携带的参数
let query = defineProps<{
  type: string
}>()

// currentItem为hotMap中的某一项
const currentItem = hotMap.find((item) => {
  return item.type === query.type
})
let activeIndex = ref(0)
// 设置页面的标题
uni.setNavigationBarTitle({
  title: currentItem!.title,
})
// 获取推荐页数据
function getHotRecommendData() {
  // console.log(import.meta.env.DEV); // true，当前是开发环境？
  getHotRecommendAPI(currentItem!.url, {
    // 这里使用环境变量
    page: import.meta.env.DEV ? 30 : 1,
    pageSize: 10,
  }).then((res) => {
    bannerPicture.value = res.result.bannerPicture
    subTypes.value = res.result.subTypes
  })
}

// 滚动到底部
function onScrolltolower() {
  // 获取当前的tab项
  const currSubTypes = subTypes.value[activeIndex.value]
  if (currSubTypes.goodsItems.page < currSubTypes.goodsItems.pages) {
    // 当前页++
    currSubTypes.goodsItems.page++
  } else {
    // 添加标志finish
    currSubTypes.finish = true
    return uni.showToast({ icon: 'none', title: '没有更多数据~' })
  }

  // 调用接口
  getHotRecommendAPI(currentItem!.url, {
    subType: currSubTypes.id, // tab id
    page: currSubTypes.goodsItems.page, // 当前页
    pageSize: currSubTypes.goodsItems.pageSize, // 分页多少条
  }).then((res) => {
    const newSubTypes = res.result.subTypes[activeIndex.value]
    // 拼接
    // console.log(currSubTypes.goodsItems.items);
    currSubTypes.goodsItems.items.push(...newSubTypes.goodsItems.items)
  })
}

onLoad(() => {
  getHotRecommendData()
})
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}

.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}

.scroll-view {
  flex: 1;
}

.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;

  .text {
    margin: 0 20rpx;
    position: relative;
  }

  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}

.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;

  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .thumb {
    width: 305rpx;
    height: 305rpx;
  }

  .name {
    height: 88rpx;
    font-size: 26rpx;
  }

  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }

  .symbol {
    font-size: 70%;
  }

  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>

options: any; options: any;
