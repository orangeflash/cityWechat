<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="mall-store-details" v-if="storeInfo.storeName">
    <div class="mall-store-details_top">
      <div class="mall-store-details_top_search fixed"
           :class="{'back':isScroll}"
      >
        <Search
          placeholder="搜索本店商品"
          @search="search"
          searchType="8"
        ></Search>
      </div>
      <div class="mall-store-details_top_info">
        <dd-frame
          :src="getSingleImg(storeInfo.storeLogo[0].url)"
          :size="50"
          :title="storeInfo.storeName"
          :titleSize="15"
          titleColor="#fff"
        >
          <template slot="info">
            <div class="info">
              <span>{{storeInfo.followNum}}人关注</span>
              <!--<van-rate  readonly  v-model="value" :size="10"/>-->
            </div>
          </template>
          <template slot="right">
            <div class="follow-btn"
                 :class="{'follow':storeInfo.follow}"
                 @click="followOperation">
              <i class="iconfont icon-dianzan2"

              ></i>
              <span>关注</span>
            </div>
          </template>
        </dd-frame>
      </div>

    </div>
    <div class="mall-store-details_nav">
      <div class="mall-store-details_nav_list">
        <van-tabs v-model="active" :color="$themeColor" @change="tabsChange">
          <van-tab title="全部"></van-tab>
          <van-tab title="热销"></van-tab>
          <van-tab title="上新"></van-tab>
        </van-tabs>
      </div>
      <div class="icon" @click="changeLayer">
        <i class="iconfont icon-kujialeqiyezhan_zhinengbuju"
           :class="{'active':layerType}"
        ></i>
      </div>
    </div>
    <div class="scroller-box">
      <scroller
        :on-refresh="onrefresh"
        :on-infinite="onInfinite"
      >

        <ul
          v-if="!layerType"
        >

          <goods-card :list="goodsList"/>
        </ul>
        <ul v-else style="padding-top: 10px;">
          <dd-coupon
            v-for="(item,key) in goodsList"
            :key="key"
            :cover="getSingleImg(item.showImgs.length&&item.showImgs[0].url)"
            coverSize="120"
            @click="goPointPage({path:'/auxiliary/mall/details',query:{goodsId:item.id}})"
          >
            <template slot="up">
              <div class="goods-title">
                <dd-tag
                  v-if="item.power"
                  :name="item.power[0]"
                  color="#FF3838"
                  class="round"
                ></dd-tag>
                <span class="goods-title_info">{{item.title}}</span>
              </div>
            </template>
            <template slot="center">
              <div class="goods-attr" v-if="item.label&&item.label.length>0">
                <span v-for="(name,key) in item.label" v-if="key<2" :key="key">{{name}}</span>
              </div>
            </template>
            <template slot="down">
              <div class="goods-price">
                <div>
                  <span class="now">￥{{item.currentPrice}}</span>
                  <!--<em class="coupon">劵</em>-->
                  <span class="old">￥{{item.originalPrice}}</span>
                </div>
                <span class="goods-sale">已售{{item.salesNum}}件</span>
              </div>
            </template>
          </dd-coupon>
        </ul>

      </scroller>
    </div>
    <dd-goods-nav
      :big-btn="bigBtn"
      @method="goodsNav"
      type="bottom"
    >
    </dd-goods-nav>
  </div>
</template>
<script>
  import Search from '@/components/template/search';
  import DdFrame from '@/components/template/dd-frame';
  import DdTabs from '@/components/template/dd-tabs';
  import GoodsCard from '@/components/template/goods-card';
  import DdCoupon from '@/components/template/dd-coupon';

  import DdTag from '@/components/template/dd-tag';
  import DdGoodsNav from '@/components/template/mall/dd-goods-nav';
  import {Toast} from 'vant'
  import {mapActions, mapState, mapGetters} from "vuex";
  import {utilMixins} from "@/plugins/util-mixins";
  import {hideLoading, showLoading} from "../../../util";

  export default {
    mixins: [utilMixins],
    components: {Search, DdFrame, DdTabs, GoodsCard, DdCoupon, DdTag, DdGoodsNav},
    data() {
      return {
        storeInfo: {},
        layerType: false,
        isScroll: false,
        active: 0,
        value: 4,
        tabs: [
          {name: '全部'}, {name: '热销'}, {name: '上新'}
        ],
        goodsList: [],
        bigBtn: [
          {
            icon: 'icon-shangdian',
            name: '首页',
            field: 'frist'
          }, {
            icon: 'icon-liebiao1',
            name: '商家详情',
            field: 'details'
          }, {
            icon: 'icon-kefu',
            name: '联系客服',
            field: 'service'
          }
        ],
        params: {
          sort: null,    //排序
          size: 10,
          page: 1,
          storeId: null,
          word: null,      //关键字
        }

      }
    },
    methods: {
      ...mapActions('mall', ['getMallBusinessGoodsList']),
      ...mapActions('shop', ['getShopInfoWithUserIdById']),
      ...mapActions(['collectionPost']),
      /** 搜索 */
      search(val) {
        this.params.word = val;
        this.params.page = 1;
        this.getGoodsList(true);
      },
      /** 切换布局 */
      changeLayer() {
        this.layerType = !this.layerType;
        console.log("this.layerType", this.layerType)
        this.onrefresh();
      },
      /** 切换排序 */
      tabsChange(index) {
        this.params.page = 1;
        switch (index) {
          case 0:    //全部
            this.params.sort = "default"
            break;
          case 1:    //热销
            this.params.sort = 'salesNum';
            break;
          case 2:    //上新
            this.params.sort = 'new';
            break;
        }
        this.getGoodsList(true);
      },
      /** 关注 */
      async followOperation() {
        await this.collectionPost({
          type: 2,
          postId: this.storeInfo.id
        })
        this.storeInfo.follow = !this.storeInfo.follow;

        this.storeInfo.follow ? this.storeInfo.followNum++ : this.storeInfo.followNum--;

        this.storeInfo.follow ? Toast({
          message: '已关注',
          duration: 1500
        }) : Toast({
          message: '已取消',
          duration: 1500
        })
      },
      /** 底部导航 */
      goodsNav(item) {
        switch (item.field) {
          case 'frist':
            this.goPointPage('/auxiliary/mall');
            break;
          case 'details':
            this.goPointPage({
              path: '/shopDetail',
              query: {
                storeId: this.storeInfo.id
              }
            })
            break;
          case 'service': //拨打电话
            location.href = 'tel://' + this.storeInfo.linkTel;
            break;
        }
      },
      async getGoodsList(refresh) {
        showLoading();
        const result = await this.getMallBusinessGoodsList(this.params)



        this.goodsList = refresh ? result : this.goodsList.concat(result);
        hideLoading();
        return result.length < this.params.size;
      },
      /** 刷新 */
      async onrefresh(done) {
        this.params.page = 1;
        await this.getGoodsList(true);
        return done && done();
      },
      /** 加载更多 */
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getGoodsList();
        return done && done(bool);
      }
    },
    created() {
      const query = this.$route.query;
      if (query.id) {
        this.storeInfo = query;
        this.params.storeId = this.storeInfo.id;
        this.getGoodsList();
        this.getShopInfoWithUserIdById(this.storeInfo.id).then(result => {
          console.log('getShopInfoWithUserId', result);
          this.storeInfo = result;
          this.storeInfo.storeLogo = JSON.parse(this.storeInfo.storeLogo);
        })
      } else {
        Toast.fail({
          message: '缺少商家id',
          duration: 1500
        })
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500);
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .mall-store-details {
    padding-bottom: 120px;

    &_top {
      background: $themeColor;

      &_search {
        padding: 10px 50px;
      }

      &_info {
        padding: 30px 30px 40px;

        .info {
          display: flex;
          margin-top: 20px;
          align-items: center;

          span {
            color: #fff;
            font-size: 22px;
            margin-right: 20px;
          }
        }

        .follow-btn {
          width: 128px;
          padding: 16px 0 10px;
          background: rgba(0, 0, 0, .5);
          border-radius: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 24px;

          i {
            font-size: 26px;
            height: 24px;
            margin-right: 10px;
          }
        }
      }
    }

    &_nav {
      display: flex;
      justify-content: space-between;
      background: #fff;

      &_list {
        width: calc(100% - 150px);
      }

      .icon {
        width: 150px;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 46px;
          color: #999;
        }

      }
    }

    &_goods_list {
      padding: 16px 0 16px 28px;
      display: flex;
      flex-wrap: wrap;
    }

    .goods-title {
      overflow: hidden;
      height: 96px;
      padding-top: 10px;

      &_info {
        font-size: 28px;
        line-height: 48px;
      }
    }

    .goods-attr {
      display: flex;
      flex-wrap: wrap;
      margin: 15px 0;
      height: 50px;
      display: flex;
      align-items: center;

      span {
        padding: 8px 20px;
        border-radius: 10px;
        background: #F8F8F8;
        color: #999;
        margin-right: 10px;
        margin-bottom: 5px;
      }
    }

    .goods-price {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > div {

        .now {
          color: #FF0000;
          font-size: 26px;
        }

        .old {
          color: #999;
          font-size: 20px;
          text-decoration: line-through;
        }

        .coupon {
          border: 0.01rem solid #FF0000;
          padding: 0.03rem;
          border-radius: 50%;
          margin-left: 0.1rem;
          font-size: 0.22rem;
          margin-top: -0.05rem;
          color: #FF0000;
          display: inline-block;
        }
      }

      .goods-sale {
        padding: 0.08rem 0.12rem 0.05rem;
        color: #999;
        border: 0.01rem solid #ddd;
        border-radius: 0.1rem;

      }
    }

    .follow {
      color: $themeColor;
      background: #fff;
    }

    .scroller-box {
      position: fixed;
      z-index: 0;
      width: 100%;
      height: calc(100% - 350px - 100px);
    }

  }

  .active {
    color: $themeColor !important;
  }
</style>
