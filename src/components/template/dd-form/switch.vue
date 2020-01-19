<template>

  <div class="dh-96 bg-f flex-y-center flex-bt pad-lr">
    <div class="fon-xl">{{lable}}</div>
    <div class="col-9 fon-xl"></div>
    <div>
      <van-switch
        slot="right-icon"
        v-model="bool"
        :size="size+'px'"
        :active-color="$themeColor"
        @change="$emit('input',bool)&&deliver&&$emit('click',{name:'switch',value:{bool}})"
      />
    </div>
  </div>

</template>

<script>


  export default {
    props: {
      lable: {
        type: String,
        default: null,
      },
      value: {
        type: Boolean,
        default: false,
      },
      size:{
        type:String,
        default:'30'
      },
      deliver: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        bool: false
      }
    },
    watch: {
      value(newVal) {
        this.bool = newVal;
      }
    },
    created() {
      this.bool = this.value;
    }
  }

</script>
