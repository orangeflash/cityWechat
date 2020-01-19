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
    components:{Footer,Operation},
    data(){
      return{
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
              icon:'icon-iconset0327',
              name: '名片库',
              activeIcon: '',
              link: '/auxiliary/card',
              active:'active'
            },{
              icon:'icon-gerenzhongxin',
              name:'我的名片',
              link: '/auxiliary/card/myCard',
            },{
              icon:'icon-card1',
              name:'名片夹',
              link: '/auxiliary/card/cardcase',
            },{
              icon:'icon-buoumaotubiao49',
              name:'个人中心',
              link: '/personal',
            }
          ]
        }
      }
    },
    methods:{
      choiceReleasType(){
        this.showOperation = !this.showOperation
      },
      actionsOperation(item){
        this.goPointPage({
          path:"/auxiliary/freeRide/release",
          query:{...item}
        })
      }
    },
    created(){
      //this.alert("contatiner's page")
    }
  }
</script>
