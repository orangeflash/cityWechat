<template>


  <van-popup v-model="show" @close="close" position="bottom" style="overflow: inherit">
    <div class="pad-30">
      <div class="flex">
        <face
          size="100"
          borderRadius="0.1"
          class="posi-r"
          style="margin-top: -1rem"
          :src="info.logo"/>
        <div class="flex-bt flex-g-1 mar-l">
          <div>
            <h3 class="col-t fon-xxl mar-b-20">{{info.tips}}</h3>
            <p class="fon-sm">{{info.title}}</p>
          </div>
          <i class="iconfont icon-close col-9 fon-xll" @click="close"></i>
        </div>
      </div>
      <van-cell title="购买数量">
        <van-stepper slot="right-icon" v-model="steps" :max="info.max || 99"/>
      </van-cell>
      <van-cell title=" "><span slot="right-icon"
                                class="col-t fon-lg">共{{steps}}份 合计{{steps * (info.money || 0)}}元</span></van-cell>
      <p class="col-6 fon-lg dh flex-center">{{info.remarks}}</p>
    </div>
    <dd-button
      class="mar-30"
      style="border-radius: 0.44rem"
      type="release"
      name="立即领取"
      @click="confirm"
    ></dd-button>
  </van-popup>

</template>

<script>
  import Face from "@/components/template/face";
  import DdButton from "@/components/template/button"

  export default {
    components: {Face, DdButton},
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      info: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        show: false,
        steps: 1
      }
    },
    methods: {
      confirm() {
        this.$emit('confirm',{
          num:this.steps
        })
        this.close();
      },
      close() {
        this.$emit('input', false);
      }
    },
    watch: {
      value(newValue) {
        this.show = newValue
      }
    },
    created() {

    }
  }

</script>
