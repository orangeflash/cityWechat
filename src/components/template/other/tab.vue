<template>
  <van-tabs
    v-if="!extra"
    :lineWidth="25" @click="tabMthods" :color="$themeColor">
    <van-tab :title="item.title" v-for="(item,key) in tabs" :key="key"></van-tab>
  </van-tabs>
  <div v-else class="flex-row bg-f">
    <van-tabs
      class="flex-g-1 searchtab"
      :lineWidth="25" @click="tabMthods" :color="$themeColor">
      <van-tab :title="item.title" v-for="(item,key) in tabs" :key="key"></van-tab>
    </van-tabs>
    <div @click="$emit('search')" class="flex-g-0 flex-center search"><span
      class="iconfont icon-xiazai5 fon-35 col-6"></span></div>
  </div>
</template>

<script>

  export default {
    props: {
      tabs: {
        type: Array,
        default: []
      },
      extra: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      tabMthods(index) {
        this.$emit('click', {
          name: 'tabs',
          value: index,
          item: this.tabs[index],
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .searchtab {
    position: relative;

    &:after {
      content: " ";
      position: absolute;
      top: 25px;
      bottom: 25px;
      right: -2px;
      width: 2px;
      background: #d5d5d5;
    }
  }

  .search {
    padding: 0 35px;
  }
</style>
