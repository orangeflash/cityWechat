<template>
  <div id="IntegralMall">
    <van-swipe class="c-banner" v-if="banner.length" :show-indicators="false" :autoplay="3000">
      <van-swipe-item v-for="(item,key) in banner" :key="key">
        <img-wrapper class="c-banner__img" :src="getMediaList(item.photoList).img[0]"/>
      </van-swipe-item>
      <!--<van-swipe-item>-->
      <!--<img-wrapper class="c-banner__img" src="http://i2.qihuiwang.com/web/2016-06-30/115833dcd24f543d82.jpg"/>-->
      <!--</van-swipe-item>-->
    </van-swipe>

    <figure class="c-tab-bar">
      <figcaption class="c-tab-bar__item" @click="goPointPage({path:'/sign/signInPointsDetails'})">
        <i class="iconfont icon-jifen"></i>
        <em class="c-tab-bar__legend">积分</em>
        <em class="c-tab-bar__value">{{user&&user.integral}}</em>
      </figcaption>
      <figcaption class="c-tab-bar__item" @click="goPointPage({path:'/sign/signInPointsDetails'})">
        <i class="iconfont icon-xinfeng8"></i>
        <em class="c-tab-bar__legend">兑换记录</em>
      </figcaption>
    </figure>
    <div class="integral-mall-tab-list-box">

      <section class="entry-button-group">
        <entry-button-group v-bind="entryBtnConfig"/>
      </section>

      <!--<ul class="integral-mall-tab-list">-->
      <!--<li class="integral-mall-tab-list-item">-->
      <!--<div class="integral-mall-tab"></div>-->
      <!--餐饮美食-->
      <!--</li>-->
      <!--<li class="integral-mall-tab-list-item">-->
      <!--<div class="integral-mall-tab"></div>-->
      <!--婚纱摄影-->
      <!--</li>-->
      <!--<li class="integral-mall-tab-list-item">-->
      <!--<div class="integral-mall-tab"></div>-->
      <!--休闲娱乐-->
      <!--</li>-->
      <!--<li class="integral-mall-tab-list-item">-->
      <!--<div class="integral-mall-tab"></div>-->
      <!--生鲜水果-->
      <!--</li>-->
      <!--<li class="integral-mall-tab-list-item">-->
      <!--<div class="integral-mall-tab"></div>-->
      <!--数码家电-->
      <!--</li>-->
      <!--</ul>-->
      <div class="integral-mall-tab-express" v-if="notices.length">
        <div class="integral-mall-tab-express-title">
          <span>兑换快报:</span>
        </div>
        <div class="integral-mall-tab-express-info">
          <van-swipe class="seamless-warp" :autoplay='3000' :show-indicators="false" vertical>
            <van-swipe-item v-for="(item,key) in notices" :key="key">
              <h1 class="notice-title">恭喜 {{item.userName}} 兑换 商品 {{item.name}}</h1>
            </van-swipe-item>
          </van-swipe>

        </div>
      </div>
    </div>
    <!--<div class="magic-cube ">-->
    <!--<div class="magic-cube-left"><img src=""></div>-->
    <!--<div class="magic-cube-right-top"><img src=""></div>-->
    <!--<div class="magic-cube-right-bottom"><img src=""></div>-->
    <!--</div>-->
    <div class="integral-mall-goods">
      <ul class="integral-mall-goods-list">
        <li v-for="(item,index) in goodsList" :key="index">
          <Goods :data="item" :myIntegral="user&&user.integral"></Goods>
        </li>
      </ul>
    </div>
    <more :status="hasMore"/>

    <!--<section class="c-content">-->
    <!--<empty-view></empty-view>-->
    <!--</section>-->
    <div class="integral-mall-footer">
      <div class="integral-mall-footer-tab" @click="goPointPage({path:'/home'})">
        <i class="iconfont icon-shouye"></i>
        返回首页
      </div>
      <div class="integral-mall-footer-tab" @click="goPointPage({path:'/personal/integralMall/myOrderIndex'})">
        <i class="iconfont icon-dingdan"></i>
        我的订单
      </div>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import EmptyView from "../../../components/basic/empty-view";
  import Goods from "./template/goods";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {Toast} from 'vant';
  import EntryButtonGroup from "../../../components/basic/entry-button-group";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {
    bannerConfig,
    entryBtnConfig,
    noticeConfig,
    searchOptions
  } from "../../../pages/business-district/page-config";
  import Banner from "../../../components/home/banner";
  import {hideLoading, showLoading} from "../../../util";

  export default {
    name: "IntegralMall",
    components: {EmptyView, Goods, EntryButtonGroup, Banner},
    data() {
      return {
        category: [],
        goodsList: [],
        slide: [],
        banner: [],
        user: {},
        notices: [],
        params: {
          page: 1,
          size: 10
        },
        hasMore: true,
        requesing: false,
      }
    },
    methods: {
      ...mapActions('integralMall', ["integralCategory", "integralGoodsDetails", "integralSlide", "integralGoodsList", "exchangeNotice", "integralMallShare"]),
      ...mapActions("personal", ['getUserInfoById']),
      /** 刷新列表 */ async onRefresh() {
        this.params.page = 1;
        this.getList(true);
      },
      /** 加载更多 */ async onInfinite() {
        if (!this.requesing && this.hasMore) {
          this.params.page++;
          this.requesing = true
          await this.getList();
          this.requesing = false
        }
      },
      async getList(refresh) {

        this.requesing = true;

        const res = await this.integralGoodsList(this.params);

        this.goodsList = refresh ? res.data : this.goodsList.concat(res.data);

        this.hasMore = res.data.length >= this.params.size;
        this.requesing = false;
        return this.hasMore

      },
      load() {
        showLoading();
        this.getList();
        this.getUserInfoById().then(result => {
          console.log(result);
          this.user = result;
        })

        this.exchangeNotice().then(result => {
          console.log("兑换快报")
          console.log(result);
          if (result.code == 1) {
            this.notices = result.data;
          }
        })

        this.integralCategory().then(result => {
          if (result.code == 1) {
            this.category = result.data.map((item) => ({
              ...item,
              label: item.name,
              url: this.getMediaList(item.icon).img ? this.getMediaList(item.icon).img[0] : '',
              entry: {
                path: "/personal/integralMall/integralCategory",
                query: {id: item.id}
              }
            }))
          }
        })

        this.integralSlide().then(result => {
          this.banner = result.data;

        })
        hideLoading();
      }
    },
    mixins: [utilMixins],
    computed: {
      entryBtnConfig() {
        const config = entryBtnConfig();
        return {...config, entryButtonList: this.category};
      }
    },
    created() {
      this.load();
      this.onscroll(this.onInfinite, this.$route.path);
      //配置转发信息
      this.integralMallShare().then(result => {
        console.log(result);
        updateShareConfig({
          title: result.data.title || '积分商城',
          imgUrl: result.data.shareImg,
          desc: result.data.shareDescription,
          link: window.location.href,
        });
      })

    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  #IntegralMall {
    .c-banner {
      height: 260px;

      &__img {
        width: 100%;
        height: 100%;
      }
    }

    .c-tab-bar {
      @include alignCenter;
      background: rgba(255, 255, 255, 1);
      padding: 20px 0;

      &__item {
        flex: 1;
        font-size: 26px;
        height: 50px;
        color: #333333;
        @include flex-center;

        &:first-child {
          border-right: 1Px solid #DDDDDD;
        }
      }

      .icon-jifen {
        color: #FFD200;
        font-size: 33px;
        margin-right: 14px;
      }

      .icon-xinfeng8 {
        color: #DDDDDD;
        font-size: 33px;
        margin-right: 14px;
      }

      &__value {
        color: #F1543E;
        margin-left: 10px;
      }
    }

    .c-content {
      margin-top: 20px;
      background-color: #fff;
    }

    .integral-mall-tab-list-box {
      background: #fff;

      ul {
        display: flex;
        border-top: 1.1px solid #ddd;
        border-bottom: 1.1px solid #ddd;

        li {
          flex: 1;
          text-align: center;
          color: #333;
          font-size: 0.24rem;
          margin: 0.4rem 0;

          div {
            width: 72px;
            height: 72px;
            margin: 0 auto 24px;
            border-radius: 50%;
            background: #008a00;
          }
        }
      }

      .integral-mall-tab-express {
        display: flex;
        align-items: center;
        padding: 16px 0;

        div {
          height: 56px;
          display: flex;
          align-items: center;
        }

        .integral-mall-tab-express-title {
          border-right: 1.1px solid #ddd;
          width: 188px;
          text-align: center;

          span {
            margin: 0 auto;
            color: #666;
          }
        }

        .integral-mall-tab-express-info {
          padding: 0 34px;
          color: #666;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          width: 550px;
          display: flex;
          align-items: center;
          overflow: hidden;

          .seamless-warp {
            width: 100%;

            /*.notice-title {
              font-size: 28px;
              color: #767676;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              @include alignCenter;
              @include t-overflow;
              margin-top: 56px;
            }*/
          }
        }
      }
    }

    .magic-cube {
      overflow: hidden;
      background: #fff;
      margin-top: 20px;
      padding: 32px 30px;

      div {
        float: left;
      }

      .magic-cube-left {
        width: 236px;
        height: 236px;
        margin-right: 24px;
        background: indianred;
      }

      .magic-cube-right-top {
        width: 430px;
        height: 106px;
        background: #2299dd;
      }

      .magic-cube-right-bottom {
        margin-top: 24px;
        width: 430px;
        height: 106px;
        background: #9933ff;
      }
    }

    .integral-mall-goods {
      padding-bottom: 250px;

      .integral-mall-goods-list {
        overflow: hidden;
      }
    }

    .integral-mall-footer {
      position: fixed;
      height: 96px;
      width: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      box-shadow: 0px 0px 10px 0px rgba(153, 153, 153, 0.21);
      bottom: 0;
      left: 0;

      div {
        flex: 1;
        text-align: center;
        color: #333;
      }
    }
  }
</style>
