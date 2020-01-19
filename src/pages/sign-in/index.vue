<template>
  <div class="sign-in">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <header class="user-header">
      <p class="rule" @click="goPointPage({path:'/sign/signInRule',query:{data:ruleInfo}})">签到规则 <i
        class="iconfont icon-youjiantou1"></i></p>
      <div class="user-body-info">
        <div class="left">
          <div class="user-header-img">
            <img-wrapper :src="user.portrait"/>
          </div>
          <div class="text-body">
            <span class="text big-size">已连续签到<em class="tag big">{{getContinuity}}</em>天</span>
            <span class="text">签满7天有机会获得<em class="tag money">额外礼包</em></span>
          </div>
        </div>
        <div class="right" @click="goPointPage({path:'/sign/signInRanking'})">
          <i class="iconfont icon-tianchongxing-  crown-icon">&nbsp;&nbsp;排行榜</i>
        </div>
      </div>
    </header>
    <div class="reward">
      <p class="reward-title">
        <span><i class="iconfont icon-liwu gift"></i><em class="sign-tag-title">签到领奖励</em></span>
        <!--<span class="isRemind">签到提醒<van-switch v-model="checked"  class="power"/></span>-->
      </p>
      <ul class="reward-list">
        <li class="reward-item" v-for="(item,i) in weekDays" :key="i">
          <em>第{{i+1}}天</em>
          <!--<dd-layout-div class="money-list" :width="35">-->
          <!--<img-wrapper :src="money" not-load="true" class="money"/>-->
          <!--</dd-layout-div>-->
          <dd-layout-img :src="money" :width="0.7" :height="0.7" class="bg-tran"/>


          <span class="today" v-if="+item.time.split('-').pop() === toDay">今天 <em class="triangle"></em></span>
          <em class="integral-num">{{getDateIntegral(i) || 0}}积分</em>
          <em class="old-sign-in" v-if="item.sign == 1">已签到</em>
          <em class="await-sign-in"
              v-else-if="bjTime(item.time)">待签到</em>
          <em class="sign-in" v-else @click="showSignBox(+item.time.split('-').pop(),i+1)">签到</em>
          <!--<em class="sign-in">补签</em>-->
          <!--<em class="pending-sign">代签到</em>-->
        </li>
        <li class="reward-item-other reward-item" v-if="weekDays.length > 0">
          <img-wrapper :src="redBag" class="gold-img"/>
          <em class="integral-num">满7天额外礼包</em>
        </li>
      </ul>
    </div>
    <div class="welfare">
      <p class="welfare-title">
        <em class="welfare-text">签到福利</em>
        <em class="recording" @click="goPointPage({path:'/sign/signInRecord'})">签到记录 <i
          class="iconfont icon-youjiantou1"></i></em>
      </p>
      <ul class="welfare-body">
        <li class="welfare-item" v-for="(item,i) in welfare" :key="i">
          <img-wrapper :src="item.icon" not-load="true" class="welfare-img"/>
          <em class="word-description">{{item.name}}</em>
        </li>
      </ul>
    </div>
    <footer class="do-the-task">
      <div class="task-title">
        <strong class="literal">做任务赢积分</strong>
        <em class="go" @click="goPointPage({path:'/personal/integralMall/task'})">立即前往<i
          class="iconfont icon-youjiantou"></i></em>
      </div>
      <div class="poster" @click="goPointPage({path:'/personal/integralMall/task'})">
        <img-wrapper not-load="true" :src="signInTask" class="base-map"/>
      </div>
    </footer>
    <van-popup v-model="show" class="sign-in-popup">
      <strong class="success">签到成功</strong>
      <span class="congratulations">恭喜你获得 <em class="num">{{integral||0}}</em> 积分</span>
      <em class="isTrue" @click="show = !show">确定</em>
      <i class="iconfont icon-guanbi clone" @click="show = !show"></i>
    </van-popup>
  </div>
</template>

<script>
  import {Switch, Popup} from 'vant';
  import {mapActions, mapState, mapGetters} from 'vuex'
  import money from "../../assets/img/sign-in/jingbi.png"
  import redBag from "../../assets/img/sign-in/gift.png"
  import successSignIn from "../../assets/img/sign-in/success-sign-in.png"
  import sendIntegral from "../../assets/img/sign-in/send-integral.png"
  import sendRedBag from "../../assets/img/sign-in/send-red-bag.png"
  import sendDiscount from "../../assets/img/sign-in/send-discount.png"
  import sendBenefit from "../../assets/img/sign-in/send-benefit.png"
  import signInTask from "../../assets/img/sign-in/signIn-task.png"
  import {hideLoading, showDialog, showLoading, getUrlParams, parseObjToParams} from "../../util";
  import {Toast} from 'vant';
  import {utilMixins} from "@/plugins/util-mixins";


  import Header from "@/components/header";
  import DdLayoutImg from "../../components/layout/dd-layout-img";

  export default {
    name: "Index",
    components: {DdLayoutImg, Header},
    props: ['userInfo'],
    data() {
      return {
        checked: true,
        money,
        successSignIn,
        show: false,
        redBag,
        signInTask,
        continuity: 0,                     //已连续签到的天数
        integral: 0,                       //今天签到的积分
        signInDay: null,                   //签到的天数，不是日期
        ruleInfo: {},                      //签到规则
        toDay: new Date().getDate(),       //今天的日期
        weekDays: [],                      //七天的签到记录\
        needRepair: false,                 //是否需要补签
        mouth: new Date().getMonth() + 1,
        welfare: [                         //签到福利
          {
            name: '送积分',
            icon: sendIntegral
          }, {
            name: '送红包',
            icon: sendRedBag
          }, {
            name: '送折扣',
            icon: sendDiscount
          }, {
            name: '送优惠',
            icon: sendBenefit
          }
        ]
      }
    },
    methods: {
      ...mapActions('signIn', ["lookWeekSignInfo", "isRepair", "beginSign", "repair", "signInRule"]),
      bjTime(v) {
        // console.log(v,this.todayTime)
        return v > this.todayTime
      },
      async repairTips() {
        try {
          await showDialog("您昨天没有签到，请问是否补签？");
          // 用户确定要进行补签了
          this.repair().then(result => {
            if (result.code === 1) {
              Toast.success({
                message: '补签成功',
                duration: 1500
              });
              this.lookWeekSignInfo().then(val => {
                this.weekDays = val;
              });
            } else {
              Toast.fail({
                message: '补签失败',
                duration: 1500
              })
            }
          })
        } catch (e) {
          console.log("老板，您可以哦，这么霸气，居然不补签。从头再来吧！")
          this.lookWeekSignInfo().then(val => {
            this.weekDays = val;
          });
        }
      },
      // 获取指定天数的签到积分
      getDateIntegral(day) {
        switch (day) {
          case 0:

            return this.ruleInfo.data.monday;
          case 1:
            return this.ruleInfo.data.tuesday;
          case 2:
            return this.ruleInfo.data.wednesday;
          case 3:
            return this.ruleInfo.data.thursday;
          case 4:
            return this.ruleInfo.data.friday;
          case 5:
            return this.ruleInfo.data.saturday;
          case 6:
            return this.ruleInfo.data.sunday;
          case 7:
            return this.ruleInfo.data.sevenDays;
        }
      },
      showSignBox(day, index) {
        if (day == this.toDay) {
          this.beginSign({
            day: index
          }).then(result => {
            if (result.code == 1) {
              this.show = !this.show;
              this.integral = this.getDateIntegral(index - 1);
              this.lookWeekSignInfo().then(val => {
                this.weekDays = val;
              });
            } else {
              Toast.fail({
                message: result.msg || '签到失败',
                duration: 1500
              })
            }
          })
        }
      }
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        user: state => state.user
      }),
      getContinuity() {
        this.continuity = 0;
        this.weekDays.forEach(v => {
          if (v.sign == 1) {
            this.continuity++
          }
        })
        return this.continuity
      }
    },
    async created() {
      this.todayTime = this.formatDateByTimeStamp(this.formatDateByString(new Date()), "YYYY-MM-DD")
      // 获取签到规则
      await this.signInRule().then(result => {
        this.ruleInfo = result;
      })


      // 查看本周签到记录
      this.lookWeekSignInfo().then(val => {

        if (val) {
          val.forEach(v => {
            if (v.sign == 1) {
              this.continuity++
            }
          })
        }
        this.weekDays = val;
      });
      // 查看是否有漏签
      this.isRepair().then(val => {
        if (val.code === 1) {
          val.data === 1 && this.repairTips();
        } else {
          Toast.fail({
            message: '请求失败',
            duration: 1000
          })
        }
      });

    }
  }
</script>
<style lang="scss">
  .van-switch--on {
    background-color: rgba(237, 124, 84, 1);
  }

  .van-switch {
    width: 45px;
    height: 18px;
    border-radius: 17px;
  }

  .van-switch--on .van-switch__node {
    transform: translateX(28px)
  }

  .van-switch__node {
    width: 18px;
    height: 18px;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/theme";
  @import "../../assets/common";

  .sign-in {
    background-color: rgba(244, 244, 244, 1);
  }

  .await-sign-in {
    background: #ddd;
  }

  .sign-in, .await-sign-in {
    .user-header {
      padding: 30px;
      height: 210px;
      background: linear-gradient(-10deg, rgba(100, 96, 113, 1) 0%, rgba(62, 58, 73, 1) 100%);
    }

    .rule {
      text-align: right;
      font-size: 24px;
      font-weight: 500;
      color: rgba(195, 195, 199, 1);
      line-height: 36px;
      vertical-align: middle;

    }

    .user-body-info {
      display: flex;
      justify-content: space-between;
      position: relative;

      .left {
        display: flex;
        justify-content: space-around;
      }

      .user-header-img {
        width: 77px;
        height: 77px;
        background: rgba(255, 255, 255, 1);
        opacity: 0.7;
        border-radius: 50%;
        margin-right: 30px;
      }

      .text-body {
        display: flex;
        flex-direction: column;
        line-height: 60px;

        .text {
          color: rgba(221, 221, 221, 1);

          .tag {
            color: RGBA(239, 135, 52, 1);
          }

          .big {
            font-size: 40px;
            margin: 0px 10px;
          }

          .money {
            margin-left: 5px;
          }
        }

        .big-size {
          font-size: 30px;
        }
      }
    }

    .right {
      width: 142px;
      height: 48px;
      line-height: 48px;
      background: rgba(0, 0, 0, .2);
      border: 1PX solid rgba(255, 255, 255, 1);
      opacity: 1;
      border-radius: 10px;
      position: absolute;
      bottom: 0px;
      right: 0px;
      display: flex;
      align-items: center;

      i {
        margin: 0 auto;
      }
    }

    .crown-icon {
      font-size: $font-size-base;
      color: rgba(255, 195, 30, 1);
      line-height: 36px;
    }

    .reward {
      height: 554px;
      background: rgba(254, 247, 234, 1);
      border-radius: 8px;
      padding: 30px 20px;
    }

    .reward-title {
      display: flex;
      justify-content: space-between;

      .gift {
        color: RGBA(237, 124, 84, 1);
        font-size: $font-size-lg;
      }

      .sign-tag-title {
        font-size: $font-size-lg;
        font-weight: bold;
        color: rgba(74, 69, 90, 1);
        line-height: 40px;
        margin-left: 20px;
      }

      .isRemind {
        display: flex;
        align-items: center;
        font-size: $font-size-sm;
        font-weight: 500;
        color: rgba(74, 69, 90, 1);
        line-height: 36px;
      }

      .power {
        margin-left: 10px;
      }
    }

    .reward-list {
      margin-top: 40px;

      .reward-item {
        float: left;
        width: 168px;
        height: 218px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 5px 0px rgba(239, 135, 52, 0.27);
        border-radius: 8px;
        margin: 12px 12px 0px 0px;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
        position: relative;
        /*overflow: hidden;*/
        &:nth-of-type(4n) {
          margin-right: 0px;
        }

        .money-list {
          position: relative;
          margin-top: 15px;
          min-height: 70px;
        }

        .money {
          width: 80px;
          position: absolute;
          left: 50%;
          top: 0%;
          transform: translate(-50%);
          z-index: 5;
        }

        .money-one {
          left: -10px;
          top: 10px;
          z-index: 3;
        }

        .money-two {
          left: 10px;
          top: 10px;
          z-index: 3;
        }

        .integral-num {
          font-size: $font-size-base;
          font-weight: bold;
          color: rgba(239, 135, 52, 1);
          line-height: 40px;
        }

        .sign-in {
          background: linear-gradient(90deg, rgba(230, 61, 48, 1) 0%, rgba(238, 132, 88, 1) 100%);
        }

        .sign-in, .await-sign-in {
          width: 94px;
          height: 33px;
          line-height: 33px;
          border-radius: 17px;
          font-size: $font-size-xs;
          color: rgba(255, 255, 255, 1);
        }
      }

      .reward-item-other {
        width: 168px;
        height: 218px;
        background: linear-gradient(45deg, rgba(255, 166, 139, 1) 0%, rgba(255, 213, 200, 1) 100%);
        box-shadow: 0px 3px 5px 0px rgba(239, 135, 52, 0.27);
        border-radius: 8px;
        padding-top: 0px;
        position: relative;

        .gold-img {
          width: 133px;
          height: 133px;
        }

        .integral-num {
          position: absolute;
          top: 60%;
          left: 50%;
          transform: translateX(-50%);
          width: 89px;
          height: 60px;
          font-size: 24px;
          font-weight: bold;
          color: rgba(231, 70, 53, 1);
          line-height: 36px;
        }
      }
    }

    .welfare {
      padding: 30px;
      background-color: #fff;
      margin: 28px 0px;

      .welfare-title {
        display: flex;
        justify-content: space-between;

        .welfare-text {
          font-size: $font-size-lg;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
        }

        .recording {
          font-size: $font-size-sm;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }
      }

      .welfare-body {
        display: flex;
        margin-top: 30px;

      }

      .welfare-item {
        display: flex;
        flex-direction: column;
        flex: 1;
        align-items: center;
      }

      .welfare-img {
        width: 88px;
        height: 88px;
        background: linear-gradient(135deg, rgba(248, 74, 48, 1) 0%, rgba(255, 112, 0, 1) 100%);
        box-shadow: 0px 4px 9px 0px rgba(238, 120, 30, 0.19);
        border-radius: 50%;
        margin-bottom: 20px;
      }

      .word-description {
        font-size: $font-size-sm;
        color: rgba(102, 102, 102, 1);
      }
    }

    .do-the-task {
      margin-top: 18px;
      padding: 30px 20px;
      background-color: #fff;

      .task-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .literal {
        font-size: $font-size-lg;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }

      .go {
        font-size: $font-size-sm;
        line-height: 30px;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
      }

      .poster {
        margin-top: 31px;
        overflow: hidden;
        background: rgba(221, 204, 191, .1);
        border-radius: 8px;
      }

      .base-map {
        width: 100%;
        height: 220px;
      }
    }

    .pending-sign {
      font-size: $font-size-xs;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
      line-height: 36px;
    }

    .today {
      position: absolute;
      left: -10px;
      top: 10px;
      width: 60px;
      height: 30px;
      line-height: 30px;
      background: rgba(248, 214, 131, 1);
      font-size: $font-size-xs;
      font-family: PingFang-SC-Medium;
      color: rgba(239, 135, 52, 1);

      .triangle {
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-bottom: 10px solid rgba(239, 135, 52, 1);
        position: absolute;
        bottom: -10px;
        left: 0px;
        transform: rotateZ(45deg);
      }
    }
  }

  .sign-in-popup {
    width: 495px;
    height: 602px;
    background: url("../../assets/img/sign-in/success-sign-in.png");
    background-size: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;

    .success {
      font-size: 44px;
      font-weight: bold;
      color: rgba(247, 101, 57, 1);
      margin-top: 380px;
    }

    .congratulations {
      margin-top: 30px;
      font-size: $font-size-sm;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    .num {
      color: RGBA(247, 101, 57, 1);
    }

    .isTrue {
      margin-top: 35px;
      width: 212px;
      height: 56px;
      text-align: center;
      line-height: 56px;
      background: linear-gradient(-7deg, rgba(255, 56, 28, 1) 0%, rgba(255, 154, 79, 1) 100%);
      border-radius: 28px;
      font-size: $font-size-lg;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }

    .clone {
      position: absolute;
      color: #eee;
      font-size: 50px;
      right: 10px;
      top: 30px;
      transform: translate(-50%);
      z-index: 9999;
    }
  }
</style>
