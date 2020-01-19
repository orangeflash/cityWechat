<template>
  <!--收银台 微信支付的地方 -->
  <div id="cashier">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <div class="cashier-top"></div>
    <div class="cashier-content">
      <div class="cashier-content-title">
        <div class="cashier-tips">
          <h1>
            需支付：
            <span>￥{{(+info.money || 0).toFixed(2)}}</span>
          </h1>
          <h1 v-if="canIntegralPay">或 <span
            class="col-t">{{(+info.money || 0).toFixed(2) * config.integralProportion }}</span>积分</h1>
          <em></em>
          <em></em>
          <span>{{info.type}}</span>
          <em></em>
          <em></em>
        </div>
      </div>
      <div class="choice-pay-list">
        <div v-if="canBalancePay">
          <div class="choice-pay-type balance " @click="choiceType('balance')">
            <!--暂不需要余额支付 -->
            <div class="select-left">
              <img class="icon" :src="wallet">
              <div class="pay-info">
                <span class="label-tag">余额支付 </span>
                <p>当前可用余额(￥{{userInfo.balance || "0.00"}})</p>
              </div>
            </div>
            <van-radio-group v-model="radio" for="balance">
              <van-radio name="balance" id="balance" :checked-color="$themeColor"/>
            </van-radio-group>
          </div>
        </div>
        <div class="choice-pay-type" @click="choiceType('wechat')">
          <div class="select-left">
            <img class="icon" :src="wechat">
            <div class="pay-info">
              <span class="label-tag">微信支付</span>
              <p>更加方便，快捷</p>
            </div>
          </div>
          <van-radio-group v-model="radio">
            <van-radio name="wechat" :checked-color="$themeColor"/>
          </van-radio-group>
        </div>
        <div class="choice-pay-type" @click="choiceType('integral')" v-if="canIntegralPay">
          <div class="select-left">
            <img class="icon" :src="integral">
            <div class="pay-info">
              <span class="label-tag">积分支付</span>
              <p>当前可用积分({{userInfo.integral || "0.00"}})</p>
            </div>
          </div>
          <van-radio-group v-model="radio">
            <van-radio name="integral" :checked-color="$themeColor"/>
          </van-radio-group>
        </div>
      </div>
    </div>
    <div class="pay-btn-area">
      <button :disabled="disabled" class="give-me-money" @click="beginPay">立即支付</button>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import wallet from "@/assets/img/cashier/wallet.png";
  import wechat from "@/assets/img/cashier/wechat.png";
  import integral from "@/assets/img/cashier/integral.png";
  import {chooseWXPay, goPointPage} from "../../util/wechat-util";
  import {Toast} from "vant";
  import {hideLoading, showDialog} from "../../util";
  import Header from "@/components/header";
  import {isDev, isH5} from "../../project-config/base";

  export default {
    name: "Cashier",
    components: {Header},
    data() {
      return {
        wallet,
        integral,
        wechat,
        radio: "wechat",
        // radio: isH5() ? 'balance' : "wechat",
        type: "",
        param: {},
        userInfo: {},
        callBack: null, //支付成功的回调函数
        callLink: null, //是否有返回的地址，没有的话就是返回上一级页面
        info: {},
        moneyEnough: false, //余额是否足够
        disabled: false,
        config: {
          balancePay: 'no',
          integralPay: 'no',
        }
      };
    },
    methods: {
      ...mapActions("common", ['getPayConfig']),
      ...mapActions("balancePay", ['balanceInfoRleasePay', 'balanceInfoRefreshPay', 'balanceInfoTopAndRedPay',
        "balanceSotreEnterPay", "balanceSotreRenewPay", "balanceRentReleasePay", "balanceSuperCardPay", "balanceVipJoinPay", "balanceRentTopPay", "balanceRentRefreshPay",
        "balanceSuperCardTopPay", "balanceCouponReceivePay", "balanceFreeCarRleasePay", "balanceFreeCarTopPay", "balanceFreeCarRefreshPay", "balanceBondPay",
        "balanceExchangePay", "balanceHuntEnterPay", "balanceJobPay", "balanceJobTopPay", "balanceJobRefreshPay", "balanceSotrePay", "balanceActivityPay",
        "balanceRushPay", "balanceAssemlePay", "balanceBargainPay", "balanceLookTelPay", "balancePartnerPay", "balanceYellowPresentationPay", "balanceYellowPay", "balanceInformationRewardPay",
        "balancePartnerUpgradePay", "balanceCityLoveTop", "balanceReward", "balanceXx", "balanceXxVip"
      ]),
      ...mapActions("wxPay", [
        "infoRewardPay", "payRechargeAction", "PayPostRefreshAction", "getUserInfoById", "payToppingAction", "postPayAction", "payBusinessEnterAction", "payYellowEnterAction",
        "renewYellowEnterAction", "payPresentation", "payCallAction", "isCanCallAction", "payDeposit", "payIntegralExchange", "payPartnerEnterAction", "payReleaseFreeRide",
        "payFreeRideLookPhone", "payFreeRideTop", "payHuntEnter", "payJobEnter", "payJobHuntLookPhone", "payHousingDealLookTel", "payHousingDealRelase", "payHousingDealTop",
        "payHousingDealRefresh", "payJobHuntRefresh", "payJobHuntTop", "payMallOrder", "payCardOrder", "payEnrollActivity", "payCardTop", "payCardRenew", "payHousingDealReleaseSale",
        "payVip", "payReceiveCoupon", "payAssemble", "payRushBuy", "renewStore", "payBargain", "payPartnerUpgrade", 'payCityLoveTop', "payReward", "payXx", "payXxVip"
      ]),
      ...mapActions("integralPay", ["integralPayPostRelease"]),
      async beginPay() {
        if (!this.moneyEnough && this.radio === "balance")
          if (this.userInfo.balance < this.info.money) {
            return Toast.fail("余额不足");
          }
        this.disabled = true;
        const isWxPay = (this.radio === "wechat"),
        // const isWxPay = (this.radio === "wechat" && !isH5()),
          isIntegralPay = (this.radio === "integral")

        let config = null,
          toastTips = null;
        switch (this.type) {
          case 1: //刷新帖子
            config = isWxPay ? await this.PayPostRefreshAction(this.param) : await this.balanceInfoRefreshPay(this.param);
            toastTips = "刷新成功";
            break;
          case 2: //置顶帖子
            config = isWxPay ? await this.payToppingAction(this.param) : await this.balanceInfoTopAndRedPay(this.param)
            toastTips = "置顶成功";
            break;
          case 3: //打赏
            config = isWxPay ? await this.infoRewardPay(this.param) : await this.balanceInformationRewardPay(this.param);
            toastTips = "谢谢您的打赏，我会继续努力的^_^";
            break;
          case 4: //充值
            if (!isWxPay) {
              this.disabled = false;
              return Toast.fail({
                message: '不可使用余额进行充值'
              })
            }
            config = await this.payRechargeAction(this.param);
            toastTips = "充值成功";
            break;
          case 5: //塞红包
            config = isWxPay ? await this.payToppingAction(this.param) : await this.balanceInfoTopAndRedPay(this.param);
            toastTips = "红包添加成功";
            break;
          case 6: //发布帖子后的置顶和塞红包
            config = isWxPay ? await this.payToppingAction(this.param) : await this.balanceInfoTopAndRedPay(this.param);
            // toastTips = "福利添加成功";
            break;
          case 7: //发布帖子
            config = isWxPay ? await this.postPayAction(this.param) : isIntegralPay ? await this.integralPayPostRelease(this.param) : await this.balanceInfoRleasePay(this.param)
            toastTips = "发布成功";
            break;
          case 8:
            config = isWxPay ? await this.payBusinessEnterAction(this.param) : await this.balanceSotreEnterPay(this.param);
            toastTips = "入驻成功";
            break;
          case 9: //电话付费
            config = isWxPay ? await this.payCallAction(this.param) : await this.balanceLookTelPay(this.param);
            toastTips = "支付成功";
            break;
          case 10: // 缴纳保证金
            config = isWxPay ? await this.payDeposit(this.param) : await this.balanceBondPay(this.param);
            toastTips = "保证金缴纳成功";
            break;
          case 11: // 积分兑换支付
            config = isWxPay ? await this.payIntegralExchange(this.param) : await this.balanceExchangePay(this.param);
            break;
          case 12: // 黄页入驻
            config = isWxPay ? await this.payYellowEnterAction(this.param) : await this.balanceYellowPay(this.param);
            toastTips = "黄页发布成功";
            break;
          case 13: // 黄页续费
            config = isWxPay ? await this.renewYellowEnterAction(this.param) : await this.balanceSotreRenewPay(this.param);
            toastTips = "黄页续费成功";
            break;
          case 14: // 合伙人支付
            config = isWxPay ? await this.payPartnerEnterAction(this.param) : await this.balancePartnerPay(this.param);
            break;
          case 15: // 黄页认领
            config = isWxPay ? await this.payPresentation(this.param) : await this.balanceYellowPresentationPay(this.param);
            toastTips = "黄页认领成功";
            break;
          case 16:  // 顺风车发布
            config = isWxPay ? await this.payReleaseFreeRide(this.param) : await this.balanceFreeCarRleasePay(this.param);
            toastTips = "顺风车发布成功";
            break;
          case 17:  // 顺风车查看电话
            config = isWxPay ? await this.payFreeRideLookPhone(this.param) : await this.balanceLookTelPay(this.param);
            break;
          case 18:  // 顺风车置顶
            config = isWxPay ? await this.payFreeRideTop(this.param) : await this.balanceFreeCarTopPay(this.param);
            toastTips = "已置顶";
            break;
          case 19:  //顺风车刷新
            config = isWxPay ? await this.payFreeRideRefresh(this.param) : await this.balanceFreeCarRefreshPay(this.param);
            toastTips = "已刷新";
            break;
          case 20:  //招聘发布
            config = isWxPay ? await this.payHuntEnter(this.param) : await this.balanceHuntEnterPay(this.param);
            toastTips = "招聘发布成功";
            break;
          case 21:
            config = isWxPay ? await this.payJobEnter(this.param) : await this.balanceJobPay(this.param);
            toastTips = "求职发布成功";
            break;
          case 22:    // 租房发布
            config = isWxPay ? await this.payHousingDealRelase(this.param) : await this.balanceRentReleasePay(this.param);
            toastTips = "发布成功";
            break;
          case 23:    //租房查看电话
            config = isWxPay ? await this.payCallAction(this.param) : await this.balanceLookTelPay(this.param);
            break;
          case 24:    //租房置顶
            config = isWxPay ? await this.payHousingDealTop(this.param) : await this.balanceRentTopPay(this.param);
            break;
          case 25:    // 租房刷新
            config = isWxPay ? await this.payHousingDealRefresh(this.param) : await this.balanceRentRefreshPay(this.param);
            break;
          case 26:    //简历查看电话
            config = isWxPay ? await this.payJobHuntLookPhone(this.param) : await this.balanceLookTelPay(this.param);
            break;
          case 27:    //招聘刷新
            config = isWxPay ? await this.payJobHuntRefresh(this.param) : await this.balanceJobRefreshPay(this.param);
            break;
          case 28:    //招聘置顶
            config = isWxPay ? await this.payJobHuntTop(this.param) : await this.balanceJobTopPay(this.param);
            break;
          case 29:    //商城单个上商品下单
            config = isWxPay ? await this.payMallOrder(this.param) : await this.balanceSotrePay(this.param);
            break;
          case 30:    //名片支付
            config = isWxPay ? await this.payCardOrder(this.param) : await this.balanceSuperCardPay(this.param);
            break;
          case 31:    //参加活动
            config = isWxPay ? await this.payEnrollActivity(this.param) : await this.balanceActivityPay(this.param);
            break;
          case 32:    //超级名片置顶
            config = isWxPay ? await this.payCardTop(this.param) : await this.balanceSuperCardTopPay(this.param);
            break;
          case 33:    //名片续费
            config = isWxPay ? await this.payCardRenew(this.param) : await this.balanceSotreRenewPay(this.param);
            break;
          case 34:    //房屋出售发布支付
            config = isWxPay ? await this.payHousingDealReleaseSale(this.param) : await this.balanceRentReleasePay(this.param);
            break;
          case 35:    //会员支付
            config = isWxPay ? await this.payVip(this.param) : await this.balanceVipJoinPay(this.param);
            break;
          case 36:    //领取优惠卷
            config = isWxPay ? await this.payReceiveCoupon(this.param) : await this.balanceCouponReceivePay(this.param);
            break;
          case 37:    //拼团支付
            config = isWxPay ? await this.payAssemble(this.param) : await this.balanceAssemlePay(this.param);
            break;
          case 38:    //抢购支付
            config = isWxPay ? await this.payRushBuy(this.param) : await this.balanceRushPay(this.param);
            break;
          case 39:    //商家续费支付
            config = isWxPay ? await this.renewStore(this.param) : await this.balanceSotreRenewPay(this.param);
            break;
          case 40:    //砍价购买
            config = isWxPay ? await this.payBargain(this.param) : await this.balanceBargainPay(this.param);
            break;
          case 41:    //升级合伙人
            config = isWxPay ? await this.payPartnerUpgrade(this.param) : await this.balancePartnerUpgradePay(this.param);
            break;
          case 42:    //交友置顶
            config = isWxPay ? await this.payCityLoveTop(this.param) : await this.balanceCityLoveTop(this.param);
            break;
          case 43:    //悬赏支付
            config = isWxPay ? await this.payReward(this.param) : await this.balanceReward(this.param);
            break;
          case 44:    //信息定制支付
            config = isWxPay ? await this.payXx(this.param) : await this.balanceXx(this.param);
            break;
          case 45:    //信息定制会员支付
            config = isWxPay ? await this.payXxVip(this.param) : await this.balanceXxVip(this.param);
            break;
        }
        const _vueObj = this;

        //  本地测试电话付费
        // if (_vueObj.isCall && isDev) {
        //   console.log('是查看电话的')
        //   _vueObj.isCanCallAction(_vueObj.isCall);
        //   _vueObj.$router.go(-1);
        //   return
        // }
        if (isWxPay) {
          if(!isH5()){
            // console.log('微信公众号支付')
            // return
          if (config && config.code != 0 && config.data) {
            // 关于微信的作用域的原因，将this的这个变量重新赋值
            await chooseWXPay(config.data, () => {
              // 电话付费，支付成功后，设置一全局一次性变量值
              if (_vueObj.type === 9 || _vueObj.isCall) {
                _vueObj.isCanCallAction(_vueObj.isCall);
              }
              Toast.success({
                message: toastTips || "支付成功",
                duration: 1500
              });
              //返回上一页
              setTimeout(function () {
                if (_vueObj.callBack) {
                  _vueObj.callBack();
                }
                if (_vueObj.callLink) {
                  _vueObj.goPointPage({
                    obj: _vueObj,
                    path: _vueObj.callLink
                  });
                } else {
                  _vueObj.$router.go(-1);
                }
              }, 2000);
            });
            /** 让用户可以继续支付 */
            this.disabled = false;
          } else {
            Toast.fail({
              message: config.msg || "异常信息",
              duration: 1000
            });
            setTimeout(function () {
              _vueObj.$router.go(-1);
            }, 2000);
          }
          }else {
            if (config && config.code != 0 && config.data) {
              location.href = config.data.mweb_url
              try {
                await showDialog("已完成支付？", "请确认微信支付是否已完成",true,'已完成','未完成');
              } catch (e) {
              }
              if (_vueObj.callBack) {
                _vueObj.callBack();
              }
              if (_vueObj.callLink) {
                _vueObj.goPointPage({
                  obj: _vueObj,
                  path: _vueObj.callLink
                });
              } else {
                _vueObj.$router.go(-1);
              }
            } else {
              Toast.fail({
                message: config.msg || "异常信息",
                duration: 1000
              });
              setTimeout(function () {
                _vueObj.$router.go(-1);
              }, 2000);
            }
            // console.log('h5支付')
          }
        } else {
          if (config.code == 1) {
            if (_vueObj.type === 9 || _vueObj.isCall) {
              _vueObj.isCanCallAction(_vueObj.isCall);
            }
            Toast.success({
              message: toastTips || "支付成功",
              duration: 1500
            });
            //返回上一页
            setTimeout(function () {
              if (_vueObj.callBack) {
                _vueObj.callBack();
              }
              if (_vueObj.callLink) {
                _vueObj.goPointPage({
                  obj: _vueObj,
                  path: _vueObj.callLink
                });
              } else {
                _vueObj.$router.go(-1);
              }
            }, 2000);
          } else {
            Toast.fail({
              message: config.msg || '支付失败',
              duration: 1500
            })
            this.disabled = false;
          }
        }


      },
      async getUserInfo() {
        this.userInfo = await this.getUserInfoById(
          this.$store.state.user.id
        );
        this.userInfo = this.userInfo.data;
        if (+this.userInfo.balance < +this.info.money) {
          this.moneyEnough = false;
        } else {
          this.moneyEnough = true;
        }

      },
      choiceType(type) {
        this.radio = type;
        this.disabled = false;
        if (
          type === "balance" &&
          +this.userInfo.balance < +this.info.money
        ) {
          Toast.fail("余额不足");
          this.moneyEnough = false;
        } else if (type === "integral" &&
          +this.userInfo.integral < (+this.info.money || 0).toFixed(2) * this.config.integralProportion) {
          Toast.fail("积分不足");
          this.moneyEnough = false;
        } else {
          this.moneyEnough = true;
        }
      },
    },
    computed: {
      isH5,
      canBalancePay() {
        return this.config.balancePay != 'no' && this.type != 4 && !this.info.notBalance
      },
      canIntegralPay() {
        return this.config.integralPay != 'no' && this.type == 7
      }
    },
    async created() {
      hideLoading();

      const bool = await this.checkBindTel({callBack: true})
      if (!bool) return

      // 重置页面的高度
      this.temporaryRepair();

      this.config = await this.getPayConfig()

      console.log("this.$route.matched", this.$route.matched)
      this.param = this.$route.params.param; //支付参数
      this.type = this.$route.params.type;
      this.info = this.$route.params.info || {}; //支付
      this.callBack = this.$route.params.callBack;
      this.callLink = this.info.callLink;
      /***
       //这个是判断不是电话付费，并且是多次付费的，值为true
       //返回页面的时候可以
       ...mapState("wxPay", {
            // 是否允许拨打电话，该变量值是在wxPay里面设置的
            isCanCall: state => state.isCanCall
          }),
       */
      this.isCall = this.info.isCall;
      if (!+this.info.money) {
        Toast.fail("非法金额");
        setTimeout(() => {
          return this.$router.go(-1);
        }, 2000);
      }
      this.getUserInfo();
    }
  };
</script>


<style scoped lang="scss">
  @import "../../assets/common.scss";

  #cashier {
    .cashier-top {
      height: 140px;
      background: $themeColor;
    }

    .cashier-content {
      width: 630px;

      background: #fff;
      padding: 0 30px;
      margin: 0 auto;
      margin-top: -90px;
      border-radius: 10px;
      box-shadow: 0px 0px 18px 0px rgba(221, 221, 221, 0.96);

      .cashier-content-title {
        border-bottom: 4px dashed #ddd;
        padding: 60px 0;
        text-align: center;

        h1 {
          margin-bottom: 50px;
          font-size: 28px;

          span {
            font-size: 36px;
            font-weight: bold;
            color: #ff4830;
          }
        }

        .cashier-tips {
          color: #999;

          em {
            width: 12px;
            height: 12px;
            background: #ffcc1b;
            display: inline-block;
            margin: 0 16px;
            transform: rotateZ(45deg);
          }
        }
      }

      .choice-pay-list {
        padding: 60px 0 0;

        .choice-pay-type {
          padding: 40px 0 90px;
          display: flex;
          height: 48px;
          align-items: center;
          position: relative;
          z-index: 1;

          em {
            position: absolute;
            right: 0;
            color: #999;
          }

          .select-left {
            display: flex;
            align-items: center;

            .icon-weixinzhifu4 {
              color: #5db271;
              font-size: 56px;
              margin-right: 20px;
            }

            .icon {
              height: 104px;
              width: 104px;
              margin-right: 26px;
            }

            .pay-info {
              span.label-tag {
                font-size: 32px;
                color: #333;
              }

              p {
                color: #999;
                font-size: 26px;
                margin-top: 24px;
              }
            }
          }

          .van-radio {
            position: absolute;
            right: 0;
            top: 18px;
            width: 30px;
            height: 30px;

            span.van-radio__input {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .pay-btn-area {
      margin-top: 90px;
      text-align: center;

      button {
        background: $themeColor;
        color: #fff;
        font-size: 34px;
        width: 600px;
        height: 100px;
        border-radius: 50px;
        box-shadow: 0 10px 40px $themeColor;
      }
    }
  }
</style>
