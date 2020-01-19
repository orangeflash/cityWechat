<template>
  <div v-if="type==1" class="mar-b box-sha">
    <div class="flex-bt base-pad bor-b">
      <dd-layout-user
        :src="dataInfo.portrait"
        :size="0.85"
        :fillet="0.85"
        :desc="formatDateByTimeStamp(dataInfo.createdAt,'YYYY-MM-DD HH:mm')"
      >
        <div slot="icon" class="fon-b">{{dataInfo.userName}}</div>
      </dd-layout-user>
      <div v-if="isOwn" class="col-6">
        <div v-if="dataInfo.state==1" class="box-btn" @click="tzsj">通知商家</div>
        <div v-else-if="dataInfo.state==2||dataInfo.state==3" class="box-btn"
             @click="$emit('method','cksy',{...dataInfo,timeArr})"
             style="color: #058DFF;border-color: #058DFF">查看收益
        </div>
        <div v-else-if="dataInfo.state==4">
          <div v-if="!dataInfo.userAppealState" class="box-btn"
               style="color: #FF0000;border-color: #FF0000" @click="yhss">
            我要申诉
          </div>
          <span v-else class="col-9">申诉状态:{{states[dataInfo.userAppealState]}}</span>
        </div>
      </div>
    </div>
    <div class="flex-x-bt base-pad">
      <div v-if="dataInfo.state==1" class="fon-sm">
        <span class="col-9">等待处理:</span><span class="col-r">{{`${timeArr[0]}天${timeArr[1]}时${timeArr[2]}分`}}</span>
      </div>
      <div v-else-if="dataInfo.state==2||dataInfo.state==3" class="fon-sm">
        <div>
          <span class="col-9">处理结果:</span><span class="col-058DFF">应赏成功</span>
        </div>
        <div class="mar-t-20 col-9" v-if="dataInfo.state==2">
          <span>赏金保护期:</span><span>{{`${timeArr[0]}天${timeArr[1]}时${timeArr[2]}分`}}</span>
        </div>
      </div>
      <div v-else-if="dataInfo.state==4" class="fon-sm"><span class="col-9">处理结果:</span><span class="col-r">应赏失败</span>
      </div>
      <div v-if="isFtz" class="col-6 flex-y-center">
        <div v-if="dataInfo.state==1" class="box-btn mar-l-10" @click="$emit('method','glcl',dataInfo)">处理</div>
        <div v-else-if="dataInfo.state==2">
          <div v-if="!dataInfo.appealState" class="box-btn mar-l-10" @click="glss">申诉</div>
          <span v-else class="col-9">申诉状态:{{states[dataInfo.appealState]}}</span>
        </div>
        <div class="box-btn" @click="$emit('method','glck',dataInfo)">查看</div>
      </div>
    </div>
  </div>
  <div v-else-if="type==2" class="mar-b box-sha">
    <div class="flex-bt base-pad bor-b">
      <dd-layout-user
        :src="dataInfo.portrait"
        :size="0.85"
        :fillet="0.85"
        :desc="formatDateByTimeStamp(dataInfo.createdAt,'YYYY-MM-DD HH:mm')"
      >
        <div slot="icon" class="fon-b">{{dataInfo.userName}}</div>
      </dd-layout-user>
      <div v-if="isOwn" class="col-6">
        <div v-if="dataInfo.state==1" class="box-btn" @click="tzsj">通知商家</div>
        <div v-else-if="dataInfo.state==2||dataInfo.state==3" class="box-btn"
             @click="$emit('method','cksy',{...dataInfo,timeArr})"
             style="color: #058DFF;border-color: #058DFF">查看收益
        </div>
        <div v-else-if="dataInfo.state==4">
          <div v-if="!dataInfo.userAppealState" class="box-btn"
               style="color: #FF0000;border-color: #FF0000" @click="yhss">
            我要申诉
          </div>
          <span v-else class="col-9">申诉状态:{{states[dataInfo.userAppealState]}}</span>
        </div>
      </div>
    </div>
    <div class="flex-x-bt base-pad">
      <div v-if="dataInfo.state==1" class="fon-sm">
        <span class="col-9">等待处理:</span><span class="col-r">{{`${timeArr[0]}天${timeArr[1]}时${timeArr[2]}分`}}</span>
      </div>
      <div v-else-if="dataInfo.state==2||dataInfo.state==3" class="fon-sm">
        <div>
          <span class="col-9">处理结果:</span><span class="col-058DFF">应赏成功</span>
        </div>
      </div>
      <div v-else-if="dataInfo.state==4" class="fon-sm"><span class="col-9">处理结果:</span><span class="col-r">应赏失败</span>
      </div>
      <div v-if="isFtz" class="col-6 flex-y-center">
        <div v-if="dataInfo.state==1" class="box-btn mar-l-10" @click="$emit('method','glcl',dataInfo)">处理</div>
        <div class="box-btn" @click="$emit('method','glck',dataInfo)">查看</div>
      </div>
    </div>
  </div>
  <div v-else-if="type==3" class="mar-b box-sha">
    <div class="flex-bt base-pad bor-b">
      <dd-layout-user
        :src="dataInfo.portrait"
        :size="0.85"
        :fillet="0.85"
        :desc="formatDateByTimeStamp(dataInfo.createdAt,'YYYY-MM-DD HH:mm')"
      >
        <div slot="icon" class="fon-b">{{dataInfo.userName}}</div>
      </dd-layout-user>
      <div v-if="isOwn" class="col-6">
        <div v-if="dataInfo.state==1" class="box-btn" @click="tzsj">通知商家</div>
        <div v-else-if="dataInfo.state==2||dataInfo.state==3" class="box-btn"
             @click="$emit('method','cksy',{...dataInfo,timeArr})"
             style="color: #058DFF;border-color: #058DFF">查看收益
        </div>
        <div v-else-if="dataInfo.state==4">
          <div v-if="!dataInfo.userAppealState" class="box-btn"
               style="color: #FF0000;border-color: #FF0000" @click="yhss">
            我要申诉
          </div>
          <span v-else class="col-9">申诉状态:{{states[dataInfo.userAppealState]}}</span>
        </div>
      </div>
    </div>
    <div class="flex-x-bt base-pad">
      <div v-if="dataInfo.state==1" class="fon-sm">
        <span class="col-9">等待处理:</span><span class="col-r">{{`${timeArr[0]}天${timeArr[1]}时${timeArr[2]}分`}}</span>
      </div>
      <div v-else-if="dataInfo.state==2||dataInfo.state==3" class="fon-sm">
        <div>
          <span class="col-9">处理结果:</span><span class="col-058DFF">应赏成功</span>
        </div>
      </div>
      <div v-else-if="dataInfo.state==4" class="fon-sm"><span class="col-9">处理结果:</span><span class="col-r">应赏失败</span>
      </div>
      <div v-if="isFtz" class="col-6 flex-y-center">
        <div v-if="dataInfo.state==1" class="box-btn mar-l-10" @click="$emit('method','glcl',dataInfo)">处理</div>
        <div class="box-btn" @click="$emit('method','glck',dataInfo)">查看</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import DdLayoutUser from "../../../components/layout/dd-layout-user";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {PlaceholderAvatar, PlaceholderImg, backendPath, publishUrl} from "../../../project-config/base";
  import {countDownTime, showDialog, showHandleStatusByFlag} from "../../../util";

  export default {
    name: "vip-package",
    components: {DdLayoutUser},
    props: ['dataInfo', 'type', 'rewardInfo', 'postuid'],
    data() {
      return {
        PlaceholderAvatar,
        timeArr: ['00', '00', '00', '00'],
        states: ['', '待确认', '已确认', '已拒绝'],
      }
    },
    methods: {
      ...mapActions("yS", ["rewardCall"]),
      yhss() {
        this.goPointPage({path: '/auxiliary/ys/appealYs?type=1&id=' + this.dataInfo.id})
      },
      glss() {
        this.goPointPage({path: '/auxiliary/ys/appealYs?type=2&id=' + this.dataInfo.id})
      },
      async tzsj() {
        try {
          await showDialog("您确定通知商家吗？一天之内最多通知3次");
          const res = await this.rewardCall({
            rewardInfoId: this.dataInfo.id
          })
          showHandleStatusByFlag(res.code, res.msg, res.msg,)
          //res.code && this.$parent.getReward(true)
        } catch (e) {
        }
      },
    },
    computed: {
      isOwn() {
        return this.user.id == this.dataInfo.userId && this.rewardInfo == 1
      },
      isFtz() {
        //console.log('isFtz', this.dataInfo, this.postuid)
        return this.user.id == this.postuid && this.rewardInfo == 1
      },
    },
    watch: {
      dataInfo: {
        handler(val, oldVal) {
          if (this.type == 1) {
            if (val.state == 1) {
              let EndTime = parseInt(this.dataInfo.createdAt) + 7 * 86400, NowTime = this.getTimeStamp(new Date());
              this.timeArr = countDownTime(EndTime - NowTime)
              this.dsq = setInterval(() => {
                NowTime += 60
                if (EndTime - NowTime <= 0) {
                  clearInterval(this.dsq)
                }
                this.timeArr = countDownTime(EndTime - NowTime)
                //console.log('倒计时',this.timeArr,EndTime-NowTime)
              }, 60000)
            } else if (val.state == 2) {
              let EndTime = parseInt(this.dataInfo.confirmAt) + 30 * 86400, NowTime = this.getTimeStamp(new Date());
              this.timeArr = countDownTime(EndTime - NowTime)
              this.dsq = setInterval(() => {
                NowTime += 60
                if (EndTime - NowTime <= 0) {
                  clearInterval(this.dsq)
                }
                this.timeArr = countDownTime(EndTime - NowTime)
                //console.log('倒计时',this.timeArr,EndTime-NowTime)
              }, 60000)
            } else {
              clearInterval(this.dsq)
            }
          } else if (this.type == 2) {
            if (val.state == 1) {
              let EndTime = parseInt(this.dataInfo.createdAt) + 30 * 86400, NowTime = this.getTimeStamp(new Date());
              this.timeArr = countDownTime(EndTime - NowTime)
              this.dsq = setInterval(() => {
                NowTime += 60
                if (EndTime - NowTime <= 0) {
                  clearInterval(this.dsq)
                }
                this.timeArr = countDownTime(EndTime - NowTime)
                //console.log('倒计时',this.timeArr,EndTime-NowTime)
              }, 60000)
            } else {
              clearInterval(this.dsq)
            }
          } else if (this.type == 3) {
            if (val.state == 1) {
              let EndTime = parseInt(this.dataInfo.createdAt) + 30 * 86400, NowTime = this.getTimeStamp(new Date());
              //console.log('倒计时', EndTime, NowTime)
              this.timeArr = countDownTime(EndTime - NowTime)
              this.dsq = setInterval(() => {
                NowTime += 60
                if (EndTime - NowTime <= 0) {
                  clearInterval(this.dsq)
                }
                this.timeArr = countDownTime(EndTime - NowTime)
                //console.log('倒计时',this.timeArr,EndTime-NowTime)
              }, 60000)
            } else {
              clearInterval(this.dsq)
            }
          }
          //console.log('dataInfo', val)
        },
        immediate: true
      },
    },
    mixins: [utilMixins],
    destroyed() {
      clearInterval(this.dsq)
    }
  }
</script>

<style scoped lang="scss">

</style>
