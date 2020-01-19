<template>

  <div class="dd-form-cell bg-f flex-y-center pad-l">
    <div class="flex-bt br-b-e">
      <div class="flex-y-center">
        <i class="iconfont"
           :class="icon"
           v-if="icon"
        ></i>
        <span class="fon-xl hide-e" :style="{'font-size':labelSize/100 + 'rem'}">{{label}}</span>
      </div>
      <div class="flex-center flex-g-1">
        <slot name="center"></slot>
      </div>
      <div class="flex-center">
        <slot name="right"></slot>
      </div>
    </div>

  </div>

</template>

<script>

  export default {
    props:['label','icon','labelSize']
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  .dd-form-cell{
    height: 88px;
    >div{
      height: 88px;
      width: 100%;
    }
  }
</style>
