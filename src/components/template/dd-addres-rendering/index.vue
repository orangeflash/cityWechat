<template>

  <!--地址选择以及渲染展示 - 目前用在下订单的时候-->

  <div class="order-address"
       @click="!info.linkName&&goPointPage({path:'/personal/shippingAddress',query:{isChoice:true}})">
    <div class="order-address-icon-box">
      <i class="iconfont icon-dizhi"></i>
    </div>
    <div class="order-address-details">
      <p class="order-main-info">
        收货人:{{info.linkName || address.linkName}}
        <span class="order-main-tellphone">{{info.linkTel || address.linkTel}}</span>
      </p>
      <div class="order-address-info-details">
        <span>收货地址:</span>
        <i class="iconfont icon-iconfontjiantou4" v-if="!info.linkName"></i>
        <div>{{info.address || address.address}} {{ info.detailedAddress || address.detailedAddress}}</div>
      </div>
    </div>
    <div class="line mar-t"></div>
  </div>

</template>

<script>

  import {mapState, mapActions} from 'vuex';

  export default {
    props: {
      info: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      ...mapActions("personal", ["getUserAddressByGet"]),
      ...mapActions("integralMall", ["choiceAddress"]),
    },
    computed: {
      ...mapState("integralMall", {
        address: state => state.address,
      }),
    },
    created() {
      if (!this.info.linkName) {
        this.getUserAddressByGet().then(result => {
          console.log("getUserAddressByGet", result);
          if (this.address.linkName) {
            this.$emit('change', this.address);
          } else if (result.length > 0) {
            console.log(result[0])
            this.choiceAddress(result[0]);
            this.$emit('change', result[0]);
          }
        });
      }

    }
  }


</script>


<style scoped lang="scss">
  @import "../../../assets/common";

  .order-address {
    padding: 34px 0 0;

    div {
      line-height: 34px;
    }

    .order-address-icon-box {
      width: 74px;
      display: flex;
      align-items: center;
      float: left;
      height: 104px;

      i {
        margin: 0 auto;
        font-size: 32px;
      }

    }

    .order-address-details {
      margin-right: 30px;

      .order-main-info {
        font-size: 30px;

        .order-main-tellphone {
          float: right;
        }

      }

      .order-address-info-details {
        margin-top: 16px;
        overflow: hidden;

        span {
          float: left;
          font-size: 24px;
        }

        div {
          margin-left: 120px;
          margin-right: 50px;
        }

        i {
          float: right;
          font-size: 24px;
          margin-top: 10px;
        }

      }
    }

    .line {
      background: url("../../../assets/img/other/address-line.png");
      height: 4px;
    }
  }
</style>
