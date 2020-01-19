<template>
  <div id="WhiteSpace" :style="{height:`${height}px`,background:color,marginTop:`${topMargin}px`,opacity:`${opacity/100}`}">
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "WhiteSpace",
    props: ["height","color","topMargin","opacity"],
    data() {
      return {}
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  #WhiteSpace {
  }
</style>
