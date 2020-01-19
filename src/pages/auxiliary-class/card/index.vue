<template>

  <dd-layout-div>
    <dd-layout-search :config="searchConfig" search-type="10"/>
    <Banner
      :height="platform.slideNum"
      :swiper="{children:banners}"
    />
    <div class="pad-30 flex-y-center bg-f">
      <div class="flex-g-1 br-r-d">
        <div class="fon-wb mar-b-20 fon-b">数据分析</div>
        <p class="flex-y-center"><span class="pad-4-4-2 br-d col-6">超级名片</span></p>
      </div>
      <div class="flex-g-1">
        <div class="fon-wb mar-b t-c fon-xl">{{parseFloat(formatNumber(statistics.browse))}}<span
          v-if="statistics.browse >= 10000" class="fon-sm fon-w1">万</span><span class="fon-w1 fon-xss">次</span></div>
        <p class="col-9 t-c"><i class="iconfont icon-shuji col-t fon-xss mar-r-10"></i>浏览量</p>
      </div>
      <div class="flex-g-1">
        <div class="fon-wb mar-b t-c fon-xl">{{parseFloat(formatNumber(statistics.post))}}<span
          v-if="statistics.post >= 10000" class="fon-sm fon-w1">万</span><span class="fon-w1 fon-xss">条</span></div>
        <p class="col-9 t-c"><i class="iconfont icon-shangyi col-t fon-xss mar-r-10"></i>信息发布</p>
      </div>
    </div>
    <dd-layout-announce announceType="card" class="mar-b-20"/>

    <div v-if="bannerTwo&&bannerTwo.length">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(item,key) in bannerTwo" :key="key">
          <img :src="getPathByAssetPath(item.url)" style="width: 100%; height:140px" alt="">
        </van-swipe-item>
      </van-swipe>
    </div>


    <!--名片库首页-->
    <div class="dd-card">

      <dd-tree-select
        :fixedTop="true"
        ref="choiceTree"
        @choice="choiceResult"
        :trees="trees"
        v-if="showChoice"
        @closed="showChoice = false"
      ></dd-tree-select>
      <dd-tree-select
        @openTree="openTree"
        :isHideTree="true"
        :trees="trees"
      ></dd-tree-select>
      <card-tips v-if="myCardLength<1"></card-tips>
      <div v-if="cardList.length>0">
        <card :list="cardList"/>
        <More :status="hasMore"></More>
      </div>
      <not-data v-else></not-data>
    </div>
  </dd-layout-div>
</template>

<script>
  import Banner from '@/components/home/banner';
  import Card from '../../../components/template/card/two'
  import CardTips from '../../../components/template/card/tips'
  import DdTreeSelect from '../../../components/template/dd-tree-select'
  import Search from '../../../components/template/dd-form/search'
  import More from '../../../components/template/more';
  import SearchWithLocation from "../../../components/home/search-with-location";
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {hideLoading, showLoading} from "../../../util";
  import {getLocation, updateShareConfig} from "../../../util/wechat-util";
  import DdLayoutAnnounce from "../../../components/layout/dd-layout-announce";

  export default {
    components: {DdLayoutAnnounce, Banner, Card, CardTips, DdTreeSelect, More, Search, SearchWithLocation},
    data() {
      return {
        showChoice: false,
        banners: [],
        bannerTwo: [],
        statistics: {
          browse: 0,
          post: 0
        },
        searchConfig: {
          keyWords: '想找的搜出来',
          shape: 3
        },
        trees: [
          {
            title: '排行榜',
            items: [
              {text: '人气榜', sort: 'hot'},
              {text: '最新', sort: 'new'},
              {text: '点赞榜', sort: 'love'},
              {text: '最多收藏', sort: 'follow'},
              {text: '附近的人', sort: 'nearest'},
            ]
          },
          {
            title: '全部行业',
            items: [],
          },
          {
            title: '所有区域',
            items: [],
          }
        ],
        type: "",
        cardList: [],
        hasMore: true,
        queryParams: {
          typeId: null,
          typePid: null,
          zoneId: null,
          sort: "hot",
          page: 1,
          size: 10
        },
        myCardLength: "",
      }
    },
    methods: {
      ...mapActions(['getInformationAdList', 'getAnnounce']),
      ...mapActions("card", ["getCardConfig", "getCategoryList", "getCardMeal", "postSaveCard", "getCardList", "getMyList", "cardStatistics"]),
      ...mapActions("businessDistrict", ["getLocationOption",]),
      call(tel) {
        location.href = `tel://${tel}`;
      },
      openTree(index) {
        this.type = index;
        console.log("index", this.type)
        this.showChoice = true;
        setTimeout(() => {
          this.$refs.choiceTree.openTree(index);
        })
      },
      choiceResult(item) {
        this.showChoice = false;
        console.log('choiceResult', item);
        if (this.type == 0) {
          this.queryParams.sort = item.sort;
        } else if (this.type == 1) {
          this.queryParams.typeId = item.id;
          this.queryParams.typePid = item.pid;
        } else {
          this.queryParams.zoneId = item.id
        }
        this.getData(true)
      },
      async getMyCardLength() {
        const res = await this.getMyList({
          page: 1,
          size: 10,
        })
        if (res.code == 1) {
          this.myCardLength = res.data.length;
        }
      },
      async getData(refresh) {
        showLoading();
        const res = await this.getCardList(this.queryParams);
        hideLoading();
        this.cardList = refresh ? res.data : this.cardList.concat(res.data);

        if (res.data.length < this.queryParams.size) this.hasMore = false;

        return res.data;
      },
      onInfinite() {
        if (this.hasMore) {
          this.queryParams.page++;
          this.getData();
        }
      }

    },
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
      ...mapGetters("businessDistrict", ["formatLocationOption",]),
      ...mapGetters("card", ["formatCategoryOption"]),
      searchOptions() {
        return {
          "position": 0,
          "shape": 3,
          "height": 42,
          "borderStyle": 0,
          "fontStyle": "left",
          "recommendSearch": 1,
          "searchBoxList": [
            {
              "id": 1545381832,
              "icon": "http://static.shanjiezhifu.com/zhihui/cert.png",
              "typesetting": 0,
              "style": 0,
              "link": ""
            }
          ],
          "keyWords": ""
        }
      },
    },
    async created() {


      this.cardStatistics().then(result => {
        console.log("cardStatistics=>", result)

        this.statistics.browse = result.viewNum
        this.statistics.post = result.joinNum
      })

      // 分享设置
      this.getCardConfig().then(result => {
        document.title = this.$parent.footerConfig.footerInfo[1].name = result.field || '名片库';
        updateShareConfig({
          title: result.title,
          imgUrl: result.shareImg,
          desc: result.shareDescription,
        })
      })
      // 获取用户当前的坐标
      try {
        window.wxReady(async () => {
          showLoading("定位中");
          let latLng = await getLocation();
          hideLoading();
          this.getData();
          //获取地区和分类数据
          await Promise.all([this.getLocationOption(), this.getCategoryList({term: 13})]);
          this.$set(this.trees[2], 'items', this.formatLocationOption)
          this.$set(this.trees[1], 'items', this.formatCategoryOption);
          console.log("this.formatCategoryOption", this.formatCategoryOption)
          console.log(this.trees)
          this.queryParams.lat = latLng.latitude;
          this.queryParams.lng = latLng.longitude;
        })
      } catch (e) {
        console.log(e)
      }
      if (this.$route.query.sort) {
        this.queryParams.sort = this.$route.query.sort;
        const res = await this.getCardList({...this.queryParams});
        this.cardList = res.data;
        this.trees[0].title = "人气榜"
      }
      this.getMyCardLength()
      this.onscroll(this.onInfinite, this.$route.path);
      /** 幻灯片 */
      this.getInformationAdList({
        type: 13,
        adType: 1
      }).then(result => {
        result.data.forEach(v => v.notHost = true)
        this.banners = result.data || [];
      });
    }
  }


</script>
