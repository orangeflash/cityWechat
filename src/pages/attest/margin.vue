<template>
  <div class="margin">
    <AttestHeader v-bind="defaultData"/>
    <article class="margin-body">
      <header class="is-to-pay">
        <em class="pay-num">￥{{bondMoney?bondMoney:"0.00"}}</em>
        <em class="success" v-if="bondInfo">已缴纳保证金</em>
        <em class="status" v-else>未缴纳</em>

      </header>
      <ul class="problem-list">
        <li class="problem-item">
          <!--<p class="title">-->
          <!--<i class="iconfont icon-wenti question-icon"></i>-->
          <!--<em class="text">保证金是什么？</em>-->
          <!--</p>-->
          <p class="term" v-html="MarginSetting.bondExplain">
          </p>
        </li>
      </ul>
      <aside class="consent-code">
        <check-box :checked.sync="checked" class="checkbox"/>
        <em class="desc">阅读并同意以上</em>
        <em class="doc" @click="show=!show">《保证金协议》</em>
      </aside>
    </article>
    <van-button type="primary" size="large" class="now-to-pay" @click="moneyOperate">{{
      bondInfo?+bondInfo.status == 1 || +bondInfo.status == 4?"退还保证金":"押金退还中":'立即缴纳' }}
    </van-button>
    <van-actionsheet v-model="payShow" :actions="actions" cancel-text="取消" @select="onSelect" @cancel="onCancel"/>
    <!--<van-dialog v-model="show" :before-close="beforeClose">-->
    <!--<p class="warn-title"><i class="iconfont icon-gantanhao warn"></i> <em>缴纳保证金未满1天</em></p>-->
    <!--<em class="warn-body">保证金缴纳满1天后可申请退还</em>-->
    <!--</van-dialog>-->
    <van-dialog v-model="returnShow" :before-close="beforeClose">
      <p class="warn-title"><i class="iconfont icon-wanchenggouxuan2 warn-text"> </i> <em>退还申请成功</em></p>
      <em class="warn-body">保证金将在7个工作日内退还</em>
    </van-dialog>
    <van-popup v-model="show" class="popupPact" position="right">
      <p class="pactBody" v-html="MarginSetting.bondComment"></p>
      <div class="cancel" @click="show=!show">
        <span class="cancel-text">
          我已阅读并同意此协议
        </span>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import AttestHeader from "../../components/attest/attest-header"
  import CheckBox from "../../components/basic/check-box";
  import {Button, Actionsheet, Dialog, Toast} from 'vant';
  import {mapActions, mapState} from "vuex"
  import {showDialog, showLoading, hideLoading} from "../../util";

  export default {
    name: "attestMargin",
    components: {AttestHeader, CheckBox},
    data() {
      return {
        payShow: false,
        checked: true,
        show: false,
        bondMoney: null,
        bondInfo: {},
        actions: [
          {
            name: "请选择缴纳金规格",
            disabled: true,
            className: "tag-title"
          }
          // {
          //   name: '个人基本保证金',
          //   subname:"50元",
          //   className:"selectItem",
          // },{
          //   name: '商家信誉保证金 ',
          //   subname:"500元",
          //   className:"selectItem",
          // },
        ],
        MarginSetting: {},
        show: false,
        returnShow: false,
        params: {
          userId: null,     // 用户id || 商家id
          money: null,     //金额
          type: null,      //1个人2商家
        }
      }
    },
    methods: {
      ...mapActions("attest", ["getAttestByPost", 'downOrder', 'lookBondInfo', 'refundrBond']),
      async onSelect(item) {
        try {
          if (+item.money) {
            await showDialog("需要支付：" + item.subname);
            this.params.money = item.money;
            showLoading();
            const res = await this.downOrder(this.params)
            hideLoading();
            if (+res) {
              this.$router.push({
                name: 'cashier',
                params: {
                  type: 10,
                  param: {
                    bondId: +res
                  },
                  info: {
                    money: item.money,
                    type: item.name,
                    callLink: "/attestIndex?type=" + this.$route.query.type
                  }
                }
              });
            }
          } else {
            Toast.fail({
              message: "金额有误",
              duration: 1500
            })
          }
        } catch (e) {
          console.log("老板，" + item.money + "元都不愿给我，" + item.name + "这件事，我很难帮你办啊！");
        }
      },
      onCancel() {
      },
      async moneyOperate() {

        if (+this.bondInfo.status === 2) return Toast({
          message: "押金退还中",
          duration: 1500
        })

        if (!this.checked) return Toast({
          message: '请阅读并同意保证金协议',
          duration: 1500
        })

        // 退还保证金
        if (this.bondInfo) {
          try {
            await showDialog("确认要退还保证金吗？");
            const res = await this.refundrBond({
              id: this.bondInfo.id
            });
            if (+res.code === 1) {
              Toast.success({
                message: "申请成功",
                duration: 1000
              })
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000)
            } else {
              Toast({
                message: res.msg,
                duration: 1000
              })
            }
          } catch (e) {
            console.log('老板手误了')
          }

          return false;
        }
        this.payShow = !this.payShow

        // if (+this.MarginSetting.companyMoney === 0) {
        //   this.payShow = !this.payShow
        // } else if (+this.MarginSetting.companyMoney > 0) {
        //   Dialog.confirm({
        //     title: '是否确认退还保证金',
        //     message: '保证金退还后可再次缴纳',
        //     confirmButtonText: "取消",
        //     cancelButtonText: '确认',
        //   }).catch(() => {
        //     if (parseInt(this.MarginSetting.minDay) < 5) {
        //       this.show = !this.show
        //     } else {
        //       this.returnShow = !this.returnShow;
        //     }
        //   });
        // } else if (parseInt(this.MarginSetting.minDay) < 5) {
        //   this.show = !this.show
        // }
      },
      beforeClose(action, done) {
        if (action === 'confirm') {
          done();
        }
      },
      async getMoneySetting() {
        this.MarginSetting = await this.getAttestByPost();
        if (+this.MarginSetting.bondOpen == 2) {
          Toast.fail({
            message: '保证金功能暂未开启',
            duration: 1500
          })
          setTimeout(() => {
            this.$router.go(-1);
          }, 1500)
          return false;
        }
        ;
        this.bondInfo = await this.lookBondInfo({
          id: this.params.userId,
          type: this.params.type
        });
        if (this.$route.query.type == 'personal') {

          this.bondMoney = this.MarginSetting.personalMoney;
          this.actions.push({
            name: '个人基本保证金',
            subname: (this.MarginSetting.personalMoney || "0.00") + "元",
            className: "selectItem",
            type: 1,
            money: this.MarginSetting.personalMoney
          })
        } else if (this.$route.query.type == "store") {
          this.bondMoney = this.MarginSetting.companyMoney;
          this.actions.push({
            name: '商家信誉保证金',
            subname: (this.MarginSetting.companyMoney || "0.00") + "元",
            className: "selectItem",
            type: 2,
            money: this.MarginSetting.companyMoney
          })
        }
      }
    },
    created() {
      if (this.$route.query.id) {
        this.params.userId = this.$route.query.id;
      } else {
        Toast.fail("缺少id参数");
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500)
      }
      if (this.$route.query.type) {
        this.params.type = this.$route.query.type == 'personal' ? 1 : 2;
      } else {
        Toast.fail("缺少type参数");
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500)
      }


      this.getMoneySetting();
    },
    computed: {
      ...mapState({
        user: state => state.user
      }),
      defaultData() {
        return {
          backgroundColor: "rgba(38,153,129,1)",
          title: "诚信保证金",
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "../../assets/theme";


  .tag-title {
    color: #fff;
    background-color: $themeColor;

    &:active {
      color: #fff;
      background-color: $themeColor;
    }
  }

  .selectItem {
    color: $themeColor;
    font-size: 24px;
  }


  .consent-code {
    display: flex;
    align-items: center;
    height: 106px;
    padding: 0 30px;

    .checkbox {
      margin-right: 10px;
      margin-top: -5px;
    }

    .desc {
      font-size: 0.24rem;
      color: #999999;
    }

    .doc {
      color: $themeColor;
    }
  }

</style>
<style scoped lang="scss">
  @import "../../assets/theme";

  .margin {
    .is-to-pay {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      padding: 30px;
      background-color: rgba(241, 255, 252, 1);
    }

    .pay-num {
      font-size: $font-size-lg;
      font-family: PingFang-SC-Bold;
      font-weight: bold;
      color: rgba(38, 153, 129, 1);
    }

    .status {
      font-size: $font-size-sm;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
    }

    .problem-list {
      padding: 40px 30px 50px 30px;
      background-color: #fff;
    }

    .problem-item {
      padding-bottom: 50px;

      .title {
        margin-bottom: 40px;

        .question-icon {
          color: rgba(38, 153, 129, 1);
        }

        .text {
          margin-left: 30px;
          color: #333333;
          font-size: $font-size-lg;
        }
      }

      .term {
        font-size: 26px;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 42px;
      }
    }

    .margin-body {
      margin-bottom: 60px;
    }

    .now-to-pay {
      position: fixed;
      bottom: 0px;
      background-color: #269981;
      border: none;
    }
  }

  .warn-title {
    font-size: $font-size-xxl;
    margin: 50px 0px;
  }

  .warn-body {
    display: block;
    font-size: $font-size-xs;
    margin-bottom: 50px;
    color: #666;
  }

  .warn {
    color: #f65a56
  }

  .warn-text {
    color: #5db271
  }

  .success {
    color: red;
  }

  .popupPact {
    width: 100%;
    height: 100%;
    background-color: #f9f9f9;
  }

  .pactBody {
    line-height: 40px;
    margin-top: 20px;
    overflow-Y: scroll;
    min-height: 90%;
    padding: 0 30px;
    height: calc(100vh - 150px);
  }

  .cancel {
    width: 100%;
    height: 100px;
    text-align: center;
    color: #fff;
    position: absolute;
    background-color: #fff;

    .cancel-text {
      display: inline-block;
      text-align: center;
      height: 60px;
      line-height: 60px;
      padding: 5px 0px;
      width: 80%;
      font-size: 28px;
      background-color: $themeColor;
      border-radius: 10px;
      position: absolute;
      left: 50%;
      bottom: 50%;
      transform: translate(-50%, 50%);
    }
  }
</style>
