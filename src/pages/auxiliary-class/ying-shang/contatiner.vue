<template>
  <div>
    <router-view></router-view>
    <Footer @go-release="goMethod" v-bind="footerConfig" v-if="$route.meta.defaultTab"></Footer>
  </div>

</template>

<script>
  import { mapActions,mapMutations, mapState, mapGetters } from "vuex";
  import Footer from '../../../components/template/footer'
  import {hideLoading, showLoading} from "../../../util";
  //页脚
  export default {
    components:{Footer},
    data(){
      return{
        footerConfig:{
          color: '#818181',
          activeColor: 'red',
          prominent:true,
          footerInfo: [
            {
              icon: "icon-shouye",
              name: '首页',
              link: '/home',
            },
            {
              icon: "icon-credentials_icon",
              name: '会员卡',
              link: '/auxiliary/vip',
            },
            {
              icon:'icon-jia',
              name: '加入',
              // link: '/auxiliary/vip/enterVip',
              method:'go-release'
            },
            {
              icon: 'icon-xinfeng8',
              name: '使用',
              link: '/auxiliary/vip/myVip',
            },
            {
              icon: 'icon-xiaolian',
              name: '我的',
              link: '/personal',
            },
          ]
        },
      }
    },
    methods:{
      async goMethod(){
        const bool=await this.checkBindTel()
        if(!bool) return
        this.goPointPage({path:'/auxiliary/vip/enterVip'})
      },
    },
    computed: {
    },
    async created() {
    },
  }
</script>
