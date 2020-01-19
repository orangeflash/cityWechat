<template>

  <div v-if="data.length>0">
    <div class="dh flex-y-center flex-bt pad-lr">
      <span class="fon-lg">{{infoTitle}}</span>
      <div class="fon-lg col-6"  @click="goPointPage('/auxiliary/rushBuy')">
        更多
        <i class="iconfont icon-youjiantou2"></i>
      </div>
    </div>
    <vue-seamless-scroll :data="data" ref="scrollCmp" :class-option="optionLeft" class="seamless-warp">
      <ul class="swipe-list">
        <li class="br-r-10 t-c mar-r over-h" v-for="(item,key) in data" :key="key">
          <div class="w-175 dh-160">
            <img-wrapper :src="item.src"/>
          </div>
          <div class="fon_b fon-wb hide-e w100">{{item.storeName}}</div>
          <div class="fon_b hide-e w100">{{item.title}}</div>
          <span class="col-f fon-b">{{item.price}}元</span><span class="col-9 t-d-l">{{item.money}}元</span>
        </li>
      </ul>
    </vue-seamless-scroll>
  </div>


</template>


<script>

  import VueSeamlessScroll from '../../basic/VueSeamlessScroll'

  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    comments: {VueSeamlessScroll},
    props: {
      infoTitle: {
        type: String,
        default: '限时抢购'
      },
      topMargin: {
        type: Number,
        default: 0
      },
      isBottom: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        data: []
      }
    },
    methods: {},
    computed: {
      optionLeft() {
        return {
          direction: 2,
          limitMoveNum: this.data.length
        }
      },
    },
  }

</script>
