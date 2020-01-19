<template>
  <img :src="url">
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  const loadingImg = require("../../assets/img/img-loading.svg");
  const errorImg = 'http://static.shanjiezhifu.com/a6589a425f73048e58d1d3ecaffebbd6.jpg';
  export default {
    name: "ImgLoading",
    props: ['src'],
    data() {
      return {
        url: loadingImg,
        newImg: new Image()
      }
    },
    methods: {},
    computed: {},
    mounted() {
      let newImg = new Image();
      newImg.src = this.src;
      newImg.onerror = () => {    // 图片加载错误时的替换图片
        newImg.src = errorImg;
      };
      newImg.onload = () => { // 图片加载成功后把地址给原来的img
        this.url = newImg.src;
      }
    }
  }
</script>

<style scoped lang="scss">
  #ImgLoading {
  }
</style>
