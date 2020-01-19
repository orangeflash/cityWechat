<template>
  <div id="SearchList">
    <div v-if="tabConfig.name&&dataList.length"
         :class="tabConfig.parentClassName"
         :style="tabConfig.parentStyle"
    >
      <component
        :class="tabConfig.className"
        @showMore="showMore"
        @topPost="onTopPost"
        @refresh="()=>{changeTab(active)}"
        v-for="(data,key) in dataList" :key="key"
        v-bind="getRightBind(data)"
        :is="tabConfig.name"
        @click="tabConfig.path?go(tabConfig,data):'void 0'"
        @call="call(data.tel)"
        @message="goPointPage({path:'/conversation',query:{tId:data.userId}})"
      />

    </div>
    <More :status="hasMore"></More>
    <not-data v-if="dataList.length ==0&&!hasMore"/>
  </div>
</template>
<script>

  import {mapActions, mapState, mapGetters} from "vuex"
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import PlaceholderImg from "@/assets/img/personal/my_publication_placeholder.jpg";
  import StoreTabItem from "@/components/template/item/business";
  import FreeRideCard from '@/components/template/free-ride-card'                      // 顺风车卡片
  import ListItem from "@/components/yellow-page/list-item";       //黄页
  import HuntFind from "@/components/template/item/hunt-find";                          //求职招聘(招)
  import JobFind from "@/components/template/item/job-find";                  //求职招聘(求)
  import HousingDealCard from '@/components/template/housing-deal-card';            //房屋租售
  import GoodsCard from '@/components/template/goods-card';       //多商户商城
  import DdArticleActivity from '@/components/template/item/activity';   //同城活动
  import Card from '@/components/template/card/two'     //超级名片
  import Assemble from '@/components/template/item/assemble'     //全民拼团
  import RushBuy from '@/components/template/rush-buy/rush-buy'   //限时抢购
  import DdCoupon from '@/components/template/item/coupon'      // 优惠卷
  import DdBargain from '@/components/template/item/bargain'      // 砍价
  import VipPrivilege from "@/components/template/vip/vip-privilege"; //会员卡
  import PostCord from "@/components/layout/dd-layout-article-info";
  import {getRightTemplate} from "../../project-config";
  import {utilMixins} from "../../plugins/util-mixins";
  import {hideLoading, showLoading} from "../../util";
  import CityLove from "@/components/template/item/city-love";    //同城交友
  import CityLoveNotice from "@/components/template/item/city-love-notice";
  import ListItemxx from "@/components/template/item/xx";       //信息定制

  export default {
    name: "SearchList",
    mixins: [utilMixins],
    components: {
      DdBargain,
      PostCord,
      BasicNoteItem,
      StoreTabItem,
      FreeRideCard,
      ListItem,
      HuntFind,
      JobFind,
      HousingDealCard,
      GoodsCard,
      DdArticleActivity,
      Card,
      Assemble,
      RushBuy,
      DdCoupon,
      VipPrivilege,
      CityLove,
      CityLoveNotice,
      ListItemxx,
    },
    //props: ["tabList", "topMargin"],
    data() {
      return {
        PlaceholderImg,
        active: 0,
        hasMore: true,
        dataList: [],
        showPayMask: false,
        bind: {},
        tabConfig: {},
        tabs: [],
        searchType: '0',
        params: {
          lat: null,
          lng: null,
          page: 1,
          size: 10
        }
      }
    },
    methods: {
      ...mapActions("post", ["getPostListByParams", 'likePostAction']),
      ...mapActions("shop", ["getShopListByParams"]),
      ...mapActions("cityInformation", ["getCityInfoList"]),
      ...mapActions('freeRide', ['getCarList']),
      ...mapActions("YellowPage", ["getYellowList"]),
      ...mapActions("jobHunt", ["getHuntList","getJobList"]),
      ...mapActions('houingDeal', ["housingDealList"]),
      ...mapActions("mall", ['getMallGoodsList']),
      ...mapActions("activity", ["getActivityList"]),
      ...mapActions("card", ["getCardList"]),
      ...mapActions("storeAuxiliary/storeAssemble", ["getAssembleList"]),
      ...mapActions('rushBuy', ['getRushGoodsList']),
      ...mapActions('coupon', ['getCouponList']),
      ...mapActions('vip', ['getPrivilegeList']),
      ...mapActions("storeAuxiliary/storeBargain", ["getBargainList"]),
      ...mapActions("cityLove", ["cityLoveFriends", 'cityLoveGetDynamicList']),
      ...mapActions("Xx", ["XxList"]),
      call(tel) {
        location.href = `tel://${tel}`;
      },
      /** 跳页面 */
      go(item, data) {

        let json = this.jsonChangeField({
          json: data,
          fields: item.fields
        });
        let query = {}
        for (let f in item.fields) {
          query[item.fields[f]] = json[f];
        }
        this.goPointPage({
          path: item.path,
          query
        })
      },
      /** 获取正确的绑定值 */
      getRightBind(item) {
        let bind = this.tabConfig.other || {};

        bind[this.tabConfig.bind] = this.tabConfig.dataChange ? this.tabConfig.dataChange({
          item,
          params: {
            assetPath: this.assetPath,
            computedDate: this.computedDate
          },
          platform: this.platform
        }, this) : item;

        return bind;
      },
      //改变tab触发方法请求数据
      async changeTab(index) {
        showLoading("加载中");
        this.hasMore = true;
        try {
          const res = this.tabConfig
          const methodName = res.method;
          if (this.getType(index) == "number") {
            this.params.page = 1;
            this.dataList = [];
          }
          let datas = [];
          methodName && await this[methodName]({
            ...res.params,
            ...this.params
          }).then(result => {
            //console.log(methodName, result)
            if (this.getType(result) == 'array') {
              datas = res.ergodic ? result : [result];
            } else if (this.getType(result) == "json") {
              if (result.data && this.getType(result.data) == "array") {
                datas = res.ergodic ? result.data : [result.data]
              }
            }
            this.dataList = this.getType(index) == "number" ? datas : this.dataList.concat(datas);

            this.hasMore = res.ergodic ? datas.length >= this.params.size : datas[0].length >= this.params.size
          })
        } catch (e) {
          console.log(e)
        }


        hideLoading();
        return
      },

      // 调用父组件的函数方法
      onTopPost(item) {
        this.$root.$children[0].openArticleTop(item, (tips) => (tips) => {
          this.changeTab(this.active)
        })
      },
      showMore(item) {
        return this.$root.$children[0].openArticleMore(item, (tips) => {
          this.changeTab(this.active)
        });

      },
      //上拉加载触发的方法
      async onInfinite() {
        this.params.page++;
        this.hasMore && this.changeTab();
        return
      },
    },
    computed: {
      ...mapState("common", {
        latLng: state => state.latLng
      }),
    },
    created() {
      this.searchType = this.$route.query["searchType"];
      this.params.word = this.$route.query["keyWords"];
      this.params.lat = this.latLng.latitude;
      this.params.lng = this.latLng.longitude;
      this.tabConfig = getRightTemplate(this.searchType)
      this.changeTab();
      this.color = this.$themeColor;
      this.onscroll(this.onInfinite, this.$route.path);
    }
  }
</script>

<style lang="scss">
  @import "../../assets/theme";

  #SearchList {
    /*padding-bottom: 100px;*/
    .c-more-btn {
      background-color: #fff;
      padding: 30px;
      text-align: center;
      font-size: 28px;
      color: #2d2d2d;
    }

  }

  .van-tab > span {
    font-size: 16px;
  }
</style>
