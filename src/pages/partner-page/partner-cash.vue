<template>
  <div class="withdraw-box">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <header class="withdraw-index-header">
      <div class="left">
        <em class="usable-money">可提现金额￥{{hhrsj.surplusCost}}</em>
        <!--<em class="withdraw-amount">￥0.00</em>-->
        <div class="sun-box"><span class="symbol">￥</span><input type="Number" @input="getServiceCharge"
                                                                 placeholder="0.00" class="input-sum"/>
        </div>
      </div>
      <div class="right" @click="goPointPage({name:'PartnerCashlist'})">提现明细</div>
    </header>
    <article v-for="(item,index) in balanceGetType" :key="index">
      <label class="select-withdraw">
      <div class="select-left">
        <i class=" iconfont  wechat-icon" :class="item.icon"  :style="{color:item.color}"></i>
        <span class="label-tag">
                    <em class="channel">{{item.title}}</em>
                    <em class="prompt-text">{{item.label}}</em>
                </span>
      </div>
      <div class="select-right">
        <van-radio-group v-model="radio">
          <van-radio :name="item.id" :checked-color="$themeColor"/>
        </van-radio-group>
      </div>
      </label>
    </article>
    <div class="private-info">
      <van-cell-group>
        <div v-if="+radio===1">
          <van-field v-model="wxNumber" input-align="right" label="微信账号"
                     placeholder="请输入微信账号" clearable/>
        </div>
        <div v-if="+radio===3">
          <van-field v-model="bankCardId" type="number" input-align="right"
                     label="银行卡号" placeholder="请输入银行卡号" clearable/>
          <van-field v-model="bankCardInfo" input-align="right" label="支行信息"
                     placeholder="请输入支行信息" clearable/>
        </div>
        <div v-if="+radio===2">
          <van-field v-model="payNumber" type="number" input-align="right"
                     label="支付宝账号" placeholder="请输入支付宝账号" clearable/>
        </div>
        <van-field v-model="userName" input-align="right" label="姓名" placeholder="请输入收款人姓名" clearable/>
        <van-field v-model="phoneTel" type="number" input-align="right" label="联系方式" placeholder="请输入真实的联系方式"
                   clearable/>
      </van-cell-group>
    </div>
    <footer>
      <p class="isReade">
        <CheckBox :checked.sync="checked" class="checkbox"/>
        <span class="is-reade-must">我已阅读并同意<em class="must-know" @click="isShow = !isShow">《提现需知》</em> </span>
      </p>
      <button class="withdraw-btn"  @click="getMoney">确认提现</button>
      <p class="cost-legend">
        <em>详细说明 </em>
        <em>提现门槛为{{config.money}}元</em>
        <em> 提现手续费为{{config.procedures}}%</em>
        <em>本次提现将扣除手续费{{serviceCharge}}元</em>
        <em>本次提现实际到账金额为{{actualAmount}}元</em>
      </p>
    </footer>
    <agreement @hide="isShow = false" v-if="isShow" :con="config.notice"></agreement>
  </div>
</template>

<script>
  import CheckBox from '../../components/basic/check-box'
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {Toast} from "vant";
  import Agreement from "@/components/publication/agreement";
  import {showDialog, hideLoading, showLoading, showText, showHandleStatusByFlag} from "../../util";
  import Header from "@/components/header";
  export default {
    name: 'partnerCash',
    components: {CheckBox, Agreement,Header},
    data() {
      return {
        radio: 0,
        itemSum: 0,
        bankCardId: '',
        bankCardInfo: '',
        wxNumber: '',
        payNumber: '',
        userName: '',
        phoneTel: '',
        checked: false,
        hhrsj: {},
        config: {},
        choiceTypeNumber: 0,
        isShow: false,
        serviceCharge: 0,
        actualAmount: 0,
        handeing: false
      }
    },
    methods: {
      ...mapActions("personal", ["getUserInfoById"]),
      ...mapActions("partner", ["getPartnerconfig","getPartnerstatus"]),
      ...mapActions("partner/partnerEnter", ["getpartnerStatistics","postpartnerCash"]),
      async gethhrpz(){
        this.config=await this.getPartnerconfig()
        console.log(this.config)
      },
      async gethhrsj(){
        this.hhrsj=await this.getpartnerStatistics();
        console.log(this.hhrsj)
      },
      selectChannel() {
        return [{
          icon: 'icon-weixinzhifu4',
          title: '微信钱包',
          label: '申请通过后将自动打入您的微信零钱账户',
          color: "#5db271",
          id: 1
        }, {
          icon: 'icon-zhifubao',
          title: '支付宝余额',
          label: '申请通过后打入您的支付宝余额',
          color: '#00aaee',
          id: 2
        }, {
          icon: 'icon-iconfontjikediancanicon20',
          title: '银行卡',
          label: '申请通过后打入您的银行账户',
          color: '#eeaf1d',
          id: 3
        }]
      },
      getServiceCharge() {
        this.itemSum = document.querySelector('.input-sum').value;
        this.serviceCharge = (this.itemSum / 100 * this.config.procedures).toFixed(2);
        this.actualAmount = (this.itemSum - this.serviceCharge).toFixed(2);
      },
      async getMoney() {

        if (this.handeing) return false;
        const typeId = this.radio;
        this.itemSum = document.querySelector('.input-sum').value;
        if (Number(this.itemSum) <= 0) return showText('请输入提现金额');
        const config = {
          money: Number(this.itemSum).toFixed(2),
          mode: typeId,
        }

        if (+config.money > +this.hhrsj.surplusCost) return showText('已超出可提现金额范围');
        switch (typeId) {
          case 1:
            if (!this.wxNumber.trim()) return showText('请输入微信账号',1000);
            config.accountNumber = this.wxNumber;
            break;
          case 2:
            if (!this.payNumber.trim()) return showText('请输入支付宝账号');
            config.accountNumber = this.payNumber;
            break;
          case 3:
            if (!this.bankCardId.toString().trim()) return showText('请输入银行卡号')
            if (!this.bankCardInfo.toString().trim()) return showText('请输入支行信息');
            config.accountNumber = this.bankCardId;
            config.branch = this.bankCardInfo;
            break;
        }
        if (!this.userName.toString().trim()) return showText('请输入收款人姓名');
        if (!this.phoneTel.toString().trim()) return showText('请输入真实的联系方式');
        if (!this.checked) return showText('请阅读并同意提现须知');
        config.name = this.userName;
        config.linkTel = this.phoneTel;
        // console.log(config)
        // return
        showLoading();
        const res = await this.postpartnerCash(config);
        // hideLoading();
        if (res.code) {
          showHandleStatusByFlag([true,'提交成功'])
          setTimeout(() => {
            this.goPointPage({name:'PartnerHome'},true)
            // this.$router.go(-1);
          }, 1000)
        } else {
          showText(res.msg,2000,true);
        }
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      }),
      balanceGetType() {
        const arr = [];
        if (this.config.balanceGetType) {
          for (let p in this.config.balanceGetType) {
            arr.push(this.selectChannel()[p - 1])
          }
        }
        this.choiceTypeNumber = 3 - arr.length;
        if(arr.length)this.radio = arr[0].id
        return arr;
      }
    },
    async created() {
      this.gethhrsj();
      this.gethhrpz();
      // this.myInfo = await this.getUserInfoById();
      // this.config = await this.getPartnerconfig();
//      this.config[0]
    }
  }
</script>
<style scoped lang="scss">

  .input-sum::-webkit-input-placeholder { /* WebKit browsers */
    color: #fff;
  }

  .input-sum:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #fff;
  }

  .input-sum::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #fff;
  }

  .input-sum:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #fff;
  }

  .van-cell{
    padding: 10px 10px;
  }

  @import "../../assets/common";

  .withdraw-index-header {
    padding: 40px 30px;
    box-sizing: border-box;
    width: 100%;
    background-color: $themeColor;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    height: 200px;

    .left {
      display: flex;
      flex-direction: column;
      line-height: 40px;
      width: 500px;

      .usable-money {
        font-size: 28px;
        color: rgba(255, 255, 255, .8);
      }

      .withdraw-amount {
        font-size: 56px;
        color: rgba(255, 255, 255, .95);
        margin-top: 30px;
      }
    }

    .right {
      align-self: flex-start;
      line-height: 60px;
    }
  }

  .van-radio .van-icon-checked {
    color: $themeColor;
  }

  .sun-box {
    display: flex;
    align-items: center;
  }

  .symbol {
    color: rgba(255, 255, 255, 0.95);
    font-weight: 500;
    font-size: 56px;
    width: 40px;
    margin-right: 10px;
  }

  .input-sum {
    border: none;
    color: rgba(255, 255, 255, 0.95);
    font-size: 56px;
    background-color: $themeColor;
    outline: none;
    border: none;
    display: inline-block;
    float: left;
    width: 400px;
    line-height: 88px;
  }

  .input-sum:before {
    content: "￥";
  }

  .select-withdraw {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    margin-top: 18px;
    padding: 30px;

    .select-left {
      display: flex;

      .wechat-icon {
        font-size: 80px;
      }

      .label-tag {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin-left: 30px;

        .channel {
          font-size: 30px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }

        .prompt-text {
          margin-top: 15px;
          font-size: 24px;
          color: rgba(153, 153, 153, 1);
        }
      }
    }
  }

  .private-info {
    margin-top: 15px;
  }

  .isReade {
    padding: 30px;

    .checkbox {
      margin-right: 20px;
    }

    .is-reade-must {
      font-size: 26px;
      color: rgba(153, 153, 153, 1);
    }

    .must-know {
      color: #78C2F2;
    }
  }

  .withdraw-btn {
    display: block;
    width: 90%;
    height: 90px;
    margin: 0px auto;
    background: $themeColor;
    border-radius: 8px;
    color: #fff;
    font-size: 34px;
  }

  .cost-legend {
    margin: 30px;
    line-height: 40px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    font-size: 28px;
    color: rgba(153, 153, 153, 1);
  }

  .van-icon-check {
    color: $themeColor;
  }
</style>
