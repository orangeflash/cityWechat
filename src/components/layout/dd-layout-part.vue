<template>

  <div class="miw-317 w-317 bg-f box-sha br-r-20 over-h" @click="$emit('click')">
    <div class="posi-r">
      <dd-layout-img :width="3.17" :height="1.47" :src="src" class="br-r-tl-20 br-r-tr-20" />
      <slot name="cover"/>
    </div>
    <div class="flex-y-center dh-76 mar-t-10 mar-b-20">
      <div class="pad-lr-20 lineH-38 fon-sm fon-wb hide-e-2 mh-76 ">
        {{title}}
        <slot name="tips"/>
      </div>
    </div>

  </div>


</template>
<script>
  import DdLayoutImg from "./dd-layout-img";

  export default {
    components: {DdLayoutImg},
    props: {
      src: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      time: {
        type: String,
        default: ''
      }
    }
  }
</script>
