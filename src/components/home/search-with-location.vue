<template>
  <div id="SearchWithLocation"
       v-show="!hidden"
       :style="{'margin-top':(config.topMargin || 0)+'px','background':'transparent'}"
       >
    <div class="search-box" v-if="+config.position === 1" :class="sticky&&'search-box--sticky'" ref="searchBox">
      <search-with-location-content :noShowAddress="noShowAddress" :search-type="searchType" @initializedLocation="$emit('initializedLocation')" v-bind="config"/>
    </div>
    <div class="search-box search-box--normal" v-else ref="searchBox">
      <search-with-location-content :noShowAddress="noShowAddress"  :search-type="searchType" @initializedLocation="$emit('initializedLocation')" v-bind="config"/>
    </div>
  </div>

</template>

<script>
  import SearchWithLocationContent from "./search-with-location-content";

  export default {
    name: "SearchWithLocation",
    props: ["config","searchType","hidden",'noShowAddress'],
    components: {SearchWithLocationContent},
    data() {
      return {
        sticky: false
      }
    },
    methods: {
      stickyHandle() {
        this.$nextTick(() => {
          const fn = (e) => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 10) {
              return this.sticky = true
            }
            this.sticky = false;
          };
          document.onscroll = fn.bind(this);
        })
      },
      secondInit(){
        this.$parent.initPage && this.$parent.initPage(true);
      }
    },
    created() {
      +this.config.position === 1 && this.stickyHandle();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";
  //不吸顶的情况
  #SearchWithLocation {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: 999;
    .search-box {
      box-sizing: border-box;
      padding: 12px 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      //不吸顶的情况
      // background-color: $themeColor;
      background-color: transparent;
      transition: background-color .2s;
      &--normal {
        position: relative;
      }
      &--sticky {
        background-color: $themeColor;
      }

    }

  }

</style>
