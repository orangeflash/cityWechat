<template>
  <label id="InputWithCmp">
    <em v-if="title" class="label">{{title}}</em>
    <span v-if="disabled" class="field" :class="inputVal||'placeholder'">{{inputVal||placeholder}}</span>
    <input :type="type" v-model="inputVal" v-else class="field" :placeholder="placeholder" :name="name">
    <slot/>
  </label>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "InputWithCmp",
    props: {
      title: {
        default: "标题"
      },
      placeholder: {
        default: "请输入文本"
      },
      value: String,
      type: String,
      disabled: String,
      name: String,
    },
    data() {
      return {}
    },

    methods: {},
    computed: {
      inputVal: {
        get() {
          return this.value
        },
        set(newVal) {
          this.$emit("input", newVal)
        }
      }
    },
    created() {
    },
  }
</script>

<style scoped lang="scss">
  @import "../../assets/theme";

  #InputWithCmp {
    height: 90px;
    display: block;
    width: 100%;
    @include flex-between;

    .label {
      font-size: $font-size-lg;
      color: #666;
      width: 180px;
      min-width: 180px;
    }

    .field {
      flex: 1;
      outline: none;
      border: 0;
      font-size: $font-size-base;
      color: #666;
      margin-left: 0px;
      background-color: transparent;
      @include t-overflow;

      &.placeholder {
        font-size: $font-size-base;
        line-height: 1.5;
        display: inline-block;
        color: #666;
      }
    }

    &input::-webkit-input-placeholder {
      font-size: 140px;
      color: #666;
    }

    .field::-webkit-input-placeholder {
      font-size: $font-size-base;
      line-height: 1.5;
      color: rgba(150, 150, 150, 1);
    }
  }
</style>
