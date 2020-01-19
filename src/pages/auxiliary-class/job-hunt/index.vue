<template>
  <div id="JobHunt">
    <div class="job_search posi-f t0 l0 r0 zIndex99"
         :class="{'back':isScroll}"
    >
      <Search v-if="action.length>1"
              :searchType="6"
              :selectName="action[choiceIndex].name"
      />
    </div>
    <div class="banner-box" v-if="bannerList1.length > 0">
      <Banner
        :height="platform.slideNum"
        :swiper="{children:bannerList1}"></Banner>
    </div>
    <div v-else class="dh"></div>

    <div class="pad-30 flex-y-center bg-f">
      <div class="flex-g-1 br-r-d">
        <div class="fon-wb mar-b-20 fon-b">数据分析</div>
        <p class="flex-y-center"><span class="pad-8-10-4 br-d col-6">整站统计</span></p>
      </div>
      <div class="flex-g-1">
        <div class="fon-wb mar-b t-c fon-xl">{{parseFloat(formatNumber(statistics.browse || 0))}}<span
          v-if="statistics.browse >= 10000" class="fon-sm fon-w1">万</span><span class="fon-w1 fon-xss">次</span></div>
        <p class="col-9 t-c"><i class="iconfont icon-shuji col-t fon-xss mar-r-10"></i>浏览量</p>
      </div>
      <div class="flex-g-1">
        <div class="fon-wb mar-b t-c fon-xl">{{parseFloat(formatNumber(statistics.post || 0))}}<span
          v-if="statistics.post >= 10000" class="fon-sm fon-w1">万</span><span class="fon-w1 fon-xss">条</span></div>
        <p class="col-9 t-c"><i class="iconfont icon-shangyi col-t fon-xss mar-r-10"></i>发布量</p>
      </div>
    </div>
    <!--<dd-layout-notice :hidden-box-sha="true" pagePath="jobHunt" class="mar-tb" :row="2">-->

    <!--<dd-layout-img slot="left" :src="announce" class="bg-tran" :width="0.82" :height="0.82"/>-->

    <!--&lt;!&ndash;<div slot="right" @click="goPointPage('/auxiliary/jobHunt/myJobHunt')"&ndash;&gt;-->
    <!--&lt;!&ndash;class="w-82 miw-82 mar-l dh-82 bg-FF4800 flex-center br-r-10">&ndash;&gt;-->
    <!--&lt;!&ndash;<span class="col-f fon-b t-c">我的 发布</span>&ndash;&gt;-->
    <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--</dd-layout-notice>-->

    <dd-layout-div class="flex bg-f mar-b-20" :pad="[30,0]">
      <dd-layout-div class="flex-g-1 flex-center"
                     @click="goPointPage({path:'/auxiliary/jobHunt/jobHuntList',query:{jobType:item.data,title:item.name}})"
                     v-for="(item,index) in jobCategory" :key="index">
        <dd-layout-div class="t-c">
          <dd-layout-img class="bg-tran mar-a" :src="item.data=='1'?zgz:zrc" :width="0.84" :height="0.84"/>
          <dd-layout-div color="#494949" class="mar-t-20">{{item.name}}</dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="flex-g-1 flex-center" v-for="(item,key) in jobCategory" :key="'j'+key">
        <dd-layout-div class="t-c" @click="goPost(item)">
          <dd-layout-img class="bg-tran mar-a" :src="item.data=='1'?fbqz:fbzp" :width="0.84" :height="0.84"/>
          <dd-layout-div color="#494949" class="mar-t-20">发布{{item.name}}</dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>


    <dd-layout-announce announceType="jobHunt" class="mar-b-20"/>


    <van-swipe :autoplay="3000" v-if="bannerList2&&bannerList2.length">
      <van-swipe-item v-for="(item,key) in bannerList2" :key="key">
        <img :src="getPathByAssetPath(item.url)" style="width: 100%; height:140px" alt>
      </van-swipe-item>
    </van-swipe>

    <router-view/>

    <!--<dd-layout-div class="flex-bt flex-y-center bg-f" :pad="[30,30,15]" :mar="[30,0,0]">-->
    <!--<dd-layout-div class="flex-y-center">-->
    <!--<dd-layout-div class="fon-xll col-t" :mar="[0,100,0,0]">-->
    <!--最新-->
    <!--<dd-layout-div class="bg-t" :width="42" :height="6" :mar="[15,'auto',0]"/>-->
    <!--</dd-layout-div>-->
    <!--<dd-layout-div class="fon-xll">-->
    <!--推荐-->
    <!--&lt;!&ndash;<dd-layout-div class="bg-t"  :width="42" :height="6" :mar="[15,'auto',0]"/>&ndash;&gt;-->
    <!--</dd-layout-div>-->
    <!--</dd-layout-div>-->
    <!--<dd-layout-div>我的收藏</dd-layout-div>-->
    <!--</dd-layout-div>-->
    <!--<dd-layout-div v-if="list.length > 0">-->
    <!--<job-find :list="list"/>-->
    <!--</dd-layout-div>-->

    <!--<not-data v-else-if="isRequest"/>-->

    <Operation :show="showOperation"
               @close="showOperation = !showOperation"
               @choice="actionsOperation"
               :actions="action"
    ></Operation>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import _ from "lodash";
  import EntryButtonGroup from "../../../components/basic/entry-button-group";
  import NoticeWithInfo from "../../../components/home/notice-with-info";
  import {utilMixins} from "../../../plugins/util-mixins";
  import JobTab from "../../../components/template/job-hunt/job-tab";
  import Search from '../../../components/template/search';
  import Operation from '@/components/template/operation';
  import Banner from "../../../components/home/banner";
  import jobFind from "../../../components/template/item/job-find";
  import Notice from "../../../components/business-district/notice";
  import {Toast} from "vant";
  import {updateShareConfig} from "../../../util/wechat-util";
  import jobimg from "../../../assets/img/job-hunt/job.png";
  import huntimg from "../../../assets/img/job-hunt/hunt.png";
  import zgz from "../../../assets/img/job-hunt/zgz.png";
  import zrc from "../../../assets/img/job-hunt/zrc.png";
  import fbqz from "../../../assets/img/job-hunt/fbqz.png";
  import fbzp from "../../../assets/img/job-hunt/fbzp.png";

  import {hideLoading, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";

  import DdLayoutAnnounce from "../../../components/layout/dd-layout-announce";

  export default {
    name: "JobHunt",
    components: {
      DdLayoutAnnounce,
      DdLayoutImg,
      Notice,
      Banner,
      Search,
      Operation,
      NoticeWithInfo,
      EntryButtonGroup,
      JobTab,
      jobFind,
    },
    data() {
      return {
        zrc,
        zgz,
        fbzp,
        fbqz,
        list: [],
        isRequest: false,
        showOperation: false,
        isScroll: false,
        choiceIndex: 1,
        action: [
          {title: '分类'},
        ],
        jobimg, huntimg,
        store: "store",
        statistics: {},
        bannerList1: [],
        bannerList2: [],
        noticeList: [],
        entryCategories: [],
        isEnter: false,
        params: {
          page: 1,
          size: 10,
        }
      };
    },
    methods: {
      ...mapActions("common", [
        "getBannerListByType",
      ]),
      // ...mapActions("home/components", [
      //   "getAnnounceList",
      //   "getBasicStatistics",
      //   "getEntryGroupCategories"
      // ]),
      ...mapActions("jobHunt", ["getJobConfig", "getJobCategory", "getHuntList"]),
      ...mapActions("home/components", ["getJobStatistics"]),
      // 搜索
      search(val) {
        if (!val.trim()) return showHandleStatusByFlag([false, '请输入关键词'])
        this.$refs.storeTabs.queryParams.word = val;
        this.$refs.storeTabs.changeTab(+this.choiceIndex - 1, 'isSearch')
      },
      // 搜索框的更多选项
      actionsOperation(val, key) {
        this.choiceIndex = key;
        console.log(val, key,);
      },
      formatEntryGroups(entryCategories) {
        if (entryCategories && entryCategories.length) {
          this.entryCategories = entryCategories.map(item => ({
            ...item,
            label: item.name,
            url: this.getMediaList(item.icon).img
              ? this.getMediaList(item.icon).img[0]
              : "",
            entry: {
              path: "/businessDistrict/storeList",
              query: {activeId: item.id}
            }
          }));
        }
      },
      async getCmpInitializationData() {
        const bannerAction = adType =>
          this.getBannerListByType({
            type: 9,
            adType
          });
        bannerAction(1).then(val => {
          val.forEach(v => (v.notHost = true));
          this.bannerList1 = val;
        });
        this.getJobCategory();
        bannerAction(2).then(val => {
          this.bannerList2 = val
          console.log(" this.bannerList2", this.bannerList2)
        });


        // this.getAnnounceList({
        //   type: 3,
        //   adType: 1
        // }).then(result => {
        //   this.noticeList = result;
        // });
        /*分类组*/
        // this.getEntryGroupCategories({
        //   type: 2
        // }).then(entryCategories => this.formatEntryGroups(entryCategories));
      },
      clickHandle() {
        this.goPointPage({path: "/shopDetail", query: {id: 7}});
      },
      async goPost(item){
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.goPointPage({
          name: item.data=='1'?'JobJobSettled':'JobHuntSettled',
          params: {huntType: item.id}
        })
      },
    },
    computed: {
      ...mapState("jobHunt", {
        jobConfig: state => state.jobConfig,
        jobCategory: state => state.jobCategory,
      }),
      ...mapState({
        user: s => s.user,
        platform: s => s.platform
      }),
      storeCanEnter() {
        return this.jobConfig && +this.jobConfig.enter === 1;
      },
      noticeConfig: () => {
        return {
          "source": 'jobHuntIndex',
          "isRight": {icon: 'icon-hehuoren', text: '我的发布'},
          "icon": true,
          "link": "",
          "infoList": [
            "浏览",
            "发布",
          ],
          "slidingDirection": "horizontal"
        }
      },
      entryBtnConfig() {
        const config = {
          "color": "#0173f0",
          "shape": 2,
          "buttonNumberOfCol": 5,
          "buttonNumberOfRow": 2,
        };
        return {...config, entryButtonList: this.entryCategories};
      }
    },
    mixins: [utilMixins],
    async created() {

      this.getJobStatistics().then(result => {
        console.log("求职招聘的数据统计===》", result)
        this.statistics = result;
      })

      this.getCmpInitializationData();
      let data = await this.getJobConfig();
      this.action = this.action.concat(data.sort && data.length > 0 ? data.sort : [{
        name: '最新招聘',
        value: 'newRecruit'
      }, {name: '最新求职', value: 'newJob'}])
      document.title = data.field || '求职招聘'
      updateShareConfig({
        title: data.title,
        imgUrl: data.shareImg,
        desc: data.shareDescription,
        link: window.location.href
      });
      // this.onscroll(this.$refs.storeTabs.onInfinite, this.$route.path, (top) => {
      //   this.isScroll = top > 50
      // });
    }
  };
</script>
