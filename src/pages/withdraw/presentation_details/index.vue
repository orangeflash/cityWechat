<template>
  <!--提现明细-->
  <div id="presentation_details">

    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <router-view/>
    <!--<div class="tabs-list">-->
      <!--<div @click="getPresentation(false)"><span :class="{'active':active===0}" >提现</span></div>-->
      <!--<div @click="getRecharge(false)"><span :class="{'active':active===1}">充值</span></div>-->
    <!--</div>-->
    <!--<div class="data-list">-->
      <!--<div v-if="active===0" v-for="(item,key) in presentationData" :key="key" class="persent"-->
           <!--@click="$pushRoute({path:'/withdraw/details',query:{id:item.id}})">-->
        <!--<div class="present-type">-->
          <!--<i class="iconfont " :class="{'icon-weixinzhifu4': +item.mode==1,'icon-zhifubao': +item.mode===2,'icon-iconfontjikediancanicon20': +item.mode===3}"></i>-->
        <!--</div>-->
        <!--<div class="present-status">-->
          <!--<p class="present-money">{{item.applyMoney}}</p>-->
          <!--<span class="present-status-txt">{{+item.status===1?'审核中': +item.status===2?'已通过':'已拒绝'}}</span>-->
        <!--</div>-->
        <!--<div class="present-info">-->
          <!--<p class="present-info-time">{{formatDateByTimeStamp(item.creatTime,"MM-DD")}} {{formatDateByTimeStamp(item.creatTime,"HH:mm")}}</p>-->
          <!--<span class="present-info-order">订单号:{{item.orderNum}}</span>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div v-if="active===1" v-for="(item,key) in rechargeData" :key="key" class="recharge">-->
        <!--<div class="recharge-status">-->
          <!--<p class="recharge-money">+{{item.money}}</p>-->
          <!--<span class="recharge-status-txt">已到账</span>-->
        <!--</div>-->
        <!--<div class="recharge-info">-->
          <!--<p class="recharge-time">{{formatDateByTimeStamp(item.creatTime,"MM-DD")}} {{formatDateByTimeStamp(item.creatTime,"HH:mm")}}</p>-->
          <!--<p class="recharge-order">订单号：{{item.orderNum}}</p>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!--<div class="load-more" @click="loadMore">{{tips}}</div>-->
  </div>
</template>
<script>
  import Header from "@/components/header";
  export default {
    components:{Header},
    data() {
      return {

      }
    },
    methods: {},
    computed: {},
    created() {
    }
  }

</script>
