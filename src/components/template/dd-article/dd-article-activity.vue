<template>

  <dd-article
    :data="item"
    @click="goPointPage({ path: '/auxiliary/activity/details', query: {activityId: item.id }})"
  >
    <template slot="mask">
      <div class="activity-mask">
        <div class="star-num flex-center">
          <i class="iconfont icon-dianzan2 col-t"></i>
          <span class="col-f">{{item.count}}人</span>
        </div>
        <div class="activity-over flex-center"
             v-if="item.isOver"
        >
          <img :src="isEnd">
        </div>
        <div v-else class="start-time bg-t col-f">{{item.startTime}} 开始</div>
      </div>
    </template>
  </dd-article>

</template>


<script>
  import DdArticle from '@/components/template/dd-article/two'

  export default {
    components: {DdArticle},
    props: ["item"]
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .activity-mask {
    .star-num {
      background: #000;
      position: absolute;
      z-index: 2;
      right: 30px;
      top: 30px;
      padding: 16px 20px 12px;
      border-radius: 30px;

      i {
        height: 25px;
        margin-right: 10px;
      }
    }

    .start-time {
      position: absolute;
      z-index: 2;
      bottom: 0;
      left: 0;
      padding: 16px 20px 12px;
      opacity: 0.9;
      border-top-right-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    .activity-over {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      background: rgba(0, 0, 0, .5);
      top: 0;
      left: 0;

      img {
        width: 260px;
      }
    }
  }


</style>
