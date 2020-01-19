<template>

  <div class="dd-labels" v-if="labels&&labels.length">
    <div class="dd-labels__label"
        :key="key"
        :class="over&&over != 'false'&&'is-over'"
        v-for="(item,key) in labels"
        v-if="key < max && item[field || 'name']"
        :style="{borderColor:`${back&&item.color}`,color:back || (over&&over != 'false')?'#fff':item.color||getColor(key),borderColor:`${item.color || getColor(key)}`,fontSize:`${fontSize || 12 }px`,background:`${back&&item.color}`}">{{item[field
      || 'name']}}</div>
  </div>

</template>
<script>
  export default {
    props: ["labels", 'back', 'field', 'fontSize', 'maxLength', 'over'],
    data() {
      return {}
    },
    methods:{
      // 这样获取颜色的原因是，我对scss样式的循环不太了解
      getColor(key){
        switch (key/4){
          case 0 :
            return '#FFA029';
          case 1:
            return '#FD6441';
          case 2:
            return '#648EFC';
          case 3:
            return '#12C8D3';
        }
      }
    },
    computed: {
      max() {
        return this.maxLength || (this.labels && this.labels.length) || []
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-labels {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    .dd-labels__label {
      $color-list: (#FFA029, #FD6441, #648EFC);
      margin-right: 10px;
      padding: 10px 10px 6px;
      border-radius: 6px;
      border:0.011rem solid;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .is-over {
      background: #bbb !important;
      border: 1.1px solid #bbb !important;
    }
  }
</style>
