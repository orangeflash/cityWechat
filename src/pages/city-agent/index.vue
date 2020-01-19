<template>
  <!--手机端城市代理功能-->
  <div id="CityAgent" v-if="active">
    <router-view></router-view>
  </div>
</template>
<script>
  import Footer from '@/components/template/footer'                 //页脚
  export default {
    components:{},
    provide() {
      return {
        refreshAuxActive: this.refreshAuxActive,
      }
    },
    data(){
      return{
        active: true,
      }
    },
    methods:{
      refreshAuxActive() {
        this.active = false;
        setTimeout(() => this.active = true, 50)
      },
    },
  }
</script>
