<template>

  <div class="dh-100 pad-lr flex-y-center">
    <div class="fon-xl flex-g-1">{{label}}</div>
    <div class="flex-g-1">
      <dd-form-radio
        :radios="radios"
        v-model="v"
        :deliver="deliver"
        @click="handle"
      ></dd-form-radio>
    </div>
  </div>

</template>

<script>

  import DdFormRadio from "@/components/template/dd-form/radio"

  export default {
    components: {DdFormRadio},
    props: {
      deliver: {
        type: Boolean,
        default: false,
      },
      label: {
        type: String,
        default: '',
      },
      value: {
        type: Number,
        default: 0,
      },
      radios: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        v: 0,
      }
    },
    watch: {
      value(newValue) {
        this.v = newValue
      }
    },
    methods: {
      handle(item) {
        this.$emit('input', item.key);
        this.deliver ? this.$emit('click', {
          name: 'dd-form-radio',
          value: item
        }) : this.$emit('change', item);
      }
    },
    created() {
      this.v = this.value;
    }
  }

</script>
