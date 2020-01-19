<template>
  <div id="Partnerwdfs">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <van-tabs :line-width="25" @click="changeTab" :color="$themeColor" v-model="active">
      <van-tab :title="label" v-for="(label,key) in tabList" :key="key">
        <scroller
          v-if="dataList.length"
          :on-refresh="onRefresh"
          :on-infinite="onInfinite">
          <!--<job-tab-item @cancel-col="cancleCol" :job-type="+key+1" page-type="collection" :store-list="dataList"/>-->


          <!--找工作-->
          <hunt-find :list="dataList" v-if="+key+1==1"/>
          <job-find :list="dataList" v-else/>

        </scroller>
        <not-data v-else></not-data>
      </van-tab>
    </van-tabs>
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
  import HuntFind from "../../../components/template/item/hunt-find";
  import JobFind from "../../../components/template/item/job-find";

  export default {
    name: "PartnerWdfs",
    components: {JobFind, HuntFind, JobTabItem},
    data() {
      return {
        queryParams: {
          page: 1,
          size: 10,
          type: null,
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
      ...mapActions("jobHunt/jobHuntEnter", ["getMyCollection"]),
      changeTab(active) {
        console.log(active)
        // this.hasMore=true;
        this.queryParams.page = 1;
        this.queryParams.type = this.jobCategory[active].data || 2;
        this.onRefresh();
      },
      // 刷新的函数
      async onRefresh(done) {
        showLoading()
        console.log('222222222')
        // this.hasMore=true;
        this.queryParams.page = 1;
        this.dataList = [];
        this.dataList = await this.getMyCollection({
          ...this.queryParams,
        });
        hideLoading()
        done && done();
      },
      async onInfinite(done) {
        showLoading()

        // if (!this.hasMore ) return done();
        this.queryParams.page++;
        const list = await this.getMyCollection({
          ...this.queryParams,
        });
        if (list.length) {
          this.dataList = this.dataList.concat(list);
        }
        hideLoading()
        // else {
        //   this.hasMore=false;
        // }
        done(!list.length)
      },
      async cancleCol(id, type) {
        // console.log(id,type)
        // return
        showLoading();
        let res = await this.collectPost({
          postId: id,
          type: type == 1 ? 7 : 8,
        });
        if (res.code) {
          showHandleStatusByFlag(true, '取消成功')
          setTimeout(() => {
            this.onRefresh();
          }, 800)
        } else {
          showText(res.msg, 2000, true);
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
      tabList() {
        return _.map(this.jobCategory, ({name}) => name)
      },
    },

    async created() {
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
      min-height: calc(100vh - 120px);
      position: relative;
    }
  }
</style>
