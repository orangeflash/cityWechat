<template>
  <div class="mall-cart">
    <div class="mall-cart_up">
      <div class="mall-cart_up_tips">
        <span>共{{goodsTotal}}件宝贝</span>
        <span @click="clearShoppingCar" v-if="orderList.length">清空</span>
      </div>
    </div>
    <div class="mall-cart_center">
      <ul class="mall-cart_center_list" v-if="orderList.length>0">
        <li class="mall-cart_center_list_single"
            v-for="(store,index) in orderList"
            :key="index"
        >
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
                    <i class="iconfont icon-iconset0212" @click.stop="delGoods(item.childrenId)"></i>
                    <van-stepper v-model="item.num" @change="changeNum(store)"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="order-settlement">
            <div>
              共计<em>{{store.totalNum}}</em>件商品，总价：<em class="total">{{(+store.totalMoney).toFixed(2)}}</em>
              <span @click="settlement(store)">结算</span>
            </div>
          </div>
        </li>
      </ul>
      <div v-else style="margin-top: 60px">
        <not-data></not-data>
      </div>
    </div>
    <!--<div class="mall-cart_down">-->
    <!--<div class="choice-all">-->
    <!--<i class="iconfont icon-circular"></i>-->
    <!--全选-->
    <!--</div>-->
    <!--<div class="checkout">-->
    <!--<div>-->
    <!--<span>合计：<em>￥999</em></span>-->
    <!--<button>结算(0)</button>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->

  </div>
</template>
<script>

  import {mapActions, mapState} from 'vuex';
  import {hideLoading, showDialog, showLoading} from "../../../util";
  import {utilMixins} from "@/plugins/util-mixins";
  import {Toast} from 'vant'

  export default {
    mixins: [utilMixins],
    data() {
      return {
        openCoupon:false,
        orderList: [],
        num: 1,
        goodsTotal: 0,
      }
    },
    methods: {
      ...mapActions('mall', [
        'mallMyShoppingCar',
        'mallDelShoppingCar',
        'mallClearShoppingCar',
        'setOrderList'

      ]),
      async getMyCardInfo(refresh) {
        showLoading();
        const data = await this.mallMyShoppingCar();
        this.goodsTotal = 0;
        data.forEach(store => {
          store.totalNum = 0;
          store.totalMoney = 0;
          store.goods.forEach(goods => {
            store.totalNum += +goods.num;
            store.totalMoney += goods.num * goods.money;
            this.goodsTotal += +goods.num
          })

        })

        this.orderList = refresh ? data : this.orderList.concat(data);
        hideLoading();
      },
      async settlement(store) {
        console.log(store);
        // let orderInfo = {
        //   storeId: store.storeId,
        //   storeName: store.storeName,
        //   storeLogo: store.storeLogo,
        //   goods: []
        // };
        //
        //
        // store.goods.forEach(goods => {
        //   orderInfo.goods.push({
        //     id: goods.goodsId,
        //     specId: goods.groupId,
        //     price: goods.money,
        //     num: goods.num
        //   })
        // })
        // console.log(orderInfo);

        this.setOrderList([store]);
        this.goPointPage('/auxiliary/mall/orderPay');

      },
      changeNum(store) {
        console.log(store);
        store.totalNum = 0;
        store.totalMoney = 0;
        this.goodsTotal = 0;
        this.orderList.forEach(item => {
          item.goods.forEach(goods => {
            if (item == store) {
              store.totalNum += +goods.num;
              store.totalMoney += goods.num * goods.money;
            }
            this.goodsTotal += +goods.num;
          })
        })
      },
      /** 清空购物车 */
      async clearShoppingCar() {
        try {
          await showDialog("您确定要清空购物车吗？");
          console.log("这年头真是赚点钱不容易啊,订单又没了！煮熟的鸭子又飞了！");
          const res = await this.mallClearShoppingCar();
          if (res.code == 1) {
            hideLoading();
            this.getMyCardInfo(true);
          } else {
            Toast({
              message: res.msg,
              duration: 1500
            })
          }
        } catch (e) {
          console.log("老板，我的小心脏受不了啊！不要调戏我了！")
        }
      },
      async delGoods(childrenId) {
        try {
          await showDialog("您确定要删除这件商品吗？");
          console.log("又少了一件商品买卖！T _ T");
          console.log(childrenId);
          showLoading();
          const res = await this.mallDelShoppingCar({
            childrenId
          });
          console.log(res);
          if (res.code == 1) {
            hideLoading();
            this.getMyCardInfo(true);
          } else {
            Toast({
              message: res.msg,
              duration: 1500
            })
          }
        } catch (e) {
          console.log("原来是误操作啊！");
        }
      }
    },
    computed: {
      ...mapState('mall', {
        orderState: s => s.orderList
      })
    },
    created() {
      this.getMyCardInfo(true);


    }
  }

</script>
<style scoped lang="scss">
  @import "../../../assets/common";

  .mall-cart {
    &_up {
      background: $themeColor;
      height: 240px;

      > div {
        padding: 50px 30px 0;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          color: #fff;
          font-size: 28px;
        }
      }
    }

    &_center {
      padding: 10px 30px;
      margin-top: -120px;
      overflow: auto;

      &_list {
        &_single {
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
            display: flex;
            height: 194px;
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
        }
      }
    }

    &_down {
      height: 92px;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px 0 50px;

      .choice-all {
        display: flex;
        align-items: center;

        i {
          color: #999;
          font-size: 36px;
          height: 32px;
          margin-right: 10px;
        }
      }

      .checkout {
        display: flex;
        align-items: center;

        span {
          em {
            color: $themeColor;
          }
        }

        button {
          height: 56px;
          background: $themeColor;
          color: #fff;
          border-radius: 28px;
          padding: 0 30px;
          font-size: 26px;
        }
      }
    }
  }
</style>
