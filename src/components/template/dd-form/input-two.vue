<template>

  <div class="bg-f pad-lr"
       @click.stop="readonly&&deliver?$emit('click',{'name':'input','value':{before}}):$emit('click',before)">
    <div class="dh-100 flex flex-y-center" :class="{'br-b-d':br}">
      <slot name="before"/>
      <div class="fon-xl flex-g-1" v-if="before" v-html="before"></div>
      <input class="flex-g-1 fon-xl br-n mar-b-5"
             :type="type"
             v-model="txt"
             @input="$emit('input',txt)"
             :readonly="readonly"
             :placeholder="placeholder"
      />
      <div class="flex-g-1 t-r fon-xl flex-y-center flex-x-end"
           @click.stop="deliver?$emit('click',{'name':'input','value':{before}}):$emit('click',before)">
        {{after}}
        <i v-if="rightIcon" class="iconfont icon-youjiantou1 col-9 mar-t-10"></i>
      </div>
      <component v-if="com.is" v-model="txt" v-bind="com"/>
      <slot name="after"/>
    </div>

  </div>

</template>

<script>
  import DdMusic from "@/components/template/other/music"
  import DdVideo from "@/components/template/other/video"

  export default {
    components: {DdMusic, DdVideo},
    props: {
      before: {
        type: String,
        default: null,
      },
      after: {
        type: String,
        default: null,
      },
      value: {
        type: String,
      },
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: '请输入',
      },
      rightIcon: {
        type: Boolean,
        default: false,
      },
      readonly: {
        type: Boolean,
        default: false,
      },
      br: {
        type: Boolean,
        default: false,
      },
      deliver: {
        type: Boolean,
        default: false,
      },
      com: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        txt: '',
      }
    },
    watch: {
      value(newValue) {
        this.txt = newValue;
      }
    },
    created() {
      this.txt = this.value;
    }
  }

</script>
