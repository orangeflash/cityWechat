<template>
  <div class="rich-text" v-html="richText" :style="{marginTop:`${topMargin}px`}">

  </div>
</template>
<script>
  export default {
    name: "RichText",
    props: ["richText","color","topMargin","opacity"],
    data(){
      return{

      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  .rich-text{
    padding: 0 30px;
  }
</style>
