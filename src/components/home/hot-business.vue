<template>
  <div id="hot-business" >
    <!--<div class="hot-header">-->
      <!--<em class='hot-business-text'>热门商家</em>-->
      <!--<router-link to="/businessDistrict" class="more">更多 <i class="iconfont icon-youjiantou1"></i></router-link>-->
    <!--</div>-->
    <vue-seamless-scroll  :data="pictureWithTextList" ref="scrollCmp" :class-option="optionLeft" class="seamless-warp">
      <ul class="swipe-list">
        <li class="swipe-list__item" v-for="(item,key) in pictureWithTextList" :key="key"
            @click="$pushRoute(item.entry)">
          <img-wrapper :src="item.url" alt="" srcset="" class="swipe-list__item__img"/>
          <span class="swipe-list__item__wrap">
            <em class="swipe-list__item__text">{{item.text}}</em>
          </span>
        </li>
      </ul>
    </vue-seamless-scroll>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import Vue from 'vue'
  import VueSeamlessScroll from '../basic/VueSeamlessScroll'

  export default {
    name: "HotBusiness",
    props: ["pictureWithTextList"],
    data() {
      return {}
    },
    methods: {
      getStoreLogo(index) {
        const logo = this.storeList[index].storeLogo;
        if (logo) {
          const jsonLogo = JSON.parse(logo);
          return jsonLogo[0] ? jsonLogo[0].url : ""
        }
        return "";
      }
    },
    mounted() {
    },

    computed: {
      optionLeft() {

        return {
          direction: 2,
          limitMoveNum: this.pictureWithTextList.length
        }
      },

    },
    components: {
      VueSeamlessScroll
    },
    watch: {},
    created() {

    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  #hot-business {
    background-color: #fff;
    padding: 0 30px;
    /*min-height: 290px;*/
    margin-top: 18px;
    .hot-header {
      //    text-align: be
      padding: 0px 4px;
      height: 70px;
      line-height: 70px;
      .hot-business-text {
        font-size: 30px; //$font-size-base;
        color: #666;
        &:before {
          width: 4px;
          height: 24px;
          display: inline-block;
          content: "";
          margin-right: 18px;
          background: $themeColor;
        }
      }
      .more {
        float: right;
        color: rgb(153, 153, 153);
        font-size: $font-size-sm;
        .iconfont {
          font-size: 26px;
        }
      }
    }
    .scroll-wrapper {
      height: 218px;
    }
    .seamless-warp {
      overflow: hidden;
      width: 100%;
      .swipe-list {
        display: flex;
        &__item {
          width: 220px;
          height: 220px;
          margin-right: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          &__img {
            width: 220px;
            // min-width: 188px;
            height: 220px;
            border-radius: 8px;
          }
          &__wrap {
            background: rgba(0, 0, 0, .5);
            @include positionAbsolute(null, 0, 0, 0);
            height: 57px;
            line-height: 57px;
            text-align: center;
            border-radius: 0px 0px 8px 8px;
            @include t-overflow;
          }
          &__text {
            font-size: 24px;
            color: rgba(255, 255, 255, 1);
          }
        }

      }
    }

  }

</style>
