<template>
  <div class="store-management">
    <Header moreName="切换店铺" @onMore="goPointPage({path:'/businessDistrict/businessList'})"></Header>
    <header class="management-header">
      <div class="management-header-top">
         <span class="header-bg" v-if="shopDetail">
             <img-wrapper :src="storeLogo" class="store-img"/>
         </span>
        <span class="see-store" @click="goPointPage({path:'/shopDetail',query:{storeId:(+storeInfo.id)}})">
             <em>查看商家 <i class="iconfont icon-youjiantou"></i></em>
         </span>
        <div class="right" v-if="storeInfo.storeName">
          <em class="store-name">{{`${storeInfo.storeName}(ID:${storeInfo.id})`}}</em>
          <p class="store-setting"><em>到期:{{formatDateByTimeStamp(storeInfo.enterEndTime,"YYYY-MM-DD HH:mm")}}</em></p>
          <!--<em class="store-back-time">到期时间：{{formatTime(+storeInfo.enterEndTime)}}<em>我要续费</em></em>-->
        </div>
      </div>
      <div class="foot-con">
        <div>
          <i class="iconfont icon-yanjing"></i>
          <span>浏览:{{storeInfo.viewNum||0}}</span>
        </div>
        <div>
          <i class="iconfont icon-fensi"></i>
          <span>粉丝:{{storeInfo.followNum||0}}</span>
        </div>
      </div>
    </header>

    <dd-layout-notice :hidden-box-sha="true" pagePath="storePersonal" class="mar-tb">
      <div slot="left" class="w-82 miw-82 dh-82 flex-center br-r-10">
        <img :src="businessNotice" class="w100 hei100">
      </div>

    </dd-layout-notice>

    <!--<div class="announce">-->
    <!--<i class="iconfont icon-shouqi"></i>-->
    <!--<van-swipe class="announce-body" :show-indicators="false" vertical :autoplay="3000">-->
    <!--<van-swipe-item v-for="(item,key) in announce" :key="key">-->
    <!--<h4 @click="goPointPage({name:'Announcement',params:{list:announce,index:key}})">{{item.title}}</h4>-->
    <!--</van-swipe-item>-->
    <!--</van-swipe>-->
    <!--</div>-->
    <article class="store-data">
      <p class="store-data-title">商家数据</p>
      <ul class="data-list">
        <li class="data-item">
          <em>今日订单</em>
          <em class="col-g">{{storeData&&storeData.shop.orderNum||0}}</em>
        </li>
        <li class="data-item">
          <em>今日收益</em>
          <em class="col-b">{{storeData&&storeData.shop.todayBalance||0}}</em>
        </li>
        <li class="data-item" @click="goPointPage({path:'/storeAuxiliary/StoreBalance'})">
          <em>商家余额</em>
          <em class="col-r">{{storeData&&storeData.shop.totalBalance||0}}</em>
        </li>
      </ul>
    </article>
    <div v-for="(block,index) in storeManagement" :key="index" v-if="block.show" class="management-setting">
      <h2 class="setting-title">{{block.text}}</h2>
      <ul class="setting-list">
        <li v-for="(item,index) in block.arr" :key="index" v-if="!item.hide" class="setting-item"
            @click="toolCLick(item,index)">
          <i class="iconfont" :class="[item.icon]" :style="{color:item.color}"></i>
          <em>{{item.title}}</em>
        </li>
      </ul>
    </div>
    <Operation
      :show="showOperation"
      @close="showOperation = !showOperation"
      @choice="actionsOperation"
      :actions="actions"
    ></Operation>
  </div>
</template>

<script>
  import {mapActions, mapState, mapMutations, mapGetters} from 'vuex'
  import {Row, Col} from 'vant';
  import Operation from '../../components/template/operation'
  import {utilMixins} from "../../plugins/util-mixins.js"
  import Notice from "../../components/home/notice";
  import {Toast} from 'vant';
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../util";
  import DdLayoutNotice from "../../components/layout/dd-layout-notice";
  import businessNotice from '../../assets/img/business-district/business-notice.png'

  export default {
    name: "storeManagement",
    components: {DdLayoutNotice, Notice, Operation},
    data() {
      return {
        businessNotice,
        params: {
          userId: null,
          linkTel: null,
        },
        show: false,
        storeInfo: '',
        storeData: null,
        announce: [],
        showOperation: false,
        actions: [
          {
            title: '请选择续费套餐',
            disabled: true
          },
        ],
      }

    },
    mixins: [utilMixins],
    methods: {
      ...mapActions("businessDistrict", ["getStoreByAdminId", "getStoreData", "getSetmeal", "postStoreRenew"]),
      ...mapActions("home/components", ["getAnnounceList"]),
      ...mapActions("shop", ["getShopInfoWithUserIdById"]),
      ...mapMutations("businessDistrict", ["SET_STOREID"]),
      scanQRCode() {
        console.log("想扫码了？");
        window.wx.ready(async function () {

          window.wx.scanQRCode({
            desc: 'scanQRCode desc',
            needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
            },
            error: function (res) {
              if (res.errMsg.indexOf('function_not_exist') > 0) {
                showDialog("版本过低请升级");
              }
            }
          });
        })

      },
      renewal() {
        this.showOperation = true
      },
      async actionsOperation(item, index) {
        if (!item.id) return showText('请选择套餐')
        if (+item.money > 0) {
          try {
            await showDialog("需要支付" + +item.money + "元");
          } catch (e) {
            console.log('老板，我是要赚钱的啊~')
            return false;
          }
        }
        showLoading("提交中...")
        const res = await this.postStoreRenew({storeId: this.storeInfo.id, mealId: item.id});
        if (res.code) {
          showHandleStatusByFlag([true, '提交成功'])
          if (+item.money > 0) {
            this.$router.push({
              name: 'cashier',
              params: {
                type: 39,
                param: {
                  renewId: res.data
                },
                info: {
                  money: +item.money,
                  type: "商家续费支付",
                  callLink: '/businessDistrict/storeManagement',
                }
              }
            });
          } else {
            showHandleStatusByFlag([true, '提交成功'])
            setTimeout(() => {
              this.getStoreInfo()
            }, 1000)
          }
        } else {
          showText(res.msg, 2000, true);
        }
        console.log(item, index)
      },
      toolCLick(item, index) {
        console.log(item, index)
        if (this.expire && item.title != '我要续费') {
          return showDialog('您的店铺已到期,续费后使用此功能', '提示', false)
        }
        if (item.path) {
          this.goPointPage({
            path: item.path,
            query: item.query,
          })
        } else if (item.method) {
          this[item.method]()

        }

      },
      async getStoreInfo() {
        showLoading()
        // 这里获取到的是一个店铺数组，
        // const storeInfo = await this.getStoreByAdminId({
        //   adminId: this.$route.query.id || this.user.id
        // });
        this.storeInfo = await this.getShopInfoWithUserIdById(this.$route.query.storeId || this.user.storeInfo.storeId)
        this.getStoreData({storeId: this.storeInfo.id}).then(res => {
          this.storeData = res
        })
        //提交mutation设置state.storeid
        this.SET_STOREID(this.storeInfo.id);
        hideLoading()
        // this.getShopInfoWithUserIdById(storeInfo[0].id).then((res) => {
        //   this.$set(this.storeManagement[5], 'show', res.meal.indexOf('group') > -1)
        //   this.$set(this.storeManagement[6], 'show', res.meal.indexOf('rush') > -1)
        // });
        // console.log("storeInfo============================")
        // console.log(storeInfo)
      },
      async getAnnounceListInfo() {
        this.announce = await this.getAnnounceList({
          type: 3,
          adType: 2
        })
      },
      callTel(link) {
        location.href = link;
      },
      addPeople() {
        this.show = !this.show;
      },
      queryPeople() {
        if (this.params.userId || this.params.linkTel) {

        } else {
          Toast({
            message: '请输入关键信息',
            duration: 1500
          })
        }
      }
    },
    computed: {
      ...mapState({
        user: s => s.user
      }),
      ...mapState("shop", {
        shopDetail: s => s.shopDetail
      }),
      storeManagement() {
        return [
          {
            show: true,
            text: '管理工具',
            arr: [
              {
                title: '认证中心',
                icon: 'icon-renzhengzhongxin-xuanzhong',
                color: '#FF9901',
                path: '/attestIndex',
                query: {id: this.storeInfo.id, type: 'store'}
              },
              {
                title: '修改资料',
                icon: 'icon-xiugaiziliao',
                color: '#19BEC4',
                path: '/publication/businessEditForm',
                query: {storeId: this.storeInfo.id}
              },
              // {
              //   title: '帮助中心',
              //   icon: 'icon-bangzhu',
              //   color: '#FC7772',
              //   path: '/home/helpPage',
              // },
              // {
              //   title: '联系客服',
              //   icon: 'icon-custom-service',
              //   color: '#299DFF',
              //   path: '/personal/CustomerService',
              //   query: {}
              // },
              {
                title: '我要续费',
                icon: 'icon-xuqi',
                color: '#299DFF',
                method: 'renewal'
              },
              {
                title: '扫码核销',
                icon: 'icon-saoma',
                color: '#666',
                method: 'scanQRCode'
              }, {
                title: '员工管理',
                icon: 'icon-yuangonghuangye',
                color: '#FFB131',
                path: "/storeAuxiliary/storeStaff"
              },
            ],
          },
          {
            show: this.shopDetail.meal && this.shopDetail.meal.indexOf('shop') > -1,
            text: '商城管理',
            arr: [
              {
                title: '订单管理',
                icon: 'icon-dingdanguanli',
                color: '#3889FF',
                path: '/storeAuxiliary/storeGood',
              },
              {
                title: '商品管理',
                icon: 'icon-gouwu',
                color: '#6C95EA',
                path: '/storeAuxiliary/storeGood/storeGoodList',
              },
              {
                title: '店铺优惠',
                icon: 'icon-youhuiquan2',
                color: '#FF0000',
                path: '/storeAuxiliary/storeCoupon',
              },
              {
                title: '配送设置',
                icon: 'icon-shangjia1',
                color: '#B19EFF',
                path: '/storeAuxiliary/storeGood/storeManageGood',
              },
            ],
          },
          {
            show: this.shopDetail.meal && this.shopDetail.meal.indexOf('activity') > -1,
            text: '活动管理',
            arr: [
              {
                title: '发布活动',
                icon: 'icon-fabu',
                color: '#FF9901',
                path: '/storeAuxiliary/storeActivity/storeActivityRelease',
              }, {
                title: '我的活动',
                icon: 'icon-huodong1',
                color: '#FF9901',
                path: '/storeAuxiliary/storeActivity',
              },
            ],
          },
          {
            show: this.shopDetail.meal && this.shopDetail.meal.indexOf('coupon') > -1,
            text: '优惠劵管理',
            arr: [
              {
                title: '发布优惠劵',
                icon: 'icon-llingquxianjinquan',
                color: '#FF0000',
                path: '/storeAuxiliary/storeCoupon/storeCouponRelease',
              },
              {
                title: '管理优惠券',
                icon: 'icon-youhuiquanxianxing',
                color: '#FF0000',
                path: '/storeAuxiliary/storeCoupon/storeMyRelease'
              },
            ],
          }, {
            show: this.shopDetail.meal && this.shopDetail.meal.indexOf('vip') > -1,
            text: '会员特权管理',
            arr: [
              {
                title: '发布特权',
                icon: 'icon-qunfengfabushangxian',
                color: '#FDAF04',
                path: '/storeAuxiliary/storePrivilege/storeReleasePrivilege',
              },
              {
                title: '管理特权',
                icon: 'icon-tianchongxing-',
                color: '#FF9901',
                path: '/storeAuxiliary/storePrivilege',
              },
            ],
          }, {
            show: this.shopDetail.meal && this.shopDetail.meal.indexOf('group') > -1,
            text: '拼团管理',
            arr: [
              {
                title: '发布拼团',
                icon: 'icon-pintuandingdan',
                color: '#3889FF',
                path: '/storeAuxiliary/storeAssemble/release',
              },
              {
                title: '管理拼团',
                icon: 'icon-pintuangou',
                color: '#3889FF',
                path: '/storeAuxiliary/storeAssemble/myRelease',
              },
            ],
          }, {
            show: this.shopDetail.meal && this.shopDetail.meal.indexOf('rush') > -1,
            text: '限时抢购管理',
            arr: [
              {
                title: '发布抢购',
                icon: 'icon-qiang',
                color: '#FF0000',
                path: '/storeAuxiliary/storeRushbuy/storeReleaseRushbuy',
              },
              {
                title: '管理抢购',
                icon: 'icon-daojishi',
                color: '#FF0000',
                path: '/storeAuxiliary/storeRushbuy',
              },
            ],
          }, {
            show: this.shopDetail.meal && this.shopDetail.meal.indexOf('bargain') > -1,
            text: '砍价商品管理',
            arr: [
              {
                title: '发布砍价',
                icon: 'icon-kanjia',
                color: '#FF0000',
                path: '/storeAuxiliary/storeBargain/release',
              },
              {
                title: '管理砍价',
                icon: 'icon-lianmengguanli',
                color: '#FF0000',
                path: '/storeAuxiliary/storeBargain/myRelease',
              },
            ],
          },
        ]
      },
      expire() {
        return Math.round(new Date().getTime() / 1000) >= this.storeInfo.enterEndTime
      },
      storeLogo() {
        const imgs = this.getMediaList(this.shopDetail.storeLogo).img;
        return imgs && imgs.length ? imgs[0] : ""
      }

    },
    created() {
      this.getStoreInfo();
      this.getAnnounceListInfo();
      this.getSetmeal().then(res => {
        res.forEach(item => {
          item.name = item.setName
        })
        this.actions = this.actions.concat(res)
      });
    }
  }
</script>
<style scoped lang='scss'>
  @import "../../assets/theme";

  .management-header {
    padding: 20px 30px;
    background-color: $themeColor;
  }

  .management-header-top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    padding: 20px 0px;

    .header-bg {
      display: inline-block;
      width: 100px;
      height: 100px;
      background-color: #fff;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    .right {
      margin-left: 20px;
      line-height: 40px;
      color: #fff;

      .store-setting {
        margin-top: 20px;
        font-size: 24px;

        em:nth-of-type(1) {
          /*&::after {*/
          /*content: '';*/
          /*display: inline-block;*/
          /*width: 2px;*/
          /*height: 26px;*/
          /*vertical-align: middle;*/
          /*background-color: #fff;*/
          /*margin: 0px 20px;*/
          /*}*/
        }
      }

      .store-name {
        font-size: 30px;

      }

      .store-back-time {
        font-size: 22px;
      }
    }

    .see-store {
      position: absolute;
      right: -30px;
      top: 50%;
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, .5);
      height: 55px;
      padding: 0 0 0 20px;
      border-radius: 28px 0px 0px 28px;
      color: #fff;
      display: flex;
      align-items: center;
      font-size: $font-size-sm;;

      .iconfont {
        font-size: $font-size-xs;
      }
    }
  }

  .foot-con {
    padding-top: 10px;
    @include flex-between;
    color: #fff;
    font-size: $font-size-xs;
  }

  .announce {
    background-color: #fff;
    margin: 0px auto;
    width: 80%;
    padding: 30px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    color: #666;
    transform: translateY(-30%);
    z-index: 50;
    @include alignCenter;

    .announce-body {
      flex: 1;
      margin-left: 20px;
      height: 30px;
      font-size: 28px;

      h4 {
        height: 30px;
        line-height: 34px;
        overflow: hidden;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  .store-data {
    margin-top: 20px;
    background-color: #fff;
    padding: 30px 0 0 0;

    .store-data-title {
      padding: 0px 30px 20px 30px;
      font-size: $font-size-lg;
      font-weight: 500;
      border-bottom: 1px solid #f9f9f9;
    }

    .data-list {
      padding-bottom: 0px;
      overflow: hidden;

      .data-item {
        width: 33.33%;
        box-sizing: border-box;
        float: left;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px 0px;
        border-right: 1px solid #f9f9f9;
        border-bottom: 1px solid #f9f9f9;
        color: #666;
        font-size: 28px;
        line-height: 50px;
      }
    }
  }

  .management-setting {
    margin-top: 20px;
    padding: 30px 0 0 0;
    background-color: #fff;

    .setting-title {
      padding: 0px 30px 20px 30px;
      font-size: $font-size-lg;
      font-weight: 500;
      border-bottom: 1px solid #f9f9f9;
    }

    .setting-list {
      flex-wrap: wrap;
      background: #fff;
      display: flex;

      .setting-item {
        width: 25%;
        box-sizing: border-box;
        padding: 20px 0px;
        float: left;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 28px;
        color: #666;
        line-height: 60px;
        border-right: 1PX solid #f9f9f9;
        border-bottom: 1PX solid #f9f9f9;

        .iconfont {
          font-size: 48px;
          height: 50px;
          margin-bottom: 10px;
        }
      }
    }

  }
</style>
