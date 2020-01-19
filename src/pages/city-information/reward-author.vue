<template>
  <div class="reward-author">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <div class="body">
      <div class="author">
        <div class="author-face-box">
          <img-wrapper :src=this.$route.query.face||user.portrait alt="" srcset="" class="author-img"/>
        </div>

        <em class="author-text">{{this.$route.query.name||user.userName || '我是神秘人' }}</em>
        <em class="author-text author-good">优质内容，值得打赏哦！</em>
      </div>
      <div class="choice-reward-num">
        <!--<van-button plain size="small" class="reward-num" :class="{rewardNumActive:rewardNumIndex===index}"-->
        <!--v-for="(item,index) in authorInfo.rewardNumList" :key="index" @click="selctReward(index)">-->
        <!--{{item.num}}-->
        <!--</van-button>-->
        <div class="flex-wrap flex flex-bt" v-if="labels && labels.length">
          <div class="flex-center mar-b fon-40 br-t w-160 dh-70 pad-t-5 br-r-10"
               @click="selctReward(item,k)"

               :class="choiceIndex==k?'bg-t':'bg-f'"

               :key="k"
               v-for="(item,k) in labels">
            <div>
              <span class="col-t" :class="choiceIndex==k?'col-f':'col-t'">{{item.money}}</span>
              <em class="fon-b col-t" :class="choiceIndex==k?'col-f':'col-t'">元</em>
            </div>
          </div>
          <div class="w-175" v-if="labels.length % 3 > 0" v-for="t in (3 - (labels.length % 3)) " :key="t"></div>

        </div>


        <!--<ChoiceLabel v-if="labels && labels.length" :labels="labels" @choice="selctReward" isSingle="true" field="money"-->
        <!--before="￥"-->
        <!--after="元"></ChoiceLabel>-->

        <p v-else>暂无打赏金额</p>

      </div>

      <van-button size="large" class="isReward" @click="rewardAuthor">打赏</van-button>
      <em class="reward-arouse">打赏是表示鼓励和
        对内容的无偿赠与</em>
      <pay-mask :show-mask.sync="showPayMask" :money="money" @pay="payHandle"/>
    </div>

  </div>
</template>

<script>
  import authorImg from '../../assets/img/city-information/小头像.png'
  import PayMask from "../../components/publication/pay-mask";
  import {Toast} from 'vant';
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {chooseWXPay} from "../../util/wechat-util";
  import {showDialog} from "../../util";
  import ChoiceLabel from '@/components/template/choice-label'


  import {
    hideLoading,
    showLoading,
  } from "@/util";
  import Header from "@/components/header";

  export default {
    components: {PayMask, Header, ChoiceLabel},
    data() {
      return {
        authorInfo: {
          id: 0,
          img: authorImg,
          rewardNumList: [
            {id: 0, num: 0.01},
            {id: 1, num: 2},
            {id: 2, num: 3},
            {id: 3, num: 5},
            {id: 4, num: 10}
          ]
        },
        rewardNumIndex: 0,
        showPayMask: false,
        money: 0,
        choiceIndex: null,
        labels: [],
      }
    },
    methods: {
      ...mapActions("wxPay", ["infoRewardPay"]),
      ...mapActions('cityInformation', ['rewardPrice']),
      selctReward(item, key) {
        this.money = (+item.money).toFixed(2);
        console.log(this.money)
        this.choiceIndex = key;
      },
      async rewardAuthor() {
        const bool = await this.checkBindTel({
          callBack: true
        })
        if (!bool) return;
        const info = {
          money: this.money, informationId: this.$route.query.informationId, userId: this.user.id
        }
        if (+this.money > 0) {
          try {
            await showDialog("需要支付：" + this.money + '元');
            this.$router.push({
              name: 'cashier',
              params: {
                type: 3,
                param: info,
                info: {
                  money: this.money,
                  type: "打赏",
                  callLink: "/cityInformation/detail?id=" + this.$route.query.informationId,
                }
              }
            })
          } catch (e) {
            console.log("老板，您就可怜可怜我吧，赏给我" + this.money + "元！");
          }
        }

      },
      async payHandle() {
        const info = {
          money: this.money, informationId: this.$route.query.informationId, userId: this.user.id
        }
        hideLoading();
        // try{
        //   await showDialog("需要支付："+this.money);
        //   this.$router.push({
        //     name: 'cashier',
        //     params: {
        //       type: 3,
        //       param :info,
        //       info:{
        //         money:this.money,
        //         type:"打赏",
        //         callLink:"/cityInformation/detail?id="+informationId
        //       }
        //     }
        //   })
        // }catch (e) {
        //
        //   return false;
        // }
        // const payConfig = await this.infoRewardPay(info);
        //
        // showLoading();
        // await chooseWXPay(payConfig, () => {
        //  Toast('谢谢您的打赏，我会继续努力的^_^')
        // });
        // hideLoading();
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    mounted() {
    },
    async created() {

      const bool = await this.checkBindTel({
        callBack: true
      })
      if (!bool) return;

      const res = await this.rewardPrice();
      if (res.code == 1) {
        if (res.data) {
          console.log(res.data)
          this.labels = res.data;
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../assets/theme";

  .reward-author {
    background-color: #fff;
    min-height: 100vh;

    .author {
      text-align: center;
      align-items: center;
      display: flex;
      flex-direction: column;

      .author-face-box {
        width: 155px;
        height: 155px;
        margin: 60px auto;
        border-radius: 50%;
        overflow: hidden;
      }
    }

    .choice-reward-num {
      margin: 30px 60px;

      p {
        color: #999;
        text-align: center;
      }
    }

    .author-img {
      width: 155px;
      height: 155px;
      display: block;

    }

    .author-text {
      font-size: $font-size-lg;
      line-height: 40px;
    }

    .author-good {
      font-size: $font-size-xs;
      color: rgba(153, 153, 153, 1);
    }

    .reward-num {
      line-height: 40px;
      border-radius: 8px;
      margin: 32px 18px 0px 0px;
      color: rgba(51, 51, 51, 1);
      padding: 0 30px;
      font-size: 28px;
    }

    .reward-num:after {
      content: '元';
    }

    .rewardNumActive {
      color: #f20;
      border-color: #f20;
    }

    .isReward {
      margin-top: 62px;
      background: $themeColor;
      border: 1.1px solid $themeColor;
      color: #fff;
      border-radius: 8px;
      width: 90%;
      display: block;
      margin: 62px auto;
    }

    .reward-arouse {
      display: block;
      text-align: center;
      margin-top: 40px;
      font-size: 26px;
      color: rgba(102, 102, 102, 1);

    }

    .body {
      padding: 0 30px;
    }
  }
</style>
