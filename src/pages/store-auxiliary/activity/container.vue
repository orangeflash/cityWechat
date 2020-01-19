<template>
  <div>
    <router-view></router-view>
    <!--<Footer @go-release="goMethod" v-bind="footerConfig" v-if="$route.meta.defaultTab"></Footer>-->
  </div>

</template>

<script>
  import { mapActions, mapState, mapGetters } from "vuex";
  import Footer from '@/components/template/footer'                 //页脚
  import Operation from '../../../components/template/operation'
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
              icon: "icon-wodeqianbao",
              name: '我要提现',
              link: '/storeAuxiliary/storeBalance/storeCash',
            },
            {
              icon:'icon-wodejilu',
              name: '提现明细',
              method:'go-release'
            },
          ]
        },
      }
    },
    methods:{
      ...mapActions("jobHunt", ["getJobConfig","getJobCategory",]),
      goMethod(){
        console.log('11111')
        this.goPointPage({path:'storeCoupon/storeReleaseCoupon'})
      },
    },
    async created() {
      await this.getJobCategory();
    },
  }
</script>
