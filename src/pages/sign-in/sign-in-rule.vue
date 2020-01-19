<template>
  <div class="sign-in-rule">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->

    <header class="rule-header">签到规则</header>

    <article class="regular-list">
      <div v-if="signInRule&&signInRule.body" v-html="signInRule.body"></div>
      <!--<div class="regular-item">-->
        <!--<p class="headline">-->
          <!--<em class="serial-number">1</em>-->
          <!--<em class="issue">活动时间</em>-->
        <!--</p>-->
        <!--<ul class="description-list ">-->
          <!--<li class="time text-indent">自2018年10月19日起</li>-->
        <!--</ul>-->
      <!--</div>-->


      <!--<div class="regular-item" v-for="i in 5" :key="i">-->
        <!--<p class="headline">-->
          <!--<em class="serial-number">1</em>-->
          <!--<em class="issue">活动时间</em>-->
        <!--</p>-->
        <!--<ul class="description-list">-->
          <!--<li class="description-item padding-left" v-for="i in 4" :key="i">-->
            <!--<em class="index">1）</em>-->
            <!--<em class="description-details">每邀请1位新用户进入本活动页面，填写您的邀请-->
              <!--码，您可获得6元现金奖励+1张福利卡，新用户可获得随机红包+1张福利卡。</em>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
    </article>
  </div>
</template>

<script>
  import {Toast} from 'vant';
  import Header from "@/components/header";
  export default {
    name: "signInRule",
    components: {Header},
    data() {
      return {
        signInRule: {}
      }
    },
    created() {
      if (this.$route.query.data) {

        console.log(this.$route.query.data.data)

        this.signInRule = this.$route.query.data.data;
        console.log(this.signInRule)
      } else {
        Toast.fail({
          message: "签到规则获取失败",
          duration: 1500
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/theme";
  @import "../../assets/common";

  .text-indent {
    text-indent: 70px;
  }

  .sign-in-rule {
    background-color: #fff;
  }

  .rule-header {
    height: 298px;
    background-color: #433f4f;
    text-align: center;
    line-height: 248px;
    font-size: 67px;
    font-family: MFLiHei_Noncommercial-Regular;
    font-weight: 900;
    letter-spacing: 15px;
    color: rgba(255, 255, 255, 1);
    z-index: 0;
  }

  .regular-list {
    transform: translateY(-52px);
    background-color: #fff;
    border-radius: 52px 52px 0px 0px;
    padding: 60px;
    padding-bottom: 0px;

    .regular-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 40px;
    }
  }

  .headline {
    display: flex;
    flex-direction: row;
    align-items: center;

    .serial-number {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      width: 36px;
      height: 36px;
      background: rgba(243, 63, 58, 1);
      border-radius: 50%;
      font-size: 27px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      /*line-height:79px;*/
    }

    .issue {
      font-size: 30px;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      margin-left: 20px;
    }
  }

  .description-list {
    margin-top: 28px;

    .time {
      font-size: $font-size-sm;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    .description-item {
      display: flex;
      flex-direction: row;
      margin-top: 10px;

      .description-details {
        font-size: $font-size-xs;
        font-family: PingFang-SC-Medium;
        color: rgba(51, 51, 51, 1);
        line-height: 36px;
      }

      .index {
        font-size: $font-size-xs;
        line-height: 36px;
      }
    }

    .padding-left {
      padding-left: 60px;
    }
  }
</style>
