<template>
  <div id="Blancehome">
    <Header moreName="" :is-fixed="true"
            @onMore="goPointPage({name: 'Rule',params:{rulefrom:'partnerprivilege'}})"></Header>
    <div class="headbox">
      <div class="headbox_top">
        <div>
          ￥
          <span>{{yeData}}</span>
        </div>
        <div class="headbox_top_jrsr">总收入</div>
      </div>
      <!--<div class="headbox_btm">-->
        <!--<van-row type="flex" justify="center">-->
          <!--<van-col span="12">-->
            <!--<ul>-->
              <!--<li>￥{{storeData&&storeData.money&&storeData.money.surplusCost||0}}</li>-->
              <!--<li>可提现</li>-->
            <!--</ul>-->
          <!--</van-col>-->
          <!--<van-col span="12">-->
            <!--<ul>-->
              <!--<li>￥{{storeData&&storeData.money&&storeData.money.totalCost||0}}</li>-->
              <!--<li>累计提现</li>-->
            <!--</ul>-->
          <!--</van-col>-->
        <!--</van-row>-->
      <!--</div>-->
    </div>
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
      <div class="head-title bor-b">收入明细</div>
      <van-cell v-for="(item,index) in dataList" center :key="index">
        <div slot="icon" class="flex-col mar-r">
          <i class="iconfont fon-40" :class="[item.icon]" :style="{color:item.color}"></i>
        </div>
        <div slot="title" class="flex-x-bt">
          <div class="flex-col">
            <span class="fon-b col-3">悬赏ID:{{item.rewardId}}  应赏ID:{{item.rewardInfoId}}</span>
            <span class="fon-sm col-9 mar-t-10">{{formatDateByTimeStamp(item.createdAt,"YYYY-MM-DD HH:mm")}}</span></div>
          <div class="fon-lg col-r">+{{item.money||0}}</div>
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
        yeData: '',
        footarr: [
          {
            title: "我要提现",
            icon: "icon-wodeqianbao",
            color: "#4BA4FF",
            url: "/auxiliary/ys/ysCash"
          },
          {
            title: "提现明细",
            icon: "icon-wodejilu",
            color: "#1afa29",
            url: "/auxiliary/ys/ysCashlist"
          }
        ],
        dataList: [],
        hasMore: true,
        params: {
          size: 10,
          page: 1,
        },
      };
    },
    methods: {
      ...mapActions("yS", ["rewardBalance","rewardBalanceList"]),
      async getYeData() {
        this.yeData = await this.rewardBalance();
      },
      onRefresh() {
        this.params.page = 1;
        this.dataList = [];
        this.getData(true);
      },
      onInfinite() {
        if (!this.hasMore) return
        this.params.page++;
        this.getData();
      },
      async getData(refresh) {
        showLoading();
        const result = await this.rewardBalanceList(this.params);
        hideLoading();
        this.dataList = refresh ? result : this.dataList.concat(result);
        this.hasMore = result.length >= this.params.size
        return this.hasMore;
      }
    },
    mixins: [utilMixins],
    computed: {
    },

    async created() {
      this.getYeData();
      this.onRefresh();
      this.onscroll(this.onInfinite, this.$route.path);
    }
  };
</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  #Blancehome {
    font-size: $font-size-base;
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
