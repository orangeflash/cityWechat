<template>
  <div id="Blancehome">
    <Header moreName="" :is-fixed="true"
            @onMore="goPointPage({name: 'Rule',params:{rulefrom:'partnerprivilege'}})"></Header>
    <div class="headbox">
      <div class="headbox_top">
        <div>
          ￥
          <span>{{storeData&&storeData.money&&(+storeData.money.totalMoney).toFixed(2)||0}}</span>
        </div>
        <div class="headbox_top_jrsr">总收入</div>
      </div>
      <div class="headbox_btm">
        <van-row type="flex" justify="center">
          <van-col span="12">
            <ul>
              <li>￥{{storeData&&storeData.money&&storeData.money.surplusCost||0}}</li>
              <li>可提现</li>
            </ul>
          </van-col>
          <van-col span="12">
            <ul>
              <li>￥{{storeData&&storeData.money&&storeData.money.totalCost||0}}</li>
              <li>累计提现</li>
            </ul>
          </van-col>
        </van-row>
      </div>
    </div>
    <!--<Notice-->
    <!--class="notice"-->
    <!--label="最新收益"-->
    <!--:notice="noticeList"-->
    <!--@featureClick="storeCanEnter&&featureClick()"-->
    <!--/>-->
    <div class="Partnerhomefootbox">
      <van-row>
        <van-col v-for="(item,index) in footarr" span="12" :key="index">
          <div @click="goPointPage({path: item.url,params:item.param})" class="vancolitem">
            <i
              class="topimg iconfont"
              :class="[item.icon]"
              :style="{color:$themeColor}"
            ></i>
            <em>{{item.title}}</em>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="bg-f mar-t">
      <div class="head-title bor-b">收入项目</div>
      <van-cell v-for="(item,index) in projectArr" center :key="index" v-if="item.show" is-link :to="item.path">
        <div slot="icon" class="flex-col mar-r">
          <i class="iconfont fon-40" :class="[item.icon]" :style="{color:item.color}"></i>
        </div>
        <div slot="title" class="flex-x-bt">
          <div><span class="col-6">{{item.title}}</span></div>
          <div v-if="item.type==2" class="fon-sm col-9">总支出:{{item.money||0}}</div>
          <div v-else class="fon-sm col-9">总收入:{{item.money||0}}</div>
        </div>
      </van-cell>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import Notice from "../../../components/business-district/notice";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {
    hideLoading,
    showDialog,
    showLoading,
    getUrlParams,
    parseObjToParams
  } from "../../../util";

  export default {
    name: "Blancehome",
    components: {Notice},
    data() {
      return {
        storeData: '',
        noticeList: [],
        projectArr: [
          {
            show: false,
            title: "商城",
            icon: "icon-gouwu",
            color: "#4BA4FF",
            path: {path: 'storeBalance/storeBalanceList', query: {item: 1}},
            money: '0'
          },
          {
            show: false,
            title: "活动",
            icon: "icon-kaishibaoming",
            color: "#4BA4FF",
            path: {path: 'storeBalance/storeBalanceList', query: {item: 2}},
            money: '0'
          }, {
            show: false,
            title: "优惠券",
            icon: "icon-kaishibaoming",
            color: "#4BA4FF",
            path: {path: 'storeBalance/storeBalanceList', query: {item: 3}},
            money: '0'
          }, {
            show: false,
            title: "拼团",
            icon: "icon-kaishibaoming",
            color: "#4BA4FF",
            path: {path: 'storeBalance/storeBalanceList', query: {item: 4}},
            money: '0'
          },
          {
            show: false,
            title: "抢购",
            icon: "icon-kaishibaoming",
            color: "#4BA4FF",
            path: {path: 'storeBalance/storeBalanceList', query: {item: 5}},
            money: '0'
          }, {
            show: false,
            title: "砍价",
            icon: "icon-kaishibaoming",
            color: "#4BA4FF",
            path: {path: 'storeBalance/storeBalanceList', query: {item: 6}},
            money: '0'
          },
          {
            show: false,
            title: "合伙人",
            icon: "icon-kaishibaoming",
            color: "#4BA4FF",
            path: {path: 'storeBalance/storeBalanceList', query: {item: 7}},
            type: 2,
            money: '0'
          },
        ],
        footarr: [
          {
            title: "我要提现",
            icon: "icon-wodeqianbao",
            color: "#4BA4FF",
            url: "/storeAuxiliary/storeBalance/storeCash"
          },
          {
            title: "提现明细",
            icon: "icon-wodejilu",
            color: "#1afa29",
            url: "/storeAuxiliary/storeBalance/storeCashList"
          }
        ]
      };
    },
    methods: {
      ...mapActions("storeAuxiliary/storeBalance", ["getStoreBalance",]),
      async getStoreData() {
        showLoading()
        this.storeData = await this.getStoreBalance({storeId: this.storeId});
        this.storeData.item && this.storeData.item.forEach((item, index) => {


          this.projectArr.forEach((arr, key) => {
            if (item.name == arr.title) {
              this.$set(this.projectArr[key], 'money', item.value)
              this.$set(this.projectArr[key], 'show', true)
            }
          })
        })
        hideLoading()
        console.log(this.storeData)
      },
      // async gethhrzxsy(){
      //   const hhrzxsy=await this.getpartnerNewlist();
      //   this.noticeList=_.map(hhrzxsy, (item) =>(
      //     {title: `${item.userName}收入${(+item.income).toFixed(2)}元(${item.incomeType})`,'content':''}
      //   ))|| []
      //   console.log(hhrzxsy,this.noticeList)
      // },
      async getInitializationData() {
        this.getStoreData()
        // const arr = this.getAnnounceList({
        //   type: 3,
        //   adType: 1
        // });
        // arr.then(value => (this.noticeList = value));
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },

    async created() {
      //
      this.getInitializationData();
      console.log(this.storeId);
    }
  };
</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  #Blancehome {
    font-size: $font-size-base;
    /*min-height: calc(100vh - 80px);*/
    width: 100%;
    padding-bottom: 130px;

    .headbox {
      position: relative;
      margin-top: 92px;
      height: 300px;
      background: $themeColor;

      &_top {
        position: absolute;
        top: 30px;
        width: 100%;
        font-size: $font-size-base;
        color: #fff;
        text-align: center;

        span {
          font-size: 60px;
        }

        &_jrsr {
          margin-top: 20px;
        }
      }

      &_btm {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 130px;
        color: #fff;

        ul {
          height: 130px;
          @include flex-center($direction: column);

          :nth-child(1) {
            font-size: $font-size-lg;
          }

          :nth-child(2) {
            margin-top: 10px;
            font-size: $font-size-xs;
          }
        }
      }
    }

    .notice {
      border-radius: 0;
    }

    .Partnerhomemainbox {
      margin-top: 0px;
      font-size: $font-size-base;
      background: #fff;

      .topimg {
        font-size: 50px;
      }

      .vancolitem {
        box-sizing: border-box;
        border-right: 1px solid #f5f5f5;
        border-bottom: 1px solid #f5f5f5;
        @include flex-center($direction: column);
        height: 160px;

        em {
          margin-top: 20px;
          color: #666;
        }
      }
    }

    .Partnerhomefootbox {
      margin-top: 30px;
      background: #fff;
      padding: 10px 0;

      .topimg {
        font-size: 50px;
      }

      .vancolitem {
        box-sizing: border-box;
        @include flex-center;
        height: 70px;

        &:nth-child(1) {
          border-right: 1px solid #f5f5f5;
        }

        em {
          color: #666;
          margin-left: 20px;
        }
      }
    }
  }
</style>
