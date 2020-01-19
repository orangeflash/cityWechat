<template>
  <div class="dd-frame">
    <div class="dd-frame_left">
      <div class="dd-frame_left_img"
           :style="{'width':size+'px','height':size+'px'}"
      >
        <img-wrapper :src="src"></img-wrapper>
      </div>
    </div>
    <div
      class="dd-frame_content"
      :style="{'width':'calc(100% - '+size+'px - 15px)'}"
    >
      <div class="dd-frame_content_info">
        <div
          class="dd-frame_content_info_title"
          :style="{'fontSize':(titleSize || 12)+'px','color':(titleColor|| '#333'),'height':(titleHeight || 25)+'px'}"
          v-if="title"
        >{{title}}</div>
        <slot v-else name="title"></slot>
        <slot name="info"></slot>
      </div>
      <div class="dd-frame_content_right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['src','size','title','titleSize','titleColor','titleHeight']
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-frame {
    display: flex;

    &_left {
      &_img {
        overflow: hidden;
        border-radius: 8px;
        background: #ddd;
      }
      .size50 {
        width: 100px;
        height: 100px;

      }
    }

    &_content {
      margin-left: 30px;
      display: flex;
      justify-content: space-between;
      &_info{
        width: 100%;
        &_title{
          line-height: 50px;
          height: 50px;
          overflow: hidden;
        }
      }
      &_right{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
