<template>
  <!--类似于优惠卷的排版-->
  <div class="dd-coupon" @click.stop="$emit('click')">
    <div class="dd-coupon_cover "
         :class="['size_'+ (coverSize || 60)]"
    >
      <img-wrapper :src="cover"></img-wrapper>
    </div>
    <div class="dd-coupon_info"
         :style="{'width':'calc(100% - '+(coverSize/50)+'rem - 0.3rem'}"
    >
      <slot name="up"></slot>
      <slot name="center"></slot>
      <slot name="down"></slot>
    </div>
  </div>
</template>

<script>

  export default {
    props:['cover','coverSize'],
    data(){
      return{

      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  .dd-coupon{
    border-radius: 8px;
    margin: 0 30px 20px;
    background: #fff;
    display: flex;
    .size_60{
      width: 120px;
      height: 120px;
    }
    .size_120{
      width: 240px;
      height: 240px;
    }
    &_cover{
      overflow: hidden;

    }
    &_info{
      margin:0 30px;
    }
  }
</style>
