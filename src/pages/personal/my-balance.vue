<template>
  <div id="MyBalance">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <header class="c-info">
      <em class="c-info__value">{{userInfo.balance||'0.00'}}</em>
      <em class="c-info__legend">账户余额</em>
    </header>
    <figure class="c-tab-bar">
      <figcaption v-if="czkk" class="c-tab-bar__item recharge" @click="goPointPage({path:'/personal/rechargeCenter'})">
        我要充值
      </figcaption>
      <figcaption class="c-tab-bar__item withdrawal" @click="goPointPage({path:'/withdraw'})">
        我要提现
      </figcaption>
    </figure>
    <section class="c-content">
      <template v-if="dataList.length">
        <header class="c-content-header">
          <div class="c-header-info">
            <aside class="c-header-info__segment-line"></aside>
            <em class="c-header-info__title">账单明细</em>
            <!--<em class="c-header-info__desc">（合计:￥1342.25）</em>-->
          </div>
          <!--<aside class="c-content-header__tip">更多<i class="iconfont icon-jiantouarrow487"></i></aside>-->
        </header>
        <ul class="c-content-list">
          <li class="c-list-item" v-for="(item,key) in dataList" :key="key">
            <div class="c-list-item__date">
              <em class="c-list-item__label">{{formatDateByTimeStamp(item.createdAt,"MM-DD")}}</em>
              <em class="c-list-item__value">{{formatDateByTimeStamp(item.createdAt,"HH:mm")}}</em>
            </div>
            <div :class="hasModifier('c-list-item__wrapper','last',key===dataList.length-1)">
              <div class="c-list-item__info">
                <em class="c-list-item__label">{{getLabelByType(item.type)}}</em>
                <em class="c-list-item__value">订单号：{{item.orderNum}}</em>
              </div>
              <aside :class="hasModifier('c-list-item__num','increase',checkType(item.item))" class="c-list-item__num">
                {{checkType(item.item)?'+':'-'}} {{item.money}}
              </aside>
            </div>
          </li>
        </ul>
        <footer class="c-more-btn" @click="hasMore&&onInfinite()">
          {{hasMore?'加载更多':'没有更多了'}}
        </footer>
      </template>
      <empty-view v-else></empty-view>
    </section>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import EmptyView from "../../components/basic/empty-view";
  import {hideLoading, showLoading} from "../../util";
  import {utilMixins} from "../../plugins/util-mixins";
  import Header from "@/components/header";

  const defaultPage = () => ({pageSize: 10, pageNum: 0});

  export default {
    name: "MyBalance",
    components: {EmptyView, Header},
    data() {
      const pageOption = defaultPage();

      return {
        ...pageOption,
        hasMore: true,
        userInfo: {},
        czkk: false,
        dataList: []
      }
    },
    mixins: [utilMixins],
    methods: {
      ...mapActions("personal", ["getUserInfoById"]),
      ...mapActions("personal/balance", ["getBalanceList"]),
      ...mapActions("common", ['getPayConfig']),
      async initData() {
        showLoading();
        this.userInfo = await this.getUserInfoById(this.user.id);
        hideLoading();
      },
      checkType(type) {
        return +type === 1;
      },
      async searchData(pageOption) {
        let list = [];
        list = await this.getBalanceList({
          ...pageOption,
        });
        return list;
      },
      getLabelByType(type) {
        switch (+type) {
          case 1:
            return "置顶";
          case 2:
            return "刷新";
          case 3:
            return "发帖";
          case 4:
            return "红包";
          case 5:
            return "商家入驻";
          case 6:
            return "商家续费";
          case 7:
            return "充值";
          case 8:
            return "资讯打赏";
          case 9:
            return "保证金";
          case 10:
            return "电话付费"
          case 11:
            return "提现";
          case 12:
            return "保证金退还"
          case 13:
            return "积分兑换"
          case 14:
            return "黄页发布"
          case 15:
            return "加入合伙人"
          case 17:
            return "顺风车发布"
          case 18:
            return "顺风车置顶"
          case 19:
            return "顺风车刷新"
          case 20:
            return "求职招聘发布"
          case 21:
            return "求职招聘置顶"
          case 22:
            return "求职招聘刷新"
          case 23:
            return "房屋发布"
          case 24:
            return "房屋置顶"
          case 25:
            return "房屋刷新"
          case 26:
            return "商城订单"
          case 27:
            return "名片发布"
          case 28:
            return "名片置顶"
          case 29:
            return "后台充值";
          case 30:
            return "活动报名"
          case 31:
            return "名片续费"
          case 32:
            return "黄页续费"
          case 33:
            return "VIP"
          case 34:
            return "拼团支付"
          case 35:
            return "优惠卷领取"
          case 36:
            return '抢购支付'
          case 37:
            return "砍价支付"
          case 38:
            return "余额退还"
          case 100:
            return "领取红包"
          default:
            return "账单提现"
        }
      },
      async onRefresh(done) {
        Object.assign(this, defaultPage());
        this.dataList = [];
        this.dataList = await this.searchData({
          page: 1,
          size: this.pageSize
        });
        this.pageNum++;
        done && done();
      },
      async onInfinite(done) {
        showLoading("请稍等");
        if (this.pageNum === 0) {
          return done();
        }
        this.pageNum++;
        const list = await this.searchData({
          page: this.pageNum,
          size: this.pageSize
        });
        if (list.length) {
          this.dataList = this.dataList.concat(list);
        } else {
          this.pageNum--;
        }
        this.hasMore = !!list.length;
        hideLoading();
      },
    },
    computed: {
      ...mapState({
        user: s => s.user
      }),
      ...mapState("personal/rechargeCenter", {
        rechargeConfig: s => s.rechargeConfig
      })
    },
    created() {
      this.onRefresh();
      this.initData();
      this.getPayConfig().then(result => {
        this.czkk = result.balanceRecharge == 'yes';
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #MyBalance {
    .c-info {
      height: 337px;
      background-color: $themeColor;
      @include flex-center;
      flex-direction: column;

      &__value {
        font-size: 80px;
        color: rgba(255, 255, 255, 1);
        position: relative;
        margin-left: 6px;

        &:before {
          content: "￥";
          display: block;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(-100%, -50%);
        }
      }

      &__legend {
        font-size: 28px;
        color: rgba(255, 255, 255, 1);
        margin-top: 26px;
        display: inline-block;
        position: relative;
      }
    }

    .c-tab-bar {
      padding: 30px 0;
      background-color: #fff;
      @include alignCenter;

      &__item {
        /*flex: 1;*/
        width: 46%;
        @include flex-center;
        font-size: 30px;
        color: rgba(51, 51, 51, 1);
        margin: 0 30px;

        padding: 30px 0;
        border-radius: 10px;
      }

      .recharge {
        color: #fff;
        background: $themeColor;
      }

      .withdrawal {
        background: #f4f4f4;
        color: #000;
        border: 1.1px solid #ddd;
      }
    }

    .c-content {
      margin-top: 20px;
    }

    .c-content-header {
      height: 92px;
      border-bottom: 1Px solid #DDDDDD;
      padding: 0 29px;
      @include flex-between;

      .c-header-info {
        flex: 1;
        @include alignCenter;

        &__segment-line {
          width: 4px;
          height: 35px;
          background: $themeColor;
        }

        &__title {
          font-size: 30px;
          color: rgba(51, 51, 51, 1);
          margin: 0 15px;
        }

        &__desc {
          font-size: 26px;
          margin-top: 2px;
          color: rgba(153, 153, 153, 1);
        }
      }

      &__tip {
        font-size: 26px;
        color: rgba(153, 153, 153, 1);
        @include alignCenter;

        .icon-jiantouarrow487 {
          margin-left: 12px;
        }
      }
    }

    .c-content-list {
      background: #fff;

      .c-list-item {
        box-sizing: border-box;
        @include alignCenter;

        &__date {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 26px 0;
          margin-left: 29px;
        }

        &__wrapper {
          flex: 1;
          height: 100%;
          padding: 26px 0;
          margin-left: 22px;
          @include flex-between;
          border-bottom: 1Px solid #DDDDDD;

          &--last {
            border-bottom: 0;
          }
        }

        &__info {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }

        &__label {
          font-size: 26px;
          color: rgba(51, 51, 51, 1);
          @include t-overflow;
        }

        &__value {
          margin-top: 20px;
          font-size: 24px;
          color: rgba(153, 153, 153, 1);
          @include t-overflow;
        }

        &__num {
          font-size: 32px;
          color: rgba(255, 0, 0, 1);
          margin-right: 30px;

          &--increase {
            color: #5DB271;
          }
        }
      }
    }

    .c-more-btn {
      background-color: #fff;
      padding: 30px;
      text-align: center;
      font-size: 28px;
      color: #2d2d2d;
    }
  }
</style>
