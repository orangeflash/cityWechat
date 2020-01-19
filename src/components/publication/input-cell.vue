<template>
  <div id="InputCell">
    <label class="input-bar">
      <i class="iconfont  input-bar__icon" :class="icon" v-show="false"></i>
      <em class="input-bar__label">{{label}}</em>
      <input v-if="type != 'radio'" :type="type" :readonly="readonly" @focus="readonly&&preventInput($event)"
             class="input-bar__input"
             v-model="inputVal" :disabled="disabled" :placeholder="placeHolder">
      <div class="input-bar__raido" v-if="type === 'radio'">
        <van-radio-group  v-model="inputVal">
          <van-radio label-position="" :checked-color="$themeColor" :name="key" v-for="(item,key) in radioData"  :key="key">{{item}}</van-radio>
        </van-radio-group>
      </div>
      <i @click="$emit('click-row')" class="iconfont icon-jiantouarrow487 arrow base-pad" v-if="showArrow"></i>
    </label>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "InputCell",
    props: ["showArrow", "icon", "label", "placeHolder", "value", "disabled", "type", "readonly",'radioData'],
    data() {
      return {}
    },
    methods: {
      preventInput(e) {
        e.target.blur();
      }
    },
    computed: {
      inputVal: {
        get() {
          return this.value
        },
        set(newVal) {
          this.$emit("input", newVal);
        }
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #InputCell {
    @include flex-center($justify: space-between);
    height: 89px;

    .input-bar {
      flex: 1;
      display: flex;
      @include flex-center($justify: null);

      &__icon {
        font-size: 36px;
        color: #666666;
        margin-right: 20px;
        margin-top: -5px;
      }

      &__label {
        font-size: 30px;
        font-weight: normal;
        color: #666;
        min-width:160px;
      }

      &__input {
        flex: 1;
        margin-left: 30px;
        outline: none;
        border: 0;
        font-size: 30px;
        color: #666;

        &:disabled {
          background-color: transparent;
        }
      }
      &__raido{
        width: calc( 100% - 120px);
        .van-radio-group{
          text-align: center;
          div{
            display: inline-block;
            margin: 0 0.3rem;
          }
        }
      }

      &__input::-webkit-input-placeholder {
        font-size: 30px;
        line-height: 1.5;
        color: #999999;

      }
    }

    .arrow {
      font-size: 30px;
      color: #999999;
      margin-left: 20px;
    }
  }
</style>
