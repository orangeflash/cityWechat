<template>

  <!--页面输入框-->
  <div>
    <div class="dd-form-input flex-bt bg-f br-t-d flex-y-center ">
      <div class="dd-form-input_box">
        <input class="br-d" v-model="v" @input="$emit('input',v)" :placeholder="placeholder"/>
      </div>
      <button class="dd-form-input_send mar-r bg-t col-f" @click.stop="$emit('click',v)">{{name}}</button>
    </div>
    <div class="space" style="height: 1.2rem"></div>
  </div>
</template>

<script>

  export default {
    props: {
      name: {
        type: String,
        default: '发送'
      },
      placeholder: {
        type: String,
        default: '请输入...'
      }
    },
    data() {
      return {
        v: '',
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-form-input {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;

    &_box {
      width: 100%;
      padding: 20px 30px;

      input {
        width: calc(100% - 40px);
        height: 48px;
        padding: 5px 20px;
        border-radius: 8px;
      }
    }

    &_send {
      width: 200px;
      height: 54px;
      border-radius: 8px;
    }

  }

</style>
