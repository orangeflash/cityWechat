<template>
  <div id="LaunchPage">
    <van-swipe :autoplay="launchConfig.duration*1000" :show-indicators="false"  class="c-carousel">
      <van-swipe-item :key="key" v-for="(item,key) in launchConfig.pictureList" class="c-carousel__item">
        <img-wrapper :src="item.url" class="c-carousel__img" alt=""/>
      </van-swipe-item>
    </van-swipe>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "LaunchPage",
    data() {
      return {

      }
    },
    methods: {
      ...mapActions("home", ["getLaunchDragLayout"]),
    },
    computed: {
      ...mapState("home", {
        launchConfig: state => state.launchConfig,
      }),
    },
    async created() {
      await this.getLaunchDragLayout();
    }
  }
</script>

<style scoped lang="scss">
  #LaunchPage {
    height: 100vh;
    .c-carousel {
      width: 100%;
      height: 100%;
      line-height: 0;
      font-size: 0;
      &__img {
        width: 100%;
        height: 100%;
      }
      &__item {
        height: 100%;
      }
    }
  }
</style>
