<template>
  <div id="MyIntegral">
    <header class="c-info">
      <em class="c-info__value">0</em>
      <em class="c-info__legend">总积分</em>
    </header>
    <figure class="c-tab-bar">
      <figcaption class="c-tab-bar__item">
        积分明细
      </figcaption>
      <figcaption class="c-tab-bar__item">
        兑换记录
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
    name: "MyIntegral",
    components: {EmptyView},
    data() {
      return {}
    },
    methods: {

    },
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #MyIntegral {
    .c-info {
      height: 337px;
      background-color: $themeColor;
      @include flex-center;
      flex-direction: column;
      &__value {
        font-size: 80px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }
      &__legend {
        font-size: 28px;
        color: rgba(255, 255, 255, 1);
        margin-top: 26px;
        display: inline-block;
        position: relative;
        &:before, &:after {
          position: absolute;
          left: -100%;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 1Px;
          background: #fff;
          content: "";
          display: block;
        }
        &:after {
          left: auto;
          right: -100%;
        }
      }
    }
    .c-tab-bar {
      height: 90px;
      background-color: #fff;
      @include alignCenter;
      &__item{
        flex: 1;
        @include flex-center;
        font-size:30px;
        font-weight:500;
        color:rgba(51,51,51,1);
      }
    }
    .c-content{
      margin-top: 20px;
      background-color: #fff;
    }
  }
</style>
