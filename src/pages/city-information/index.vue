<template>
  <div id="city-information">
    <dd-layout-search :config="searchConfig" search-type="2"/>
    <Banner v-if="banners.length"
            :height="platform.slideNum"
            :swiper="{children:banners}"/>
    <entry-button-group v-if="entryButtonList.length" :entryButtonList="entryButtonList" :buttonNumberOfCol="5"
                        :buttonNumberOfRow="2"></entry-button-group>

    <!-- 暂不需要公告
    <dd-layout-notice :hidden-box-sha="true" pagePath="classification">
      <div slot="left" class="w-82 miw-82 dh-82 flex-center br-r-10">
        <img :src="infoNotice" class="w100 hei100">
      </div>
      <div slot="right" class="w-82 miw-82 mar-l dh-82 bg-FF4800 flex-center br-r-10">
        <span class="col-f fon-b t-c">发布 信息</span>
      </div>
    </dd-layout-notice>
     -->

    <dd-layout-announce announceType="cityInformation" class="mar-b-20"/>

    <Banner v-if="centerBanners.length"
            height="140"
            :swiper="{children:centerBanners}"/>
    <dd-layout-part-list :info-title="`热门${zxConfig.field}`" v-if="essence.length > 0">
      <dd-layout-part
        v-for="(item,key) in essence"
        :key="key"
        class="mar-l"
        :src="item.src"
        :title="item.title"
        @click="goPointPage({path:'/cityInformation/detail',query:{id:item.id}})"
      >
        <span class="flo-r col-9 fon-xss fon-w4" slot="tips">{{item.browse}}浏览</span>
        <div slot="cover" class="tips-bg h-42 w-77 flex-center posi-a mar-l b0 mar-b-010 fon-xss fon-wb">精华</div>
      </dd-layout-part>
    </dd-layout-part-list>

    <div class="bg-f">
      <dd-layout-article-info
        v-for="(item ,key) in getInfoList"
        :key="key"
        v-bind="item"
        @click="goPointPage({path:'/cityInformation/detail',query:{id:item.id}})"
        :class="key < getInfoList.length - 1 &&'br-b-F0'"
      />
    </div>
    <more :hasMore="hasMore"/>
  </div>
</template>
<script>
  import dayjs from "dayjs";
  import DdLayoutSearch from "../../components/layout/dd-layout-search"; //搜索
  import Banner from '../../components/home/banner';
  import DdLayoutNotice from '../../components/layout/dd-layout-notice'   //首页 通知


  import {mapActions, mapState, mapGetters} from 'vuex'
  import myPublicationPlaceholder from "../../assets/img/personal/my_publication_placeholder.jpg"
  import EntryButtonGroup from "../../components/basic/entry-button-group";
  import {getLocation, updateShareConfig} from "../../util/wechat-util";
  import infoNotice from '../../assets/img/city-information/info-notice.png'
  import {computedDate, hideLoading, showLoading} from "../../util";
  import DdLayoutPartList from "../../components/layout/dd-layout-part-list";
  import DdLayoutPart from "../../components/layout/dd-layout-part";
  import DdLayoutArticleInfo from "../../components/layout/dd-layout-article-info";
  import {utilMixins} from "../../plugins/util-mixins";
  import DdLayoutAnnounce from "../../components/layout/dd-layout-announce";


  export default {
    mixins: [utilMixins],
    name: 'CityInformation',
    components: {
      DdLayoutAnnounce,
      DdLayoutArticleInfo,
      DdLayoutPartList, DdLayoutSearch, Banner, EntryButtonGroup, DdLayoutNotice, DdLayoutPart
    },
    data() {
      return {
        infoNotice,
        searchConfig: {
          keyWords: '想找的搜出来',
          shape: 3
        },
        noticeConfig: {},
        cityIconList: [],
        centerBanners: [],
        weather: '',
        banners: [],
        postlist: [],
        essence: [],
        week: '',
        hasMore: true,
        params: {
          page: 1,
          size: 10,
        },

        iconfontWeather: '',
        actions: {
          '晴': 'icon-tianqi-qing',
          '多云': 'icon-duoyun',
          '中雨': "icon-zhongyu",
          '小雨': 'icon-xiaoyu',
          '暴雨': 'icon-baoyu',
          '阵雨': 'icon-zhenyu',
          '雷阵雨': 'icon-leizhenyu',
          '霾': 'icon-mai',
          '大雨': 'icon-dayu',
          '阴': 'icon-yin',
          '少云': 'icon-3shaoyun',
          '雾': "icon-wu",
          'default': "icon-duoyun",
        },
        weekDays: {
          "Sunday": '星期天',
          "Monday": '星期一',
          "Tuesday": '星期二',
          "Wednesday": '星期三',
          "Thursday": '星期四',
          "Friday": '星期五',
          "Saturday": '星期六',
        },
        entryButtonList: [],
        myPublicationPlaceholder,
      }
    },
    methods: {
      ...mapActions("cityInformation", ['getCityInfoList', 'getCityCategory', 'getZxConfig']),
      ...mapActions("common", ['getBannerListByType', 'getLocationByLatLng', 'getWether']),
      ...mapActions(['getInformationAdList']),
      ...mapState("cityInformation", {
        cityInfoList: state => state.cityInfoList
      }),
      async getCityCategorylist(attribute) {
        let zoneId = JSON.parse(localStorage.getItem("GlobalData")).cityId ? JSON.parse(localStorage.getItem("GlobalData")).cityId : 258;

        // showLoading();

        const arr = await this.getCityInfoList({
          ...this.params,
          attribute,
          zoneId
        })

        if (arr.length) {
          this.postlist = this.postlist.concat(arr);
        } else if (!attribute) {
          this.params.page--;
          this.hasMore = false;
        }

        // hideLoading();
        return arr;
      },
      onInfinite() {
        if (!this.hasMore) return false;
        this.params.page++;
        this.getCityCategorylist();
      },

      async getWetherInfo() {
        window.wxReady(async () => {
          let latLng = {}
          try {
            latLng = await getLocation();
          } catch (e) {
            //定位失败可以使用vuex中存的后台返回的默认latLng
            latLng = this.latLng
          }
          let adInfo = (await this.getLocationByLatLng({
            latitude: latLng.latitude,
            longitude: latLng.longitude,
          }))
          //console.log(this.address)
          this.weather = await this.getWether(adInfo.ad_info.adcode);
          let data = '';
          data = dayjs(this.weather.reporttime).format('dddd');
          this.getcomparisonData(data)
          this.getcontrast(this.weather.weather)
        })
      },
      getcontrast(thisWeather) {
        const action = this.actions[thisWeather] || this.actions['default'];
        this.iconfontWeather = action;
      },
      getcomparisonData(thisWeek) {
        let weekDay = this.weekDays[thisWeek];
        this.week = weekDay;
      },
      async getButtonList() {
        this.entryButtonList = await this.getCityCategory({type: 3})
        this.entryButtonList.forEach(v => {
          v.url = this.getPathByAssetPath(v.icon);
          v.path = "/cityInformation/categoryList"
          v.label = v.name;
          v.entry = {
            path: "/cityInformation/categoryList",
            query: {label: v.name, url: this.getPathByAssetPath(v.icon), id: v.id}
          }
        })
      }
    },
    computed: {
      ...mapState({
        platform: state => state.platform
      }),
      ...mapState("common", {
        latLng: state => state.latLng
      }),
      ...mapState("cityInformation", ['zxConfig']),
      getInfoList() {

        return this.postlist.map(item => {

          let pictures = [];

          if (item.media && item.media.length > 2) {
            pictures = JSON.parse(item.media).map(item => {
              return this.getSingleImg(item.url);
            })
          }
          return {
            title: item.title,
            attribute: +item.attribute,
            pictures,
            time: computedDate(item.createdAt) + '发布',
            like: +item.loveNum || 0,
            comment: +item.commentNum || 0,
            browse: +item.browseNum || 0,
            id: +item.id
          }
        })
      }
    },
    async created() {
      this.getZxConfig().then(() => {
        document.title = this.zxConfig.field || '同城资讯';
      })
      //配置转发信息
      // updateShareConfig({});

      // 幻灯片
      this.getInformationAdList({
        type: 4,
        adType: 1
      }).then(result => {
        result.data.forEach(v => v.notHost = true)
        this.banners = result.data || []
      })
      // 中部广告位
      this.getInformationAdList({
        type: 4,
        adType: 2
      }).then(result => {
        result.data.forEach(v => v.notHost = true)
        this.centerBanners = result.data || []
      })
      this.getButtonList();

      //this.getCityAd();
      this.getCityCategorylist();
      this.getCityInfoList({
        page: 1,
        attribute: 2,
        zoneId: JSON.parse(localStorage.getItem("GlobalData")).cityId ? JSON.parse(localStorage.getItem("GlobalData")).cityId : 258,
      }).then(result => {
        this.essence = result.map(item => {
          let pictures = [];
          if (item.media && item.media.length > 2) {
            pictures = JSON.parse(item.media).map(item => {
              return this.getSingleImg(item.url);
            })
          }
          item.title = item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title
          return {
            title: item.title,
            browse: +item.browseNum,
            src: pictures.length > 0 ? pictures[0] : '',
            id: +item.id
          }
        })
      })
      // this.getCityCategorylist(2).then(result => {
      //   console.log("result", result)
      //
      //   this.essence = result.map(item => {
      //     let pictures = [];
      //     if (item.media && item.media.length > 2) {
      //       pictures = JSON.parse(item.media).map(item => {
      //         return this.getSingleImg(item.url);
      //       })
      //     }
      //     item.title = item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title
      //     return {
      //       title: item.title,
      //       browse: +item.browseNum,
      //       src: pictures.length > 0 ? pictures[0] : '',
      //       id: +item.id
      //     }
      //   })
      //
      // });


      // await cityLocations({key: this.platform.mapKey});
      // this.getWetherInfo();

      this.onscroll(this.onInfinite, this.$route.path);
    }
  }
</script>
