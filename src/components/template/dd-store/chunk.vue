<template>

  <div class="dd-store-chunk">
    <div class="dd-store-chunk_up flex-bt pad-lr flex-y-center"
         :style="{'justify-content':titlePosi}"
    >
      <div class="left flex-y-center"


      >
        <i class="iconfont col-price mar-r fon-40"
           style="height: 0.3rem"
           v-if="icon"
           :class="icon"
        ></i>
        <span class="fon-lg">{{title}}</span>
      </div>
      <div class="center">
        <slot name="center"></slot>
      </div>
      <div class="right flex-center"
           @click.stop="$emit('iconRight')"
      >
        <span class="col-9 "
              v-if="desc || iconRight"
        >
          {{desc}}
            <i class="iconfont icon-youjiantou2"></i>
        </span>
      </div>

    </div>
    <div class="dd-store-chunk_center">
      <slot name="content"></slot>
    </div>
  </div>

</template>

<script>

  export default {
    props: ['icon', 'title', 'desc', 'iconRight', 'br', 'title-posi']
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-store-chunk {
    background: #fff;

    &_up {
      height: 88px;

    }
  }
</style>

