<template>
  <div id="StoreManage">
    <header class="l-header">
      <img-wrapper class="l-header__avatar" :src="PlaceholderAvatar" alt=""/>
      <div class="c-shop-info">
        <em class="c-shop-info__name">商家名称</em>
        <figure class="c-shop-feature">
          <figcaption class="c-shop-feature__item">修改资料</figcaption>
          <figcaption class="c-shop-feature__item">我要续费</figcaption>
        </figure>
      </div>
      <aside class="l-header__entry-btn">查看商家<i class="iconfont icon-jiantouarrow487"></i></aside>
      <section class="c-notice">
      </section>
    </header>
    <section class="c-content">
      <div class="c-content__container">
        <h3 class="c-content__title">店铺数据</h3>
        <ul class="c-content__list">
          <li class="c-content__cell" v-for="item in 6" :key="item">
            <em class="c-content__legend">浏览量</em>
            <em>1000</em>
          </li>
        </ul>
      </div>
    </section>
    <section class="c-content--icon">
      <div class="c-content__container" style="padding-bottom: 20px">
        <h3 class="c-content__title">商家管理</h3>
        <ul class="c-content__list">
          <li class="c-content__cell" v-for="item in 4" :key="item">
            <i class="iconfont icon-mingpian"></i>
            <em>店员管理</em>
          </li>
        </ul>
      </div>
    </section>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {PlaceholderAvatar} from "../../project-config/base";
  import Notice from "../../components/home/notice";

  export default {
    name: "StoreManage",
    components: {Notice},
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

  #StoreManage {
    .l-header {
      height: 287px;
      background: $themeColor;
      @include alignCenter;
      position: relative;
      &__avatar {
        width: 102px;
        height: 102px;
        border-radius: 50%;
        margin: 0 32px;
      }
      .c-shop-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        &__name {
          font-size: 32px;
          color: rgba(255, 255, 255, 1);
          margin-bottom: 24px;
        }
        .c-shop-feature {
          @include alignCenter;
          font-size: 26px;
          color: rgba(255, 255, 255, 1);
          &__item {
            &:first-child {
              padding-right: 17px;
              border-right: 1Px solid #fff;
            }
            &:last-child {
              padding-left: 17px;
            }
          }
        }
      }
      &__entry-btn {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        font-size: 24px;
        color: rgba(255, 255, 255, 1);
        height: 50px;
        @include alignCenter;
        padding: 0 29px;
        background: rgba(0, 0, 0, .2);
        border-radius: 24px 0 0 24px;
        .icon-jiantouarrow487 {
          margin-bottom: -3px;
        }
      }
      .c-notice {
        height: 86px;
        background: rgba(255, 255, 255, 1);
        border-radius: 10px;
        position: absolute;
        bottom: 0;
        left: 28px;
        right: 28px;
        transform: translateY(50%);
      }
    }
    .c-content {
      margin-top: 60px;
      &__container {
        margin-top: 16px;
        background-color: #fff;
      }
      &__title {
        font-size: 28px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        padding: 23px 29px;
      }
      &__list {
        @include alignCenter;
        flex-wrap: wrap;

      }
      &__cell {
        width: 33.33333%;
        flex-shrink: 0;
        @include flex-center;
        flex-direction: column;
        padding: 32px 0;
        box-sizing: border-box;
        border-top: 1Px solid #F4F4F4;
        font-size: 26px;
        color: rgba(102, 102, 102, 1);
        &:not(:nth-child(3n + 3)) {
          border-right: 1Px solid #f4f4f4;
        }

      }
      &__legend {
        margin-bottom: 20px;
      }
      &--icon {
        @extend .c-content;
        .c-content__cell {
          width: 25%;
          .iconfont{

          }
        }
        .c-content__list {
        border-bottom: 1Px solid #F4F4F4;
        }
      }
    }
  }
</style>
