<template>
  <div id="IntegralMall">
    <van-swipe class="c-banner" :show-indicators="false" :autoplay="3000">
      <van-swipe-item>
        <img-wrapper class="c-banner__img" src="http://i2.qihuiwang.com/web/2016-06-30/115833dcd24f543d82.jpg"/>
      </van-swipe-item>
      <van-swipe-item>
        <img-wrapper class="c-banner__img" src="http://i2.qihuiwang.com/web/2016-06-30/115833dcd24f543d82.jpg"/>
      </van-swipe-item>
    </van-swipe>
    <figure class="c-tab-bar">
      <figcaption class="c-tab-bar__item" @click="goPointPage('/sign/signInPointsDetails')">
        <i class="iconfont icon-jifen"></i>
        <em class="c-tab-bar__legend">积分</em>
        <em class="c-tab-bar__value">222</em>
      </figcaption>
      <figcaption class="c-tab-bar__item" @click="goPointPage('/sign/signInPointsDetails')">
        <i class="iconfont icon-xinfeng8"></i>
        <em class="c-tab-bar__legend">兑换记录</em>
      </figcaption>
    </figure>
    <section class="c-content">
      <empty-view></empty-view>
    </section>
</div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import EmptyView from "../../components/basic/empty-view";

  export default {
    name: "IntegralMallCopy",
    components: {EmptyView},
    data() {
      return {}
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #IntegralMall {
    .c-banner {
      height: 400px;
      &__img {
        width: 100%;
        height: 100%;
      }
    }
    .c-tab-bar {
      @include alignCenter;
      background: rgba(255, 255, 255, 1);
      padding: 20px 0;
      &__item {
        flex: 1;
        font-size: 26px;
        height: 50px;
        color: #333333;
        @include flex-center;
        &:first-child {
          border-right: 1Px solid #DDDDDD;
        }
      }
      .icon-jifen {
        color: #FFD200;
        font-size: 33px;
        margin-right: 14px;
      }
      .icon-xinfeng8 {
        color: #DDDDDD;
        font-size: 33px;
        margin-right: 14px;
      }
      &__value {
        color: #F1543E;
        margin-left: 10px;
      }
    }
    .c-content {
      margin-top: 20px;
      background-color: #fff;
    }
  }
</style>
