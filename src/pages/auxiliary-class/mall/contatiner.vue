<template>
  <div>
    <router-view></router-view>
    <Footer
      v-bind="footerConfig"
      v-if="$route.meta.defaultTab"
    ></Footer>
    <Operation :show="showOperation"
               @close="showOperation = !showOperation"
               :actions="actions"
    ></Operation>
  </div>

</template>

<script>
  import Operation from "@/components/template/operation"
  import Footer from '@/components/template/footer'                 //页脚

  export default {
    components: {Footer, Operation},
    data() {
      return {
        showOperation:false,
        actions:[],
        footerConfig:{
          color: '#818181',
          activeColor: 'red',
          footerInfo: [
            {
              icon: "icon-shouye",
              name: '首页',
              link: '/home',
            },
            {
              icon:'icon-shangdian',
              name: '商城',
              activeIcon: '',
              link: '/auxiliary/mall',
              active:'active'
            },
            {
              name: '分类',
              icon:'icon-category',
              link:'/auxiliary/mall/category',
            },
            {
              icon: 'icon-gouwuche2',
              name: '购物车',
              link: '/auxiliary/mall/cart',
            },
            {
              icon:'icon-xiaolian',
              name: '我的订单',
              link: '/auxiliary/mall/order',
            },
          ]
        }
      }
    }
  }
</script>
