<template>
  <div>
    <router-view></router-view>
    <Footer @go-release="goMethod" v-bind="footerConfig" v-if="$route.meta.defaultTab"></Footer>
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
              icon: "icon-qiang",
              name: '管理抢购',
              link: '/storeAuxiliary/storeRushbuy',
            },
            // {
            //   icon: 'icon-zhaopinguanli1',
            //   name: '求职招聘',
            //   activeIcon: '',
            //   link: '/auxiliary/jobHunt',
            // },
            {
              icon:'icon-daojishi',
              name: '发布抢购',
              method:'go-release'
            },
            // {
            //   icon: 'icon-yufukuanyufukuanjil',
            //   name: '收藏',
            //   link: '/auxiliary/jobHunt/collection',
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
        this.goPointPage({path:'/storeAuxiliary/storeRushbuy/storeReleaseRushbuy'})
      },
    },
    async created() {
    },
  }
</script>
