<template>
  <div id="presentation-content">
    <div class="tabs-list">
      <div @click="getPresentation(false)"><span :class="{'active':active===0}">提现</span></div>
      <div @click="getRecharge(false)"><span :class="{'active':active===1}">充值</span></div>
    </div>
    <div class="data-list">
      <div v-if="active===0" v-for="(item,key) in presentationData" :key="key" class="persent"
           @click="goPointPage({path:'/withdraw/details',query:{id:item.id}})">
        <div class="present-type">
          <i class="iconfont "
             :class="{'icon-weixinzhifu4': +item.mode==1,'icon-zhifubao': +item.mode===2,'icon-iconfontjikediancanicon20': +item.mode===3}"></i>
        </div>
        <div class="present-status">
          <p class="present-money">{{item.applyMoney}}</p>
          <span class="present-status-txt">{{+item.status===1?'审核中': +item.status===2?'已通过':'已拒绝'}}</span>
        </div>
        <div class="present-info">
          <p class="present-info-time">{{formatDateByTimeStamp(item.creatTime,"MM-DD")}}
            {{formatDateByTimeStamp(item.creatTime,"HH:mm")}}</p>
          <span class="present-info-order">订单号:{{item.orderNum}}</span>
        </div>
      </div>
      <div v-if="active===1" v-for="(item,key) in rechargeData" :key="key" class="recharge">
        <div class="recharge-status">
          <p class="recharge-money">+{{item.money}}</p>
          <span class="recharge-status-txt">已到账</span>
        </div>
        <div class="recharge-info">
          <p class="recharge-time">{{formatDateByTimeStamp(item.createdAt,"MM-DD")}}
            {{formatDateByTimeStamp(item.createdAt,"HH:mm")}}</p>
          <p class="recharge-order">订单号：{{item.orderNum}}</p>
        </div>
      </div>
    </div>
    <div class="load-more" @click="loadMore">{{tips}}</div>

  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "@/plugins/util-mixins";
  import Header from "@/components/header";
  export default {
    components:{Header},
    data() {
      return {
        active: 0,
        presentationData: [],      //提现数据
        rechargeData: [],              //充值数据
        page:1,                     //页码数 默认1
        type:7,                    //充值记录列表是传type=7
        size:10,                    //每页数量 默认10条
        tips:"加载更多"
      }
    },
    methods: {
      ...mapActions("presentationDetails", ["getPresentationInfo", 'getRechargeInfo']),
      async getPresentation(isMore){
        this.active = 0;
        isMore?this.page++:this.page = 1;
        if(!isMore)this.presentationData=[];
        const data = await this.getPresentationInfo({
          page:this.page,
          size:this.size
        })
        this.presentationData =  this.presentationData.concat(data);
        data.length?this.tips = "加载更多":this.tips=" 暂无更多信息";
      },
      async getRecharge(isMore){
        this.active = 1;

        isMore?this.page++:this.page = 1;
        if(!isMore)this.rechargeData=[];
        const data =  await this.getRechargeInfo({
          page:this.page,
          size:this.size,
          type:this.type
        })
        this.rechargeData = this.rechargeData.concat(data.data);
        data. data.length?this.tips = "加载更多":this.tips=" 暂无更多信息";
      },
      loadMore(){
        this.tips = "加载中...";
        this.active === 1?this.getRecharge(true):this.getPresentation(true);
      }
    },
    mixins: [utilMixins],
    computed: {},
    created() {
      this.getPresentation();
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  #presentation_details {
    background-color: #f4f4f4;
    .tabs-list {
      width: 100%;
      height: 88px;
      color: $themeColor;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-bottom: 1.1px solid #eee;

      div {
        display: flex;
        align-items: center;
        height: 100%;
        flex: 1;

        span {
          margin: 0 auto;
          color: #80848f;
          display: block;
          height: 100%;
          line-height: 88px;
          font-size: 30px;
        }

        span.active {
          color: $themeColor;
          border-bottom: 4px solid $themeColor;
        }
      }
    }

    .data-list {
      border-top: 20px solid #f4f4f4;
      background-color: #fff;
    }

    .persent, .recharge {
      overflow: hidden;
      padding: 20px 30px 20px 0;
      margin-left: 30px;
      border-top: 1.1px solid #eee;
      line-height: 46px;

      .present-type {
        float: left;
        width: 66px;
        display: flex;
        height: 92px;
        align-items: center;
        margin-right: 20px;

        i {
          margin: 0 auto;
          font-size: 60px;
        }

        .icon-weixinzhifu4 {
          color: #5db271;
        }

        .icon-zhifubao {
          color: #00aaee;
        }
        .icon-iconfontjikediancanicon20{
          color: #eeaf1d;
        }
      }

      .present-status, .recharge-status {
        float: right;
        height: 92px;
        text-align: right;

        p.present-money,p.recharge-money {
          color: $themeColor;
          font-size: 32px;
        }

        .present-status-txt, .recharge-status-txt {
          color: #999;
        }
      }

      .present-info, .recharge-info {

        .present-info-time,.recharge-time {
          color: #666;
          font-size: 30px;
        }

        .present-info-order,.recharge-order {
          font-size: 26px;
          color: #999;
        }
      }
    }
    .load-more{
      text-align: center;
      line-height: 100px;
    }
  }
</style>
