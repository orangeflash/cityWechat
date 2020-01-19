<template>
  <!--<img v-if="prevent" :src="src" @click.stop="void 0" :preview="preview" alt="叮咚同城">-->
  <!--<div style="overflow: hidden">-->
  <img v-if="prevent"  :width="width" class="load-img dis-n" :src="src" ref="img" @click.stop="showImage" alt="加载失败">
  <img v-else-if="alt" :height="height" :src="src" class="load-img dis-n" ref="img" @click="showImage" :alt="alt">
  <img v-else :src="src" class="load-img dis-n" ref="img" @click="showImage" alt="加载失败">
  <!--</div>-->
  <!--<img v-else :src="url" :preview="preview" alt="叮咚同城">-->
</template>

<script>
  import {PlaceholderImg} from "../../project-config/base";
  import {previewImage} from "../../util/wechat-util";
  import pictrueError from '../../assets/img/other/pictrue-err.png'

  /**
   该组件将被逐渐淘汰，设计思想需要优化，
   该组件的缺点就是将图片的大小的宽高度交付给了父组件控制了，
   使之不能更高效的加载，

   在自适应布局方面利用的是边距来进行的控制，没能更好的利用css样式，
   该组件使用的是JS来进行操作，对dom元素的操作有过多的频繁操作

   该组件的方法是：每次加载了该组件的时候，
   都对页面进行了获取所有的img元素，这种方式应当不可取

   新的图片组件 dd-layout-img.vue
   2019-05-29 end Clover
   */
  export default {
    name: "ImgWrapper",
    props: ["src", "preview", "prevent", 'pictures', 'isShowView', 'alt', 'width', 'height'],
    data() {
      return {
        url: PlaceholderImg,
        error: pictrueError
      }
    },
    method() {
      const _this = this;

    },
    methods: {
      changeImage(url) {
        if (!url) return;
        const image = new Image();
        image.src = url;
        image.onload = () => {
          this.url = url;
          image.onload = null;
        }
      },
      showImage() {
        if (!this.isShowView) return false;
        this.previewImage(this.src, this.pictures || [this.src]);
      },
    },
    computed: {},
    created() {
      // this.changeImage(this.src);
      this.$nextTick(function () {
        let imgs = document.querySelectorAll('.load-img');
        Array.from(imgs).forEach(img => {
          if (img.getAttribute('fill')) {
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.display = "block";
          } else if (!img.getAttribute('not-load') && !img.getAttribute('is-load')) {
            img.onload = function (error) {

              let parent = img.parentNode,
                w = img.width, h = img.height,
                pw = parent.offsetWidth,
                ph = parent.offsetHeight;
              /** 父级元素是一个正方形
               *  给5px的误差
               * */

              if (Math.abs(pw - ph) < 5) {
                // 图片的宽度大于图片的高度
                if (w > h) {

                  let proportion = ph / h;
                  img.style.height = ph + 'px';
                  img.style.width = w * proportion + 'px';
                  let marginLeft = (w * proportion) - pw;
                  img.style.marginLeft = (-marginLeft / 2) + "px";

                  // 图片的宽度小于图片的高度
                } else if (w < h) {
                  let proportion = pw / w;
                  img.style.width = pw + 'px';
                  img.style.height = h * proportion + 'px'
                  parent.style.overflow = 'hidden';
                  let marginTop = (h * proportion) - ph;
                  img.style.marginTop = (-marginTop / 2) + "px";
                  // 图片是一个正方形的
                } else {
                  img.style.width = pw + 'px'
                  img.style.height = ph + 'px'
                }
                /** 父级元素是长方形 */
              } else {
                /** 横向的长方形 就以以横向为基准进行放大 */
                if (pw > ph) {
                  let proportionW = ph / h;
                  if (w * proportionW >= pw) {
                    if (w > h) {
                      let proportion = ph / h;
                      img.style.height = ph + 'px';

                      img.style.width = w * proportion + 'px';
                      let marginLeft = (w * proportion) - pw;
                      img.style.marginLeft = (-marginLeft / 2) + "px";
                    } else {
                      let proportion = pw / w;
                      img.style.width = pw + 'px';
                      img.style.height = h * proportion + 'px'
                      parent.style.overflow = 'hidden';
                      let marginTop = (h * proportion) - ph;
                      img.style.marginTop = (-marginTop / 2) + "px";
                    }
                  } else {
                    let proportion = pw / w;
                    img.style.width = pw + 'px';
                    img.style.height = h * proportion + 'px'
                    parent.style.overflow = 'hidden';
                    let marginTop = (h * proportion) - ph;
                    img.style.marginTop = (-marginTop / 2) + "px";
                  }
                } else if (pw < ph) {
                  let proportionH = pw / w;
                  if (proportionH * h >= ph) {
                    if (w >= h) {
                      let proportion = ph / h;
                      img.style.height = ph + 'px';
                      img.style.width = w * proportion + 'px';
                      let marginLeft = (w * proportion) - pw;
                      img.style.marginLeft = (-marginLeft / 2) + "px";
                    } else {
                      let proportion = pw / w;
                      img.style.width = pw + 'px';
                      img.style.height = h * proportion + 'px'
                      parent.style.overflow = 'hidden';
                      let marginTop = (h * proportion) - ph;
                      img.style.marginTop = (-marginTop / 2) + "px";
                    }
                  } else {
                    let proportion = ph / h;
                    img.style.height = ph + 'px';
                    img.style.width = w * proportion + 'px';
                    let marginLeft = (w * proportion) - pw;
                    img.style.marginLeft = (-marginLeft / 2) + "px";
                  }


                }
              }
              parent.style.overflow = 'hidden';
            }

            img.classList.remove('load-img')
            img.style.display = "block";
            img.setAttribute('is-load', true)
          } else if (!img.getAttribute('not-load')) {
            img.style.display = "block";
            img.style.maxWidth = img.parentNode.offsetWidth + 'px';
          } else {
            img.style.display = "block";
            img.style.maxWidth = img.parentNode.offsetWidth + 'px';
            // img.style.margin = "0"
          }
        })
      })
    }
  }
</script>

<style lang="scss" scoped>

  img {
    display: none;
  }

</style>
