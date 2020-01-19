<template>

  <dd-layout-div v-if="value" class="posi-f t0 r0 b0 l0 bg-0-5 zIndex999 flex-center" @click="$emit('input',false)">
    <dd-layout-div v-if="baseUrl" :width="600">
      <img :src="baseUrl" class="w100"/>
    </dd-layout-div>
    <dd-layout-div v-else class="bg-f" :width="600" id="posterBox">
      <dd-layout-img v-if="cover" :width="6" :height="6" :src="cover"/>
      <dd-layout-div class="flex flex-bt flex-y-center" :pad="[20]">
        <dd-layout-div class="flex-g-1 mar-r">
          <dd-layout-div class="fon-b lineH-40">
            <span v-if="label"
                  class="flo-l bg-t col-f lineH-34 fon-sm br-r-10 pad-l-10 pad-t-5 pad-r-10 mar-r">{{label}}</span>
            {{title}}
          </dd-layout-div>
          <dd-layout-div class="flex flex-y-center" :mar="[20,0]">
            <span class="col-price mar-r fon-lg">￥{{price}}</span>
            <span class="col-9 fon-xs t-d-l" v-if="originPrice">￥{{originPrice}}</span>
          </dd-layout-div>
          <dd-layout-div class="col-9" v-if="desc">{{desc}}</dd-layout-div>
        </dd-layout-div>
        <dd-layout-div @load="QRCodeHandle" id="qrcode" class="flex-g-0" :width="200" :height="200"/>
      </dd-layout-div>
    </dd-layout-div>
  </dd-layout-div>


</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import DdLayoutImg from "../../layout/dd-layout-img";
  import {getImageBase64, srcToBase64, hideLoading, showLoading} from "../../../util";
  import html2canvas from 'html2canvas'
  import QRCode from 'qrcodejs2'

  export default {
    components: {DdLayoutImg},
    props: {
      label: {
        type: String,
        default: null
      },
      url: {
        type: String,
        default: null
      },
      title: {
        type: String,
        default: null
      },
      cover: {
        type: String,
        default: null
      },
      price: {
        type: String,
        default: null
      },
      originPrice: {
        type: String,
        default: null
      },
      desc: {
        type: String,
        default: null
      },
      value: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        baseUrl: null,
        imgs: [],
        changeSuccess: false
      }
    },
    methods: {
      ...mapActions(["getLocationUrl"]),
      QRCodeHandle(e) {
        console.log("e=>", e)
        if (this.baseUrl) return
        showLoading("二维码成中")

        const qrcodeDom = e.dom;
        this.getQRCode({
          dom: qrcodeDom,
          width: qrcodeDom.offsetWidth, // 设置宽度，单位像素
          height: qrcodeDom.offsetHeight, // 设置高度，单位像素
          url: this.url,   // 设置二维码内容或跳转地址
          typeNumber: 4,
          correctLevel: QRCode.CorrectLevel.L
        })
        const dom = document.querySelector("#posterBox")
        this.dom = dom;
        this.generatePoster({
          dom,
          images: dom.querySelectorAll('img')
        })
      },
      generatePoster(e) {

        this.imgs = e.images;

        let len = 0;

        const self = this;

        showLoading("海报生成中")
        for (let i = 0; i < this.imgs.length; i++) {

          const src = this.imgs[i].getAttribute('src');
          if (!src) {
            len++;
            continue
          }
          getImageBase64(src, (base64) => {
            if (base64) {
              // console.log('1111111111',base64)
              len++;
              this.imgs[i].setAttribute("src", base64);
              if (len == this.imgs.length) {
                self.changeSuccess = true;
                html2canvas(e.dom).then(function (canvas) {
                  hideLoading();
                  self.baseUrl = canvas.toDataURL("image/jpeg", 1);
                  document.body.classList.remove('posi-f')
                  window.scroll(0, Math.abs(parseFloat(document.body.style.top)))
                  document.body.style.top = "0px"
                  document.body.style.left = "0px"
                  document.body.style.width = "100%";
                });

              }
            } else {
              this.getLocationUrl({
                url: src
              }).then(src => {
                srcToBase64(src, (base64) => {
                  len++;
                  this.imgs[i].setAttribute("src", base64);
                  if (len == this.imgs.length) {
                    self.changeSuccess = true;
                    html2canvas(e.dom).then(function (canvas) {
                      hideLoading();
                      self.baseUrl = canvas.toDataURL("image/jpeg", 1);
                      document.body.classList.remove('posi-f')
                      window.scroll(0, Math.abs(parseFloat(document.body.style.top)))
                      document.body.style.top = "0px"
                      document.body.style.left = "0px"
                      document.body.style.width = "100%";
                    });
                  }
                })
                console.log("goods.vuegetLocationUrl", src);
              })
            }
          })
        }
      },
    },
    watch: {
      value(newVal) {
        if (newVal) {
          if (!this.baseUrl) {
            document.body.style.top = -window.scrollY + 'px'
            document.body.classList.add("posi-f")
          }
        }
      }
    }
  }
</script>
