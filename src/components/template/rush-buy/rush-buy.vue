<template>


  <dd-layout-div
    :pad="[40,30]"
    class="bg-f mar-b-20"
    @click="goPointPage({path:'/auxiliary/rushBuy/rushBuyDetails',query:{id:getInfo.id}})"
  >
    <dd-layout-div class="posi-r">
      <dd-layout-div class=" col-f posi-a t0 l0 z-i" :mar="[0,0,0,-11]" :fillet="[8,30,0,30]"
                     bg="linear-gradient(90deg, #f93245 0%, #ed4e6e 100%)"
                     :pad="[18,25,15]">距离结束 <span class="fon-wb col-f">{{timeArr[0]}}天{{timeArr[1]}}时{{timeArr[2]}}分{{timeArr[3]}}秒</span>
      </dd-layout-div>
      <dd-layout-img :src="getInfo.cover" :height="4" :width="6.9" :fillet="0.3"/>
    </dd-layout-div>
    <dd-layout-div class="fon-b fon-wb hide-e mar-t pad-t-5">{{getInfo.title}}</dd-layout-div>
    <dd-layout-div class="flex-bt flex-y-center">
      <dd-layout-div class="flex-g-1">
        <dd-layout-div :mar="[30,0,10]">
          <span class="fon-xxll fon-wb col-price mar-r">￥{{getInfo.rushPrice}}</span> <span class="t-d-l col-9 fon-xss">￥{{getInfo.originalPrice}}</span>
        </dd-layout-div>
        <dd-layout-div class="flex flex-y-center">
          <dd-layout-div class="iconfont icon-huo1 col-f flex-center fon-xs posi-r z-i" bg="#FFA446" :width="40"
                         :height="40" :fillet="40"></dd-layout-div>
          <dd-layout-div bg="#FFBBC8" class="posi-r flex-y-center col-f fon-xss over-h" :mar="[0,0,0,-18]" :width="166"
                         :height="33" :fillet="[0,30,0,30]">
            <dd-layout-div class="posi-a l0 t0 b0" bg="#F8506F" :width="getInfo.percentage"
                           :fillet="[0,30,0,30]"></dd-layout-div>
            <dd-layout-div :mar="[0,0,0,30]" class="posi-r">已抢{{getInfo.percentage}}</dd-layout-div>
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="bg-f52c2c col-f fon-b" :pad="[20,35,18]" :fillet="35">立即抢购</dd-layout-div>
    </dd-layout-div>


    <dd-layout-div v-if="layoutFooter" class="flex-x-end">
      <dd-layout-div class="flex">
        <dd-layout-div class="bg-t br-t col-f fon-sm" :stop="true" :pad="[20,30,16]" :fillet="15" :mar="[0,0,0,30]" @click="$emit('go-detail')">领取详情</dd-layout-div>
        <dd-layout-div class="br-e fon-sm" :stop="true" :pad="[20,30,16]" :fillet="15" :mar="[0,0,0,30]" @click="$emit('operation')">操作/编辑</dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
  </dd-layout-div>

</template>

<script>
  import LayoutOne from "../../../components/template/dd-article/layout-one";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {PlaceholderAvatar, PlaceholderImg, backendPath, publishUrl} from "../../../project-config/base";
  import {countDownTime} from "../../../util";
  import DdLayoutImg from "../../layout/dd-layout-img";

  export default {
    name: "vip-package",
    components: {DdLayoutImg, LayoutOne},
    props: ['dataInfo', 'type', 'countDown'],
    data() {
      return {

        layoutHeader: {},
        layoutBody: {
          class: 'base-pad2',
          hd: 1,
          bd: 1,
          img: {
            brs: 'border-0',
            wid: 1.7,
            hei: 1.7,
          },
        },
        layoutFooter: this.type == 'manage-rushbuy',
        PlaceholderAvatar,
        timeArr: ['00', '00', '00', '00'],
      }
    },
    mixins: [utilMixins],
    computed: {
      getInfo() {
        const data = this.dataInfo

        return {
          id: data.id,
          title: data.title,
          rushPrice: (+data.rushPrice).toFixed(2),
          originalPrice: (+data.originalPrice).toFixed(2),
          cover: data.showImgs[0]&&this.getSingleImg(data.showImgs[0].url),
          percentage: `${parseInt(data.salesNum / (parseInt(data.num) + parseInt(data.salesNum)) * 100)}%`
        }
      }
    },
    created() {
      // countdown()
      // function countdown(time) {
      //   let EndTime = 1556077749;
      //   let NowTime = parseInt(new Date().getTime() / 1000);
      //   let differSecond = EndTime - NowTime;
      //   if (differSecond <= 0) {
      //     console.log('tiem','已截止')
      //   }
      //   else{
      //     console.log('tiem倒计时',countDownTime(differSecond))
      //     setTimeout(function () {
      //       countdown(time);
      //     }, 1000)
      //   }
      // }
      // let EndTime = parseInt(this.dataInfo.endTime);
      // let NowTime = parseInt(new Date().getTime() / 1000);
      // this.dsq=setInterval(()=> {
      //   NowTime+=1
      //   if(EndTime-NowTime<=0){
      //     clearInterval(this.dsq)
      //   }
      //   this.timeArr=countDownTime(EndTime-NowTime)
      //   // console.log('倒计时',this.timeArr,EndTime-NowTime)
      // }, 1000)
    },
    watch: {
      countDown: {//值为1才倒计时
        handler(val, oldVal) {
          if (val == 1) {
            let EndTime = parseInt(this.dataInfo.endTime), NowTime = parseInt(new Date().getTime() / 1000);
            this.timeArr = countDownTime(EndTime - NowTime)
            this.dsq = setInterval(() => {
              NowTime += 1
              if (EndTime - NowTime <= 0) {
                clearInterval(this.dsq)
              }
              this.timeArr = countDownTime(EndTime - NowTime)
              // console.log('倒计时',this.timeArr,EndTime-NowTime)
            }, 1000)
          } else {
            clearInterval(this.dsq)
          }
          //console.log('countDown',val)
        },
        immediate: true
      },
    },
    destroyed() {
      clearInterval(this.dsq)
      //console.log('离开页面')
    }
  }
</script>
