<template>

  <div class="pad-30 flex-wrap flex">
    <div
      v-for="(item,k) in labelArray"
      :key="k"
      class="mar-r mar-b"
      @click="change(item)"
    >
      <i class="iconfont fon-35" :class="item.active?'icon-fuxuankuang col-t':'icon-fangxing col-6'"></i>
      <span class="fon-lg" :class="item.active?'col-t':'col-6'">{{item.name}}</span>
    </div>


  </div>

</template>

<script>

  export default {
    props: {
      labels: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        labelArray: [],
      }
    },
    methods: {
      change(item) {
        item.active = !item.active;
        this.getSuccessLabels(this.labelArray)
      },
      getSuccessLabels(labels) {
        let arr = [];
        this.labelArray = labels.map(item => {
          item.active && arr.push(item);
          return {
            ...item,
            active: item.active == true
          }
        })
        this.$emit('click', arr);
      }
    },
    watch: {
      labels(newValue) {
        this.getSuccessLabels(newValue || [])
      }
    },
    created() {
      this.getSuccessLabels(this.labels || [])
    }
  }

</script>
