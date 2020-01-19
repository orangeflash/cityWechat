<template>
  <!--海报-->
  <div class="dd-poster"
       v-if="value"
  >
    <div class="dd-poster_mask" @click="$emit('input',false)"></div>
    <div class="dd-poster_contatiner">
      <div></div>
      <div class="dd-poster_contatiner_up">长按保存图片分享给朋友</div>
      <div v-if="baseUrl" class="mar-lr mar-b mar-t">
        <img-wrapper
          class="poster-img"
          :src="baseUrl"
          style="margin: 0;"
          not-load="true"
          is-show-view="true"
        />
      </div>
      <dd-layout-div v-else class="dd-poster_contatiner_center" @load="loadHnadle">
        <div class="content">
          <div class="up">
            <div class="logo">
              <img-wrapper
                :src="logo"></img-wrapper>
            </div>
            <div class="info flex-1">
              <span class="nickname">{{nickname}}</span>
              <div v-if="tag">
                <span class="tag">{{tag}}</span>
              </div>
            </div>
            <div v-if="rewardInfo&&rewardInfo.offerReward==1" class="col-t fon-xss bg-FEE4BF br-r-30 flex-center"
                 style="height: 0.5rem;padding: 0 0.1rem">
              赏金{{parseInt(rewardInfo.money)}}元
            </div>
          </div>
          <div class="text">
            <div>{{getText()}}</div>
            <ul v-if="photos&&photos.length>0">
              <li
                v-for="(item,key) in photos"
                :key="key"
                v-if="key < (isVideo ? 1 : 3)"
              >
                <i
                  v-if="isVideo"
                  class="iconfont icon-bofang"></i>
                <img-wrapper :src="item"></img-wrapper>
              </li>
            </ul>
          </div>
        </div>
        <div class="down">
          <div class="qrcode-box">
            <div id="dd-qrcode"></div>
          </div>

          <div class="link-info">
            <h3>联系人：{{nickname}}</h3>
            <p>{{desc}}</p>
            <span>{{user.userName}}向您推荐，长按识别二维码来看看吧</span>
          </div>
        </div>
      </dd-layout-div>

      <div class="dd-poster_contatiner_donw"
           @click="$emit('input',false)"
      >确&nbsp;&nbsp;&nbsp;定
      </div>
    </div>
  </div>

</template>


<script>
  import html2canvas from 'html2canvas'
  import QRCode from 'qrcodejs2'
  import {Toast} from 'vant'

  import {getImageBase64, srcToBase64} from "@/util/index"
  import {hideLoading, showDialog, showLoading} from "../../../util";
  import {mapState, mapActions} from 'vuex'

  /**
   * 生成海报
   *
   *
   *  由于html2canvas截取不到img的资源，
   *  所以在这里只好写一个默认的模版来进行渲染
   *  由于模版的是固定死的所以需要进行传参进行操作
   *
   *  params = {
   *    logo,   用户头像/商家的logo
   *    icons,  用户的小图标，个人认证/企业认证/保证金...
   *    photos, 图片列表 限制三张
   *    qrcode, 二维码
   *    isVideo,    是不是视频
   *  }
   *
   *
   * */
  export default {
    props: ['logo', 'icons', 'photos', 'qrcode', 'value', 'nickname', 'body', 'tag', 'desc', 'isVideo', 'rewardInfo'],
    data() {
      return {
        baseUrl: null,
        loadBool: false,
        imgs: [],
        loadFail: false,   //是否加载失败
      }
    },
    methods: {
      ...mapActions(["getLocationUrl"]),
      /** 由于内容部分可能会传来带标签的文本，所以就利用还方法进行获取纯文字 */
      loadHnadle({dom}) {
        console.log("dom.offsetTop", dom.offsetTop)
      },
      getText() {
        const div = document.createElement('div');
        div.innerHTML = this.body;
        return div.innerText;
      },
      begin() {
        const that = this;
        const contentBox = document.querySelector(".dd-poster_contatiner_center");
        console.log("contentBox", window.scrollY - contentBox.offsetTop)
        html2canvas(contentBox, {}).then(function (canvas) {
          hideLoading();
          that.baseUrl = canvas.toDataURL("image/jpeg", 1);

          document.body.classList.remove('posi-f')

          window.scroll(0, Math.abs(parseFloat(document.body.style.top)))
          document.body.style.top = "0px"
          document.body.style.left = "0px"

          document.body.style.width = "100%";

        });
      },
      /** 由于苹果手机的并发功能很差，所以进行采用递归的方式进行加载 */
      imgLoad(index) {
        if (this.imgs[index]) {
          const that = this;
          const src = this.imgs[index].getAttribute('src');
          console.log("src", src)
          /** 如果路径不是base64为的就执行 将图片转换成base64 */
          if (src && src.indexOf('data:image') == -1) {
            getImageBase64(src, (base64) => {
              if (base64) {
                this.imgs[index].setAttribute("src", base64);
                index++;
                if (this.imgs[index]) {
                  this.imgLoad(index);
                } else {
                  that.begin()
                }
              } else {
                this.getLocationUrl({
                  url: src
                }).then(src => {
                  console.log("getLocationUrl", src);
                  srcToBase64(src, (base64) => {
                    this.imgs[index].setAttribute("src", base64);
                    index++;
                    if (this.imgs[index]) {
                      this.imgLoad(index);
                    } else {
                      that.begin()
                    }
                  })
                })
              }
            })
          } else {
            index++;
            if (this.imgs[index]) {
              this.imgLoad(index);
            } else {
              that.begin()
            }
          }
        }
      },
      /** 将所有的图片都进行转换成base64位的编码 */
      getAllImageBase64() {
        const contentBox = document.querySelector('.dd-poster_contatiner_center');
        const content = contentBox.querySelector('.content');
        this.imgs = content.querySelectorAll('img');
        let index = 0;
        const that = this;

        if (this.imgs.length > 0) {
          this.imgLoad(index);
          // setTimeout(() => {
          //   if (!that.baseUrl) {
          //     that.loadFail = true;
          //     hideLoading();
          //     Toast.fail({
          //       message: '生成失败',
          //       duration: 1500
          //     })
          //   }
          // }, 1000 * 10)
        } else {
          console.log("contentBox", contentBox)
          const contentBox = document.querySelector(".dd-poster_contatiner_center");
          console.log("contentBox", contentBox)
          html2canvas(contentBox, {}).then(function (canvas) {
            hideLoading();
            that.baseUrl = canvas.toDataURL("image/jpeg", 1);
          });
        }
      }
    },
    computed: {
      ...
        mapState({
          user: state => state.user
        }),

    },
    watch: {
      value(newVal) {
        if (this.loadBool || this.loadFail) {

          return;
        }
        showLoading("二维码生成中")

        document.body.style.top = -window.scrollY + 'px'
        document.body.classList.add("posi-f")


        setTimeout(() => {
          const qrcodeDom = document.querySelector('#dd-qrcode');
          console.log("qrcodeDom", qrcodeDom)
          new QRCode('dd-qrcode', {
            width: qrcodeDom.offsetWidth, // 设置宽度，单位像素
            height: qrcodeDom.offsetHeight, // 设置高度，单位像素
            text: window.location.href,   // 设置二维码内容或跳转地址
            typeNumber: 4,
            correctLevel: QRCode.CorrectLevel.L
          });
          this.loadBool = !this.loadBool
          showLoading("海报生成中");
          setTimeout(() => {
            this.getAllImageBase64();
          }, 1000)

        }, 100);
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-poster {
    position: fixed;
    z-index: 999;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;

    &_mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .5);
      top: 0;
      left: 0;
    }

    &_contatiner {

      width: 6rem;
      position: relative;
      z-index: 1;
      padding: 50px 0 0;
      border-radius: 10px;
      background: #fff;

      &_up {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
      }

      &_center {
        padding: 10px;
        background: $themeColor;
        border-radius: 6px;
        margin: 30px;

        > .content {
          padding: 30px;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;

          .up {
            display: flex;

            .logo {
              background: red;
              width: 68px;
              height: 68px;
              overflow: hidden;
              border-radius: 50%;
            }

            .info {
              margin-left: 20px;

              .nickname {
                margin-top: 5px;
                display: inline-block;
              }

              > div {
                margin-top: 10px;

                > span {
                  background: $themeColor;
                  color: #fff;
                  display: inline-block;
                  padding: 8px 10px 3px;
                  border-radius: 8px;
                  font-size: 20px;
                }
              }
            }
          }

          .text {
            margin-top: 20px;

            div {
              line-height: 34px;
              max-height: calc(34px * 8 + 4px);
              overflow: hidden;
            }

            ul {
              display: flex;
              flex-wrap: wrap;
              margin-top: 10px;

              li {
                width: 142px;
                height: 142px;
                margin-right: 10px;
                overflow: hidden;
                position: relative;
                z-index: 1;
                border-radius: 8px;

                i {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  font-size: 0.6rem;
                  margin: -0.3rem;
                  width: 0.6rem;
                  height: 0.6rem;
                  color: #fff;
                }
              }
            }
          }
        }

        > .down {
          display: flex;
          margin-top: 10px;

          .qrcode-box {
            padding: 5px 4px 4px 6px;
            background-color: #fff;
            width: 120px;
            height: 120px;
          }

          #dd-qrcode {
            width: 120px;
            height: 120px;
            background: #fff;
            background-size: 100%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .link-info {
            margin-left: 10px;
            color: #fff;
            font-size: 20px;

            h3 {
              font-size: 24px;
              height: 30px;
              line-height: 30px;
              overflow: hidden;
            }

            p {
              margin: 15px 0 20px;
              line-height: 24px;
              overflow: hidden;
            }

            span {
              display: inline-block;
              line-height: 28px;
              overflow: hidden;
            }
          }
        }

        &_donw {
          height: 88px;
          color: $themeColor;
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

      }

      .poster-img {
        max-width: calc(100% - 0.58rem);
        margin: 30px;
      }

      &_donw {
        display: flex;
        align-items: center;
        justify-content: center;
        color: $themeColor;
        font-size: 32px;
        height: 88px;
        border-top: 1.1px solid #eee;
      }
    }
  }
</style>
