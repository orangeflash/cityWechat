<template>
  <div id="Partnerwdfs">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <!--<van-tabs :line-width="25" @click="changeTab" :color="$themeColor" v-model="active">-->
      <!--<van-tab :title="label" v-for="(label,key) in tabList" :key="key">-->
    <div class="scroll-div">
        <scroller
          v-if="dataList.length"
          :on-refresh="onRefresh"
          :on-infinite="onInfinite">
          <job-tab-item :job-type="1" page-type="myjob" :store-list="dataList"/>
        </scroller>
        <not-data v-else></not-data>
      <!--</van-tab>-->
    <!--</van-tabs>-->
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import JobTabItem from "../../../components/template/job-hunt/job-tab-item";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {
    hideLoading,
    showDialog,
    showLoading,
    getUrlParams,
    parseObjToParams,
    showText,
    showHandleStatusByFlag
  } from "../../../util";
  import {Toast} from 'vant';
  import {PlaceholderAvatar} from "../../../project-config/base";
  import PlaceholderImg from "../../../assets/img/personal/my_publication_placeholder.jpg";

  export default {
    name: "PartnerWdfs",
    components: {JobTabItem},
    data() {
      return {
        queryParams:{
          page:1,
          size:10,
          type:null,
        },
        active: 0,
        dataList: [],
        PlaceholderImg,
        PlaceholderAvatar,
      }
    },
    methods: {
      ...mapActions("post", ["collectPost"]),
      ...mapActions("jobHunt", ["getJobConfig"]),
      // ...mapActions("partner", ["getBannerList", "getAnnounceList","getPartnerconfig","getPartnerstatus"]),
      ...mapActions("jobHunt/jobHuntEnter", ["getRecruitResume","getMyRecruit"]),
      changeTab(active) {
        console.log(active,this.active)
        // this.hasMore=true;
        this.queryParams.page = 1;
        // this.queryParams.type=this.jobCategory[active].data||2;
        this.onRefresh();
      },
      // 刷新的函数
      async onRefresh(done) {
        showLoading()
        console.log('222222222')
        // this.hasMore=true;
        this.queryParams.page=1;
        this.dataList = [];
        this.dataList =this.active? await this.getMyRecruit({...this.queryParams,}):await this.getRecruitResume({...this.queryParams,});
        hideLoading()
        done && done();
      },
      async onInfinite(done) {
        showLoading()

        // if (!this.hasMore ) return done();
        this.queryParams.page++;
        const list = this.active? await this.getMyRecruit({...this.queryParams,}):await this.getRecruitResume({...this.queryParams,});
        if (list.length) {
          this.dataList = this.dataList.concat(list);
        }
        hideLoading()
        // else {
        //   this.hasMore=false;
        // }
        done(!list.length)
      },
      async cancleCol(id,type){
        // console.log(id,type)
        // return
        showLoading();
        let res = await this.collectPost({
          postId: id,
          type: type==1?7:8,
        });
        if (res.code) {
          showHandleStatusByFlag(true,'取消成功')
          setTimeout(()=>{
            this.onRefresh();
          },800)
        }
        else {
          showText(res.msg,2000,true);
        }
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        user: state => state.user
      }),
      ...mapState("jobHunt", {
        jobCategory: state => state.jobCategory,
      }),
      tabList(){
        return ['我的求职','我的招聘']
        // return  _.map(this.jobCategory,({name})=>name)
      },
    },

    async created() {
      this.queryParams.recruitId=this.$route.query['recruitId']
      console.log(this.queryParams)
      //配置
      await this.getJobConfig()
      // 获取列表
      this.changeTab(0);
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  #Partnerwdfs {
    /*min-height: calc(100vh - 80px);*/
    position: fixed;
    width: 100%;
    height: calc(100vh - 0px);
    .van-tab__pane {
      min-height: calc(100vh - 60px);
      position: relative;
    }
    .scroll-div{
      min-height: calc(100vh - 0px);
      position: relative;
    }
  }
</style>
