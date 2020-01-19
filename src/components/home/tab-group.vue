<template>
  <div id="TabGroup" :style="{marginTop:`${topMargin}px`}">
    <van-tabs @click="changeTab" v-model="active" :color="$themeColor" :lineWidth="25">
      <van-tab v-for="(item,index) in tabs" :key="index" :title="item.title">
        <template>
          <div v-if="item.name==tabConfig.name&&dataList.length"
               :class="item.parentClassName"
               :style="item.parentStyle"
               class="bg_search_bg"
          >
            <component
              :class="item.className"
              @showMore="showMore"
              @topPost="onTopPost"
              @refresh="()=>{changeTab(active)}"
              v-for="(data,key) in dataList" :key="key"
              v-bind="getRightBind(data)"
              :is="item.name"
              @click="item.path?go(item,data):'void 0'"
              @call="call(data.tel)"
              @message="goPointPage({path:'/conversation',query:{tId:data.userId}})"
            />

          </div>
          <More :status="hasMore"></More>
          <not-data v-if="dataList.length ==0&&isRequest"/>

        </template>

      </van-tab>
    </van-tabs>
  </div>
</template>
<script>

  import {mapActions, mapState, mapGetters} from "vuex"
  import BasicNoteItem from "../post/note-item/basic-note-item";
  import _ from 'lodash'
  import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";
  import EmptyView from "../basic/empty-view";
  import StoreTabItem from "../../components/template/item/business";
  import FreeRideCard from '@/components/template/free-ride-card'                      // 顺风车卡片
  import ListItem from "@/components/yellow-page/list-item";       //黄页
  import JobTabItem from "@/components/template/item/hunt-find";                          //求职招聘
  import HousingDealCard from '@/components/template/housing-deal-card';            //房屋租售
  import GoodsCard from '@/components/template/goods-card';       //多商户商城
  import DdArticleActivity from '@/components/template/item/activity';   //同城活动
  import Card from '@/components/template/card/two'     //超级名片
  import Assemble from '@/components/template/item/assemble'     //全民拼团
  import RushBuy from '@/components/template/rush-buy/rush-buy'   //限时抢购
  import DdCoupon from '@/components/template/item/coupon'      // 优惠卷
  import DdBargain from '@/components/template/item/bargain'      // 砍价
  import VipPrivilege from "@/components/template/vip/vip-privilege"; //会员卡
  import CityLove from "@/components/template/item/city-love";    //同城交友
  import {getGlobalData, hideLoading, showDialog, showLoading} from "../../util";
  import PostCord from "../../components/layout/dd-layout-article-info";
  import {getLocation} from "../../util/wechat-util";
  import {getRightTemplate} from "../../project-config";
  import {utilMixins} from "../../plugins/util-mixins";
  import HuntFind from "@/components/template/item/hunt-find";                          //求职招聘(招)
  import JobFind from "@/components/template/item/job-find";                  //求职招聘(求)

  /***
   * 无法做下拉
   */
  export default {
    name: "TabGroup",
    mixins: [utilMixins],
    components: {
      PostCord,
      EmptyView,
      BasicNoteItem,
      StoreTabItem,
      FreeRideCard,
      ListItem,
      JobTabItem,
      HousingDealCard,
      GoodsCard,
      DdArticleActivity,
      Card,
      Assemble,
      RushBuy,
      DdCoupon,
      VipPrivilege,
      DdBargain,
      HuntFind,
      JobFind,
      CityLove
    },
    props: ["tabList", "topMargin"],
    data() {
      return {
        PlaceholderImg,
        active: 0,
        hasMore: true,
        dataList: [],
        showPayMask: false,
        bind: {},
        requesing: false,
        tabConfig: {},
        tabs: [],
        isRequest: false,
        params: {
          lat: null,
          lng: null,
          page: 1,
          size: 10
        }
      }
    },
    methods: {
      ...mapActions("common", ["getPostConfig"]),
      ...mapActions("post", ["getPostListByParams", 'likePostAction']),
      ...mapActions("shop", ["getShopListByParams"]),
      ...mapActions("cityInformation", ["getCityInfoList"]),
      ...mapActions('freeRide', ['getCarList']),
      ...mapActions("YellowPage", ["getYellowList"]),
      ...mapActions("jobHunt", ["getHuntList"]),
      ...mapActions('houingDeal', ["housingDealList"]),
      ...mapActions("mall", ['getMallGoodsList']),
      ...mapActions("activity", ["getActivityList"]),
      ...mapActions("card", ["getCardList"]),
      ...mapActions("storeAuxiliary/storeAssemble", ["getAssembleList"]),
      ...mapActions('rushBuy', ['getRushGoodsList']),
      ...mapActions('coupon', ['getCouponList']),
      ...mapActions('vip', ['getPrivilegeList']),
      ...mapActions("storeAuxiliary/storeBargain", ["getBargainList"]),
      ...mapActions("cityLove", ["cityLoveFriends"]),
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
        if (this.tabList.length <= 0) return
        showLoading("加载中");
        setTimeout(() => {
          hideLoading();
        }, 500)
        this.hasMore = true;
        this.requesing = true;
        try {
          const res = getRightTemplate(this.tabList[this.active].type)
          const methodName = res.method;
          this.tabConfig = res;
          if (index != null) {
            this.params.page = 1;
            this.dataList = [];
          }
          let datas = [];
          methodName && await this[methodName]({
            ...res.params,
            ...this.params
          }).then(result => {
            //console.log(methodName, result)
            this.isRequest = true
            if (this.getType(result) == 'array') {
              datas = res.ergodic ? result : [result];
            } else if (this.getType(result) == "json") {
              if (result.data && this.getType(result.data) == "array") {
                datas = res.ergodic ? result.data : [result.data]
              }
            }
            this.dataList = this.getType(index) == "number" && this.params.page == 1 ? datas : this.dataList.concat(datas);

            this.hasMore = res.ergodic ? datas.length >= this.params.size : datas[0].length
          })
        } catch (e) {
          console.log(e)
        }

        this.requesing = false;
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
        if (!this.requesing && this.hasMore) {
          this.params.page++;
          this.changeTab();
        }
        return
      },
    },
    watch: {
      tabList: {
        handler(newVal) {
          this.params.page = 1;
          this.dataList = [];
          let latLng = {}
          this.getPostConfig();
          window.wxReady(async () => {
            try {
              latLng = await getLocation();
            } catch (e) {
              //定位失败可以使用vuex中存的后台返回的默认latLng
              latLng = this.latLng
              console.log('定位catch定位catch定位catch', e)
            }
          })

          this.params.lat = latLng.latitude;
          this.params.lng = latLng.longitude;
          this.changeTab();
          //console.log('this.tabList', this.tabList)
          this.tabs = this.tabList ? this.tabList.map(item => {
            const result = getRightTemplate(item.type);
            item.data = [];
            return Object.assign(item, result);
          }) : [];
          this.color = this.$themeColor;
        },
        immediate: true,
      }
    },
    computed: {
      ...mapState({
        platform: state => state.platform,
        assetPath: s => s.assetPath,
      }),
      ...mapState("common", {
        latLng: state => state.latLng
      }),
      ...mapState({
        user: state => state.user
      }),
      tabType() {
        return this.tabList[this.active].type
      },
    },
    async created() {
      // window.wxReady(async () => {
      //   // showLoading("定位中...");
      //   // setTimeout(() => {
      //   //   hideLoading();
      //   //   if (!this.params.lat) showDialog("定位失败,无法正确获取信息");
      //   // }, 10 * 1000)
      //   // let latLng = await getLocation();
      //   // hideLoading();
      //
      // }, (error) => {
      //   //showDialog(error);
      // })
    }
  }
</script>

<style lang="scss">
  @import "../../assets/theme";

  #TabGroup {
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
