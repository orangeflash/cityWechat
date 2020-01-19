<template>
  <div class="dd-search"
  >
    <div class="dd-search_left"
         v-if="selectName"
         @click="$emit('select')">{{selectName}}
    </div>
    <div class="dd-search_center" @click='goPointPage({path: "/search", query: {searchType}})'>
      <input type="text"
             readonly
             v-model="val"
             :placeholder="placeholder || '请输入相关关键词' "/>
    </div>
    <div class="dd-search_right" @click="$emit('search',val)">搜索</div>
  </div>
</template>

<script>

  export default {
    props: ['placeholder', 'selectName','searchType'],
    data() {
      return {
        val: ''
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 34px;
    background-color: rgba(255, 255, 255, 0.64);
    height: 68px;
    overflow: hidden;
    width: 100%;

    &_left {
      border-right: 1.1px solid #ddd;
      color: #666;
      font-size: 26px;
      padding: 0 32px;
      min-width: 60px;
      text-align: center;
    }

    &_center {
      width: 100%;

      input {
        background-color: transparent;
        border: none;
        outline: none;
        width: 100%;
        height: 68px;
        padding: 0 30px;
      }
    }

    &_right {
      border-left: 2px solid $themeColor;
      color: $themeColor;
      font-size: 30px;
      padding: 0 32px;
      width: 100px;
    }
  }

  .fixed {
    position: fixed;
    top: 0;
  }

</style>
