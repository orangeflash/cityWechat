<template>
  <div id="Popup" @click="$emit('close')">
    <van-popup :lazy-render="false" :close-on-click-overlay="false" v-model="isShow">
      <div class="c-weChat-qrCode">
        <h3 class="c-weChat-qrCode__title" v-if="title" v-html="title"></h3>

        <img-wrapper not-load="true"
                     v-if="QRCode&&QRCode.length > 10"
                     class="c-weChat-qrCode__img"
                     :prevent="true"
                     :isShowView="true"
                     :src="QRCode" alt=""/>
        <div id="qrcode" v-else ref="qrcode"
             style="margin: 0.3rem auto;width: calc(70vw - 0.4rem);height:calc(70vw - 0.4rem);"></div>
        <p class="c-weChat-qrCode__desc" v-if="desc" v-html="desc"></p>

      </div>
      <footer class="c-weChat-qrCode__confirm-btn" @click="$emit('close')">确定</footer>
    </van-popup>
  </div>

</template>

<script>
  export default {
    props: ['title', 'QRCode', 'desc', 'QRLink'],
    data() {
      return {
        isShow: true
      }
    },
    created() {
      if (this.QRLink) {
        setTimeout(() => {
          this.getQRCode({
            dom: this.$refs.qrcode,
            url: this.QRLink
          });
        }, 10)
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../assets/common";

  div#Popup {
    position: fixed;
    z-index: 999;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);

    .c-weChat-qrCode {
      background-color: white;
      @include flex-center;
      flex-direction: column;
      width: 70vw;
      padding: 0 20px;
      box-sizing: border-box;
      text-align: center;

      &__title {
        font-size: 32px;
        color: #000;
        margin-top: 20px;
        padding: 20px 0;
      }

      &__desc {
        font-size: 28px;
        color: #666;
        margin: 20px 0;
      }

      &__img {
        width: 100%
      }

      &__confirm-btn {
        padding: 26px 0;
        color: red;
        font-size: 32px;
        width: 100%;
        border-top: 1PX solid #dedede;
        letter-spacing: .3em;
        text-align: center;
        background: #f4f4f4;
      }
    }
  }

</style>
