/**
此组件的布局是写会员卡首页开卡礼包时写的，类似开卡礼包的都可以用
"header","body","footer"用来控制布局，bodySrc显示body部分的图片
**/
<template>
    <div @click="$emit('click')" class="cell" :class="{'cell-last':isLast,'cell-after-right':afterRight,'base-pad2':!noPad}" :style="{background:background||'#fff'}">
      <!--头部-->
      <template>
        <div v-if="header" class="flex-g-1 flex-x-bt br-b-e base-pad2">
          <slot name="header-bd"></slot>
        </div>
        <slot v-else name="header"></slot>
      </template>
      <!--中部-->
      <template>
        <div class="flex-row" :class="body.class">
          <div v-if="body.hd" class="flex-g-0 flex-col mar-r" :class="body.center&&'flex-x-center'">
            <div v-if="body.img" class="cell-img" :class="body.img.brs||'br-r-10'" :style="{width:body.img.wid+'rem',height:body.img.hei+'rem'}">
              <img-wrapper :src="bodySrc"></img-wrapper>
            </div>
            <slot v-else name="body-hd"></slot>
          </div>
          <div v-if="body.bd" class="flex-g-1 flex-y-bt">
            <div class="flex-row flex-x-bt lineH-40">
              <slot name="body-bd-f"></slot>
            </div>
            <div class="flex-row flex-x-bt">
              <slot name="body-bd-s"></slot>
            </div>
            <div class="flex-row flex-x-bt mar-t-10">
              <slot name="body-bd-t"></slot>
            </div>
          </div>
          <div v-else  class="flex-g-1">
              <slot name="body-bd"></slot>
          </div>
          <div v-if="body.ft" class="flex-g-0 mar-l flex-col-end" :class="body.ftcenter&&'flex-x-center'">
            <slot name="body-ft"></slot>
          </div>
        </div>
      </template>
      <!--尾部-->
      <template>
        <div v-if="footer" class="flex-g-1 flex-x-bt br-t-e base-pad2">
          <slot name="footer-bd"></slot>
        </div>
        <slot v-else name="footer"></slot>
      </template>
    </div>
</template>

<script>
  import {utilMixins} from "../../../plugins/util-mixins";
  import {PlaceholderAvatar} from "../../../project-config/base";
    export default {
      name: "LayoutOne",
      props: ["noPad","isLast","afterRight","background","header","body","footer","bodySrc"],
      data() {
        return {
          PlaceholderAvatar,
        }
      },
      mixins: [utilMixins],
    }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .cell {
    position: relative;
    /*padding: 25px 30px;*/
    /* background: #fff; */
    font-size: $font-size-base;
    .body-bd-pad{
      padding: 10px 0 0;
    }
    .iconfont{
      margin-top: 10px;
    }
  }
  .cell-img{
    overflow: hidden;
  }
  .cell:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 2px;
    border-bottom: 1.1px solid #EEEEEE;
    color: #EEEEEE;
    /* -webkit-transform-origin: 0 100%;
            transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5); */
    left: 30px;
  }
  .cell-after-right:after {/*底部边框右边距*/
    right: 30px;
  }
  /*.cell:first-child{
    padding-top: 20px;
  }*/
  .cell:last-child:after{/*最后一个不显示底部边框*/
    display: none;
  }
  .cell-last:after {/*不显示底部边框*/
    display: none;
  }
</style>
