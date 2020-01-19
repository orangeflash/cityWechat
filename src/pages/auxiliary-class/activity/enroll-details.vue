<template>
  <!--报名详情-->

  <div class="activity-enroll-details">
    <Header/>
    <dd-tips :tips="platform.name+'不会以任何理由来要求您点击任何链接进行退款操作，谨防诈骗！'"></dd-tips>
    <dd-steps
      v-bind="stepsConfig"
    ></dd-steps>
    <dd-article
      v-bind="orderInfo"
    >
      <div slot="attr" class="flex-bt flex-y-center col-9 mar-t">
        <span>{{orderInfo.typeName}}</span>
      </div>
    </dd-article>
    <van-cell-group>
      <van-cell size="large">
        <div slot="title" class="flex">
          <span class="fon-b" style="width: 1.5rem">人数：</span>
          <span class="fon-b">{{enrollInfo.num}}人</span>
        </div>
      </van-cell>
      <van-cell size="large">
        <div slot="title" class="flex">
          <span class="fon-b" style="width: 1.5rem">总金额：</span>
          <span class="fon-b col-t">￥{{enrollInfo.money}}</span>
        </div>
      </van-cell>
    </van-cell-group>

    <dd-form-chunk title="核销订单">
      <div slot="content" class="pad-t-10">
        <div class="write-off-qrcode" @click="goWriteOff">
          <div id="qrcode" ref="qrcode" style="margin: 0.3rem auto;width: 2rem;height: 2rem"></div>
        </div>
        <dd-store-data-list class="pad-t pad-b-20 pad-lr br-t-d" :height="60" :form="tips"/>
      </div>
    </dd-form-chunk>

    <dd-form-chunk title="出行人信息" class="mar-b-20">
      <div slot="content">
        <van-cell size="large" v-for="(item,key) in this.enrollInfo.info" :key="key">
          <div slot="title" class="flex">
            <span class="fon-b col-9" style="width: 1.5rem">{{item.name}}：</span>
            <span class="fon-b">{{item.value}}</span>
          </div>
        </van-cell>
      </div>
    </dd-form-chunk>
    <van-cell-group>
      <van-cell size="large">
        <div slot="title" class="flex">
          <span class="fon-b" style="width: 1.5rem">订单编号：  </span>
          <span class="fon-b">{{enrollInfo.outTradeNo}}</span>
        </div>
      </van-cell>
      <van-cell size="large">
        <div slot="title" class="flex">
          <span class="fon-b" style="width: 1.5rem">报名时间：  </span>
          <span class="fon-b">{{enrollInfo.createTime}}</span>
        </div>
      </van-cell>
    </van-cell-group>
    <dd-button
      class="mar-30"
      type="release"
      name="联系主办方"
      @click="callLink"
    ></dd-button>
  </div>

</template>

<script>

  import DdTips from '@/components/template/other/tips';
  import DdSteps from '@/components/template/other/steps';
  import DdArticle from '@/components/template/dd-article/three';
  import DdFormChunk from "@/components/template/dd-form/chunk";
  import DdStoreDataList from "@/components/template/dd-store/data-list";
  import DdButton from "@/components/template/button"
  import {Toast} from 'vant'

  import {mapActions, mapState} from 'vuex';
  import {hideLoading, showLoading, format} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {redirectPath} from "../../../project-config/base";

  export default {
    mixins: [utilMixins],
    components: {DdTips, DdSteps, DdArticle, DdFormChunk, DdStoreDataList, DdButton},
    data() {
      return {
        enrollInfo: {},
        stepsConfig: {
          active: 3,
          steps: ["填写信息", "等待付款", "报名成功"]
        },
        orderInfo: {},
        tips: []
      }
    },
    methods: {
      ...mapActions("activity", ["getEnrollInfo"]),
      callLink() {
        console.log("要打电话咯");
        location.href = `tel://${this.enrollInfo.linkTel}`
      },
      goWriteOff() {
        return false
        this.goPointPage({
          path: '/auxiliary/activity/writerOff',
          query: {
            activityId: this.enrollInfo.activityId,
            enrollId: this.$route.query.enrollId,
            validateId: this.user.id
          }
        })
      }
    },
    computed: {
      ...mapState({
        user: s => s.user
      })
    },
    async created() {

      const query = this.$route.query;

      if (query.enrollId) {
        showLoading();
        this.enrollInfo = await this.getEnrollInfo(query);


        this.orderInfo = {
          cover: this.getSingleImg(this.enrollInfo.showImgs[0].url),
          title: this.enrollInfo.name,
          time: format(this.enrollInfo.startTime * 1000) + " ~ " + format(this.enrollInfo.endTime * 1000),
          typeName: this.enrollInfo.typeName
        }

        this.enrollInfo.createTime = format(this.enrollInfo.payTime * 1000);

        this.tips = [
          {label: '核销码：' + this.enrollInfo.code, color: '#333'},
          {label: '核销订单数：' + this.enrollInfo.num, color: '#333'},
        ]

        const url = redirectPath + "/auxiliary/activity/writerOff?appId="
          + localStorage.projectAppId + "&enrollId=" + query.enrollId + "&activityId=" + this.enrollInfo.activityId + "&validateId=" + this.user.id

        this.getQRCode({
          dom: this.$refs.qrcode,
          url
        });
        hideLoading();
      } else {
        Toast.fail({
          message: '缺少报名订单id',
          duration: 1500
        });
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      }


    }
  }

</script>
