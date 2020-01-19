<template>

  <div class="dd-shopping-car" v-if="store.storeId && store.goods.length > 0">
    <div class="up"
         @click="goPointPage('/auxiliary/mall/storeDetails?id='+store.storeId)">
      <i class="iconfont icon-tubiaolunkuo- icon"></i>
      <span>{{store.storeName}}</span>
      <i class="iconfont icon-youjiantou1 right"></i>
    </div>
    <div class="goods"
         v-for="(item,key) in store.goods"
         :key="key"
         :class="{bt:key>0}"
         @click="goPointPage({path:'/auxiliary/mall/details',query:{goodsId:item.goodsId}})"
    >
      <!--<div class="choice-box">-->
      <!--<i class="iconfont icon-circular"></i>-->
      <!--</div>-->

      <div class="goods_info">
        <div class="goods_info_cover">
          <img-wrapper
            v-if="item.showImgs.length>0"
            :src="getSingleImg(item.showImgs[0].url)"
          ></img-wrapper>
        </div>
        <div class="goods_info_txt">
          <div class="title">{{item.title}}</div>
          <div class="tabs">
            <span v-if="item.data">{{item.data}}</span>
          </div>
          <div class="attr">
            <span>￥{{(+item.money).toFixed(2)}}</span>
            <div @click.stop>
              <i class="iconfont icon-iconset0212" v-if="item.childrenId"
                 @click.stop="delGoods(item.childrenId,key)"></i>
              <van-stepper v-model="item.num" @change="changeNum(store)"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row-info">
        <span class="row-info_label">运费：</span>
        <span class="row-info_tips">{{item.isPost==1 || (+item.satisfy <= 0) || item.freightTips?'包邮':'快递：￥'+(+item.freight).toFixed(2)+'(满'+(+item.satisfy).toFixed(2)+'包邮)'}}</span>
      </div>
    </div>
    <div class="row-info bortop" v-if="coupons&&coupons.length>0">
      <span class="row-info_label">优惠劵：</span>
      <span class="row-info_tips"  @click.stop="$emit('choiceCoupon')">{{store.couponTips?store.couponTips:'有'+coupons.length+'张可用'}}
          <i class="iconfont icon-youjiantou1"></i>
        </span>
    </div>
    <!--<div class="down" v-if="coupons&&coupons.length>0">-->
      <!--<van-cell title="优惠劵:"-->
                <!--is-link :value="store.couponTips?store.couponTips:'有'+coupons.length+'张可用'"-->
                <!--@click="$emit('choiceCoupon')"-->
      <!--/>-->
    <!--</div>-->
    <div class="order-settlement" v-if="!hideSettlement">
      <div>
        共计<em>{{store.totalNum}}</em>件商品，总价：<em class="total">{{(+store.totalMoney).toFixed(2)}}</em>
        <span @click="settlement(store)">结算</span>
      </div>
    </div>
  </div>


</template>

<script>
  import {utilMixins} from "@/plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    props: ['store', 'hideSettlement', 'coupons'],
    methods: {
      changeNum(store) {
        store.goodsTotalMoney = 0;
        store.goodsTotalNum = 0;
        store.goodsTotalFreight = 0;
        store.goods.forEach(goods => {
          store.goodsTotalMoney += goods.num * goods.money;
          store.goodsTotalNum += +goods.num;
          store.goodsTotalFreight += +goods.freight
        })
        this.$emit('change', store);
      },
      async delGoods(childrenId, key) {

        this.$emit('delete', {
          store: this.store,
          childrenId,
          key
        });

        // console.log(8888);
        // this.store.goods.splice(key, 1);
        // this.$emit('change',this.store);
      }
    }
  }


</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-shopping-car {
    background: #fff;
    overflow: hidden;
    border-radius: 20px;
    padding: 30px 20px;
    margin-bottom: 24px;

    .up {

      font-size: 28px;
      display: flex;
      align-items: center;

      i {
        margin-right: 20px;
      }

      i.icon {
        font-size: 36px;
        height: 32px;
      }

      i.right {
        font-size: 26px;
        height: 20px;
        color: #999;
      }
    }

    .bt {
      border-top: 1.1px solid #eee;
    }

    .goods {
      padding: 30px 0;

      .choice-box {
        display: flex;
        align-items: center;
        width: 50px;

        i {
          font-size: 36px;
          color: #999;
        }

        i.active {
          color: $themeColor !important;
        }

      }

      .goods_info {
        display: flex;
        width: 100%;

        &_cover {
          width: 194px;
          height: 194px;
          overflow: hidden;
          background: #ddd;
          margin-right: 20px;
          border-radius: 8px;
        }

        &_txt {
          width: calc(100% - 194px - 20px);

          .title {
            font-size: 26px;
            height: 84px;
            line-height: 42px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .tabs {
            display: flex;
            margin: 10px 0;
            height: 40px;

            span {
              background: #eee;
              color: #999;
              padding: 8px 15px 4px;
              font-size: 24px;
              border-radius: 8px;
            }
          }

          .attr {
            display: flex;
            justify-content: space-between;
            align-items: center;

            span {
              color: $themeColor;
              font-size: 28px;
            }

            div {
              display: flex;
              align-items: center;

              > i {
                color: #FF1B1B;
                margin-right: 10px;
              }
            }
          }
        }

      }

    }

    .order-settlement {
      padding: 10px 0 0;
      display: flex;
      justify-content: flex-end;

      > div {
        display: flex;
        align-items: center;

        em {
          color: $themeColor;
          margin: 0 5px;
        }

        em.total {
          font-size: 30px;
        }

        em.total:before {
          content: '￥';
          font-size: 24px;
        }

        span {
          background: $themeColor;
          color: #fff;
          border-radius: 8px;
          padding: 16px 20px 10px;
          margin-left: 20px;
        }
      }
    }

    .row-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 30px;
      font-size: 26px;
      &_tips{
        color: #999;
        i{
          font-size: 26px;
        }
      }
    }
    .bortop{
      border-top: 1.1px solid #eee;
    }
  }
</style>
