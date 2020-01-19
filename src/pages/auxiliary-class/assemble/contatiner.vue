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
          // prominent: true,
          footerInfo: [
            {
              icon: "icon-shouye",
              name: '首页',
              link: '/home',
            },
            {
              icon: 'icon-pintuandingdan',
              name: '拼团',
              activeIcon: '',
              link: '/auxiliary/assemble',
              active: 'active'
            },
            {
              name: '分类',
              link: '/auxiliary/assemble/category',
              icon:'icon-category'
            },
            {
              icon: 'icon-jilu',
              name: '我的拼团',
              link: '/auxiliary/assemble/myOrder',
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
    methods: {},
    created() {
      //this.alert("contatiner's page")
    }
  }
</script>
