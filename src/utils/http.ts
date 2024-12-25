import { useMemberStore } from '@/stores'

uni.addInterceptor('request', {
  invoke(args) {
    const baseUrl = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

    if (!args.url.startsWith('http')) {
      // 拼接地址
      args.url = baseUrl + args.url
    }

    args.timeout = 10000 // 超时时间

    args.header = {
      // 请求头
      ...args.header,
      'source-client': 'miniapp',
    }

    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      args.header.Authorization = token
    }
  },
})

interface ResInterface<T> {
  code: string
  msg: string
  result: T
}

export const http = <T>(options: UniApp.RequestOptions) => {
  // Promise<Data<T>> 表示异步操作成功时，返回的数据将符合 Data<T> 结构，T 会根据调用时传入的类型来决定。
  return new Promise<ResInterface<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        // resolve(res.data)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as ResInterface<T>)
        } else if (res.statusCode === 401) {
          // 跳转登录
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({
            url: '/src/pages/login/login',
          })

          reject(res)
        } else {
          uni.showToast({
            icon: 'none',
            title: (res.data as ResInterface<T>).msg || '获取数据失败',
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误',
        })
        reject(err)
      },
    })
  })
}
