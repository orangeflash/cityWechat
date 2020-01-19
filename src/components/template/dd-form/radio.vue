<template>

  <div class="dd-form-radio-group bg-f flex-y-center flex-wrap" v-if="radios.length">
    <div class="radio fon-xl flex-g-1 flex-center"
         v-for="(item,key) in radios"
         :key="key"
         @click="change(key)"
    >
      <i class="iconfont fon-xxl mar-r mar-t-10"
         :class="a == key?'icon-trues-active col-t':'icon-circular'"
         style="height: 0.45rem;display: inline-block"
      ></i>
      <span :class="a == key&&'col-t'" class="mar-r fon-lg">{{item.label || item}}</span>
    </div>
  </div>

</template>

<script>

  export default {
    props: {
      deliver: {
        type: Boolean,
        default: false,
      },
      radios: {
        type: Array,
        default: []
      },
      active: {
        type: Number,
        default: 0,
      },
      value: {
        type: Number,
        default: 0,
      }
    },
    data() {
      return {
        a: 0
      }
    },
    watch:{
      value(newValue){
        this.a = newValue
      }
    },
    methods: {
      change(key) {
        this.a = key;
        this.$emit('input', key);
        this.deliver ? this.$emit('click', {
          name: 'radio',
          value: key
        }) : this.$emit('change', key);
      }
    },
    created() {
      this.a = this.value;
    }
  }

</script>
