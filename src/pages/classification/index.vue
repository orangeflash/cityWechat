<template>
  <div class="classification bg-F2F3F5 pad-b">

    <dd-layout-search :config="searchConfig" search-type="0"/>
    <Banner v-if="banners.length"
            :height="platform.slideNum"
            :swiper="{children:banners}"/>
    <div class="pad-30 flex-y-center bg-f">
      <div class="flex-g-1 br-r-d">
        <div class="fon-wb mar-b-20 fon-b">数据分析</div>
        <p class="flex-y-center"><span class="pad-4-4-2 br-d col-6">整站统计</span></p>
      </div>
      <div class="flex-g-1">
        <div class="fon-wb mar-b t-c fon-xl">{{parseFloat(formatNumber(statistics.browse))}}<span
          v-if="statistics.browse >= 10000" class="fon-sm fon-w1">万</span><span class="fon-w1 fon-xss">次</span></div>
        <p class="col-9 t-c"><i class="iconfont icon-shuji col-t fon-xss mar-r-10"></i>浏览量</p>
      </div>
      <div class="flex-g-1">
        <div class="fon-wb mar-b t-c fon-xl">{{parseFloat(formatNumber(statistics.post))}}<span
          v-if="statistics.post >= 10000" class="fon-sm fon-w1">万</span><span class="fon-w1 fon-xss">条</span></div>
        <p class="col-9 t-c"><i class="iconfont icon-shangyi col-t fon-xss mar-r-10"></i>{{postConfig.field}}发布</p>
      </div>
    </div>
    <entry-button-group v-bind="entryGroupConfig"></entry-button-group>

    <dd-layout-notice :hidden-box-sha="true" pagePath="classification" class="mar-tb">
      <div slot="left" class="w-82 miw-82 dh-82 flex-center br-r-10">
        <img :src="infoNotice" class="w100 hei100">
      </div>
      <div slot="right" @click="goPointPage('/publication')"
           class="w-82 miw-82 mar-l dh-82 bg-FF4800 flex-center br-r-10">
        <span class="col-f fon-b t-c">发布 {{postConfig.field}}</span>
      </div>
    </dd-layout-notice>

    <Banner v-if="bannerTwo.length"
            height="140"
            :swiper="{children:bannerTwo}"/>

    <!--
      暂时还没有推荐的信息

      <dd-layout-part-list info-title="天天信息">
        <dd-layout-part
          v-for="(item,key) in 5"
          :key="key"
          class="mar-l"
          src="http://img3.redocn.com/tupian/20140822/musejingsefengjing_2939709.jpg"
        >
          <div class="flex-y-center pad-t-10 flex-bt" slot="tips">
            <dd-layout-img src="https://pic.qqtn.com/up/2018-1/15153913996445478.jpg" :width="0.4" :height="0.4"
                           :fillet="0.4"/>
            <span class="flo-r col-9 fon-xss fon-w4"><i class="iconfont icon-yanjing"></i>23浏览</span>
          </div>
          <div slot="cover" class="posi-a bg-0-5 w100 hei100 col-f fon-sm t0 br-tl-r-15 br-r-tr-20">
            <div class="pad-lr-20 pad-t lineH-38 hide-e-2">
              【网红爆款】立减20【网 红爆款】立减20...
            </div>
          </div>
        </dd-layout-part>
      </dd-layout-part-list>
  -->
    <dd-layout-part-list :info-title="`分类${postConfig.field}`">
      <div class="flex-bt dh flex-bt w100 flex-y-center">
        <div v-for="(item,key) in tabConfig"
             :key="key"
             :class="params.sort == item.sort?'col-3 fon-wb fon-xll':'fon-lg col-9'"
             class=" dh flex-y-center posi-r mar-lr"
             @click="changeType(item.sort)"
        >
          {{item.name}}
          <span v-if="params.sort == item.sort" class="dh-8 posi-a b0 flex-center w100">
            <em class="bg-t dh-8 w-48 br-r-16"></em>
          </span>
        </div>
      </div>
    </dd-layout-part-list>
    <div class="bg_search_bg">
      <basic-note-item :postData="item" v-for="(item,key) in postList" :key="key"/>
    </div>
    <more :status="hasMore"/>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex"
  import _ from 'lodash'
  import {classificationConfig} from "./page-config";
  import {utilMixins} from "../../plugins/util-mixins";
  import {updateShareConfig} from "../../util/wechat-util";
  import {hideLoading, showDialog, showLoading, showHandleStatusByFlag} from "../../util";
  import {Toast} from 'vant';

  import DdLayoutSearch from "../../components/layout/dd-layout-search"; //搜索
  import Banner from '../../components/home/banner';
  import EntryButtonGroup from "../../components/basic/entry-button-group";
  import DdLayoutNotice from '../../components/layout/dd-layout-notice'   //首页 通知
  import infoNotice from '../../assets/img/city-information/info-notice.png'
  import DdLayoutPartList from "../../components/layout/dd-layout-part-list";
  import DdLayoutPart from "../../components/layout/dd-layout-part";
  import DdLayoutImg from "../../components/layout/dd-layout-img";
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";


  export default {
    components: {
      DdLayoutImg,
      DdLayoutSearch,
      Banner,
      EntryButtonGroup,
      DdLayoutNotice,
      DdLayoutPartList,
      DdLayoutPart,
      BasicNoteItem
    },
    name: "classification",
    data() {
      return {
        infoNotice,
        searchConfig: {
          keyWords: '想找的搜出来',
          shape: 3
        },
        tabConfig: [
          {name: '附近', sort: 'nearest'},
          {name: '热门', sort: 'hot'},
          {name: '最新', sort: 'new'},
        ],
        hasMore: true,
        showTopOption: false,
        showMore: false,           //显示更多操作
        toppingOptions: [],      //置顶的列表信息选择
        banners: [],
        statistics: {
          browse: 1,
          post: 1
        },
        announceList: '',
        entryButtonList: [],
        bannerTwo: [],
        redEnvelopesConfig: {},
        postId: null,
        params: {
          page: 1,
          size: 10,
          sort: 'new'
        },
        postList: [],
      }
    },
    methods: {
      ...mapActions("common", ['getBannerListByType', 'getPostConfig']),
      ...mapActions("home/components", ["getBasicStatistics", "getPostStatistics"]),
      ...mapActions("post", ["getPostListByParams"]),
      ...mapActions("classification", ["getIndexCategroyList"]),
      onInfinite() {
        this.params.page++;
        this.hasMore && this.getPostList();
      },
      async onRefresh() {
        this.params.page = 1;
        this.hasMore = true;
        return await this.getPostList(true);
      },
      async changeType(type) {
        this.params.sort = type;
        showLoading()
        await this.onRefresh();
        hideLoading();
      },
      async getPostList(refresh) {
        let res = await this.getPostListByParams({
          ...this.params,
          lat: this.latLng.latitude,
          lng: this.latLng.longitude
        });
        this.postList = refresh ? res : this.postList.concat(res);
        this.hasMore = res.length >= this.params.size;
        return res
      },
      async getClassificationIndexInfo() {
        this.getBannerListByType({
          type: 3,
          adType: 1,
        }).then(banners => {
          if (banners && banners.length) {
            banners.forEach(v => v.notHost = true);
            this.banners = banners;
          }
        });
        this.getIndexCategroyList({type: 1}).then((val) => {
          this.entryButtonList = val
        });
      },
      async getSlideAd() {
        let result = await this.getBannerListByType({
          type: 3,
          adType: 2,
        })
        result.forEach(v => v.notHost = true)
        this.bannerTwo = result
      },
    },

    mixins: [utilMixins],
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
      ...mapState("home", {
        defaultConfig: state => state.defaultConfig
      }),
      ...mapState("common", {
        latLng: state => state.latLng,
        postConfig: state => state.postConfig
      }),
      entryGroupConfig() {
        const config = classificationConfig.entryBtnConfig();
        if (this.entryButtonList) {
          try {
            const entryButtonList = this.entryButtonList.map(({icon, name, id}) => ({
              label: name,
              url: this.getMediaList(icon).img[0],// `${this.assetPath}${JSON.parse(icon)[0].url}`,
              entry: {
                path: "classification/secondaryClassification", meta: {title: name}, query: {
                  pid: id.split(",")[0], id: id.split(",")[1], title: name
                }
              }
            }))
            return {...config, entryButtonList};
          } catch (e) {
            return []
          }
        } else {
          return []
        }
      },

    },
    //在页面离开时记录滚动位置
    beforeRouteLeave(to, from, next) {
      let position = document.documentElement.scrollTop || document.body.scrollTop
      this.$store.commit('changeRecruitScrollY', position)
      next()
    },
    //进入该页面时，用之前保存的滚动位置赋值
    beforeRouteEnter(to, from, next) {
      setTimeout(() => {
        next(vm => {
          document.body.scrollTop = document.documentElement.scrollTop = vm.$store.state.recruitScrollY
        })
      }, 100)
    },
    async created() {
      this.getPostStatistics().then(result => {
        this.statistics = result;
      });
      this.getClassificationIndexInfo();
      this.getSlideAd();
      this.onRefresh();
      const data = await this.getPostConfig();
      this.tabConfig = data.sort.map(item => {
        return {
          name: item.value,
          sort: item.name
        }
      })
      updateShareConfig({
        title: data.title,
        imgUrl: data.shareImg,
        desc: data.shareDescription,
        link: window.location.href,
      });


      //上拉加载
      this.onscroll(this.onInfinite, this.$route.path);
      document.title = data.field + '首页'
    }
  }
</script>

