<template>
  <!--报名详情-->

  <div class="activity-enroll-details">
    <Header/>
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
      name="确认核销"
      @click="beginWriterOff"
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
  import {mapActions} from 'vuex';
  import {format, hideLoading, showDialog, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdTips, DdSteps, DdArticle, DdFormChunk, DdStoreDataList, DdButton},
    data() {
      return {
        enrollInfo: {},
        orderInfo: {},
        tips: []

      }
    },
    methods: {
      ...mapActions("activity", ["writerOffActivityOrder", "getEnrollInfo"]),
      /** 开始核销 */
      async beginWriterOff() {

        try {
          await showDialog("确认要核销该订单吗？");
          showLoading("正在核销中...")
          const res = await this.writerOffActivityOrder(this.$route.query);
          if (res.code == 1) {
            Toast.success({
              message: '核销成功',
              duration: 1500
            });
            setTimeout(() => {
              this.goPointPage("/auxiliary/activity")
            }, 1500)
          } else {
            Toast.fail({
              message: res.msg,
              duration: 1500
            })
          }
        } catch (e) {
          console.log("原来是操作失误啊")
        }
      }
    },
    computed: {},
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

        hideLoading();
      } else {
        Toast.fail({
          message: '缺少报名订单id',
          duration: 1500
        });
        setTimeout(() => {
          this.goPointPage({
            path: '/auxiliary/activity'
          })
        }, 1500)
      }
    }
  }

</script>
