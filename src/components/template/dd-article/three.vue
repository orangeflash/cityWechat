<template>
  <div class="dd-article">
    <div class="pad-l pad-r pad-t-20 pad-b-20 flex">
      <div class="info-cover mar-r">
        <img-wrapper :src="cover"></img-wrapper>
      </div>
      <div class="info-txt">
        <h3 class="fon-b">{{title}}</h3>
        <div>
          <slot name="attr"></slot>
        </div>
      </div>
    </div>
    <div class="flex-bt dh flex-y-center pad-r pad-l bg-f">
      <div>
        <i class="iconfont icon-rili"></i>
        <span class="col-6">{{time}}</span>
      </div>
    </div>
  </div>

</template>

<script>

  export default {
    props: ['cover', 'title', 'time']
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .info-cover {
    width: 240px;
    height: 128px;
    overflow: hidden;
    border-radius: 4px;
  }

  .info-txt {
    width: calc(100% - 270px);
  }

  h3 {
    height: 66px;
    line-height: 32px;
    overflow: hidden;
  }


</style>
