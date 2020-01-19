<template>
  <div id="PublishStatus">
    <!--这个头部是组件来的 S-->
    <Header :childrenTitle="$route.query.redId?'塞福利':'发布结果'"></Header>
    <!--这个头部是组件来的 E-->
    <div v-if="!$route.query.redId&&!$route.query.rewardId">
      <section class="l-top">
        <header class="c-topic">
          <van-icon class="success-icon" :color="$themeColor" name="checked"/>
          <em class="c-topic__title">{{this.postConfig.audit == 'open'?'发布成功,请等待审核':'发布成功'}}</em>
        </header>
        <figure class="c-feature-bar">
          <figcaption class="c-feature-bar__item" @click="goPointPage('/personal/myPublication')">管理信息</figcaption>
          <figcaption class="c-feature-bar__item" @click="goPointPage({path:'/postDetail',query:{postId}})">查看信息
          </figcaption>
          <figcaption class="c-feature-bar__item" @click="$popRoute">再发一条</figcaption>
          <figcaption class="c-feature-bar__item" @click="goPointPage({path:'/postDetail',query:{postId}})">分享信息
          </figcaption>
          <figcaption class="c-feature-bar__item" @click="goPointPage('/home')">首页</figcaption>
        </figure>
      </section>
      <section class="c-option-box" v-if="rewardType&&rewardType.type<4">
        <h3 class="legend">用悬赏让全民帮您完成任务，悬赏失败赏金可退</h3>
        <ul class="c-feature-list">
          <li class="c-feature-list__item--topic">
            <em>悬赏</em>
            <van-switch v-model="xsChecked" size="20px"/>
          </li>
          <div v-show="xsChecked">
            <li v-if="!v.hide" class="c-feature-list__item" v-for="(v,i) in xsOptions" :key="i">
              <em style="color:#3d3d3d">{{v.name}}</em>
              <van-stepper v-model="v.value" :max="i==0?5000:50" :min="i==0?100:1" :step="i==0?rewardType.plusMoney:1"/>
            </li>
            <li v-if="rewardType.type!=3" class="pad-tb fon-sm col-9">获赏条件:{{rewardType.condition}}</li>
            <div v-else>
              <div>
                <van-field
                  label="获赏条件"
                  :readonly=true
                />
              </div>
              <dd-form-textarea class="fon-b" v-model="hstj" height="120" style="padding-top: 0;"
                                placeholder="请输入要别人帮您解决什么样的问题，如每介绍一个客户并成交，即获得一笔赏金，任务要简单明了。"/>
            </div>
          </div>
        </ul>
      </section>
      <div v-if="!xsChecked">
        <section class="c-option-box" v-if="postConfig.top=='open'&&toppingOptions&&toppingOptions.length">
          <h3 class="legend">置顶信息提高10倍曝光率</h3>
          <van-radio-group v-model="chooseFeatureId">
            <ul class="c-feature-list">
              <li class="c-feature-list__item--topic">
                <em>置顶</em>
                <van-switch v-model="toppingChecked" size="20px"/>
              </li>
              <li v-show="toppingChecked" class="c-feature-list__item" v-for="item in toppingOptions" :key="item.id"
                  @click="chooseFeatureId = item.id">
                <em>{{item.body}}</em>
                <van-radio :name="item.id"/>
              </li>
            </ul>
          </van-radio-group>
        </section>
        <!--<section class="c-option-box" v-if="toppingOptions&&toppingOptions.length">-->
        <template v-if="redEnvelopesConfig.redEnvelopes == 'open'">
        <section class="c-option-box">
          <!--<h3 class="legend">塞福利（可提高阅读量和转发量哦）</h3>-->
          <van-radio-group v-model="chooseFeatureId">
            <ul class="c-feature-list">
              <li class="c-feature-list__item--topic">
                <em>塞福利（可提高阅读量和转发量哦）</em>
                <van-switch v-model="redEnvelopeChecked" size="20px"/>
              </li>
              <van-cell-group v-show="redEnvelopeChecked">
                <van-field v-model="moneyNum" type="number" placeholder="请输入福利金额" label="福利总金额"/>
                <van-field v-model="copiesNum" type="number" placeholder="分成几份 (至少一份)" label=" 分成几份"/>
              </van-cell-group>
            </ul>
          </van-radio-group>
        </section>
        <div class=" col-9 pad-lr pad-t" v-if="+redEnvelopesConfig.redMoney > 0">
          最低红包金额：￥{{(+redEnvelopesConfig.redMoney).toFixed(2)}}元
        </div>
        <em class="redChageTips"
            v-if="redEnvelopesConfig.redCharge == 'open'">红包手续费：{{
          (+redCharge).toFixed(2) }}元</em>
        </template>
        <footer class="c-submit" @click="payHandle">
          {{+getMoneyNum>0?`立即支付￥${getMoneyNum}`:'返回首页'}}
        </footer>
      </div>
      <div v-else>
        <AgreeAgreement
          :status="agreeAgreement"
          @choice="agreeAgreement = !agreeAgreement"
          :con="postConfig.rewardAgreement"
          name="悬赏规则"
        ></AgreeAgreement>
        <footer class="c-submit" @click="xsHandle" :style="{background:agreeAgreement?'':'#ddd'}">
          {{+getXsMoneyNum>0?`立即支付￥${getXsMoneyNum}`:'返回首页'}}
        </footer>
      </div>
    </div>
    <!--单独发红包-->
    <div class="sprea-by-money" v-else-if="redEnvelopesConfig.redEnvelopes == 'open'&&$route.query.redId">
      <section class="c-option-box" :class="{marginTop:$route.query.redId===1}">
        <!--<h3 class="legend">塞福利（可提高阅读量和转发量哦）</h3>-->
        <van-radio-group v-model="chooseFeatureId">
          <ul class="c-feature-list">
            <li class="c-feature-list__item--topic">
              <em>塞福利（可提高阅读量和转发量哦）</em>
              <van-switch v-model="redEnvelopeChecked" size="20px"/>
            </li>
            <van-cell-group v-show="redEnvelopeChecked">
              <van-field v-model="moneyNum" type="number" placeholder="请输入福利金额" label="福利总金额:"/>
              <van-field v-model="copiesNum" type="number" placeholder="分成几份 (至少一份)" label=" 分成几份:"/>
            </van-cell-group>
          </ul>
        </van-radio-group>
      </section>
      <div class=" col-9 pad-lr pad-t" v-if="+redEnvelopesConfig.redMoney > 0">
        最低红包金额：￥{{(+redEnvelopesConfig.redMoney).toFixed(2)}}元
      </div>
      <em class="redChageTips"
          v-if="redEnvelopesConfig.redCharge == 'open' && redEnvelopesConfig.redEnvelopes == 'open'">红包手续费：{{
        (+redCharge).toFixed(2) }}元</em>
      <footer class="c-submit" @click="payHandle">
        {{+getMoneyNum>0?`立即支付￥${getMoneyNum}`:'返回首页'}}
      </footer>
    </div>
    <!--单独发悬赏-->
    <div class="sprea-by-money" v-else-if="$route.query.rewardId">
      <section class="c-option-box" v-if="rewardType&&rewardType.type<4">
        <h3 class="legend">用悬赏让全民帮您完成任务，悬赏失败赏金可退</h3>
        <ul class="c-feature-list">
          <li class="c-feature-list__item--topic">
            <em>悬赏</em>
            <van-switch v-model="xsChecked" size="20px"/>
          </li>
          <div v-show="xsChecked">
            <li v-if="!v.hide" class="c-feature-list__item" v-for="(v,i) in xsOptions" :key="i">
              <em style="color:#3d3d3d">{{v.name}}</em>
              <van-stepper v-model="v.value" :max="i==0?5000:50" :min="i==0?100:1" :step="i==0?rewardType.plusMoney:1"/>
            </li>
            <li v-if="rewardType.type!=3" class="pad-tb fon-sm col-9">获赏条件:{{rewardType.condition}}</li>
            <div v-else>
              <div>
                <van-field
                  label="获赏条件"
                  :readonly=true
                />
              </div>
              <dd-form-textarea class="fon-b" v-model="hstj" height="120" style="padding-top: 0;"
                                placeholder="请输入要别人帮您解决什么样的问题，如每介绍一个客户并成交，即获得一笔赏金，任务要简单明了。"/>
            </div>
          </div>
        </ul>
      </section>
      <AgreeAgreement
        :status="agreeAgreement"
        @choice="agreeAgreement = !agreeAgreement"
        :con="postConfig.rewardAgreement"
        name="悬赏规则"
      ></AgreeAgreement>
      <footer class="c-submit" @click="xsHandle" :style="{background:agreeAgreement?'':'#ddd'}">
        {{+getXsMoneyNum>0?`立即支付￥${getXsMoneyNum}`:'返回首页'}}
      </footer>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import _ from 'lodash'
  import {hideLoading, showLoading, showDialog, showHandleStatusByFlag, showText} from "../../util";
  import {chooseWXPay} from "../../util/wechat-util";
  import {Field, Toast} from 'vant';
  import Header from "@/components/header";
  import AgreeAgreement from '@/components/template/agree-agreement'
  import DdFormTextarea from "@/components/template/dd-form/textarea"

  export default {
    components: {Header, AgreeAgreement, DdFormTextarea},
    name: "PublishStatus",
    data() {
      return {
        chooseFeatureId: null,       // 置顶类型id
        postId: 0,                // 帖子的id
        xsChecked: false,//悬赏开关
        toppingChecked: false,    // 是否置頂 - 默認false
        redEnvelopeChecked: this.$route.query.redId ? true : false,  // 是否有红包
        topMoney: 0,              // 置顶的金额
        moneyNum: 0,              // 红包的金额
        copiesNum: 0,             // 红包的数量
        totalNum: 0,              // 总数量
        redEnvelopesConfig: {
          redMoney: 0,
        },
        redCharge: 0,
        agreeAgreement: true,
        rewardType: null,
        xsOptions: [],
        hstj: '',
      }
    },
    methods: {
      ...mapActions("publication", ["createToppingOrder", "payToppingAction", "getRedEnvelopesConfig"]),
      ...mapActions("post", ["getToppingOptions"]),
      ...mapActions("yS", ["getRewardType", "saveReward"]),
      async xsHandle() {
        if (!this.agreeAgreement) return
        const needPay = this.getXsMoneyNum > 0
        if (needPay) {
          try {
            await showDialog("需要支付" + this.getXsMoneyNum + "元");
          } catch (e) {
            return;
          }
        }
        let params = {
          postId: this.postId,
          num: this.xsOptions[1].value,
          singleMoney: this.xsOptions[0].value,
          condition: this.hstj,
          userId: this.user.id
        }
        //console.log(params)
        //return
        showLoading()
        const res = await this.saveReward(params);
        showHandleStatusByFlag(res.code, '提交成功', res.msg)
        if (res.code) {
          if (needPay) {
            this.$router.push({
              name: 'cashier',
              params: {
                type: 43,
                param: {
                  rewardId: res.data
                },
                info: {
                  money: this.getXsMoneyNum,
                  type: "悬赏支付",
                  callLink: '/home',
                }
              }
            });
          } else {
            setTimeout(() => {
              this.goPointPage('/home')
            }, 1000)
          }
        }
      },
      async payHandle() {

        if (+this.getMoneyNum <= 0) return this.goPointPage({
          path: '/home'
        })

        // 如果没有置顶以及没有红包就返回首页
        if (!this.toppingChecked && !this.redEnvelopeChecked) {
          return this.goPointPage("/home")
        } else if (this.redEnvelopeChecked && this.moneyNum <= 0) {
          return Toast('请输入福利的金额');
        }
        if (this.redEnvelopeChecked && this.copiesNum < 1) { //判斷是否有福利,如果有的話,數量不能少於一分
          return Toast("请填写福利份数，最少1份")
        } else if (this.redEnvelopeChecked && ((+this.moneyNum) / this.copiesNum).toFixed(2) < 0.01
          || (+this.moneyNum).toFixed(2) / +this.copiesNum < 0.01) {//判斷每一份的金額是否少於一分錢
          return Toast("请填写正确的份数")
        } else if (this.redEnvelopeChecked && +this.moneyNum < +this.redEnvelopesConfig.redMoney) {
          return Toast("最低红包金额：￥" + (+this.redEnvelopesConfig.redMoney).toFixed(2) + '元');
        } else {
          showLoading("请求中...");
          const topOrder = await this.createToppingOrder({
            postId: this.postId,
            topMoney: this.toppingChecked ? +this.chooseTopOption.money : null,
            topDays: this.toppingChecked ? +this.chooseTopOption.days : null,
            redMoney: this.redEnvelopeChecked ? +this.moneyNum : null,
            redBagNum: this.redEnvelopeChecked ? +this.copiesNum : null,
            isRed: this.redEnvelopeChecked ? 1 : 0,
            topId: this.toppingChecked && !this.$route.query.redId ? this.chooseFeatureId : null,       //如果有置顶的话，就传选中的id;否则就null
            isTop: this.toppingChecked && !this.$route.query.redId ? 1 : null
          });
          if (!topOrder.data && topOrder.msg != 'success') {
            return Toast(topOrder.msg)
          }
          hideLoading();
          try {
            await showDialog("需要支付：" + this.totalNum + " 元")
            this.$router.push({
              name: 'cashier',
              params: {
                type: this.$route.query.redId ? 5 : 6,
                param: {
                  postId: this.postId,
                  money: this.totalNum,
                  redId: topOrder.red,
                  orderId: topOrder.data
                },
                info: {
                  money: this.totalNum,
                  type: this.$route.query.redId ? "添加福利红包" : "发布帖子",
                  notBalance: this.redEnvelopeChecked,
                  callLink: "/home"
                }
              }
            })
          } catch (e) {
          }
          return false;
        }
      },
    },
    computed: {
      ...mapState("post", {
        toppingOptions: state => state.toppingOptions
      }),
      ...mapState("common", {
        postConfig: state => state.postConfig
      }),
      chooseTopOption() {
        return _.find(this.toppingOptions, {id: this.chooseFeatureId}) || {};
      },
      getXsMoneyNum() {
        if (!this.xsOptions.length) return
        let moeny = 0;
        moeny = +(this.xsOptions[0].value * this.xsOptions[1].value).toFixed(2);
        return moeny
      },
      getMoneyNum() {
        //判断是否有置顶
        if (this.toppingChecked && this.chooseTopOption.money) {
          this.topMoney = +this.chooseTopOption.money
        } else if (this.redEnvelopeChecked > 0 && this.moneyNum > 0) {  // 判断是有红包的数量,并且金额是否有
          this.moneyNum = +this.moneyNum
        }
        if (!this.toppingChecked) { // 没有置顶就执行
          this.topMoney = 0
        }
        if (!this.redEnvelopeChecked) {  // 没有红包就执行
          this.moneyNum = 0
        }
        //获取红包数量的整数部分 不是红包的数量
        if (this.copiesNum.toString().includes('.')) {
          //this.copiesNum = this.copiesNum.toString().split('.')[0]
          this.copiesNum = parseInt(this.copiesNum)
        }
        if (this.redEnvelopesConfig.redCharge == 'open') {
          this.redCharge = +this.redEnvelopesConfig.charge / 100 * (+this.moneyNum);
        }
        // 总金额
        this.totalNum = (this.topMoney + (+this.moneyNum) + this.redCharge).toFixed(2);
        return this.totalNum
      },
    },
    async created() {
      this.postId = this.$route.query["postId"];
      this.getRewardType({postId: this.postId}).then(res => {
        this.rewardType = res
        if (res.type == 1) {
          this.xsOptions = [{
            name: '单人赏金',
            value: +res.downMoney,
          }, {
            name: '招聘人数',
            value: 1,
          }
          ]
        } else if (res.type == 2) {
          this.xsOptions = [{
            name: '悬赏金额',
            value: +res.downMoney,
          }, {
            name: '招聘人数',
            value: 1,
            hide: 1,
          }
          ]
        } else if (res.type == 3) {
          this.xsOptions = [{
            name: '单笔赏金',
            value: +res.downMoney,
          }, {
            name: '任务数量',
            value: 1,
          }
          ]
        }
      })
      await this.getToppingOptions({
        postId: this.postId
      });
      // 获取红包的配置参数
      let config = await this.getRedEnvelopesConfig();

      if (config) this.redEnvelopesConfig = config;

      const featureId = this.toppingOptions;
      if (featureId && featureId.length) this.chooseFeatureId = featureId[0].id;

      document.title = this.$route.query.redId ? '塞福利' : '发布结果'

      if (this.$route.query.redId && this.redEnvelopesConfig.redEnvelopes != 'open') {
        Toast({
          message: '红包功能暂未开启',
          duration: 1500
        });
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      }
    }
  }
</script>
<style lang="scss">
  @import "../../assets/common";

  #PublishStatus .van-cell {
    padding: 10px 0;
  }

  #PublishStatus .van-cell__title {
    flex: 6;
    font-size: 16px;
    @include t-overflow;
  }

  .redChageTips {
    color: #999;
    margin: 20px 30px;
    display: block;


  }

  .van-switch--on {
    background-color: $themeColor;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/common";

  #PublishStatus {
    overflow: hidden;
    min-height: 100vh;
    padding-bottom: 99px;
    background-image: radial-gradient(6000px 3000px at 50% 0, $themeColor 10%, transparent 0);

    .l-top {
      margin: 69px auto 16px auto;
      width: 94%;
      padding: 37px 0;
      background: rgba(255, 255, 255, 1);
      border-radius: 20px;

      .c-topic {
        @include flex-center;
        flex-direction: column;

        .c-topic__title {
          font-size: 36px;
          color: rgba(51, 51, 51, 1);
          margin-top: 30px;
        }

        .success-icon {
          font-size: 160px;
        }

        em {
          color: rgba(51, 51, 51, 1);
        }
      }

      .c-feature-bar {
        @include flex-center;
        margin: 35px auto 39px auto;

        .c-feature-bar__item {
          margin-top: 20px;
          flex-shrink: 0;
          display: inline-block;
          border: 1PX solid rgba(153, 153, 153, 1);
          border-radius: 8px;
          padding: 13px 15px;
          font-size: 24px;
          color: rgba(51, 51, 51, 1);

          &:not(:last-child) {
            margin-right: 14px;
          }
        }
      }
    }
  }

  .c-option-box {
    margin: 0 auto;
    width: 94%;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    margin-top: 20px;

    .legend {
      font-size: 30px;
      color: rgba(153, 153, 153, 1);
      padding: 31px;
      border-bottom: 1PX solid #f4f4f4;
    }

    .c-feature-list {
      padding: 0 32px;
      font-size: 30px;
      color: #3d3d3d;

      &__item {
        padding: 22px 0;
        @include flex-between;

        &:not(:last-child) {
          border-bottom: 1PX solid #f4f4f4;
        }

        &:first-child {
          border-bottom: 0;

          em {
            color: rgba(153, 153, 153, 1);
            font-weight: normal;
          }
        }

        &--topic {
          @extend .c-feature-list__item;
          color: #000;
          font-weight: 500;
        }
      }
    }
  }

  .c-submit {
    @include absoluteFull(fixed);
    top: auto;
    height: 88px;
    line-height: 88px;
    font-size: 34px;
    text-align: center;
    color: #fff;
    z-index: 99999;
    background: $themeColor;
  }

  .sprea-by-money {
    height: 100vh;
    background-color: #f4f4f4;
    padding-top: 5%;
    box-sizing: border-box;
  }
</style>
