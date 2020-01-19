<template>

  <dd-layout-div v-if="list.length > 0" class="flex-wrap flex-bt bg-f" :pad="[35]"

  >
    <dd-layout-div
      @click="goPointPage({path:'/auxiliary/mall/details',query:{goodsId:item.id}})"
      v-for="(item,key) in list"
      :key="key"
      class="mar-b-20"
      :width="330">
      <dd-layout-img
        :width="3.30"
        :height="3.30"
        :fillet="0.30"
        :src="item.showImgs[0]&&getSingleImg(item.showImgs[0].url)"/>
      <dd-layout-div :mar="[30,0,26]" :height="80" class="hide-e-2 fon-b fon-wb dis-ib" :line-height="40">
        <span style="color:#D6AB85" class="fon-b fon-wb mar-r" :line-height="40" v-if="item.power&&item.power.length > 0">自营</span>{{item.title}}
      </dd-layout-div>
      <dd-layout-div class="flex flex-y-center">
        <dd-layout-div class="col-price fon-xxl fon-wb mar-r">￥{{(+item.currentPrice).toFixed(2)}}</dd-layout-div>
        <dd-layout-div class="col-price" v-if="item.isCoupon" :pad="[3,2,2,4]" :fillet="8" :br="'0.011rem solid #f52c2c'">劵</dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="flex flex-bt" :pad="[16,0,20]">
        <dd-layout-div :font-size="22" class="col-9">￥{{(+item.originalPrice).toFixed(2)}}</dd-layout-div>
        <dd-layout-div :font-size="22" class="col-9">已售{{item.salesNum}}件</dd-layout-div>
      </dd-layout-div>
      <dd-layout-div :height="50" class="over-h">
        <dd-layout-tag class="mar-r" color="#E97D96" v-for="(name,key) in item.label" v-if="key<2" :key="key"
                       :name="name"/>
      </dd-layout-div>
    </dd-layout-div>
  </dd-layout-div>


  <!--<div class="dd-goods-card"-->
  <!--@click="$emit('click')"-->
  <!--&gt;-->
  <!--<div class="dd-goods-card_cover">-->
  <!--<img-wrapper-->
  <!--:src="item.showImgs[0]&&getSingleImg(item.showImgs[0].url)"></img-wrapper>-->
  <!--</div>-->
  <!--<div class="dd-goods-card_title">-->
  <!--<span class="label" v-if="item.power&&item.power.length > 0">{{item.power[0]}}</span>-->
  <!--<div class="title">{{item.title}}</div>-->
  <!--</div>-->
  <!--<div class="dd-goods-card_attr">-->
  <!--<span v-for="(name,key) in item.label" v-if="key<2" :key="key">{{name}}</span>-->
  <!--</div>-->
  <!--<div class="dd-goods-card_price">-->
  <!--<p class="dd-goods-card_price_now">￥{{(+item.currentPrice).toFixed(2)}}<span class="col-t fon-xss mar-l-10" v-if="item.vipMoney">会员价：{{(+item.vipMoney).toFixed(2)}}</span>-->
  <!--&lt;!&ndash;<em>劵</em>&ndash;&gt;-->
  <!--</p>-->
  <!--<div class="dd-goods-card_price_old">-->
  <!--<em>￥{{(+item.originalPrice).toFixed(2)}}</em>-->
  <!--<span>已售{{item.salesNum}}件</span>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->

</template>

<script>
  import {utilMixins} from "@/plugins/util-mixins";
  import DdLayoutImg from "../../layout/dd-layout-img";

  export default {
    components: {DdLayoutImg},
    mixins: [utilMixins],
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
  }

</script>
