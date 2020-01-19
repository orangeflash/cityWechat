<template>
  <!--公用的页面title-->
  <!--<header class="c-post-header" :class="{ fixed: isFixed}">-->
  <!--<aside class="c-post-header__left" @click="goPage">-->
  <!--<i class="iconfont icon-zuojiantou1 feature-icon"></i>-->
  <!--<em class="back-title">返回</em>-->
  <!--</aside>-->
  <!--<em class="c-post-header__legend">{{childrenTitle || $route.query.title || $route.meta.title ||'暂无信息'}}</em>-->
  <!--<aside class="c-post-header__right">-->
  <!--<i class="iconfont icon-caidan feature-icon" @click="$emit('onMore')" v-if="isMore"></i>-->
  <!--<span v-if="moreName" @click="$emit('onMore')">{{moreName}}</span>-->
  <!--</aside>-->
  <!---->
  <!--</header>-->


  <van-nav-bar
    :class="{ fixed: isFixed}"
    :title="childrenTitle || $route.query.title || $route.meta.title ||'暂无信息'"
    left-text="返回"
    :right-text="moreName"
    left-arrow
    @click-left="goPage"
    @click-right="$emit('onMore')"
    :style="{'background': $themeColor,'border':'none'}"
  />


</template>

<script>
  export default {
    name: 'Header',
    props: ['isMore', 'isFixed', 'metaTitle', 'childrenTitle', 'moreName', 'link'],
    data() {
      return {}
    },
    methods: {
      goPage() {

        // console.log(("window.history.length <= 1:" + window.history.length <= 1) + "   localStorage.isShare:" + localStorage.isShare)
        // console.log("localStorage.projectAppId:" + localStorage.projectAppId)
        if (window.history.length <= 1 || localStorage.isShare) {
          console.log(localStorage.projectAppId)

          // localStorage.clear('isShare');      //这种是错误的写法， localStorage.clear 是没有参数值的，这个函数则就是把所有的本地缓存数据全部清除了


          delete localStorage.isShare;        //删除缓存里面的分享
          this.goPointPage({
            path: "/home",
          });
        } else if (this.link) {
          console.log('去指定的页面:', this.link)
          this.goPointPage(this.link)
        } else {
          this.$router.go(-1)
        }
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../assets/common";

  .van-nav-bar {
    height: 51px;
    line-height: 51px;
  }

  .c-post-header {
    display: flex;
    align-items: center;
    height: 95px;
    background: $themeColor;
    @include flex-between;
    font-size: 30px;
    color: white;
    position: relative;
    z-index: 2;

    &__right {
      text-align: right;
      width: 200px;
      display: flex;
      align-items: center;
      overflow: hidden;
      line-height: 30px;
      position: absolute;
      right: 0px;
      height: 100%;

      i {
        font-size: 48px;
        margin: 0 auto;
        position: absolute;
        right: 20px;
      }

      span {
        font-size: 28px;
        position: absolute;
        right: 20px;
      }
    }

    &__left {
      width: 140px;
      margin-left: 10px;
      font-size: 28px;
      position: absolute;
      z-index: 1;
      height: 100%;
      display: flex;
      align-items: center;

      .back-title {
        margin-left: 8px;
      }

      .feature-icon {
        font-size: 32px;
        margin-top: -6px;
      }
    }

    &__legend {
      flex: 1;
      text-align: center;
      @include t-overflow;
      font-size: 32px;
      position: absolute;
      width: calc(100% - 300px);
      z-index: 0;
      margin: 0 150px;
    }
  }

  .back {

  }

  .fixed {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
  }
</style>
