<template>
  <!--客服页面-->

  <div class="customer-service">
    <div class="customer-service__type">
      <div class="customer-service__type__info">
        <div class="customer-service__type__info__title">
          <i class="iconfont icon-erweima"></i><em>平台二维码</em>
        </div>

      </div>
      <div class="customer-service__type__pic">
        <img-wrapper :src="platform.qrcode" isShowView="true"></img-wrapper>
      </div>
    </div>
    <div class="customer-service__type">
      <div class="customer-service__type__info">
        <div class="customer-service__type__info__title">
          <i class="iconfont icon-weixinzhifu4 green"></i><em>客服微信</em>
        </div>
      </div>
      <div class="customer-service__type__pic">
        <img-wrapper :src="platform.contactCode" isShowView="true"></img-wrapper>
      </div>
    </div>
    <div class="customer-service__type">
      <div class="customer-service__type__info">
        <div class="customer-service__type__info__title">
          <i class="iconfont icon-dianhua1 phone"></i><em>客服电话</em>
        </div>
      </div>
      <div class="customer-service__type__phone">
        <span>{{platform.phone}}</span>
        <a :href="'tel://'+platform.phone">拨打</a>
      </div>
    </div>
    <div class="customer-service__type">
      <div class="customer-service__type__info">
        <div class="customer-service__type__info__title">
          <i class="iconfont icon-time-active mar-t-10 col-t"></i><em>系统版本:{{platform.version}}</em>
        </div>
      </div>
      <div class="customer-service__type__phone">
        <span class="fon-b">{{version}}</span>
      </div>
    </div>
  </div>

</template>

<script>

  import {mapState} from "vuex";
  import {version} from '../../../project-config/base'
  export default {
    data() {
      return {
        version,
      }
    },
    computed: {
      ...mapState({
        platform: state => state.platform
      })
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .customer-service {
    padding: 30px 0;

    &__type {
      background: #fff;
      padding: 30px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;

      &__info {
        &__title {
          display: flex;
          align-items: center;
          font-size: 28px;
          height: 40px;
        }
      }

      &__pic {
        width: 134px;
        height: 134px;
        overflow: hidden;
      }

      i {
        font-size: 44px;
        margin-right: 10px;
      }

      .green {
        color: rgb(9, 181, 7);
        margin-top: 4px;
      }

      .phone {
        font-size: 32px;
        margin-right: 20px;
        margin-top: 6px;
        color: rgb(231, 108, 8);
      }

      &__phone {
        display: flex;
        align-items: center;

        span {
          color: $themeColor;
          font-size: 30px;
          margin-right: 10px;
        }

        a {
          padding: 10px;
          background: $themeColor;
          color: #fff;
          font-size: 26px;
          border-radius:10px;
        }
      }
    }

  }

</style>
