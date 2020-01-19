<template>
  <div id="yellowIndex">
    <div class="search-input">
      <SearchWithLocation
        search-type="3"
        :noShowAddress="true"
        :searchTypes='0'
        :config="searchOptions"

      ></SearchWithLocation>
    </div>
    <div class="banner-box" v-if="bannerList1.length > 0">
      <Banner
        :height="platform.slideNum"
        :swiper="{children:bannerList1}"></Banner>
    </div>
    <dd-layout-div v-else :height="100"/>
    <notice-with-info v-bind="noticeConfig"></notice-with-info>

    <dd-layout-announce announce-type="yellow" class="mar-b-20"/>

    <section class="entry-button-group">
      <entry-button-group v-bind="entryBtnConfig"/>
    </section>
    <!--<div class="box">-->
      <!--<Notice-->
        <!--v-if="noticeLoad"-->
        <!--label="最新入驻"-->
        <!--:notice="noticeList"-->
        <!--:suffix="suffix"-->
        <!--@featureClick="storeCanEnter&&featureClick()"-->
      <!--/>-->
    <!--</div>-->

    <van-swipe :autoplay="3000" v-if="bannerList2&&bannerList2.length">
      <van-swipe-item v-for="(item,key) in bannerList2" :key="key">
        <img :src="getPathByAssetPath(item.url)" style="width: 100%; height:140px" alt>
      </van-swipe-item>
    </van-swipe>
    <section class="tab__container">
      <store-tab @tap="clickHandle"/>
    </section>

    <div class="settled" @click="goSettled">+</div>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import _ from "lodash";
  import Footer from "../../components/yellow-page/footer";
  import EntryButtonGroup from "../../components/basic/entry-button-group";
  import SearchBar from "../../components/basic/search-bar";
  import NoticeWithInfo from "../../components/yellow-page/notice";
  import {utilMixins} from "../../plugins/util-mixins";
  import StoreTab from "../../components/yellow-page/list";
  import SearchWithLocation from "../../components/home/search-with-location";
  import Banner from "../../components/home/banner";
  import {
    bannerConfig,
    entryBtnConfig,
    noticeConfig,
    searchOptions
  } from "./page-config";
  import Notice from "../../components/yellow-page/noticeList";
  import {Toast} from "vant";
  import {updateShareConfig} from "../../util/wechat-util";
  import DdLayoutAnnounce from "../../components/layout/dd-layout-announce";

  export default {
    name: "yellowIndex",
    components: {
      DdLayoutAnnounce,
      Notice,
      Footer,
      Banner,
      SearchWithLocation,
      StoreTab,
      NoticeWithInfo,
      SearchBar,
      EntryButtonGroup
    },
    data() {
      return {
        fullpath: "",
        store: "store",
        bannerList1: [],
        bannerList2: [],
        noticeLoad: false,
        suffix: '',
        noticeList: {
          announce: [],
          yellow: []
        },
        entryCategories: [],
        isEnter: false
      };
    },
    methods: {
      ...mapActions("common", [
        "getBusinessList",
        "getBannerListByType",
        "getStoreConfig"
      ]),
      ...mapActions("home/components", [
        "getannounce",
        "getBasicStatistics",
        "getEntryGroupCategories"
      ]),
      ...mapActions("YellowPage", [
        "staticYellowPage",
        "getBannerList",
        "getannounce",
      ]),
      ...mapActions("publication/yellowEnter", ["getYellowPageSetUp"]),
      async goSettled() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.goPointPage('/yellowPage/yellowPageSettled')
      },
      getTabLabelByKey(key) {
        let label = "";
        switch (key) {
          case "post":
            label = "常用";
            break;
          case "enter":
            label = "最新";
            break;
          case "browse":
            label = "附近";
            break;
        }
        return label;
      },
      // 黄页一级分类跳转页
      formatEntryGroups(entryCategories) {
        if (entryCategories && entryCategories.length) {
          this.entryCategories = entryCategories.map(item => ({
            ...item,
            label: item.name,
            url: this.getMediaList(item.icon).img
              ? this.getMediaList(item.icon).img[0]
              : "",
            entry: {
              path: "/yellowPage/pageList",
              query: {activeId: item.id}
            }
          }));
        }
      },

      async getCmpInitializationData() {
        const bannerAction = adType =>
          this.getBannerList({
            type: 7,
            adType
          });

        bannerAction(1).then(val => {
          val.forEach(v => (v.notHost = true));
          this.bannerList1 = val;
        });
        bannerAction(2).then(val => (this.bannerList2 = val));

        this.getBasicStatistics().then(
          statistics =>
            (this.statistics = _.map(statistics, (val, key) => ({
              title: this.getTabLabelByKey(key),
              content: val
            })))
        );
        // this.getEntryGroupCategories({
        //     type: 2
        // }).then(val => (this.storeList = val));

        const arr = await this.getannounce({
          type: 5
        });
        this.noticeList = arr;//赋值给noticeList  由于时间原因 暂时就这么写吧
        this.noticeLoad = true//判断数据是否已经加载完成
        // 获取黄页分类
        this.getEntryGroupCategories({
          type: 8
        }).then(entryCategories => this.formatEntryGroups(entryCategories));
      },
      clickHandle() {
        this.goPointPage({path: "/shopDetail", query: {id: 7}});
      },
      getConfigByCmpName(name) {
        return _.find(this.defaultConfig, {cmpName: name}).config;
      },
    },
    computed: {
      ...mapState("common", {
        storeConfig: state => state.storeConfig
      }),
      ...mapState("home", {
        defaultConfig: state => state.defaultConfig
      }),
      ...mapState({
        user: s => s.user,
        platform: s => s.platform
      }),
      storeCanEnter() {
        return this.storeConfig && +this.storeConfig.enter === 1;
      },
      noticeConfig: () => noticeConfig(),
      searchOptions: () => searchOptions(),
      bannerConfig: () => bannerConfig(),
      entryBtnConfig() {
        const config = entryBtnConfig();
        config.color = "#333";
        return {...config, entryButtonList: this.entryCategories};
      }
    },
    mixins: [utilMixins],
    async created() {

      this.getCmpInitializationData();
      let data = await this.getYellowPageSetUp();

      console.log("黄页的配置信息", data)

      this.suffix = data.field || '黄页'
      updateShareConfig({
        title: data.title,
        imgUrl: data.shareImg,
        desc: data.shareDescription,
      });
    }
  };
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  .banner-box {
    padding-top: 0;
  }

  .settled {
    width: 100px;
    height: 100px;
    position: fixed;
    right: 40px;
    bottom: 300px;
    border-radius: 50%;
    background: $themeColor;
    text-align: center;
    line-height: 100px;
    color: #fff;
    z-index: 500;
    font-size: 60px;
  }

  #yellowIndex {
    padding-bottom: 150px;
    position: relative;
    min-height: 100%;

    .entry-button-group {
      margin: 1px 0;
      background: #fff;
    }
  }

  .box {
    margin: 16px 20px;
    border-radius: 8px;
  }
</style>
