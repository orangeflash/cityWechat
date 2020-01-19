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
        actions: [
          {title: '选择发布类型'},
          {name: '求租', type: 'rentSeeking'},
          {name: '出租', type: 'lease'},
        ],
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
              icon: 'icon-zufang',
              name: '房屋出售',
              activeIcon: '',
              link: '/auxiliary/housingDeal',
              active: 'active'
            },
            {
              name: '发布',
              method: 'choiceReleasType'
            },
            {
              icon: 'icon-jilu',
              name: '收藏',
              link: '/auxiliary/housingDeal/collection',
            },
            {
              icon: 'icon-xiaolian',
              name: '我的发布',
              link: '/auxiliary/housingDeal/myRelease',
            },
          ]
        }
      }
    },
    methods: {
      choiceReleasType() {
        this.showOperation = !this.showOperation
      },
      async actionsOperation(result) {
        console.log("result", result);

        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return

        let type = '',
          path = +result.identifying <= 4 ? "/auxiliary/housingDeal/release" : "/auxiliary/housingDeal/releaseSale";

        switch (+result.identifying) {
          case 3:
            type = 'lease';
            break;
          case 4:
            type = 'rentSeeking';
            break;
          case 5:
            type = 'unused';
            break;
          case 6:
            type = 'used';
            break;
        }
        this.goPointPage({
          path,
          query: {
            type,
            ...result
          }
        })
      }
    }
  }
</script>
