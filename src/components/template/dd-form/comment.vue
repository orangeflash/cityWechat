<template>
  <van-popup class="w94" v-model="mask">
    <section>
      <h3 class="dh flex-center fon-xl br-b-d">随便说点什么</h3>
      <div class="popup-mask__wrap">
        <van-field class="popup-mask__textarea" v-model="message" type="textarea" placeholder="请输入文字" rows="3"/>
      </div>
      <footer class="flex-center dh">
        <span class="col-f bg-9 pad-20-40-16 mar-lr" @click="mask = false">取消</span>
        <span class="col-f bg-t pad-20-40-16 mar-lr " @click="$emit('confirm',message)">确定</span>
      </footer>
    </section>
  </van-popup>

</template>

<script>

  export default {
    props: {
      value: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        mask: false,
        message: ''
      }
    },
    watch: {
      value(newVal) {
        this.mask = newVal
      },
      mask(newVal) {
        if (this.value != newVal) this.$emit('input', newVal);
      }
    },
    created() {
      this.mask = this.value;
    }
  }

</script>
