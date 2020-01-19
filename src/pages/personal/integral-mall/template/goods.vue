<template>
  <li class="integral-mall-goods-item" @click="goPointPage({path:'/personal/integralMall/goodsDetails',query:{id:data.id,myIntegral:myIntegral}})">
    <div class="integral-mall-goods-item-cover-box">
      <img-wrapper :src="getMediaList(data.logo).img[0]"></img-wrapper>
      <img v-if="+data.isRecommend == 1" class="recommend-icon" :src="recommend"/>
    </div>
    <div class="integral-mall-goods-item-info">
      <p class="integral-mall-goods-item-title">{{data.name}}</p>
      <p class="integral-mall-goods-item-tips">已有{{data.exchangeNum}}人兑换成功</p>
      <div class="integral-mall-goods-item-operation">
        <span class="integral-mall-goods-item-integral-number">{{data.score}} +</span>
        <span class="integral-mall-goods-item-integral-price">{{data.money}}
          <!--.<em>99</em>-->
        </span>
      </div>
    </div>
  </li>
</template>
<script>
  import {utilMixins} from "../../../../plugins/util-mixins";
  import recommend from "../../../../assets/img/order/recommend.png"


  export default {
    props:["data","myIntegral"],
    data(){
      return{
        recommend
      }
    },
    mixins: [utilMixins],
  }
</script>
<style scoped lang="scss">
  @import "../../../../assets/common";

  .integral-mall-goods-item {
    background: #fff;
    float: left;
    overflow: hidden;
    margin: 20px 0 0 26px;
    border-radius: 8px;
    width: 334px;
    border: 1.1px solid #fff;

    .integral-mall-goods-item-cover-box {
      width: 334px;
      height: 334px;
      overflow: hidden;
      background: #f4f4f4;
      position: relative;
      z-index: 0;
      .recommend-icon{
        position: absolute;
        z-index: 0;
        top: 16px;
        left: 16px;
        width: 86px;
        height: 80px;
      }
    }

    .integral-mall-goods-item-info {
      padding: 30px 20px;

      .integral-mall-goods-item-title {
        font-size: 28px;
        color: #000;
        height: 28px;
        line-height: 34px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .integral-mall-goods-item-tips {
        font-size: 22px;
        color: #999;
        margin: 28px 0;
        height: 22px;
        overflow: hidden;
      }

      .integral-mall-goods-item-operation {
        border-radius: 44px;
        overflow: hidden;
        height: 44px;

        span {
          height: 100%;
          float: left;
          line-height: 44px;
          text-align: center;
        }

        .integral-mall-goods-item-integral-number:before {
          content: '积分';
        }

        .integral-mall-goods-item-integral-number {
          background: #FFE8E5;
          color: #FF0000;
          width: 160px;
          margin-right: 8px;
        }

        .integral-mall-goods-item-integral-price {
          color: #fff;
          background: #FF635D;
          width: 126px;

          em {
            font-size: 22px;
          }
        }

        .integral-mall-goods-item-integral-price:before {
          content: "￥";
        }
      }
    }
  }
</style>
