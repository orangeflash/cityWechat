<template>
  <span
    :style="{'background':color || '#fff'}"

  >{{name}}</span>
</template>
<script>

  export default {
    props:['name','color']
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  span{
    color: #fff;
    padding: .2em .5em;
    line-height: normal;
    border-radius: .2em;
    display: inline-block;
    margin-right: 20px;
  }
  span.round{
    border-radius: 20px !important;
  }
</style>
