<template>

  <!--订单退款详情-->

  <div class="mall-refund-details">
    <Header></Header>
    <div class="mall-refund-details_goods">
      <dd-goods
        :storeInfo="storeInfo"
      ></dd-goods>
    </div>
    <div class="mall-refund-details_row">
      <span v-if="storeInfo.reason">{{storeInfo.reason}}</span>
      <p>无退款原因</p>
      <!--<ul >-->
      <!--<li>-->
      <!--<img-wrapper></img-wrapper>-->
      <!--</li>-->
      <!--</ul>-->
    </div>

    <div class="mall-refund-details_row" v-if="storeInfo.state == 5">
      <h3>退款进行中</h3>
      <p>退款申请已提交，请耐心等待商家反馈</p>
    </div>
    <div class="mall-refund-details_row" v-else-if="storeInfo.state == 6">
      <h5>商家已同意退款</h5>
      <p>商家已同意退款，请注意账户是否收到退款</p>
    </div>
    <div class="mall-refund-details_row" v-else-if="storeInfo.state == 7">
      <h4>商家已拒绝退款</h4>
      <!--<p>拒绝理由：拒绝理由拒绝理由拒绝理由拒绝理由拒绝理由拒绝理由拒绝理由拒绝理由拒绝理由拒绝理由拒绝理由</p>-->
    </div>


  </div>


</template>

<script>

  import DdGoods from '@/components/template/mall/dd-goods-info';

  import {mapActions} from 'vuex';
  import {hideLoading, showLoading} from "../../../util";

  export default {
    components: {DdGoods},
    data() {
      return {
        storeInfo: {}
      }
    },
    methods: {
      ...mapActions('mall', ['getMallOrderDetails']),
    },
    async created() {
      showLoading();
      this.storeInfo = await this.getMallOrderDetails({
        orderId: 17
      });

      hideLoading();
      console.log("storeInfo", this.storeInfo)
    }
  }


</script>


<style scoped lang="scss">
  @import "../../../assets/common";

  .mall-refund-details {
    &_goods {
      margin: 20px 0;
    }

    &_row {
      background: #fff;
      padding: 30px;
      margin-bottom: 30px;
      font-size: 32px;

      h3 {
        color: #ED660C;
        margin-bottom: 20px;
      }

      h4 {
        color: #F00909;
        margin-bottom: 20px;
      }

      h5 {
        color: #0955F0;
        margin-bottom: 20px;
      }

      p {
        font-size: 26px;
        color: #999;
        line-height: 34px;
      }

      ul {
        margin-top: 20px;
        display: flex;
        flex-wrap: wrap;
      }

      span {
        font-size: 26px;
      }
    }
  }
</style>

