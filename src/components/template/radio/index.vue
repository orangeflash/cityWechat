<template>
  <div class="dd-radio van-cell">
    <label class="van-cell__title" v-if="label"><span>{{label}}</span></label>
    <van-radio-group
      class="dd-radio__body"
      v-model="v"
      @change="$emit('change',v)&&$emit('input',v)"
      :disabled="disabled" style="display:flex">
      <van-radio :name="k" v-for="(r,k) in radios " :key="k" :checked-color="$themeColor">{{r}}</van-radio>
    </van-radio-group>
  </div>
</template>
<script>

  export default {
    props: ['radios', 'disabled', 'label'],
    data() {
      return {
        v: 0
      }
    },
    watch: {
      value(newVal) {
      }
    }
  }


</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .van-cell__title {
    max-width: 180px;
  }

  .dd-radio__body {
    width: calc(100% - 180px);
    justify-content: space-around;
  }
</style>
