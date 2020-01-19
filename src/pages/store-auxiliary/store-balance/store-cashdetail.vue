<template>
  <!--提现明细详情-->
  <div class="details">
    <van-cell class="apply-money" title="提现金额："><em>{{info.applyMoney}}元</em></van-cell>
    <van-cell-group>
      <van-cell title="实际到账" :value="info.actualMoney||0+'元'" ></van-cell>
      <van-cell title="流水号：" :value="info.orderNum" ></van-cell>
      <van-cell title="类型：" :value="info.mode == '1' ? '微信提现' : info.mode == '2' ? '支付宝提现' : '银行卡提现'" ></van-cell>
      <van-cell title="转入账号：" :value="info.accountNumber" ></van-cell>
      <van-cell title="支行信息" :value="info.branch" v-if="info.branch"></van-cell>
      <van-cell title="提现状态：" :value="+info.status==1?'待审核':+info.status==2?'已通过':'已拒绝'" ></van-cell>
      <van-cell title="提现时间：" :value="formatDateByTimeStamp(info.creatTime,'YYYY-MM-DD HH:mm')" ></van-cell>
      <van-cell title="处理时间：" :value="formatDateByTimeStamp(info.completeTime,'YYYY-MM-DD HH:mm')" v-if="info.status != 1"></van-cell>
      <van-cell title="姓名：" :value="info.name" ></van-cell>
      <van-cell title="联系方式：" :value="info.linkTel" ></van-cell>
      <van-cell title="可提现金额："  :value="myInfo&&myInfo.money.surplusCost||0+'元'" ></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "@/plugins/util-mixins";
  import {hideLoading, showLoading} from "../../../util";
  export default {
    data(){
      return{
        info: {},
        myInfo:null,
      }
    },
    methods:{
      ...mapActions("storeAuxiliary/storeBalance", ["getStoreBalance","getCashInfoById"]),
      async getPresentationById(){
        showLoading()
        this.myInfo = await this.getStoreBalance({storeId:this.storeId});
        const data = await this.getCashInfoById({
          id: this.$route.query.id
        })
        hideLoading()
        this.info = data.data;
      }
    },
    mixins: [utilMixins],
    computed:{
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    created(){
      this.getPresentationById();
    }
  }
</script>


<style scoped lang="scss">
  @import "../../../assets/theme";
  .van-cell{
    line-height: normal;
    color:#666;
    position: initial;
  }
  .apply-money{
    padding:40px 30px;
    font-size: 32px;
    position: relative;
  }
  .van-cell__value{
    span {
      color: #999;
    }
  em{
    font-size: 20px;
    color: $themeColor;
  }
  }
</style>
