<template>
  <div id="notice" v-if="dataList.length" :style="{backgroundColor:color,borderRadius:borR+'px'}" >
    <aside class="symbol">
      <img :src="icon" v-if="icon" class="symbol__img"/>
      <em v-else-if="label" class="symbol__label">{{label}}</em>
      <i v-else class="iconfont icon-xiaolaba symbol__icon"></i>
    </aside>
    <van-swipe class="seamless-warp" v-if="dataList.length" :autoplay="3000" :show-indicators="false" vertical>
      <van-swipe-item v-for="(i,key) in dataList" :key="key">
        <h1 class="notice-title" :style="{padding:pad,color:fontColor,textAlign:textAlign}" @click="goPointPage({name:'Announcement',params:{list:notice,index:key}})">{{i||'暂无信息'}}</h1>
      </van-swipe-item>
    </van-swipe>
    <div v-else class="seamless-warp"></div>
    <button v-if="featureLabel" class="feature-btn" @click.stop="$emit('featureClick')">
      {{featureLabel}}
    </button>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import VueSeamlessScroll from '../../components/basic/VueSeamlessScroll'
  import _ from 'lodash'

  export default {
    name: "notice",
    props: ["notice", "icon", "color", "label", "featureLabel", "direction","pad","fontColor","textAlign","borR"],
    data() {
      return {}
    },
    components: {
      VueSeamlessScroll
    },
    methods: {},
    computed: {
      dataList() {
        return _.map(this.notice, ({content, title}) => title) || []
      },
      optionLeft() {
        return {
          direction: this.direction || 1,
          step: .1,
          // autoPlay: false,
          limitMoveNum: this.dataList.length
        }
      }
    },
    watch: {},
    created() {
    }
  }
</script>
<style lang="scss">
  @import "../../assets/common";


  #notice .van-swipe-item {
    @include alignCenter;

  }
</style>
<style scoped lang="scss">
  @import "../../assets/common";

  #notice {
    height: 76px;
    line-height: 60px;
    @include alignCenter;
    display: flex;
    align-content: center;
    align-items: center;
    padding: 10px 20px;
    box-sizing: border-box;
    border-radius: 35px;
    background-color: #fff;
    margin: 1PX 0;
    .seamless-warp {
      height: 100%;
      flex: 1;
    }
    .symbol {
      font-size: 0;
      // line-height: 76px;
      @include alignCenter;
      position: relative;
      &:after {
        content: "";
        display: inline-block;
        height: 50%;
        //  line-height: 76px;
        @include positionAbsolute(50%, -23px, 0, null);
        transform: translateY(-50%);
        width: 1PX;
        background-color: #F4F4F4;
      }
      &__img {
        height: 100%;
      }
      &__label {
        color: $themeColor;
        font-size: 30px;
        font-weight: 900;
      }
      &__icon {
        color: #EB6262;
        font-size: 35px;
      }
    }
    .notice-title {
      font-size: 28px;
      color: #767676;
      width: 100%;
      padding-left: 52px;
      box-sizing: border-box;
      @include t-overflow;
    }
    .feature-btn {
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      color: $themeColor;
      font-size: 30px;
      font-weight: 900;
      background-color: transparent;
      border-radius: 12px;
    }
  }

</style>
