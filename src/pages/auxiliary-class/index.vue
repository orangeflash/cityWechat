<template>
  <!--辅助功能-->
  <dd-layout-div id="auxiliary" mi-h="100vh" class="flex-g-1 flex" v-if="active">
    <router-view class="flex-g-1"></router-view>
  </dd-layout-div>
</template>
<script>
  // import Footer from '@/components/template/footer'                 //页脚
  export default {
    components: {},
    provide() {
      return {
        refreshAuxActive: this.refreshAuxActive,
      }
    },
    data() {
      return {
        active: true,
      }
    },
    methods: {
      refreshAuxActive() {
        this.active = false;
        setTimeout(() => this.active = true, 50)
      },
    },
  }
</script>
