<template>
  <div class="bg-e over-h flex-center posi-r"
       v-if="stop&&src"
       @click.stop="$emit('click')"
       :style="{'width': width+unit,height: height+unit,'min-width':width+unit,'min-height':height+unit,'borderRadius':fillet?fillet+unit:''}">
    <img :src="src" class="dis-n" ref="ddImg" @load="layer">
    <slot/>
  </div>
  <div class="bg-e over-h flex-center posi-r"
       v-else-if="!stop&&src"
       @click="$emit('click')"
       :style="{'width': width+unit,height: height+unit,'min-width':width+unit,'min-height':height+unit,'borderRadius':fillet?fillet+unit:''}">
    <img :src="src" class="dis-n" ref="ddImg" @load="layer">
    <slot/>
  </div>
</template>

<script>

  export default {
    props: {
      width: {  //宽度
        type: Number,
        default: 0.45
      },
      height: { //高度
        type: Number,
        default: 0.45
      },
      src: '',
      unit: {   //单位
        type: String,
        default: 'rem'
      },
      type: {
        type: String,
        default: 'auto'
      },
      fillet: { //圆角
        type: Number,
        default: 0
      },
      stop: {    //是否阻止冒泡
        type: Boolean,
        default: false,
      }
    },
    methods: {
      layer() {
        let item = this.$refs.ddImg,
          parent = item.parentNode,
          pw = parent.clientWidth,
          ph = parent.clientHeight,
          w = item.width,
          h = item.height

        item.style.height = null;
        item.style.width = null;

        // 父级是一个正方形
        if (this.width == this.height) {
          if (w == h) {// 图片是正方形
            if (w >= pw) {
              item.style.width = '100%'
            } else {
              item.style.height = '100%'
            }
          } else if (w > h) { //图片是一个横向的矩形
            item.style.height = '100%'
          } else if (w < h) {   //图片是一个纵向的矩形
            item.style.width = '100%'
          } else {
            item.style.height = '100%'
          }
        } else if (this.width > this.height) {
          if (w == h) {// 图片是正方形
            item.style.width = '100%'
          } else if (w > h) { //图片是一个横向的矩形
            if (w > pw) {
              if (pw / w * h > ph) {
                item.style.width = '100%'
              } else {
                item.style.height = '100%'
              }
            } else {
              item.style.height = '100%'
            }
          } else if (w < h) {   //图片是一个纵向的矩形
            if (pw / w * h > ph) {
              item.style.width = '100%'
            } else {
              item.style.height = '100%'
            }
          } else {
            item.style.height = '100%'
          }
        } else if (this.width < this.height) {
          if (w == h) {// 图片是正方形
            item.style.height = '100%'
          } else if (w > h) { //图片是一个横向的矩形
            if (w > pw) {
              if (pw / w * h > ph) {
                item.style.width = '100%'
              } else {
                item.style.height = '100%'
              }
            } else {
              item.style.height = '100%'
            }
          } else if (w < h) {
            if (ph / h * w > pw) {
              item.style.height = '100%'
            } else {
              item.style.width = '100%'
            }
          } else {
            item.style.height = '100%'
          }
        }
        item.style.display = 'inline-block'
      }
    }
  }


</script>
