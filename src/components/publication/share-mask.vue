<template>
  <div id="ShareMask">
    <van-popup v-model="show" position="bottom">
      <section class="mask__container">
        <h3 class="title">分享给好友</h3>
        <ul class="btn-group">
          <li class="btn-group__item" @click="showCover=true">
            <img-wrapper not-load="true" class="btn-img" :src="weChat" alt=""/>
            <em>微信</em>
          </li>
          <li v-if="showHb" class="btn-group__item" @click="goPointPage('/publication/saveShareImg')">
            <img-wrapper not-load="true" class="btn-img" :src="qrCode" alt=""/>
            <em>海报</em>
          </li>
        </ul>
        <button class="cancel-btn" @click="closeAll">
          取消
        </button>
      </section>
    </van-popup>
    <aside class="c-share-guide" v-show="showCover">
      <img class="c-share-guide__img" @click="closeAll" :src="shareCover" alt="">
    </aside>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import qrCode from '../../assets/img/publication/二维码.png'
  import weChat from '../../assets/img/publication/微信.png'
  import shareCover from '../../assets/img/mask/share_cover.png'
  export default {
    name: "ShareMask",
    props: {
      showMask:{
       type: Boolean,
       default: false
      },
      showHb:{
        type: Boolean,
        default: false
      }},
    data() {
      return {shareCover, qrCode, weChat, showCover: false}
    },
    methods: {
      closeAll() {
        this.showCover = false;
        this.show = false;
      }
    },
    computed: {
      show: {
        get() {
          return this.showMask;
        },
        set(val) {
          this.$emit("update:showMask", val);
        }
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #ShareMask {
    .mask__container {
      background-color: #fff;
      .title {
        font-size: 30px;
        color: rgba(51, 51, 51, 1);
        text-align: center;
        padding: 31px 0;
      }
      .btn-group {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 128px;
        &__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 26px;
          color: rgba(51, 51, 51, 1);
          .btn-img {
            width: 118px;
            height: 118px;
            margin-bottom: 25px;
            border-radius: 50%;
          }
        }
      }
      .cancel-btn {
        height: 88px;
        line-height: 88px;
        text-align: center;
        width: 100%;
        font-size: 34px;
        color: rgba(51, 51, 51, 1);
        background: rgba(238, 238, 238, 1);
        letter-spacing: 6px;
        margin-top: 44px;
      }
    }
    .c-share-guide {
      background-color: rgba(0, 0, 0, .96);
      @include absoluteFull(fixed);
      z-index: 99999;
      display: flex;
      justify-content: flex-end;
      &__img {
        width: 70%;
        margin-right: 60px;
        height: 80%;
      }
    }
  }
</style>
