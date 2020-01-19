<template>
  <div id="DdTextarea">
    <!--<label class="checkbox__wrap">-->
      <!--<input type="checkbox" v-model="value" class="checkbox">-->
      <!--<i class="iconfont icon-gou1 checkbox__icon"></i>-->
    <!--</label>-->
    <div class="head-title">{{title}}</div>
    <textarea :maxlength="max" v-model="value" :placeholder="placeholder" />
    <div class="dd-text-limit" v-if="value">(<em>{{value.length}}</em>/{{max}})</div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "DdTextarea",
    props:["title","max","placeholder","textareaData"],
    data() {
      return {}
    },
    methods: {},
    computed: {
      value:{
        get(){
          return this.textareaData;
        },
        set(newVal){
          this.$emit("update:textareaData",newVal)
        }
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #DdTextarea {
    background: #fff;
    textarea {
      padding: 0px 30px;
      background: rgba(0, 0, 0, 0);
      width: 100%;
      box-sizing: border-box;
      height: 150px;
      border: none;
      outline: none;
      line-height: 36px;
      font-size: 26px;
      resize: none;
    }
    .dd-text-limit{
      padding: 20px 30px;
      text-align: right;
      color: #999;
      em{
        color: $themeColor;
      }
    }
  }
</style>
