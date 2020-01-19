<template>
  <div id="banner" color="blue"
       class="posi-r w100 b-box"
       :style="{padding:`${upDownPadding+ unit} ${leftRightPadding + unit}`, margin:`${topMargin+ unit} 0 0`}"
       v-if="swiper.children && ( swiper.children != 'undefined')&& swiper.children.length &&isKeep">
    <section class="home-swipe" :style="{minHeight:`${height+ unit}`,height:`${height+ unit}`,}">
      <van-swipe @change="onChange" :autoplay="3000" v-if="swiper&&swiper.children&&swiper.children.length"
                 :style="{borderRadius:`${radius+ unit}`,overflow:`hidden`}">
        <van-swipe-item v-for="(item, index) in swiper.children" :key="index">

          <img-wrapper
            v-if="!item.url"
            :isShowView="true"
            class="banner-img"
            :pictures="getPics"
            :src="(item.notHost?getPathByAssetPath(item):item)"
            :style="{height:`${height + unit}`}"
          />

          <img-wrapper
            v-else-if="showImage"
            :isShowView="true"
            class="banner-img"
            :pictures="getPics"
            :src="(item.notHost?getPathByAssetPath(item.url):item.url)"
            :style="{height:`${height + unit}`}"/>
          <img-wrapper
            v-else-if="notHost"
            @click.native="toLink(item)"
            class="banner-img"
            :src="(item.notHost?getPathByAssetPath(item.url):item.url)"
            :style="{height:`${height + unit}`}"/>
          <img-wrapper
            v-else
            @click.native="toLink(item)"
            class="banner-img"
            :src="getPathByAssetPath(item.url)"
            :style="{height:`${height + unit}`}"/>
        </van-swipe-item>

        <div slot="indicator" v-if="swiper.children.length > 1" class="posi-a zIndex99 b-20 w100 dh-30 flex-center">
          <div class="flex">
            <span class="w-30 dh-8 br-r-4 mar-l-10" v-for="i in swiper.children.length" :key="i"
                  :class="current+1 == i ?'bg-f':'bg-e op-6'"></span>
          </div>
        </div>

      </van-swipe>
    </section>
    <div class="posi-a t0 r0 miw-50">
      <slot name="float"/>
    </div>
    <slot name="cover"/>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {getEntryPath} from "../../plugins/get-entry-path";
  import DdLayoutImg from "../layout/dd-layout-img";

  export default {
    name: "Banner",
    components: {DdLayoutImg},
    props: {
      showImage: {
        type: Boolean,
        default: false,
      },
      notHost: {
        type: Boolean,
        default: true,
      },
      swiper: Object,
      padding: Number,
      height: {
        type: [String, Number],
        default: 200
      },
      leftRightPadding: Number,
      topMargin: Number,
      upDownPadding: Number,
      radius: Number,
      unit: {
        type: String,
        default: 'px'
      }
    },
    data() {
      return {
        pics: [],
        current: 0,
        isKeep: true,
      }
    },
    methods: {
      toLink(params) {

        params.entry && this.goPointPage({path: getEntryPath(params.entry)})

        params.wechat && params.wechat.url && (window.location.href = params.wechat.url);
      },
      onChange(index) {
        this.current = index;
      }
    },
    computed: {
      getPics() {
        return this.swiper.children.map(item => {
          return item.notHost ? this.getPathByAssetPath(item.url) : item.url || item
        });
      },

    },
    watch: {},
    created() {
      this.pics = this.swiper.children.map(item => {
        return item.notHost ? this.getPathByAssetPath(item.url) : item.url || item
      });
    },
    activated() {
      this.isKeep = true
    },
    deactivated() {
      this.isKeep = false
    },
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #banner {
    background-color: #fff;
    border-bottom: none;
  }

  .van-swipe {
    width: 100%;
    height: 100%;
  }

</style>
