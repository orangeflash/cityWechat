<template>
  <div>
    <router-view></router-view>
    <Footer @go-release="goMethod" v-bind="footerConfig" v-if="$route.meta.defaultTab"></Footer>

  </div>

</template>

<script>
  import { mapActions, mapState, mapGetters } from "vuex";
  import Footer from '../../../components/template/footer'                 //页脚
  import Operation from '../../../components/template/operation'
  export default {
    components:{Footer},
    data(){
      return{
        footerConfig:{
          color: '#818181',
          activeColor: 'black',
          prominent:true,
          footerInfo: [
            {
              icon: "icon-paixingbang",
              name: '数据',
              link: '/agentIndex/cityAgent',
            },
            {
              icon: "icon-geren2",
              name: '代理',
              link: '/agentIndex/cityAgent/cityAgentSet',
            },
            {
              icon:'icon-bianji',
              name: '设置',
              link: '/agentIndex/cityAgent/citySetUp',
            },
            // {
            //   icon: 'icon-shangjia1',
            //   name: '配送设置',
            //   link: '/storeAuxiliary/storeGood/storeManageGood',
            // },
            // {
            //   icon: 'icon-shangdian',
            //   name: '商家中心',
            //   link: '/auxiliary/jobHunt/myJobHunt',
            // },
          ]
        },
      }
    },
    methods:{
      ...mapActions("jobHunt", ["getJobConfig","getJobCategory",]),
      goMethod(){
        console.log('11111')
        this.goPointPage({path:'/storeAuxiliary/storeGood/storeReleaseGood'})
      },
    },
    async created() {
      // await this.getJobCategory();
    },
  }
</script>
