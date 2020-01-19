<template>
  <div class="dd-store-order mar-b-20">
    <div>
      <div class="flex-bt dh flex-y-center pad-r pad-l bg-f ">
        <span class="col-6">{{orderNum}}</span>
        <span class="col-t">{{tips}}</span>
      </div>
      <div class="dd-store-order_info pad-l pad-r pad-t-20 pad-b-20 flex" @click.stop="$emit('click')">
        <div class="info-cover mar-r">
          <img-wrapper :src="cover"></img-wrapper>
        </div>
        <div class="info-txt">
          <h3 class="fon-b">{{title}}</h3>
          <div class="">
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
    <div class="flex-bt bg-f br-t-d">
      <div class="flex-y-center">
        <slot name="tips"></slot>
      </div>
      <dd-store-buttons
        v-if="bts&&bts.length"
        :bts="bts"
        @click="(v)=>$emit('button',v)"
      />
    </div>
    <slot name="mask"></slot>
  </div>

</template>

<script>

  import DdFormCell from "@/components/template/dd-form/cell"
  import DdStoreButtons from './buttons'

  export default {
    components: {DdFormCell, DdStoreButtons},
    props: ['orderNum', 'tips', 'icon', 'time', 'cover', 'title', 'bts'],
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-store-order {
    position: relative;
    z-index: 1;

    &_info {
      background: #F4F6F9;
    }

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
  }


</style>
