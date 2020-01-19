<template>
  <div id="NotFound">
    <!--这个头部是组件来的 S-->
    <Header :isFixed="true"></Header>
    <!--这个头部是组件来的 E-->
    <EmptyView/>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import EmptyView from "../../components/basic/empty-view";
  import Header from "@/components/header";
  export default {
    name: "NotFound",
    components: {EmptyView,Header},
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
  @import "../../assets/common";

  #NotFound {
    padding-top: 100px;
    box-sizing: border-box;
    min-height: 100vh;
  }
</style>
