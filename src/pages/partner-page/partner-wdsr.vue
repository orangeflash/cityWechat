<template>
  <div id="Partnerwdsr">
    <Header moreName :is-fixed="true" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <van-cell class="vancell" title="总收入">
      <template slot="icon">
        <i
          class="iconfont icon-shouru-copy"
          style="color:#FF8A00"
        ></i>
      </template>
      <template>
        <div class="cellft">
          ￥{{(+hhrsj.totalCost).toFixed(2)}}
        </div>
      </template>
    </van-cell>
    <div class="headbox">
      <van-row>
        <van-col
          :offset="index%2==1&&'2'"
          v-for="(item,index) in partnerarr"
          span="11"
          :key="index"
        >
          <!--<img-wrapper  not-load="true":src="timg" class="topimg"></img-wrapper>-->
          <div @click="goPointPage({name: `${item.url}`,})" class="vancolitem">
            <div class="vancolitem_t">
              ￥
              <span>{{item.money}}</span>
            </div>
            <div class="vancolitem_b">
              <i
                class="topimg iconfont"
                :class="[item.icon]"
                :style="{color:item.color}"
              ></i>
              <em>{{item.title}}</em>
            </div>
            <!--<div class="vancolitem_f">-->
              <!--<div>查看详情</div>-->
            <!--</div>-->
          </div>
        </van-col>
      </van-row>
    </div>
    <div class="Partner_foot">
      <button @click="goPointPage({name:'PartnerSrdl'})">查看收入明细</button>
    </div>
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

  export default {
    name: "PartnerWdsr",
    components: {Notice},
    data() {
      return {
        hhrsj:'',
        partnerarr: [
          {
            title: "今日收入",
            icon: "icon-jintiandianjihou",
            color: "#FF3A0C",
            url: "PartnerSrdl"
          },
          {title: "可提现", icon: "icon-tixian", color: "#FFC61A",url: "PartnerSrdl"},
          {title: "已提现", icon: "icon-qianbao", color: "#20E67D",url: "PartnerSrdl"},
          {title: "冻结资金", icon: "icon-yuyue1", color: "#4BA4FF",url: "PartnerSrdl"}
        ]
      }
    },
    methods: {
      ...mapActions("partner", ["getBannerList", "getAnnounceList"]),
      ...mapActions("partner/partnerEnter", ["getpartnerStatistics", "getpartnerNewlist"]),
      async gethhrsj() {
        this.hhrsj = await this.getpartnerStatistics();
        this.partnerarr[0].money=(+this.hhrsj.TodayCost).toFixed(2)
        this.partnerarr[1].money=(+this.hhrsj.surplusCost).toFixed(2)
        this.partnerarr[2].money=(+this.hhrsj.useCommission).toFixed(2)
        this.partnerarr[3].money=(+this.hhrsj.freeze).toFixed(2)

        console.log(this.hhrsj)
      },
      async getPartnerInitializationData() {
        this.gethhrsj()
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

  #Partnerwdsr {
    font-size: $font-size-base;
    /*min-height: calc(100vh - 80px);*/
    width: 100%;
    padding-bottom: 130px;
    .vancell{
      margin-top: 92px;
      font-size: $font-size-base;
      i{
        font-size: 40px;
        margin-right: 20px;
      }
      .cellft{
        color: $themeColor;
        font-size: 32px;
      }
    }
    .headbox {
      position: relative;
      padding: 30px;

      .topimg {
        font-size: 40px;
      }

      .vancolitem {
        background: #fff;
        border-radius: 30px;
        margin-top: 30px;
        padding: 30px 0;
        box-sizing: border-box;
        @include flex-center($direction: column);

        .vancolitem_t {
          color: $themeColor;
          font-size: 35px;
          margin: 30px 0 30px;

          span {
            font-size: 45px;
          }
        }

        .vancolitem_b {
          margin-bottom: 50px;
          @include flex-center;
          font-size: $font-size-base;

          em {
            margin-left: 10px;
          }
        }

        .vancolitem_f {
          margin-bottom: 30px;
          color: #ea4c49;
          font-size: $font-size-sm;
          padding: 8px 40px;
          border-radius: 30px;
          border: 1.1px solid #ea4c49;
        }
      }
    }
    .Partner_foot {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 30px;
      position: fixed;
      bottom: 0px;

      button {
        @include footbtn;
        box-shadow: 5px 10px 20px #cccccc;
      }
    }
  }
</style>
