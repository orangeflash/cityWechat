<template>
  <div id="Partnerhome">
    <Header moreName="等级特权" :is-fixed="true"
            @onMore="goPointPage({name: 'Rule',params:{rulefrom:'partnerprivilege'}})"></Header>
    <div class="headbox">
      <div class="headbox_top">
        <div>
          ￥
          <span>{{hhrsj&&(+hhrsj.TodayCost).toFixed(2)||"0.00"}}</span>
        </div>
        <div class="headbox_top_jrsr">今日收入</div>
      </div>
      <div class="headbox_btm">
        <van-row type="flex" justify="center">
          <van-col span="12">
            <ul>
              <li>￥{{hhrsj.surplusCost||"0.00"}}</li>
              <li>可提现</li>
            </ul>
          </van-col>
          <van-col span="12">
            <ul>
              <li>￥{{hhrsj.totalCost||"0.00"}}</li>
              <li>累计提成</li>
            </ul>
          </van-col>
        </van-row>
      </div>
    </div>
    <Notice
      class="notice"
      label="最新收益"
      :notice="noticeList"
      @featureClick="storeCanEnter&&featureClick()"
    />
    <div v-if="user.isPartner=='1'" class="Partnerhomemainbox">
      <van-row>
        <van-col v-for="(item,index) in partnerarr" span="6" :key="index">
          <!--<img-wrapper  not-load="true":src="timg" class="topimg"></img-wrapper>-->
          <div @click="goPointPage({name: `${item.url}`,params:item.param})" class="vancolitem">
            <i class="topimg iconfont" :class="[item.icon]" :style="{color:item.color}"></i>
            <em>{{item.title}}</em>
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="Partnerhomefootbox">
      <van-row>
        <van-col v-for="(item,index) in footarr" span="12" :key="index">
          <div @click="!index?goPointPage({name: `${item.url}`,params:item.param}):isShowContactCode = true"
               class="vancolitem">
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
    <Popup v-if="isShowContactCode" :QRCode="platform.contactCode" @close="isShowContactCode = false"
           desc="联系客服"></Popup>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import Notice from "../../components/business-district/notice";
  import {utilMixins} from "../../plugins/util-mixins";
  import {updateShareConfig} from "../../util/wechat-util";
  import {
    hideLoading,
    showDialog,
    showLoading,
    getUrlParams,
    parseObjToParams
  } from "../../util";
  import {Toast} from "vant";
  import Popup from '../../components/popup'       // 弹窗
  import timg from "../../assets/img/partner/timg.png";
  import tjjl from "../../assets/img/partner/tjjl.png";
  import sstx from "../../assets/img/partner/sstx.png";
  import jdry from "../../assets/img/partner/jdry.png";
  import srys from "../../assets/img/partner/srys.png";

  export default {
    name: "PartnerHome",
    components: {Notice, Popup},
    data() {
      return {
        timg,
        tjjl,
        sstx,
        jdry,
        srys,
        isShowContactCode: false,
        hhrsj: '',
        noticeList: [],
        partnerarr: [
          {
            title: "我的特权",
            icon: "icon-huiyuanhuangguanguanjun-xianxing",
            color: "#FF3A0C",
            // url: "Rule",
            param: {rulefrom: "partnerWdtq", rulequery: 0},
            url: "PartnerWdqy"
          },
          {
            title: "我的粉丝",
            icon: "icon-fensi",
            color: "#FF6666",
            url: "PartnerWdfs"
          },
          {
            title: "我的收入",
            icon: "icon-shourumingxi",
            color: "#F3AC3C",
            url: "PartnerWdsr"
          },
          // {
          //   title: "收入趋势",
          //   icon: "icon-huiyuanfazhanqushi",
          //   color: "#4BA4FF"
          // },
          {
            title: "邀新专区",
            icon: "icon-liwu1",
            color: "#8712FF",
            url: "PartnerInvite"
          },
          {
            title: "我要提现",
            icon: "icon-wodeqianbao",
            color: "#4BA4FF",
            url: "PartnerCash"
          },
          {
            title: "提现明细",
            icon: "icon-wodejilu",
            color: "#1afa29",
            url: "PartnerCashlist"
          },
        ],
        footarr: [
          {
            title: "规则说明",
            icon: "icon-903caidan_bangzhu",
            color: "#FF3A0C",
            url: "Rule",
            param: {rulefrom: "partnerrule"},
          },
          {
            title: "联系客服",
            icon: "icon-kefuzixunhui",
            color: "#FF6666",
            method: this.showkf,
          }
        ]
      };
    },
    methods: {
      ...mapActions("partner", ["getBannerList", "getAnnounceList", "getPartnerconfig", "getPartnerstatus"]),
      ...mapActions("partner/partnerEnter", ["getpartnerStatistics", "getpartnerNewlist"]),
      showkf() {
        this.isShowContactCode = true
      },
      async gethhrsj() {
        showLoading()
        this.hhrsj = await this.getpartnerStatistics();
        hideLoading()
        console.log(this.hhrsj)
      },
      async gethhrzxsy() {
        const hhrzxsy = await this.getpartnerNewlist();
        this.noticeList = _.map(hhrzxsy, (item) => (
          // let obj={}
          // obj['title']=`${item.userName}收入${(+item.income).toFixed(2)}元(${item.incomeType})`
          // obj['content']=''
          // return obj
          {title: `${item.userName}收入${(+item.income).toFixed(2)}元(${item.incomeType})`, 'content': ''}
        )) || []
        console.log(hhrzxsy, this.noticeList)
      },
      async gethhrpz() {
        this.hhrpz = await this.getPartnerconfig()
        updateShareConfig({
          title: this.hhrpz.title,
          imgUrl: this.hhrpz.shareImg,
          desc: this.hhrpz.shareDescription,
        })
        console.log(this.hhrpz)
      },
      async gethhrzt() {
        this.hhrzt = await this.getPartnerstatus()
        this.partnerarr[0].param.rulequery = this.hhrzt.gradeId
        console.log(this.hhrzt)
      },
      async getPartnerInitializationData() {
        this.gethhrsj()
        this.gethhrzxsy()
        this.gethhrpz()
        this.gethhrzt()
        // const arr = this.getAnnounceList({
        //   type: 3,
        //   adType: 1
        // });
        // arr.then(value => (this.noticeList = value));
      },
      callTel(tel) {
        location.href = tel;
      }
    },
    mixins: [utilMixins],
    computed: {
      // ...mapState("common", {
      //   platform: state => state.platform
      // }),
      ...mapState({
        user: state => state.user,
        platform: state => state.platform
      })
    },

    async created() {
      //
      this.getPartnerInitializationData();
      console.log(this.platform, this.user);
    }
  };
</script>
<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  #Partnerhome {
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
      margin-top: 30px;
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
        font-size: 40px;
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
