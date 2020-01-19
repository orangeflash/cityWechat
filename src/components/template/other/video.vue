<template>

  <div>
    <div class="flex-center miw-50 ">
      <i class="iconfont icon-shipin fon-50" @click="value&&(show = !show)"></i>
    </div>
    <div class="posi-f w100 hei100 t0 l0 zIndex9999 flex-center flex bg-0" v-if="show">
      <i class="iconfont icon-close fon-68 col-f posi-a r0 t0 mar-t mar-r" @click="value&&(show = !show)"></i>
      <video :src="value" class="mw100 mh100" controls="controls" x5-playsinline="" playsinline="true"
             webkit-playsinline="true"
             x-webkit-airplay="true" x5-video-player-type="h5"
             x5-video-player-fullscreen="" x5-video-orientation="portraint"></video>
    </div>
  </div>

</template>

<script>

  export default {
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        show: false,
        canPlay:true,
      }
    },

  }

</script>
