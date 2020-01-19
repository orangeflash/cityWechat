<template>
  <div id="SearchBar">
    <div class="search__input" @click="onSearch">找美食、企业、酒店</div>
    <button class="search__btn" @click="onSearch">搜索</button>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "SearchBar",
    props:["source"],
    data() {
      return {}
    },
    methods: {
      onSearch() {
        this.goPointPage({path:"/search",query:{source:this.$props.source}})
      },
    },
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #SearchBar {
    $barHeight:60px;
    @include positionAbsolute(17px,0,null,0);
    width:450px;
    height: $barHeight;
    background: rgba(0, 0, 0, 1);
    opacity: 0.6;
    z-index: 9;
    border-radius: 30px;
    margin: auto;
    @include flex-between;
    box-sizing: border-box;
    .search__input {
      border: 0;
      height: $barHeight;
      line-height: $barHeight + 12px;
      outline: none;
      flex: 1;
      color: #FFFFFF;
      font-size: 26px;
      padding-left: 31px;
      background-color: transparent;
      overflow: hidden;
      &::-webkit-input-placeholder{
        color: #ebebeb;
      }
    }
    .search__btn {
      font-size: 28px;
      height: 100%;
      color: rgba(126, 215, 147, 1);
      border: 0;
      outline: none;
      background-color: transparent;
      padding:0 31px;
    }
  }
</style>
