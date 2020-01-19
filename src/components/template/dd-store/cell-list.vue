/**
此组件的布局显示列表数据左中右
<!--<CellList icon="icon-card" brs="0.2rem" :not-center="true" width="1.2" height="1.2" :is-link="true" :is-last="true" src="" title="领取用户" content="士大夫就开始矿井发生考生均可发生六点舒服"></CellList>-->
**/
<template>
  <div @click="$emit('click')" id="CellList" class="cell lineH-40" :class="{'cell-last':isLast,'cell-after-left':noAfterLeft,'cell-after-right':afterRight,'cell-access':isLink,'flex-y-center':!notCenter}" :style="styleClass">
    <div v-if="icon" class="flex-g-0 iconfont mar-r-10 col-t" :class="icon"></div>
    <div v-else-if="src" class="flex-g-0 img mar-r-10" :style="{width: `${width}rem`,height:`${height}rem`,borderRadius:`${brs}`}">
      <img-wrapper :src="src"></img-wrapper>
    </div>
    <div v-else class="flex-g-0">
      <slot name="icon"></slot>
    </div>
    <!--<img-wrapper  v-if="src" class="flex-g-0 img mar-r-10" :style="{width: `${width}rem`,height:`${height}rem`}" :not-load="true" :src="src"></img-wrapper>-->
    <div v-if="title" class="flex-g-0 title">{{title}}</div>
    <slot v-else name="title"></slot>
    <div v-if="content" class="flex-g-1">{{content}}</div>
    <div v-else class="flex-g-1">
      <slot name="content"></slot>
    </div>
    <div v-if="ftIcon||extra" class="flex-g-0 cell-ft mar-l">
      <div v-if="ftIcon" class="flex-g-0 iconfont" :class="ftIcon"></div>
      <div v-else-if="extra" :class="extraClass">{{extra}}</div>
    </div>
    <slot v-else name="footer"></slot>
  </div>
</template>

<script>
  import {utilMixins} from "../../../plugins/util-mixins";
  import {PlaceholderAvatar} from "../../../project-config/base";

  export default {
    name: "CellList",
    props: ["icon", "title", "content", "isLast","noAfterLeft","afterRight", "isLink", "extra","extraClass","ftIcon","notCenter","src","width","height","brs","styleClass"],
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

  #CellList {
    font-size: $font-size-base;
    .title {
      min-width: 160px;
    }
  }
  .img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
  }
  .cell {
    position: relative;
    padding: 25px 30px;
    display: flex;
    background: #fff;
    /*.iconfont{*/
      /*margin-top: 10px;*/
    /*}*/
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
  /*.cell:first-child{
    padding-top: 20px;
  }*/
  .cell-after-left:after {/*伪类底部边框左边距*/
    left:0px;
  }
  .cell-after-right:after {/*伪类底部边框右边距*/
    right: 30px;
  }
  .cell:last-child:after{
    display: none;
  }
  .cell-last:after {
    display: none;
  }
  .cell-ft {
    text-align: right;
    color: #999;
    font-size: 28px;
  }
  .cell-access .cell-ft {
    padding-right: 26px;
    position: relative;
  }
  .cell-access .cell-ft:after {
    content: " ";
    display: inline-block;
    height: 16px;
    width: 16px;
    border-width: 2.5px 2.5px 0 0;
    border-color: #999999;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -4px;
    position: absolute;
    top: 50%;
    margin-top: -8px;
    right: 4px;
  }
</style>
