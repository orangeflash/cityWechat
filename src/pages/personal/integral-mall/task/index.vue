<template>
  <!-- 任务中心 -->
  <div id="task">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <!-- 自己的信息 S-->
    <div class="task-my-info">
      <img :src="back" class="task-page-cover"/>
      <!--<div class="task-my-info__details">-->
      <!--<div class="task-my-info__details__face">-->
      <!--<img-wrapper not-load="true" :src="user.portrait"></img-wrapper>-->
      <!--</div>-->
      <!--<p class="task-my-info__details__integral">-->
      <!--<em>{{user.integral}}</em>积分-->
      <!--</p>-->
      <!--<p class="task-my-info__details__other" @click="goPointPage({path:'/personal/integralMall'})">-->
      <!--<span>热门福利奖品等你来兑换</span>-->
      <!--</p>-->
      <!--</div>-->
      <div class="task-my-info__sign_in" @click="goPointPage({path:'/sign'})">
        <img class="more-jing-bi" :src="moreJingBi"/>
        <em>签到</em>
      </div>
    </div>
    <!-- 自己的信息 E-->
    <!-- 今日任务 S-->
    <div class="task-to-day">
      <div class="task-to-day__info">
        今日已得：{{integral|| 0 }}积分
        <span @click="goPointPage('/sign/signInPointsDetails')">
          我的奖励
          <i class="iconfont icon-iconfontjiantou4"></i>
        </span>
      </div>
      <div class="task-to-day__content">
        <div class="task-to-day__content__title">今日任务</div>
        <ul class="task-to-day__content__list">
          <task-single v-for="(item,i) in taskArray" v-if="item.type=='day'" :task="item" :key="i"></task-single>
        </ul>
      </div>
    </div>
    <!-- 今日任务 E-->
    <!-- 必备任务 S-->
    <div class="task-necessary" v-if="hasOne">
      <div class="task-to-day__content">
        <div class="task-to-day__content__title">必备任务</div>
        <ul class="task-to-day__content__list">
          <task-single v-for="(item,i) in taskArray" v-if="item.type=='one'" :task="item" :key="i"></task-single>
        </ul>
      </div>
    </div>
    <!-- 必备任务 E-->
  </div>
</template>
<script>
  import Header from "@/components/header";
  import {mapActions, mapState, mapGetters} from 'vuex'
  import taskSingle from "../template/task-single"
  import {Toast} from "vant";
  import {updateShareConfig} from "../../../../util/wechat-util";
  import {hideLoading, showDialog, showLoading, getUrlParams, parseObjToParams} from "../../../../util";
  import moreJingBi from "../../../../assets/img/sign-in/moreJingBi.png"
  import back from "../../../../assets/img/personal/task/task-back.png"


  export default {
    components: {taskSingle, Header},
    data() {
      return {
        taskArray: [],
        hasOne: false,
        integral: 0,
        // userInfo:{},
        moreJingBi,
        back
      }
    },
    methods: {
      ...mapActions('personal/task', ["getTaskSet", "getTaskSpeedOfProgress", "getToDayIntegral"]),
      ...mapActions('personal', ["getUserInfoById"]),

    },
    computed: {
      ...mapState({
        platform: state => state.platform
      })
    },
    created() {

      showLoading();

      // this.getUserInfoById().then(result=>{
      //
      //   console.log(result);
      //
      //   if(result){
      //     this.userInfo = result
      //   }else{
      //     Toast.fail({
      //       message:'获取用户信息失败',
      //       duration:1500
      //     })
      //   }
      // })

      this.getTaskSet().then(result => {
        if (result.code === 1) {
          if (result.data.task == 'open') {

            updateShareConfig({
              title: result.data.title,
              imgUrl: result.data.shareImg,
              desc: result.data.shareDescription,
              link: window.location.href,
            });

            this.getToDayIntegral().then(result => {
              if (result.code == 1) {
                this.integral = result.data;
              } else {
                Toast.fail({
                  message: '请求失败',
                  duration: 1500
                })
              }
            })
            this.getTaskSpeedOfProgress().then(result => {
              if (result.code == 1) {
                this.taskArray = result.data.data || [];
                this.taskArray.forEach(v => {
                  if (v.type == 'one') {
                    this.hasOne = true
                    return false;
                  }
                })
              } else {
                Toast.fail({
                  message: '请求失败',
                  duration: 1500
                })
              }
            })
          } else {
            Toast.fail({
              message: '任务功能暂未开启',
              duration: 1500
            })
            setTimeout(() => {
              this.$router.go(-1);
            }, 1500)
          }
        } else {
          Toast.fail({
            message: result.msg,
            duration: 1500
          })
        }
      })
      hideLoading();
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../../assets/common";

  #task {
    .task-my-info {
      text-align: center;
      position: relative;

      .task-page-cover {
        width: 100%;
      }

      &__details {

        padding: 26px 0 40px;

        &__face {
          width: 94px;
          height: 94px;
          overflow: hidden;
          padding: 10px;
          background-image: url('../../../../assets/img/personal/task/face-halopng.png');
          background-repeat: no-repeat;
          background-size: cover;
          -webkit-background-size: cover;
          -o-background-size: cover;
          background-position: center 0;
          margin: 0 auto 14px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        &__integral {
          margin-bottom: 24px;

          em {
            color: #fff;
            font-size: 64px;
          }
        }

        &__other {
          background: #fff;
          height: 54px;
          display: inline-block;
          line-height: 54px;
          padding: 0 60px;
          border-radius: 27px;

          span {
            color: #EE832C;
            font-size: 28px;
          }
        }
      }

      &__sign_in {
        position: absolute;
        top: 40px;
        right: 44px;
        width: 130px;
        height: 42px;
        border-radius: 10px;
        background: #fff;
        background-repeat: no-repeat;
        background-size: cover;
        -webkit-background-size: cover;
        -o-background-size: cover;
        background-position: center 0;
        display: flex;
        align-items: center;

        em {
          color: #F4810E;
        }
      }
    }

    .task-to-day, .task-necessary {
      position: relative;
      margin: -90px 0 0;

      &__info {
        margin: 0 26px;
        background: rgba(0, 0, 0, .5);
        height: 72px;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        line-height: 72px;
        padding: 0 52px;
        color: #FFD7D8;
        font-size: 26px;
        overflow: hidden;

        span {
          float: right;

          i {
            font-size: 20px;
          }
        }
      }

      &__content {
        background: #fff;
        border-radius: 20px;
        overflow: hidden;

        &__title {
          height: 92px;
          line-height: 92px;
          font-size: 30px;
          padding: 0 34px;
          border-bottom: 8px solid #F4F4F4;
        }

        &_list {

        }
      }
    }

    .more-jing-bi {
      width: 40px;
      margin: 0 10px 0 7px;
    }

    .task-necessary {
      margin-top: 30px;
    }
  }

</style>
