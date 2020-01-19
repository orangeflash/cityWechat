<template>
  <div>
    <router-view></router-view>
    <Footer
      v-bind="footerConfig"
      v-if="$route.meta.defaultTab"
    ></Footer>
  </div>
</template>

<script>
  import Operation from "@/components/template/operation"
  import Footer from '@/components/template/footer'                 //页脚
  export default {
    components: {Footer, Operation},
    data() {
      return {
        showOperation: false,
        actions: [],
        footerConfig: {
          color: '#818181',
          activeColor: 'red',
          prominent: true,
          footerInfo: [
            {
              icon: "icon-shouye",
              name: '首页',
              link: '/home',
            },
            {
              icon: 'icon-shalou',
              name: '限时抢购',
              activeIcon: '',
              link: '/auxiliary/rushBuy',
              active: 'active'
            },
            // {
            //   name: '发布',
            //   link:'/auxiliary/coupon/release',
            // },
            {
              icon: 'icon-jilu',
              name: '我的领取',
              link: '/auxiliary/rushBuy/myReceive',
            },
            {
              icon: 'icon-xiaolian',
              name: '个人中心',
              link: '/personal',
            },
          ]
        }
      }
    },
    methods: { },
    created() {
      //this.alert("contatiner's page")
    }
  }
</script>
