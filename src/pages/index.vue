<template>
  <div id="Index">
    <Follow v-if="!isFollow&&platform.follow==1 && !isH5" @close="setFollowStatus(true)" :logo="platform.logo"
            :name="platform.name"
            @follow="isShow = !isShow"/>
    <!--弹窗-->
    <Popup v-if="isShow" :QRCode="platform.qrcode"
           @close="isShow = false"
           desc='长按二维码进行识别关注'></Popup>
    <div :class="{'index-page-wrap':($route.meta.tab||$route.meta.defaultTab),'mar-t-1000':!isFollow}">
      <!--<NavigationBar />-->
      <transition :name="isModalTransition?'pop-up':'normal'">
        <router-view/>
        <!--<router-view v-if="initializedLocation"/>-->
      </transition>
      <footer-bar v-show="$route.meta.tab"/>
    </div>

  </div>
</template>

<script>

  import {mapActions, mapState, mapGetters} from 'vuex'
  import {getGlobalData, getUrlParams, showDialog} from "../util";
  import {getLocation} from "../util/wechat-util";
  import FooterBar from "../components/basic/footer-bar";
  import Personal from "./personal/index";
  import Popup from '@/components/popup'       // 弹窗
  import Follow from '../components/template/other/follow'
  import DdArticleOperaion from '../components/template/dd-article/operation'
  import {isH5} from "../project-config/base";

  export default {
    name: "Index",
    components: {Personal, FooterBar, Follow, Popup, DdArticleOperaion},
    data() {
      return {
        // initializedLocation:false,
        isShow: false,
        isH5:isH5(),
      }
    },
    methods: {
      ...mapActions(["setFollowStatus"]),

    },
    computed: {
      ...mapState({
        platform: state => state.platform,
        isDebug: state => state.isDebug,
        user: state => state.user,
        isFollow: s => s.isFollow
      }),
      isModalTransition() {
        const pathArr = this.$route.fullPath.split("/");
        return pathArr[pathArr.length - 1] === "publication";
      },

    },
    watch: {},
    async created() {

    }
  }
</script>

<style scoped lang="scss">
  @import "../assets/common";

  .pop-up-enter-active {
    transition: transform .2s linear;
  }

  .pop-up-enter {
    transform: translateY(100%);
  }

  .normal-enter, .normal-leave-to {
    visibility: hidden;
  }

  #Index {
    background: #F4F4F4;
    position: relative;
    width: 100%;
    overflow: hidden;
    min-height: 100vh;

    .index-page-wrap {
      padding-bottom: 100px;
    }
  }
</style>

<!--

  该地方是配置全局的组件样式

  这个没有配置作用域的，也就是全局

  下面的样式是因为有些第三方组件的样式很难更改

  由于不想每次使用第三方组件的时候老是要写多余的样式

  所以写了下面这个

-->

<style lang="scss">

  @import "../assets/theme";

  .van-cell {
    font-size: 16px;
  }

  .van-tab--active .van-ellipsis {
    color: $themeColor !important;

  }

  .van-tab .van-ellipsis {
    font-size: 0.30rem !important;

    color: #999;
  }

  .van-tab--active .van-ellipsis {
    font-size: 0.34rem !important;
    font-weight: bold;
    color: #333 !important;
  }

  .van-tree-select__nitem--active {
    color: $themeColor;
  }

  .van-tree-select__nitem--active::after {
    background-color: $themeColor !important;
  }


  .pactBody img {
    max-width: 100%;
  }

  .info-body strong {
    font-weight: bold;
  }

  .van-tag {
    margin-right: 10px;
  }

  //底部button
  .footer-container {
    position: fixed;
    z-index: 99;
    width: 100%;
    bottom: 0;
    @include flex-center;
    background-color: #fff;
    padding: 0;

    .footer-btn {
      flex: 1;
      height: 90px;
      background-color: $themeColor;
      border-radius: 0px;
      @include flex-center;
      font-size: 34px;
      color: rgba(255, 255, 255, 1);

      &:disabled {
        background-color: #ccc;

      }
    }
  }

  .dd-txt {
    -webkit-text-size-adjust: none;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
  }
</style>

