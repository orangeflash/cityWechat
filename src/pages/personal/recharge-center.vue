<template>
  <div id="RechargeCenter">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <header class="c-info">
      <em class="c-info__value">{{userInfo.balance||'0.00'}}</em>
      <em class="c-info__legend">账户余额</em>
    </header>
    <section class="c-content">
      <em class="c-content__title">选择充值金额</em>
      <ul class="c-money-list">
        <li :class="hasModifier('c-money-list__item','active',chooseIndex===index)" @click="chooseIndex = index"
            v-for="(item,index) in rechargeConfig.site">
          <em class="money-text">￥{{item.money}}</em>
          <em class="integral-text">赠送{{item.give}}积分</em>
        </li>
        <li @click="chooseIndex = customIndex"
            :class="hasModifier('c-money-list__item','active',chooseIndex===customIndex)">
          <input type="number" v-model="inputVal" @blur="temporaryRepair" maxlength="5" class="c-money-list__input"
                 placeholder="其他金额"></li>
      </ul>
    </section>
    <AgreeAgreement
      :status="agreeAgreement"
      @choice="agreeAgreement = !agreeAgreement"
      :con="rechargeConfig.content"
      name="充值需知"
    ></AgreeAgreement>
    <figure class="c-footer">
      <figcaption class="c-footer__submit">
        <button :class="hasModifier('c-footer__btn','disabled',!checked)" @click="checked&&rechargeHandle()">确认充值
        </button>
      </figcaption>
    </figure>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import CustomRadio from "../../components/basic/custom-radio";
  import CheckBox from "../../components/basic/check-box";
  import AgreeAgreement from '@/components/template/agree-agreement'
  import {hideLoading, showDialog, showLoading, showText} from "../../util";
  import {chooseWXPay} from "../../util/wechat-util";
  import Header from "@/components/header";
  export default {
    name: "RechargeCenter",
    components: {CheckBox, CustomRadio,Header,AgreeAgreement},
    data() {
      return {
        offOn:false,
        checked: true,
        agreeAgreement: true,
        chooseIndex: null,
        customIndex: 99999,
        inputVal: null,
        userInfo: {}
      }
    },
    methods: {
      ...mapActions("personal", ["getUserInfoById"]),
      ...mapActions("personal/rechargeCenter", ["getRechargeConfig", "payRechargeAction"]),
      ...mapActions("common", ['getPayConfig']),
      async initData() {
        showLoading();
        this.getRechargeConfig();
        this.userInfo = await this.getUserInfoById(this.user.id);
        hideLoading();
      },
      async rechargeHandle() {

        if(!this.offOn)return showDialog('充值功能已关闭');

        if (this.chooseIndex === null) return showDialog("请先选择充值数目", "提示", false);
        const siteArr = this.rechargeConfig.site;
        let money = 0;
        if (this.chooseIndex === this.customIndex) {
          if (!this.inputVal) {
            return showDialog("请先选择充值数目", "提示", false);
          }
          money = this.inputVal;
        } else {
          money = siteArr[this.chooseIndex].money;
        }

        if(this.minRecharge > money)return showDialog('最低充值金额：'+this.minRecharge+'元')

        showLoading();
        this.$router.push({
          name: 'cashier',
          params: {
            type: 4,
            param :{money},
            info:{
              money:money,
              type:"充值金额"
            }
          }
        })
        hideLoading();
        return false;

        // const payConfig = await this.payRechargeAction({
        //   money
        // });
        // chooseWXPay(payConfig, () => {
        //   this.initData();
        // });

      }
    },
    computed: {
      ...mapState({
        user: s => s.user
      }),
      ...mapState("personal/rechargeCenter", {
        rechargeConfig: s => s.rechargeConfig
      })
    },
    async created() {
      this.getPayConfig().then(result=>{
        this.offOn = result.balanceRecharge == 'yes';
        this.minRecharge = +result.minRecharge || 0;
      })
      this.initData();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #RechargeCenter {
    .c-info {
      height: 337px;
      background-color: $themeColor;
      @include flex-center;
      flex-direction: column;
      &__value {
        font-size: 80px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        position: relative;
        margin-left: 6px;
        &:before{
          content: "￥";
          display: block;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translate(-100%,-50%);
        }
      }
      &__legend {
        font-size: 28px;
        color: rgba(255, 255, 255, 1);
        margin-top: 26px;
        display: inline-block;
        position: relative;
      }
    }
    .c-content {
      margin-top: 20px;
      padding: 0 20px;
      padding-bottom: 30px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      &__title {
        padding: 30px 0 10px 0;
        font-size: 30px;
        color: #666;
      }
      .c-money-list {
        @include alignCenter;
        flex-wrap: wrap;
        &__item {
          margin: 25px 15px 0px;
          flex-shrink: 0;
          border: 1Px solid #ccc;
          border-radius: 12px;
          overflow: hidden;
          height: 100px;
          width: 180px;
          padding: 0 10px;
          @include flex-center;
          flex-direction: column;
          .money-text {
            font-size: 28px;
            color: #666;
          }
          .integral-text {
            margin-top: 6px;
            text-indent: .3em;
            color: #999;
          }
          &--active {
            border-color: $themeColor;
          }
          &:not(:last-child) {
            /*margin-right: 20px;*/
          }
        }
        &__input {
          border: 0;
          display: inline-block;
          width: 120px;
          font-size: 28px;
          line-height: 1.2;
          text-align: center;
        }
      }
    }
    .c-footer {
      padding: 20px 22px;
      &__tip {
        @include alignCenter;
        font-size: 26px;
        color: #666;
      }
      &__text {
        margin-left: 20px;
      }
      &__submit {
        margin-top: 30px;
        width: 100%;
      }
      &__btn {
        width: 100%;
        height: 80px;
        border-radius: 10px;
        color: #fff;
        font-size: 32px;
        background-color: $themeColor;
        &--disabled {
          background-color: #ccc;
        }
      }
    }
    .c-cover-view {
      width: 100%;
      height: 100%;
      background-color: #fff;
      overflow-x: hidden;
      overflow-y: auto;
      padding-bottom: 130px;
      box-sizing: border-box;
      &__title {
        padding-top: 30px;
        font-size: 32px;
        @include flex-center;
        font-weight: bold;
      }
      &__content {
        margin-top: 30px;
        font-size: 26px;
        padding: 0 30px;
      }
      .c-cover-footer {
        @include absoluteFull;
        top: auto;
        height: 130px;
        padding: 0 30px;
        background-color: #fff;
        @include flex-center;
        box-shadow: 0 -1px 3px #f4f4f4;
        &__btn {
          flex: 1;
          border-radius: 6px;
          height: 80px;
          font-size: 26px;
          background-color: $themeColor;
          color: #fff;
          @include flex-center;
        }
      }
    }
  }
</style>
