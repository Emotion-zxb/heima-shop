<template>
  <view class="my">
    <view>会员信息：{{ memberStore.profile }}</view>
    <button
      @tap="
        memberStore.setProfile({
          nickname: '黑马先锋',
          token: 'xxxxxxxxxxxxxxxx',
        })
      "
      size="mini"
      plain
      type="primary"
    >
      保存用户信息
    </button>
    <button @tap="memberStore.clearProfile()" size="mini" plain type="warn">清理用户信息</button>
    <button @tap="sendRequest" size="mini" plain type="warn">发送请求</button>
  </view>
</template>

<script setup lang="ts">
import { useMemberStore } from '@/stores'
import { http } from '@/utils/http' // 引入，否则uni.request不生效

const memberStore = useMemberStore()

async function sendRequest() {
  const res = await http({
    url: '/home/banner',
    method: 'GET',
  })
  console.log('res', res)
}
</script>

<style lang="scss">
//
</style>
