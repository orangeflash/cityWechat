<template>
  <div id="BusinessDistrict">
    <dd-layout-search :config="searchConfig" search-type="1"/>
    <Banner v-if="bannerList1.length"
            :height="platform.slideNum"
            :swiper="{children:bannerList1}"/>
    <div class="pad-30 flex-y-center bg-f">
      <div class="flex-g-1 br-r-d">
        <div class="fon-wb mar-b-20 fon-b">数据分析</div>
        <p class="flex-y-center"><span class="pad-8-10-4 br-d col-6">整站统计</span></p>
      </div>
      <div class="flex-g-1">
        <div class="fon-wb mar-b t-c fon-xl">{{parseFloat(formatNumber(statistics.browse))}}<span
          v-if="statistics.browse >= 10000" class="fon-sm fon-w1">万</span><span class="fon-w1 fon-xss">次</span></div>
        <p class="col-9 t-c"><i class="iconfont icon-shuji col-t fon-xss mar-r-10"></i>浏览量</p>
      </div>
      <div class="flex-g-1">
        <div class="fon-wb mar-b t-c fon-xl">{{parseFloat(formatNumber(statistics.enter))}}<span
          v-if="statistics.enter >= 10000" class="fon-sm fon-w1">万</span><span class="fon-w1 fon-xss">家</span></div>
        <p class="col-9 t-c"><i class="iconfont icon-store1 col-t fon-xss mar-r-10"></i>{{storeConfig.field}}入驻</p>
      </div>
    </div>
    <entry-button-group v-bind="entryBtnConfig"/>
    <dd-layout-notice :hidden-box-sha="true" pagePath="store" class="mar-tb">
      <div slot="left" class="w-82 miw-82 dh-82 flex-center br-r-10">
        <img :src="businessNotice" class="w100 hei100">
      </div>
      <div v-if="storeCanEnter" slot="right" @click="featureClick"
           class="w-82 miw-82 mar-l dh-82 bg-FF4800 flex-center br-r-10">
        <span class="col-f fon-b t-c lineH-38">立即 入驻</span>
      </div>
    </dd-layout-notice>
    <Banner v-if="bannerList2.length"
            height="140"
            :swiper="{children:bannerList2}"/>
    <dd-layout-part-list :info-title="`${storeConfig.field}推荐`" v-if="businessRecommend.length > 0">
      <div class="w-160 mar-l"
           @click="goPointPage({path:'/shopDetail',query:{storeId:item.id}})"
           v-for="(item,key) in businessRecommend" :key="key">
        <dd-layout-img
          :width="1.6" :height="1.6" :fillet="0.2"
          :src="item.logo"/>
        <div class="fon-wb hide-e pad-tb w100">{{item.name}}</div>
      </div>
    </dd-layout-part-list>

    <dd-layout-part-list :info-title="`全部${storeConfig.field}`" class="bg-tran">
      <div class="flex-bt dh flex-bt w100 flex-y-center">
        <div v-for="(item,key) in storeConfig.sort"
             :key="key"
             :class="params.sort == item.value?'col-3 fon-wb fon-xll':'fon-lg col-9'"
             class=" dh mar-lr flex-center flex-g-1"
             @click="changeType(item.value)"
        >
          <div class="posi-r dh flex-y-center">
            {{item.name}}
            <span v-if="params.sort == item.value" class="dh-8 posi-a b0 flex-center w100">
            <em class="bg-t dh-8 w-48 br-r-16"></em>
          </span>
          </div>
        </div>
      </div>
    </dd-layout-part-list>
    <div class="mar-lr pad-b">

      <business
        :business="item"
        :sort="params.sort"
        v-for="(item,key) in businessList"
        :key="key"
      />
      <more :status="hasMore"/>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import _ from "lodash";
  import {utilMixins} from "../../plugins/util-mixins";
  import {
    bannerConfig,
    entryBtnConfig,
    noticeConfig,
    searchOptions
  } from "./page-config";
  import {Toast} from "vant";
  import {getLocation, updateShareConfig} from "../../util/wechat-util";

  import DdLayoutSearch from "../../components/layout/dd-layout-search"; //搜索
  import Banner from '../../components/home/banner';
  import EntryButtonGroup from "../../components/basic/entry-button-group";
  import businessNotice from '../../assets/img/business-district/business-notice.png'
  import DdLayoutNotice from '../../components/layout/dd-layout-notice'
  import DdLayoutImg from "../../components/layout/dd-layout-img";   //首页 通知
  import DdLayoutPartList from "../../components/layout/dd-layout-part-list";
  import renzheng from '../../assets/img/attest/renzheng.png'
  import {computedDate, hideLoading, showLoading} from "../../util";
  import Business from "../../components/template/item/business";

  export default {
    name: "BusinessDistrict",
    components: {Business, DdLayoutImg, DdLayoutSearch, Banner, EntryButtonGroup, DdLayoutNotice, DdLayoutPartList},
    data() {
      return {
        businessNotice,
        renzheng,
        params: {
          page: 1,
          size: 10,
          sort: 'nearest'
        },
        hasMore: true,
        latLng: {},
        searchConfig: {
          keyWords: '想找的搜出来',
          shape: 3
        },
        statistics: {
          browse: 1,
          post: 1,
          enter: 1
        },
        store: "store",
        bannerList1: [],
        bannerList2: [],
        noticeList: [],
        entryCategories: [],
        isEnter: false,
        businessList: [],
        businessRecommend: []
      };
    },
    methods: {
      ...mapActions("common", [
        "getBusinessList",
        "getBannerListByType",
        "getStoreConfig"
      ]),
      ...mapActions("shop", ["getShopListByParams"]),
      ...mapActions("home/components", [
        "getAnnounceList",
        "getBasicStatistics",
        "getEntryGroupCategories",
        "getPostStatistics"
      ]),
      ...mapActions("businessDistrict", ["getStoreByAdminId"]),
      onInfinite() {
        this.params.page++;
        this.hasMore && this.getBusinessList();
      },
      async onRefresh() {
        this.params.page = 1;
        this.hasMore = true;
        return await this.getBusinessList(true);
      },
      async changeType(type) {
        this.params.sort = type;
        showLoading()
        await this.onRefresh();
        hideLoading();
      },
      async getBusinessList(refresh) {
        let res = await this.getShopListByParams({
          ...this.params,
          ...this.latLng
        });
        res = res.map(item => {
          return {
            logo: this.getSingleImg(JSON.parse(item.storeLogo)[0].url),
            name: item.storeName,
            viewNum: item.viewNum,
            startTime: item.businessStartTime,
            endTime: item.businessEndTime,
            tag: item.storeLabel,
            address: item.address,
            id: item.id,
            list: item.list,
            isAuth: +item.isAuth,
            typeName: item.typeName,
            newName: item.newName,
            distance: item.distance,
            enterTime: computedDate(item.enterTime)
          }
        })


        this.businessList = refresh ? res : this.businessList.concat(res);
        this.hasMore = res.length >= this.params.size;
        return res
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
            type: 2,
            adType
          });

        bannerAction(1).then(val => {
          val.forEach(v => (v.notHost = true));
          this.bannerList1 = val;
        });
        bannerAction(2).then(val => {
          val.forEach(v => (v.notHost = true));
          this.bannerList2 = val;
        });

        this.getPostStatistics().then(statistics => {
          console.log('statistics', statistics)

          for (let i in statistics) {
            this.statistics[i] = statistics[i] || 0
          }
        });
        this.getEntryGroupCategories({
          type: 2
        }).then(val => (this.storeList = val));


        this.getEntryGroupCategories({
          type: 2
        }).then(entryCategories => this.formatEntryGroups(entryCategories));
      },
      clickHandle() {
        this.goPointPage({path: "/shopDetail", query: {id: 7}});
      },
      async featureClick() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        if (this.isEnter) return Toast("您的门店待审核中");
        this.goPointPage("/publication/businessEnterForm");
      },
      getConfigByCmpName(name) {
        return _.find(this.defaultConfig, {cmpName: name}).config;
      },
      async isBusiness() {
        const storeInfo = await this.getStoreByAdminId({
          adminId: this.user.id
        });

        if (storeInfo && storeInfo.length && storeInfo[0].status == '0') {
          this.isEnter = true;
        }
      }
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
        return {...config, entryButtonList: this.entryCategories};
      }
    },
    mixins: [utilMixins],
    async created() {
      this.getCmpInitializationData();

      this.getShopListByParams({
        page: 1,
        size: 10,
        isRecommend: 1,
        ...this.latLng
      }).then(res => {
        this.businessRecommend = res.map(item => {
          return {
            logo: this.getSingleImg(JSON.parse(item.storeLogo)[0].url),
            name: item.storeName,
            viewNum: item.viewNum,
            startTime: item.businessStartTime,
            endTime: item.businessEndTime,
            tag: item.storeLabel,
            address: item.address,
            id: item.id,
            list: item.list
          }
        })
      });
      this.isBusiness();


      // 获取用户当前的坐标
      let {data} = await this.getStoreConfig();
      console.log(data)
      document.title = data.field + '首页'
      updateShareConfig({
        title: data.title,
        imgUrl: data.shareImg,
        desc: data.shareDescription,
        link: window.location.href
      });
      try {
        // 获取用户当前的坐标
        let latLng = await getLocation();
        this.latLng.lat = latLng.latitude;
        this.latLng.lng = latLng.longitude;
      } catch (e) {
        console.log(e)
      }
      this.changeType(this.storeConfig.sort[0].value)
      this.onscroll(this.onInfinite, this.$route.path);
    }
  };
</script>
