<template>
  <!-- 任务组件 -->
  <li class="task-single">
    <div class="task-single-icon">
      <img-wrapper not-load="true" :src="task.img || platform.logo"></img-wrapper>
    </div>
    <div class="task-single-info">
      <div class="task-single-btn">
        <span class="completed" v-if="task.complete == 1"><em>已完成</em></span>
        <span class="go-complete" v-if="task.complete == 2"  @click="goPointPage({path:goCompleted(task.id)})"><em>{{task.num}}/{{task.taskNum}}</em></span>
        <!--<span class="rceive-awards"><em>领取奖励</em></span>-->
      </div>
      <div class="task-single-info__details">
        <p class="task-single-info__details__txt">
          {{task.name}}<em>+{{task.score}}积分</em>
        </p>
        <span class="speed-of-progress">{{task.description}}</span>
      </div>
    </div>
  </li>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    props:["task"],
    methods:{
      goCompleted(id){
        switch (id) {
          case "love":
          case "browser":
          case "comment":
            return"/classification";
          case "collection":
            return "/businessDistrict";
          case "posting":
            return "/publication";
          case "userAuthentication":
          case "userBond":
            return "/attestIndex?type=personal";
          case "authentication":
          case "businessBond":
            return "/attestIndex?type=store";
          case "businessJoin":
            return "/publication/businessEnterForm"

        }
      }
    },
    computed: {
      ...mapState({
        user: state => state.user,
        platform: state => state.platform
      })
    }
  }

</script>


<style scoped lang="scss">
  @import "../../../../assets/common";

  .task-single {
    overflow: hidden;
    padding: 28px 0 0px 32px;

    .task-single-icon {
      float: left;
      width: 74px;
      height: 74px;
      overflow: hidden;
      img {
        width: 100%;
        height:100%;
      }
    }

    .task-single-info {
      margin-left: 107px;
      overflow: hidden;

      &__details {
        padding-bottom: 36px;
        border-bottom: 1.1px solid #F4F4F4;
        padding-right: 200px;
        &__txt {
          font-size: 28px;
          margin: 4px 0 18px;

          em {
            color: #EE832C;
            margin-left: 30px;
          }
        }

        .speed-of-progress {
          color: #999;
          line-height: 30px;
        }
      }

      .task-single-btn {
        float: right;
        width: 168px;
        margin-right: 34px;
        display: flex;
        align-items: center;
        height: 74px;
        position: relative;
        span{
          height: 56px;
          border-radius: 28px;
          overflow: hidden;
          font-size: 28px;
          display: flex;
          position: absolute;
          right: 0;
          align-items: center;
          em {
            margin: 0 auto;
            color: #fff;
          }
        }
        .go-complete {
          width: 142px;
          background: linear-gradient(-90deg, rgba(252, 78, 5, 1) 0%, rgba(247, 170, 20, 1) 100%);
          box-shadow: 0px 3px 3px 0px rgba(241, 51, 54, 0.21);


        }
        .rceive-awards {
          width: 168px;
          background:linear-gradient(90deg,rgba(231,2,251,1) 0%,rgba(102,5,255,1) 100%);
          box-shadow:0px 3px 3px 0px rgba(133,102,253,0.21);

        }
        .completed{
          width: 142px;
          background: #DDD;
          box-shadow:0px 3px 3px 0px rgba(221,221,221,0.21);
        }
      }
    }
  }
</style>
