<template>

  <div class="">
    <div class="flex-bt dh flex-y-center br-b-F0 pad-lr">
      <div class="fon-wb col-2 fon-xxl">应赏</div>
    </div>
    <div v-if="comments.length>0">
      <ys-cell :reward-info="rewardInfo.isCz" :postuid="postuid" :type="type" @method="ysMethod"
               v-for="(v,i) in comments" :data-info="v"
               :key="i"></ys-cell>
    </div>
    <not-data pad="10px 0" v-else/>
    <div v-if="rewardInfo.refundInfo" class="base-pad col-9">
      <div class="pad-tb">退款状态:
        <span>{{rstates[+rewardInfo.refundInfo.state]}}</span>
      </div>
      <div v-if="rewardInfo.refundInfo.state==3&&rewardInfo.refundInfo.note" class="pad-tb">退款回复:
        <span>{{rewardInfo.refundInfo.note}}</span>
      </div>
      <div class="pad-tb">处理时间:
        <span>{{formatDateByTimeStamp(rewardInfo.refundInfo.createdAt,"YYYY-MM-DD HH:mm")}}</span>
      </div>
    </div>
    <div class="flex-row flex-ad base-pad2 fon-xl">
      <div @click="fxzq" class="pad-17-28-15 col-f br-r-40" style="background: #FE31AA;box-shadow: 0 5px 5px #FD8DCF">
        分享赚钱
      </div>
      <div v-if="!isFtz&&rewardInfo.isReward==1" @click="yszq" class="pad-17-28-15 col-f br-r-40"
           style="background: #39A7FE;box-shadow: 0 5px 5px #95CEFE">
        {{type==1?'应聘':'应赏'}}赚钱
      </div>
      <div v-if="isFtz&&rewardInfo.isTk==1&&rewardInfo.isCz==1" @click="fqtk" class="pad-17-28-15 br-t col-t br-r-40">
        发起退款
      </div>
    </div>
    <!--固定旁边-->
    <div @click="fxzq" class="ys-btn" style="background: #FE31AA">分享赚钱</div>
    <div v-if="!isFtz&&rewardInfo.isReward==1" @click="yszq" class="ys-btn" style="background: #39A7FE;top: 5.4rem;">
      {{type==1?'应聘':'应赏'}}赚钱
    </div>
    <van-dialog
      style="width: 86%;border-radius: 20px"
      v-model="fxShow"
      :confirm-button-color="$themeColor"
      close-on-click-overlay
    >
      <div class="pad-30 bg-t col-f fon-xl">分享赚钱</div>
      <div style="padding: 50px 30px">
        <div class="lineH-40 t-l">点击右上角（...）可以分享到朋友圈、微信好友、微信群等。</div>
      </div>
    </van-dialog>
    <van-dialog
      style="width: 86%;border-radius: 20px"
      v-model="cksyShow"
      :confirm-button-color="$themeColor"
    >
      <div class="pad-30 bg-t col-f fon-xl">查看收益</div>
      <div style="padding: 60px 20px;">
        <div class="fon-xxl">赏金收益:{{ysData.money}}</div>
        <div v-if="ysData.timeArr&&ysData.timeArr[2]!=0" class="mar-t-20">此收益将在<em
          class="col-t">{{ysData.timeArr[0]}}</em>天<em
          class="col-t">{{ysData.timeArr[1]}}</em>时<em class="col-t">{{ysData.timeArr[2]}}</em>分自动转入账户余额
        </div>
      </div>
    </van-dialog>
    <van-dialog
      style="width: 86%;border-radius: 20px"
      v-model="glclShow"
      :show-cancel-button="true"
      cancel-button-text="应赏成功"
      confirm-button-text="应赏失败"
      :cancel-button-color="$themeColor"
      confirm-button-color="#000"
      @confirm="glcl(false)"
      @cancel="glcl(true)"
      close-on-click-overlay
    >
      <div class="pad-30 bg-t col-f fon-xl">处理</div>
      <div class="pad-lr t-l lineH-40 col-9">
        <div class="pad-30 t-c col-3">处理须知</div>
        <div class="mar-b">1.请在处理期限内给予应赏者处理结果，超过时间系统自动按悬赏成功处理。</div>
        <div class="mar-b">2.招聘悬赏确认成功后，会有30天的锁定期，在此期间您的赏金将由平台托管，若发生中途离职，请通过申诉,平台将不支付赏金，超过时间，赏金自动转入分享和应赏者账户余额，效易结束。</div>
        <div class="mar-b">3.其它悬赏一经确认成功，赏金实时分配给应赏和分享者。</div>
      </div>
    </van-dialog>
    <van-dialog
      style="width: 86%;border-radius: 20px"
      v-model="glckShow"
      :confirm-button-color="$themeColor"
    >
      <div v-if="ysInfo" class="pad-30 t-l lineH-40 fon-sm">
        <div class="flex-y-center">
          <dd-layout-img
            :src="ysInfo.portrait"
            :style="{borderRadius:'50%'}" :width="1.3" :height="1.3"/>
          <div class="mar-l-30">
            <div>{{ysInfo.userName}}</div>
            <div>{{formatDateByTimeStamp(ysInfo.createdAt,"YYYY-MM-DD")}}</div>
            <div>{{ysInfo.address}}</div>
          </div>
        </div>
        <div class="flex-x-bt pad-tb">
          <div class="bg-t sexcon flex-row">
            <div class="flex-1 flex-center br-r-30" :class="ysInfo.sex==2?'bg-f':'col-f'">
              <span class="iconfont icon-nvxianxing sexitem"></span></div>
            <div class="flex-1 flex-center br-r-30" :class="ysInfo.sex==1?'bg-f':'col-f'">
              <span class="iconfont icon-nanxianxing sexitem"></span>
            </div>
          </div>
          <div @click="callTel(ysInfo.userTel)" class="box-btn-f" style="padding: 0.05rem 0.2rem">{{ysInfo.userTel}}
          </div>
        </div>
        <div style="background: #E7E7E7">
          <div class="pad-30">
            {{ysInfo.content}}
          </div>
          <div v-if="ysInfo.media.length>3" class="pad-30 col-9 t-c">点击图片查看大图</div>
          <div class="base-pad flex-row over-x-s">
            <div class="mar-r" v-for="(v,i) in getMediaList(ysInfo.media).img" :key="i">
              <dd-layout-img
                @click="previewImage(v,getMediaList(ysInfo.media).img)"
                :src="v"
                :style="{borderRadius:'5px'}" :width="1.6" :height="2.3"/>
            </div>
          </div>
        </div>
      </div>
    </van-dialog>
  </div>

</template>


<script>

  import DdLayoutUser from "../../../components/layout/dd-layout-user";
  import {computedDate, hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  import {mapActions} from 'vuex'
  import DdLayoutImg from "../../layout/dd-layout-img";
  import YsCell from "./ys-cell";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    props: {
      comments: {
        type: Array,
        default: () => []
      },
      rewardInfo: Object,//悬赏信息
      postuid: String,
      type: String,//悬赏类型1招聘2转让3其他
      title: {
        type: String,
        default: '评论'
      },
    },
    components: {DdLayoutImg, DdLayoutUser, YsCell},
    data() {
      return {
        fxShow: false,
        cksyShow: false,
        glckShow: false,
        glclShow: false,
        ysInfo: null,
        ysData: {},
        rstates: ['', '待处理', '退款成功', '退款拒绝'],
      }
    },
    mixins: [utilMixins],
    computed: {
      isFtz() {
        return this.user.id == this.postuid
      },
    },
    methods: {
      ...mapActions("yS", ["rewardSuccess", "rewardFail", "getUserRewardInfo", "rewardRefund"]),
      async glcl(e) {
        try {
          await showDialog("您确定" + (e ? "应赏成功" : "应赏失败") + "吗？");
          const res = e ? await this.rewardSuccess({
            id: this.ysData.id
          }) : await this.rewardFail({
            id: this.ysData.id
          });
          showHandleStatusByFlag(res.code, res.msg, res.msg,)
          res.code && this.$parent.getReward(true)
        } catch (e) {
        }
      },
      async ysMethod(t, d) {
        this.ysData = d
        switch (t) {
          case 'cksy':
            this.cksyShow = true
            break;
          case 'glck':
            showLoading()
            this.ysInfo = await this.getUserRewardInfo({id: d.id})
            hideLoading()
            this.glckShow = true
            break;
          case 'glcl':
            this.glclShow = true
            break;
        }
        console.log(t, d)
      },
      async fxzq() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return;
        this.fxShow = true
        //this.$emit('fxzq')
      },
      async yszq() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return;
        console.log(this.rewardInfo)
        this.goPointPage({path: '/auxiliary/ys/releaseYs?rewardId=' + this.rewardInfo.rewardId})
      },
      async fqtk() {
        try {
          await showDialog("您确定发起退款吗？发起后，此悬赏将冻结");
          const res = await this.rewardRefund({
            rewardId: this.rewardInfo.rewardId
          })
          if (res.code) {
            showHandleStatusByFlag([true, '提交成功'])
            this.$parent.getReward(true)
          } else {
            showText(res.msg, 2000, true);
          }
        } catch (e) {
        }
      },
    }
  }

</script>
<style scoped lang="scss">
  .box-sha {
    box-shadow: 0px 2px 5px 2px rgba(221, 221, 221, 1)
  }

  .sexcon {
    width: 120px;
    height: 53px;
    border-radius: 30px;
  }

  .ys-btn {
    position: fixed;
    top: 4.7rem;
    right: 0;
    opacity: 0.7;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 20px 10px 14px 20px;
    justify-content: center;
    z-index: 1999;
  }
</style>
