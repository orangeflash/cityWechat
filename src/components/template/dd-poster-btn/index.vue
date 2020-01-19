<template>

  <div class="dd-poster-box">
    <div class="dd-poster-btn" @click.stop="showPoster = !showPoster">生成海报
      <!--<i class="iconfont icon-iconfontjiantou4"></i>-->
    </div>
    <dd-poster
      qrcode="https://app.zhycms.com/file/2/jpg/2018/12/07/8NJFJlOICB5JErFC.jpg"
      v-model="showPoster"
      :logo="logo"
      :nickname="nickname"
      :body="body"
      :tag="tag"
      :desc="desc"
      :photos="photos || []"
      :isVideo="isVideo"
      :rewardInfo="rewardInfo"
    ></dd-poster>
  </div>


</template>
<script>

  import DdPoster from '../../../components/template/dd-poster'

  export default {
    components: {DdPoster},
    props: ['logo', 'icons', 'photos', 'qrcode', 'value', 'nickname', 'body', 'tag', 'desc', 'isVideo', 'rewardInfo'],
    data() {
      return {
        showPoster: false
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-poster-btn {
    position: fixed;
    top: 4rem;
    right: 0;
    background: $themeColor;
    opacity: 0.7;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 20px 10px 14px 20px;
    justify-content: center;
    z-index: 1999;

    i {
      font-size: 20px;
      height: 20px;
    }
  }

</style>
