<template>
  <div id="goods-details">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->

    <div class="goods-swipe-box">
      <van-swipe class="c-banner" :show-indicators="false" :autoplay="3000">
        <van-swipe-item v-for="(item,key) in getMediaList(goods.logo).img" :key="key">
          <img-wrapper class="c-banner__img" :src="item"/>
        </van-swipe-item>
      </van-swipe>
      <!--<ul class="goods-exchange-status-list">-->
      <!--<li>-->
      <!--<div><img-wrapper src="https://app.zhycms.com//file/1/2019/01-04/Kq0bmPx6NNIdCEL41546595634.png"></img-wrapper></div><span>hssg  3分钟前兑换成功</span>-->
      <!--</li>-->
      <!--</ul>-->
      <ul class="other-methods">
        <li @click="goPointPage({path:'/home'})"><span>返回</br>首页</span></li>
        <!--<li><span>生成</br>海报</span></li>-->
        <!--<li><i class="iconfont icon-music-note"></i></li>-->
      </ul>
    </div>
    <div class="goods-info">
      <span class="goods-info-price money" v-if="+goods.money>0">{{+goods.money<=0?'':goods.money}}
        <!--<em>99</em>-->
      </span> <span class="goods-info-integral">{{goods.score}}</span>
      <div class="goods-info-tips">已有{{goods.exchangeNum}}人兑换成功</div>
      <p class="goods-lod-price">&nbsp;原价：{{(+goods.originalPrice).toFixed(2)}}&nbsp;元</p>
      <div class="goods-title">
        <!--<div class="share-goods">-->
        <!--<i class="iconfont icon-fenxiang-tianchong"></i>-->
        <!--分享-->
        <!--</div>-->
        <p class="goods-title-txt">{{goods.name}}</p>

      </div>
    </div>
    <!--<div class="goods-discount">-->
    <!--<span class="goods-discount-btn">积分优惠券</span>-->
    <!--<span class="goods-discount-info">使用222积分可享受优惠100元</span>-->
    <!--</div>-->
    <!--<div class="business-info">-->
    <!--<div class="info-title">-->
    <!--<div class="info-title-details">-->
    <!--<i class="iconfont icon-shangdian"></i>-->
    <!--<span>商家信息</span>-->
    <!--</div>-->

    <!--</div>-->

    <!--<ul class="info-list">-->
    <!--<p class="business-name">商家名称</p>-->
    <!--<li>营业时间：10:00-21:00</li>-->
    <!--<li>商家电话：11111111111<a href="tel://4008001234"><span>拨打</span></a></li>-->
    <!--<li>武汉市洪山区街道口阜华大厦2802<span>导航</span></li>-->
    <!--</ul>-->
    <!--</div>-->
    <!--<div class="goods-notice">-->
    <!--<div class="info-title">-->
    <!--<div class="info-title-details">-->
    <!--<i class="iconfont icon-shiyongxuzhi"></i>-->
    <!--<span>商品须知</span>-->
    <!--</div>-->
    <!--</div>-->
    <!--<ul class="info-list">-->
    <!--<li><i></i>使用222积分可抵扣100元</li>-->
    <!--<li><i></i>该优惠不可与其他优惠同享</li>-->
    <!--</ul>-->
    <!--</div>-->
    <div class="goods-other-info" v-if="goods.body">
      <div class="info-title">
        <div class="info-title-details">
          <i class="iconfont icon-shiyongxuzhi"></i>
          <span>商品详情</span>
        </div>
        <!--<div><span class="active"></span></div>-->
        <!--<div><span>购买评价</span></div>-->
      </div>
      <div class="goods-info-txt pactBody" v-html="goods.body"></div>
    </div>
    <div class="other-godos" v-if="goodsList.length">
      <div class="info-title">
        <div class="info-title-details">
          <i class="iconfont icon-tuijianliebiao"></i>
          <span>推荐商品</span>
        </div>
      </div>
      <ul class="other-goods-list">
        <Goods :data="item" v-for="(item,index) in goodsList" :key="index"></Goods>
      </ul>
    </div>
    <div class="goods-details-footer">
      <div class="goods-details-tab" @click="goPointPage({path:'/home'})">
        <i class="iconfont icon-shouye"></i>
        首页
      </div>
      <div class="goods-details-tab" @click="isShowContactCode = !isShowContactCode"><i class="iconfont icon-kefu"></i>客服
      </div>
      <div class="goods-details-pay-tab fail" v-if="+myIntegral<+goods.score">积分不足</div>
      <div class="goods-details-pay-tab success"
           @click="goPointPage({path:'/personal/integralMall/orderPay',query:{goodsId:goods.id,myIntegral:myIntegral}})">
        立即兑换
      </div>
    </div>
    <!--<van-popup v-if="show" v-model="show" position="bottom">-->
    <!--<div class="goods-pay-details">-->
    <!--<ul class="goods-pay-details-list">-->
    <!--<li>-->
    <!--<div class="godos-cover-box">-->
    <!--<img src="">-->
    <!--</div>-->
    <!--<div class="close-goods-pay-details" @click="show = !show">-->
    <!--<i class="iconfont icon-close"></i>-->
    <!--</div>-->
    <!--<div class="goods-txt-data">-->
    <!--<p class="goods-price">99.99</p>-->
    <!--<p class="goods-spec">请选择规格、分类</p>-->
    <!--</div>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div class="goods-details-mini-title">规格</div>-->
    <!--<ul>-->
    <!--<van-button type="default" size="small" v-for="(item,index) in goodsSpec" :key="index" @click="choiceSpec(item)" :class="{action:item.action,prohibit:item.prohibit}">{{item.name}}</van-button>-->
    <!--</ul>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div class="goods-details-mini-title">分类</div>-->
    <!--<ul>-->
    <!--<van-button type="default" size="small" v-for="(item,index) in goodsType" :key="index" @click="choiceType(item)" :class="{action:item.action,prohibit:item.prohibit}">{{item.name}}</van-button>-->
    <!--</ul>-->
    <!--</li>-->
    <!--<li>-->
    <!--<div class="goods-details-mini-title">-->
    <!--购买数量-->
    <!--<ChoiceNumber></ChoiceNumber>-->
    <!--</div>-->
    <!--</li>-->
    <!--</ul>-->
    <!--<van-button size="large" @click="$pushRoute('/personal/integralMall/orderPay')">确认</van-button>-->
    <!--</div>-->

    <!--</van-popup>-->
    <Popup v-if="isShowContactCode" :QRCode="platform.contactCode" @close="isShowContactCode = false"
           desc="联系客服"></Popup>
  </div>
</template>
<script>
  import Goods from "./template/goods";
  import ChoiceNumber from "./template/choice-number";
  import {updateShareConfig} from "@/util/wechat-util";
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import Popup from '../../../components/popup'       // 弹窗


  export default {
    name: "goodsDetails",
    components: {Goods, ChoiceNumber, Popup},
    data() {
      return {
        goods: {},
        isShowContactCode: false,
        show: false,
        goodsNumber: 0,
        maxNumber: 99,
        myIntegral: 0,
        goodsType: [
          {name: "分类一"},
          {name: "分类二"},
          {name: "分类三", prohibit: true}
        ],
        goodsSpec: [
          {name: "规格一"},
          {name: "规格二"},
          {name: "规格三", prohibit: true}
        ],
        goodsList: []
      }
    },

    methods: {
      ...mapActions("integralMall", ["integralGoodsDetails", "integralGoodsList"]),
      choiceGoodsNumber(bool) {
        if (bool) {
          this.goodsNumber++
          if (this.goodsNumber >= this.maxNumber) {
            this.goodsNumber = this.maxNumber;
          }
        } else {
          this.goodsNumber--;
          if (this.goodsNumber <= 0) {
            this.goodsNumber = 0;
          }
        }
      },
      choiceSpec(item) {
        if (!item.prohibit) {
          let obj = this;
          this.goodsSpec.forEach(v => {
            if (v.action === undefined) {
              obj.$set(item, 'action', false);
            }
            v.action = false;
          })
          item.action = true
        }
      },
      choiceType(item) {
        if (!item.prohibit) {
          let obj = this;
          this.goodsType.forEach(v => {
            if (v.action === undefined) {
              obj.$set(item, 'action', false);
            }
            v.action = false;
          })
          item.action = true
        }
      },
      load() {
        this.id = this.$route.query.id;
        this.myIntegral = this.$route.query.myIntegral;
        this.integralGoodsDetails({
          id: this.id
        }).then(result => {
          console.log(result);
          this.goods = result.data;

          updateShareConfig({
            title: this.goods.name,
            imgUrl: this.getMediaList(this.goods.logo).img[0],
            desc: this.goods.name,
            link: window.location.href,
          })

        })
        this.integralGoodsList({
          isRecommend: 1
        }).then(result => {
          console.log(result)
          this.goodsList = result.data;
        })
      }
    },
    computed: {
      ...mapState({
        platform: state => state.platform
      })
    },
    mixins: [utilMixins],
    created() {
      this.load();


    }
  }

</script>
<style scoped lang="scss">
  @import "../../../assets/common";

  #goods-details {
    background: #F4F4F4;

    .goods-swipe-box {
      position: relative;

      .goods-exchange-status-list {
        position: absolute;
        top: 30px;
        left: 30px;

        li {
          background: rgba(0, 0, 0, .6);
          height: 60px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          padding: 0 20px;

          div {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 30px;
          }

          span {
            font-size: 24px;
            color: #fff;
          }
        }
      }

      .c-banner {
        height: 750px;
      }

      .other-methods {
        position: absolute;
        right: 30px;
        bottom: 40px;
        width: 72px;

        li {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          text-align: center;
          display: flex;
          align-items: center;
          margin-top: 24px;

          span {
            font-size: 22px;
            color: #F4F4F4;
            text-align: center;
            margin: 0 auto;
            line-height: 26px;
          }

          i {
            display: block;
            margin: 0 auto;
            color: #f4f4f4;
            font-size: 36px;
          }
        }
      }
    }


    .goods-info {
      color: #FF0101;
      padding: 30px 24px;
      background: #fff;
      margin-bottom: 20px;

      span {
        color: #FF0101;
        font-size: 40px;

        em {
          font-size: 24px;
        }
      }

      .goods-info-price.money:before {
        content: '￥';
        font-size: 24px;
      }

      .goods-info-integral:after {
        content: '积分';
        font-size: 24px;
      }

      .goods-info-price.money:after {
        content: "+";
        font-size: 24px;
      }


      .goods-info-tips {
        float: right;
        color: #999;
      }

      .goods-lod-price {
        font-size: 24px;
        font-weight: 500;
        color: #999;
        text-decoration: line-through;
        margin: 20px 0;
      }

      .goods-title {
        overflow: hidden;

        .goods-title-txt {
          color: #000;
          font-size: 28px;
          /*margin-right: 160px;*/
          line-height: 48px;
        }

        .share-goods {
          float: right;
          text-align: center;
          color: #999;

          i {
            display: block;
            font-size: 32px;
            color: #5DB271;
            margin-bottom: 12px;
          }
        }
      }
    }

    .goods-discount {
      margin: 20px 0;
      background: #fff;
      height: 98px;
      display: flex;
      padding: 0 30px;
      align-items: center;

      .goods-discount-btn {
        border: 1.1px solid #FF3A56;
        color: #FF3A56;
        width: 166px;
        height: 50px;
        line-height: 50px;
        font-size: 26px;
        text-align: center;
        border-radius: 8px;
        margin-right: 30px;
      }
    }

    .business-info {
      background: #fff;
    }

    .info-title {
      display: flex;
      height: 98px;
      background: #fff;
      align-items: center;
      border-bottom: 1.1px solid #ddd;

      .info-title-details {
        margin: 0 auto;
        font-size: 30px;

        i {
          color: $themeColor;
        }
      }
    }

    .info-list {
      padding: 30px;
      line-height: 50px;
      font-size: 28px;

      li {
        color: #666;
        overflow: hidden;
        height: 50px;


        span {
          float: right;
          background: $themeColor;
          color: #fff;
          width: 88px;
          height: 44px;
          line-height: 44px;
          font-size: 26px;
          border-radius: 4px;
          text-align: center;
        }

        i {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #666;
          float: left;
          margin-right: 30px;
          margin-top: 18px;
          font-size: 32px;
        }
      }
    }

    .goods-notice {
      margin: 20px 0;
      background: #fff;
    }

    .goods-other-info {
      background: #fff;

      .info-title {
        div {
          flex: 1;
          text-align: center;
          height: 100%;
          line-height: 94px;
          font-size: 30px;

          span.active {
            color: $themeColor;
            border-bottom: 4px solid $themeColor;
            display: inline-block;
          }
        }
      }
    }

    .other-godos {
      margin-top: 20px;

      .other-goods-list {
        overflow: hidden;
        padding-bottom: 150px;
      }
    }

    .goods-details-footer {
      height: 100px;
      overflow: hidden;
      position: fixed;
      width: 100%;
      bottom: 0;
      left: 0;
      border-top: 1.1px solid #f4f4f4;

      .goods-details-tab {
        float: left;
        width: 113px;
        height: 100%;
        background: #fff;
        text-align: center;

        i {
          display: block;
          font-size: 32px;
          margin: 24px auto 12px;
        }
      }

      .goods-details-pay-tab {
        text-align: center;
        font-size: 34px;

        height: 100%;
        line-height: 100px;
      }
    }

    .van-popup.van-popup--bottom {
      .goods-pay-details {
        .van-button.van-button--primary.van-button--large {
          background: $themeColor;
        }

        .goods-pay-details-list {
          padding: 15px;

          li {
            border-bottom: 1.1px solid #ddd;
            padding: 16px 0;
            overflow: hidden;

            .godos-cover-box {
              float: left;
              width: 89px;
              height: 89px;
              background: #ddd;
              overflow: hidden;
              margin-right: 18px;
              border-radius: 4px;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .close-goods-pay-details {
              float: right;
              width: 26px;
              height: 89px;

              i {
                float: right;
                font-size: 24px;
                color: #999;
              }
            }

            .goods-txt-data {
              padding-top: 23px;

              .goods-price {
                color: #FF0000;
                font-size: 22px;
                margin-bottom: 16px;
              }

              .goods-price:before {
                content: "￥";
                font-size: 15px;
              }

              .goods-spec {
                color: #333;
                font-size: 13px;
              }
            }

            .goods-details-mini-title {
              color: #333;
              font-size: 15px;
              overflow: hidden;

            }

            ul {
              margin-top: 13px;

              button {
                margin-right: 16px;
                background: #eee;
                border: 1.1px solid #eee;
                border-radius: 4px;
                color: #333;
              }

              button.action {
                background: rgba(255, 231, 227, 1);
                border: 1.1px solid rgba(245, 90, 90, 1);
                color: #F55A5A;
              }

              button.prohibit {
                background: #eee;
                color: #999;
                border: 1.1px solid #eee;
              }
            }
          }
        }

        button {
          background: $themeColor;
          color: #fff;
        }
      }
    }

    .goods-info-txt {
      padding: 30px;
    }

    .success {
      background: $themeColor;
      color: #fff;
    }

    .fail {
      background: #ddd;
      color: #666;
    }
  }
</style>
