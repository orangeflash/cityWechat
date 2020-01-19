<template>
  <div class="sign-in-record">
    <!--<header class="header">-->
    <!--<span class="have-card">您拥有<em class="num">0</em>张补签卡</span>-->
    <!--<span class="buy-card" @click="show=!show">购买补签卡</span>-->
    <!--</header>-->
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <div class="body">
      <!--<p class="point"><i class="iconfont icon-gantanhao"></i>&nbsp;&nbsp;&nbsp;以下为60天以内的签到记录，漏签的日期可补签</p>-->
      <div class="sign-in-record-item" v-for="(item,i) in record" :key="i">
        <div class="left">
          <em class="time">{{item.signTime}}</em>
          <em class="gold-num">+{{item.integral}}积分</em>
        </div>
        <div class="right">
          <em>{{item.note}} <i class="iconfont icon-qiandao1 sign-in-icon"></i> </em>
        </div>
      </div>
    </div>
    <!--<van-popup v-model="show" class="buy-card">-->
      <!--<i class="iconfont icon-jia1 close" @click="show=!show"></i>-->
      <!--<strong class="title">补签一天需一张补签卡</strong>-->
      <!--<strong class="title">确认购买一张补签卡？</strong>-->
      <!--<em class="remind">当前拥有0张补签卡</em>-->
      <!--<em class="remind">10积分/张</em>-->
      <!--<img-wrapper :src="card" class="card"/>-->
      <!--<img-wrapper :src="buy" class="buy"/>-->
      <!--<em class="signing-success">补签成功！</em>-->
    <!--</van-popup>-->
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {Popup} from 'vant';
  import card from "../../assets/img/sign-in/card.png"
  import buy from "../../assets/img/sign-in/buy.png"
  import atNowBuy from "../../assets/img/sign-in/at-now-buy.png"
  import Header from "@/components/header";
  import {Toast} from 'vant';

  export default {
    name: "signInRecord",
    components: {Header},
    data() {
      return {
        show: false,
        card,
        buy: buy,
        atNowBuy,
        record:[],        //签到记录
      }
    },
    methods:{
      ...mapActions("signIn",["signRecord"]),
    },
    created(){
      this.signRecord().then(result=>{
        console.log(result);
        if(result.code == 1){
          this.record = result.data;
        }else{
          Toast.fail({
            message:'获取信息失败',
            duration:1500
          })
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/theme";
  @import "../../assets/common";

  .header {
    padding: 30px;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;

    .have-card {
      font-size: $font-size-base;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);

      .num {
        color: rgba(255, 78, 78, 1);
        padding: 0px 10px;
      }
    }

    .buy-card {
      width: 176px;
      height: 64px;
      background: rgba(255, 78, 78, 1);
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: $font-size-base;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
  }

  .body {
    margin-top: 16px;
    /*padding: 30px 0px;*/
    background-color: #fff;

    .point {
      text-align: center;
      font-size: $font-size-sm;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
    }

    .sign-in-record-item {
      display: flex;
      justify-content: space-between;
      padding: 40px 30px;
      background-color: #fff;
      border-bottom: 1PX solid #eee;

      .left {
        font-size: $font-size-base;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }

      .time {
        color: rgba(51, 51, 51, 1);
      }

      .gold-num {
        color: rgba(255, 78, 78, 1);
        margin-left: 30px;
      }

      .sign-in-icon {
        color: $themeColor;
        font-size: $font-size-base;
        margin-left: 20px;
      }

      .right {
        font-size: $font-size-base;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
  }

  .buy-card {
    width: 576px;
    height: 510px;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .card {
      width: 308px;
      height: 165px;
      background: rgba(255, 255, 255, 1);
      border-radius: 20px;
    }

    .title {
      font-size: 34px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    .remind {
      font-size: $font-size-sm;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin: 30px 0px;
    }

    .buy {
      width: 218px;
      height: 63px;
      border-radius: 28px;
      margin-top: 30px;
    }

    .close {
      font-size: 70px;
      color: #eee;
      transform: rotateZ(45deg);
      position: absolute;
      right: 20px;
      top: 20px;
    }

    .signing-success {
      font-size: 34px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
  }
</style>
