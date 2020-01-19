<template>

  <div class="activity-enroll">
    <Header></Header>
    <dd-tips :tips="platform.name+'不会以任何理由来要求您点击任何链接进行退款操作，谨防诈骗！'"></dd-tips>
    <dd-steps
      v-bind="changeSteps"
    ></dd-steps>
    <div class="">
      <dd-form-chunk
        title="报名人信息"
      >
        <div class="pad-l pad-r bg-f4" slot="content">
          <div class="br-r-20 oh mar-b">
            <van-cell-group>
              <van-field
                v-model="randomKey[key]"
                v-for="(item,key) in activityInfo.info"
                :label="item"
                :placeholder="'请输入'+item"
                :key="key"
              />
            </van-cell-group>
          </div>
          <div class="br-r-20 oh mar-b">
            <van-cell-group>
              <van-cell title="报名人数" size="large" :label="'（每人限购'+activityInfo.limitNum+'张）'">
                <van-stepper
                  :max="+activityInfo.limitNum"
                  slot="right-icon"
                  :min="1"
                  v-model="params.num"/>
              </van-cell>
            </van-cell-group>
          </div>
          <div class="br-r-20 oh bg-f">
            <dd-article
              v-bind="orderInfo"
              class="br-b-dd"
            >
              <div slot="attr" class="flex-bt flex-y-center col-9 mar-t">
                <span>{{orderInfo.typeName}}</span>
              </div>
            </dd-article>
            <div class="dh flex-bt flex-y-center pad-l pad-r br-b-dd">
              <div class="fon-xl">金额</div>
              <div class="col-t fon-xll">{{activityInfo.currentPrice&&!isFree?'￥'+(activityInfo.currentPrice
                *params.num).toFixed(2) :
                '免费'}}
              </div>
            </div>
            <div class="dh flex-bt flex-y-center pad-l pad-r">
              <div class="fon-xl">活动说明</div>
            </div>
            <div class="col-9 base-pad" v-html="activityInfo.notice"></div>
          </div>
        </div>
      </dd-form-chunk>
      <agree-agreement
        :status="agreeAgreement"
        @choice="agreeAgreement = !agreeAgreement"
        :con="config.agreement"
        name="用户协议条款"
      ></agree-agreement>
      <dd-button
        class="mar-30"
        type="release"
        :name="isFree?'立即报名':'去支付'"
        @click="goPay"
      ></dd-button>
    </div>


  </div>

</template>

<script>

  import DdSteps from '@/components/template/other/steps';
  import DdTips from '@/components/template/other/tips';
  import DdFormChunk from "@/components/template/dd-form/chunk";
  import DdStoreOrder from '@/components/template/dd-store/order';
  import DdArticle from '@/components/template/dd-article/three';
  import DdButton from "@/components/template/button"
  import AgreeAgreement from '@/components/template/agree-agreement'

  import {mapActions, mapState} from "vuex";
  import {Toast} from 'vant'
  import {format, hideLoading, showDialog, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdSteps, DdTips, DdFormChunk, DdStoreOrder, DdArticle, DdButton, AgreeAgreement},
    data() {
      return {
        agreeAgreement: true,
        activityInfo: {},
        randomKey: [],
        isFree: false,
        config: {},
        params: {
          num: 1,
          info: [],
          activityId: null,
          money: 0,
        },
        stepsConfig: {
          active: 1,
          steps: ["填写信息", "等待付款", "报名成功"]
        },
        orderInfo: {}
      }
    },
    methods: {
      ...mapActions("activity", ["activityEnroll", "getActivityInfo", "getActivityConfig"]),
      judge() {
        this.params.info = [];
        for (let i = 0; i < this.randomKey.length; i++) {
          if (this.randomKey[i] && this.randomKey[i].trim()) {
            this.params.info.push({
              name: this.activityInfo.info[i],
              value: this.randomKey[i]
            })
          } else {
            return "请输入" + this.activityInfo.info[i];
          }
        }
        if (this.params.num <= 0) return "请选择购买数量";
        if (!this.agreeAgreement) return "请同意并遵守《用户协议条款》";
      },
      async goPay() {
        const result = this.judge()
        if (result) return Toast({
          message: result,
          duration: 1500
        });


        if (!this.isFree) {
          try {
            this.params.money = (this.activityInfo.currentPrice * this.params.num || 0).toFixed(2)
            await showDialog("需要支付￥" + (+this.params.money).toFixed(2) + "元");

          } catch (e) {
            return false;
          }
        }
        showLoading("报名中...")
        const res = await this.activityEnroll(this.params);

        if (res.code == 0) return Toast.fail({
          message: res.msg,
          duration: 1500
        })

        if (!this.isFree) {
          this.$router.push({
            name: 'cashier',
            params: {
              type: 31,
              param: {
                enrollId: res.data,
              },
              info: {
                money: this.params.money,
                type: "参加活动",
                callLink: "/auxiliary/activity"
              }
            }
          });
        } else {
          Toast.success({
            message: '报名成功',
            duration: 1500
          });
          setTimeout(() => {
            this.goPointPage("/auxiliary/activity/order")
          }, 1500)
        }


      }
    },
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
      changeSteps() {
        this.stepsConfig.active = this.judge() ? 1 : 2;
        return this.stepsConfig
      },
    },
    async created() {
      showLoading();
      const query = this.$route.query;
      if (query.activityId) {
        this.params.activityId = query.activityId;
        this.activityInfo = await this.getActivityInfo(query);

        if (this.activityInfo.enrollEndTime * 1000 <= new Date().getTime()) {
          try {
            await showDialog("报名时间已过");
          } catch (e) {

          }
          this.goPointPage("/auxiliary/activity")
        }

        this.randomKey = new Array(this.activityInfo.info.length);
        this.orderInfo = {
          cover: this.getSingleImg(this.activityInfo.showImgs[0].url),
          title: this.activityInfo.name,
          time: format(this.activityInfo.startTime * 1000) + ' ~ ' + format(this.activityInfo.endTime * 1000),
          typeName: this.activityInfo.typeName
        }
        this.isFree = !(this.activityInfo.currentPrice && +this.activityInfo.currentPrice > 0);
        this.isFree && this.stepsConfig.steps.splice(1, 1)

        this.getActivityConfig().then(result => {
          this.config = result;
        })

        hideLoading();
      } else {
        Toast.fail({
          message: '缺少活动id',
          duration: 1500,
        })
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      }

    }
  }


</script>


