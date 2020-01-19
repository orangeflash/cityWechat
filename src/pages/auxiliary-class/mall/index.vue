<template>
  <div class="dd-mall">


    <dd-layout-search :config="searchConfig" search-type="8"/>

    <!--<div class="search-input">-->
    <!--<SearchWithLocation-->
    <!--search-type="8"-->
    <!--:noShowAddress="true"-->
    <!--:config="searchOptions"-->

    <!--&gt;</SearchWithLocation>-->
    <!--</div>-->
    <!--幻灯片-->
    <div class="banner-box" v-if="banners.length">
      <Banner
        :height="config.slideNum||platform.slideNum"
        :swiper="{children:banners}"
      />
    </div>
    <ButtonGroup
      :btns="buttonGroup"
    />

    <dd-layout-announce announce-type="mall" class="mar-b-20"/>
    <!--分类 & 通知-->
    <!--<div class="dd-mall_category"-->

    <!--&gt;-->
    <!--<ButtonGroup-->
    <!--:btns="buttonGroup"-->
    <!--&gt;</ButtonGroup>-->
    <!--<div class="dd-mall_category_notice">-->
    <!--<Notice v-bind="noticeConfig"></Notice>-->
    <!--</div>-->
    <!--</div>-->
    <!--中部广告位-->
    <div class="dd-mall_ad" v-if="ADBanners.length">
      <Banner
        :swiper="{children:ADBanners}"
        :height="100"
      ></Banner>
    </div>
    <dd-layout-business :config="{infoTitle:'推荐商家'}" class="bg-f"/>

    <dd-layout-rush-buy/>

    <dd-layout-collage/>

    <dd-layout-bargain/>

    <dd-layout-div class="over-a flex bg-f" v-if="tabs.length > 0">
      <dd-layout-div v-for="(item,key) in tabs" :key="key" class="flex-g-0 t-c option-e" :pad="[5,30]">
        <dd-layout-div
          class="fon-wb fon-xl mar-b-20"
          @click="tabsChange(item,key)"
          :class="params.typePid == item.id&&'col-t'"
        >{{item.name}}
        </dd-layout-div>
        <dd-layout-div v-if="params.typePid == item.id" class=" col-f fon-xss  bg-t" :pad="[8,15,4]" :mar="[-5,0,0]"
                       :fillet="20">
          {{item.title}}
        </dd-layout-div>
        <dd-layout-div v-else class=" col-bb">{{item.title}}</dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>

    <GoodsCard :list="goodsList"/>
    <not-data v-if="isRequest&&goodsList.length==0"></not-data>
    <More v-if="goodsList.length > 0" :status="hasMore"></More>

  </div>
</template>

<script>
  import Banner from '@/components/home/banner';
  import ButtonGroup from '@/components/template/button-group' // 按钮组
  import Notice from '@/components/template/notice'; // 公告
  import HorizontalTable from '@/components/template/horizontal-table'; // 横向列表
  import SearchWithLocation from "../../../components/home/search-with-location";
  import GoodsCard from '../../../components/template/goods-card';
  import DdTabs from '@/components/template/dd-tabs';
  import {mapActions, mapState} from "vuex";
  import {utilMixins} from "@/plugins/util-mixins";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {hideLoading, showDialog, showLoading} from "../../../util";
  import MallScrollGoods from "../../../components/template/item/mall-scroll-goods";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdLayoutRushBuy from "../../../components/layout/dd-layout-rush-buy";
  import DdLayoutCollage from "../../../components/layout/dd-layout-collage";
  import DdLayoutBargain from "../../../components/layout/dd-layout-bargain";
  import DdLayoutBusiness from "../../../components/layout/dd-layout-business";
  import DdLayoutAnnounce from "../../../components/layout/dd-layout-announce";

  export default {
    mixins: [utilMixins],
    components: {
      DdLayoutAnnounce,
      DdLayoutImg,
      MallScrollGoods,
      Banner,
      ButtonGroup,
      Notice,
      HorizontalTable,
      DdTabs,
      GoodsCard,
      SearchWithLocation,
      DdLayoutRushBuy,
      DdLayoutCollage,
      DdLayoutBargain,
      DdLayoutBusiness
    },
    data() {
      return {
        searchConfig: {
          shape: 3,
        },
        isRequest: false,
        tabs: [],
        active: 0,
        banners: [],
        ADBanners: [],   //中部广告
        buttonGroup: [],
        businessGroup: [],
        bargain: [],
        assemble: [],    //拼团
        rushGoods: [],   //抢购
        hasMore: true,
        noticeConfig: {
          title: '商城头条',
          contents: []
        },
        config: {},
        goodsList: [],
        params: {
          page: 1,
          size: 10,
          typePid: null,   //父级id 搜索使用
          typeId: null,    //子级id 搜索使用
          word: null,      //关键字 搜索使用
        },
      }
    },
    methods: {
      ...mapActions("mall", [
        'getMallConfig',
        'getMallClassNav',
        'getMallBusinessList',
        'getMallFristCategory',
        'getMallGoodsList',
        'getMallCategory'
      ]),
      ...mapActions(['getInformationAdList', 'getAnnounce']),
      ...mapActions("storeAuxiliary/storeAssemble", ["getAssembleList"]),
      ...mapActions("storeAuxiliary/storeBargain", ["getBargainList"]),
      ...mapActions('rushBuy', ['getRushGoodsList']),

      /** 获取商品列表 */
      async getGoods(refresh) {
        showLoading();
        const result = await this.getMallGoodsList(this.params);

        result.forEach(item => {
          item.vipMoney = this.platform.openVip ? +item.vipMoney : null;
        })

        this.goodsList = refresh ? result : this.goodsList.concat(result);
        this.hasMore = result.length >= this.params.size;
        this.isRequest = true;
        hideLoading();
        return this.hasMore;
      },
      /**上拉加载 */
      async onInfinite(done) {
        console.log("上拉加载", this.hasMore)
        if (this.hasMore) {
          this.params.page++;
          await this.getGoods();
        }
      },
      /** tabs事件 */
      tabsChange(item, key) {
        this.params.page = 1;
        this.params.typePid = item.id;
        this.isRequest = false
        this.getGoods(true);
      }
    },
    computed: {
      ...mapState({
        platform: s => s.platform,
        user: s => s.user
      }),
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
          "keyWords": "请输入商品名称"
        }
      },
    },
    created() {
      /** 获取公告 */
      this.getAnnounce({
        type: 6,
      }).then(result => {
        console.log("公告信息", result);
        this.noticeConfig.contents = result || [];
      })

      this.getMallConfig().then(result => {
        console.log("getMallConfig", result);
        this.config = result;
        document.title = this.$parent.footerConfig.footerInfo[1].name = this.config.field || '商城';
        try {
          updateShareConfig({
            title: this.config.title,
            imgUrl: this.config.shareImg,
            desc: this.config.shareDescription,
          });
        } catch (e) {
          showDialog(e);
        }
      })

      /** 幻灯片 */
      this.getInformationAdList({
        type: 11,
        adType: 1
      }).then(result => {
        result.data.forEach(v => v.notHost = true)
        this.banners = result.data || [];
      });
      /** 中部广告位 */
      this.getInformationAdList({
        type: 11,
        adType: 2
      }).then(result => {
        result.data.forEach(v => v.notHost = true)
        this.ADBanners = result.data || [];
      });
      /** 获取分类 */
      this.getMallClassNav().then(result => {
        this.buttonGroup = result;
      })
      this.getMallBusinessList().then(result => {
        this.businessGroup = result;
      })
      // this.getMallFristCategory().then(result => {
      //   console.log('getMallFristCategory', result)
      // })
      this.getMallCategory().then(result => {
        this.tabs = [{name: '推荐', active: true, title: '猜你喜欢'}].concat(result);
      })
      this.getGoods();


      this.getAssembleList(this.params).then(result => {
        this.assemble = result.map(item => {
          return {
            id: item.id,
            cover: item.showImgs[0] && this.getSingleImg(item.showImgs[0].url),
            info: item.title,
            money: item.groupPrice,
            originalPrice: item.originalPrice,
            groupNum: item.groupNum,
            alonePrice: item.alonePrice
          }
        })
      })


      this.getBargainList(this.params).then(result => {
        this.bargain = result.map(item => {
          return {
            cover: this.getSingleImg(item.logo),
            money: item.floorPrice,
            price: item.price,
            info: item.title,
            joinNum: item.receiveNum || 0,
            browseNum: item.viewNum || 0,
            id: item.id
          }
        })
      })


      this.getRushGoodsList(this.params).then(result => {
        this.rushGoods = result.map(item => {
          return {
            cover: item.showImgs.length && this.getSingleImg(item.showImgs[0].url),
            info: item.title,
            price: (+item.originalPrice).toFixed(2),
            money: (+item.rushPrice).toFixed(2),
            id: item.id,
          }
        })
      })


      this.onscroll(this.onInfinite, this.$route.path);
    }
  }

</script>
