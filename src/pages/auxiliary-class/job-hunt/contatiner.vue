<template>
  <div>
    <router-view v-if="jobCategory.length"></router-view>
    <Footer @job-hunt="jobHunt" v-bind="footerConfig" v-if="$route.meta.defaultTab"></Footer>
    <Operation
      :show="showOperation"
      @close="showOperation = !showOperation"
      @choice="actionsOperation"
      :actions="actions"
    ></Operation>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import Footer from '@/components/template/footer'                 //页脚
  import Operation from '../../../components/template/operation'

  export default {
    components: {Footer, Operation,},
    data() {
      return {
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
              icon: 'icon-zhaopinguanli1',
              name: '求职招聘',
              activeIcon: '',
              link: '/auxiliary/jobHunt',
            },
            {
              name: '发布',
              method: 'job-hunt'
            },
            {
              icon: 'icon-yufukuanyufukuanjil',
              name: '招人才',
              link: '/auxiliary/jobHunt/HuntFind',
            },
            {
              icon: 'icon-xiaolian',
              name: '我的',
              link: '/auxiliary/jobHunt/myJobHunt',
            },
          ]
        },
        showOperation: false,
        actions: [
          {
            title: '请选择发布类型',
            disabled: true
          },
        ],
      }
    },
    methods: {
      ...mapActions("jobHunt", ["getJobConfig", "getJobCategory",]),
      jobHunt() {
        this.showOperation = true
      },
      async actionsOperation(item, index) {
        console.log(item, index)
        const bool = await this.checkBindTel()
        if (!bool) return
        item.data == 1 ? this.goPointPage({
          name: 'JobJobSettled',
          params: {huntType: item.id}
        }) : this.goPointPage({name: 'JobHuntSettled', params: {huntType: item.id}})
      }
    },
    computed: {
      ...mapState("jobHunt", {
        jobCategory: state => state.jobCategory,
      }),
    },
    async created() {
      await this.getJobCategory();
      this.footerConfig.footerInfo[1].name=this.jobCategory.find(v=>v.identifying==1)&&this.jobCategory.find(v=>v.identifying==1).name||'求职'
      this.footerConfig.footerInfo[3].name=this.jobCategory.find(v=>v.identifying==2)&&this.jobCategory.find(v=>v.identifying==2).name||'招聘'
      this.actions = this.actions.concat(this.jobCategory)
      console.table(this.jobCategory)
      // this.getStoreConfig().then(result => {
      //   this.actions = this.actions.concat(result.data);
      // })
    },
  }
</script>
