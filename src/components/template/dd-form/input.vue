<template>

  <div class="dd-form-input pad-l pad-r pad-t pad-b"
       :class="{'brr':brr}"
  >
    <div class="label col-9 fon-sm">{{label}}</div>
    <div class="input-box fon-xl "
         :class="{'br-b-d':brb}"
    >
      <div class="select flex-center"
           v-if="type == 'select'"
           @click.stop="deliver?$emit('click',{name:'input',value:{field,label,value}}):$emit('select',field,label,value)"
      >{{value}}{{text}}
      </div>

      <input
        v-else-if="type == 'input'"
        class="van-field__control fon-xl flex-g-0"
        v-model="v"
        @input="$emit('input',v)"
        :key="placeholder"
        :placeholder="placeholder"
        :disabled="disabled"/>

    </div>
  </div>

</template>

<script>

  export default {
    props: {
      deliver: {
        type: Boolean,
        default: false
      },
      value: {
        type: String
      },
      placeholder: {
        type: String
      },
      label: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'input'
      },
      text: {
        type: String,
        default: '',
      },
      brb: {
        type: Boolean,
        default: false
      },
      brr: {
        type: Boolean,
        default: false
      },
      field: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        v: ''
      }
    },
    watch: {
      value(nowV) {
        this.v = nowV;
      },
      text(nowV) {
        this.v = nowV;
      }
    },
    created() {
      this.v = this.value || this.text;
    }
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/theme";


  .dd-form-input {
    background: #fff;
    text-align: center;

    .input-box {
      padding: 20px 30px;

      input {
        text-align: center;
      }

      .select {
        height: 36px;
      }
    }


  }

  .brr {
    position: relative;
    z-index: 1;
  }

  .brr:after {
    content: " ";
    background: #ddd;
    width: 1px;
    position: absolute;
    right: 0;
    height: 50%;
    top: 20%;
  }
</style>
