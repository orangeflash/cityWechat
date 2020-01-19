<template>
  <div id="Main">
    <router-view/>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
import { Tag } from 'vant';
  export default {
    name: "Main",
    data() {
      return {}
    },
    methods: {},
    computed: {},
    components: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  // #Main {

  // }
</style>
