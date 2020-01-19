<template>

  <div class="zIndex9999 posi-r">
    <dd-layout-div :width="72" :height="72"
      :class="[iconClass?iconClass:'fon-46 miw-50  mih-50 flex-center br-r-c bg-0-5',play&&'circle col-t',!play&&'col-d']"
      @click=" value && playAudio()">♪
    </dd-layout-div>
    <audio class="dis-n" ref="audio" :src="value" @ended="play = false"
           @error="error"></audio>
  </div>
</template>

<script>

  import {Toast} from 'vant'

  export default {
    props: {
      value: {
        type: String,
        default: '',
      },
      autoPlay: {
        type: Boolean,
        default: false
      },
      iconClass:String
    },
    data() {
      return {
        play: false,
        canPlay: true
      }
    },
    methods: {
      playAudio() {
        try {
          this.play ? this.$refs.audio.pause() : this.$refs.audio.play();
          this.play = !this.play
        } catch (e) {
          console.log(e);
        }

        return true;
      },
      error() {
        if (this.play) {
          Toast.fail({
            message: '音乐加载失败',
            duration: 1500
          })
          this.play = !this.play
        }
      },
    },
    created() {
      // setTimeout(()=>{
      //   this.autoPlay && this.playAudio();
      // })
      const fn = () => {
        this.autoPlay && this.canPlay && this.playAudio();
        window.removeEventListener('touchstart', fn);
      }
      window.addEventListener('touchstart', fn, false);

    },
  }

</script>
