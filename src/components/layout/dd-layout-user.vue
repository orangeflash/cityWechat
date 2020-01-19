<template>

  <div class="flex-y-center">
    <dd-layout-img :src="src" :style="{borderRadius:fillet+unit}" :width="size" :height="size" :unit="unit"/>
    <div class="mar-l flex-col flex-bt" :style="{'min-height':size+unit}">
      <div class="flex pad-t-5">
        <span class="fon-b fon-wb mar-r-10" v-if="name">{{name}}</span>
        <slot name="icon"/>
      </div>
      <p class="col-9 fon-xss pad-b-5">
        {{desc}}
        <slot name="desc"/>
      </p>
    </div>
  </div>


</template>
<script>
  import DdLayoutImg from "./dd-layout-img";

  export default {
    components: {DdLayoutImg},
    props: {
      size: {
        type: Number,
        default: 0.38
      },
      unit: {
        type: String,
        default: 'rem'
      },
      src: {
        type: String,
        default: null
      },
      fillet: {
        type: Number,
        default: 0.38
      },
      name: {
        type: String,
        default: ''
      },
      desc: {
        type: String,
        default: ''
      }
    }
  }
</script>
