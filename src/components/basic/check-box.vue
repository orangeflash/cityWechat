<template>
  <div id="CheckBox">
    <label class="checkbox__wrap">
      <input type="checkbox" v-model="value" class="checkbox">
      <i class="iconfont icon-gou1 checkbox__icon"></i>
    </label>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "CheckBox",
    props:["checked"],
    data() {
      return {}
    },
    methods: {},
    computed: {
      value:{
        get(){
          return this.checked;
        },
        set(newVal){
          this.$emit("update:checked",newVal)
        }
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #CheckBox {
    display: inline-block;
    vertical-align: middle;
    .checkbox__wrap {
      width: 32px;
      height: 32px;
      background: rgba(244, 244, 244, 1);
      border: 1PX solid $themeColor;
      border-radius: 8px;
      @include flex-center;
      .checkbox__icon {
        font-size: 20px;
        color: $themeColor;
        visibility: hidden;
      }
      .checkbox {
        display: none;
      }
      .checkbox:checked + .checkbox__icon {
        visibility: visible;
      }
    }
  }
</style>
