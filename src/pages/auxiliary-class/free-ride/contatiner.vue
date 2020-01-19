<template>
  <div>
    <router-view></router-view>
    <Footer
      v-bind="footerConfig"
      v-if="$route.meta.defaultTab"
      @choiceReleasType="choiceReleasType"
    ></Footer>
    <Operation :show="showOperation"
               @close="showOperation = !showOperation"
               @choice="actionsOperation"
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
              icon: 'icon-car',
              name: '顺风车',
              activeIcon: '',
              link: '/auxiliary/freeRide',
              active: 'active'
            },
            {
              name: '发布',
              method: 'choiceReleasType'
              //link:'/auxiliary/freeRide/release',
            },
            {
              icon: 'icon-jilu',
              name: '收藏',
              link: '/auxiliary/freeRide/collection',
            },
            {
              icon: 'icon-xiaolian',
              name: '我的发布',
              link: '/auxiliary/freeRide/myRelease',
            },
          ]
        }
      }
    },
    methods: {
      async choiceReleasType() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.showOperation = !this.showOperation
      },
      async actionsOperation(item) {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.goPointPage({
          path: "/auxiliary/freeRide/release",
          query: {...item}
        })
      }
    },
    created() {
      //this.alert("contatiner's page")
    }
  }
</script>
