<template>

  <div class="pad-30 bg-f mar-b">
    <dd-layout-img :src="infoData.cover" :width="6.9" :height="3.3" :fillet="0.3">
      <div class="posi-a t0 l0 w-200 tsf-45 mar-l-035 mar-t-010">
        <span class="bg-f52c2c col-f w-200 dh-70 flex-y-end flex-x-center pad-b mar-t-025 mar-l-025"
              v-if="infoData.status == 1">进行中</span>
        <span class="bg-d col-9 w-200 dh-70 flex-y-end flex-x-center pad-b mar-t-025 mar-l-025"
              v-if="infoData.status == 2">已结束</span>
        <span class="bg-FFE100 col-f w-200 dh-70 flex-y-end flex-x-center pad-b mar-t-025 mar-l-025"
              v-if="infoData.status == 3">未开始</span>
      </div>
    </dd-layout-img>
    <div class="pad-t">
      <div>
        <span class="col-f bg-FFB849 fon-sm pad-8-4-2 dis-ib mar-r-10 br-r-8 flo-l"
              v-if="infoData.isSelected == 1">精</span>
        <span class="fon-xll fon-wb lineH-48 ">{{intercept(infoData.info)}}</span>
      </div>
      <div class="flex-y-center flex-bt mar-t-10">
        <div>
          <span class="col-price fon-xxl mar-r">￥{{infoData.money}}</span>
          <span class="col-9 ">已报名<em class="col-f52c2c">{{infoData.residue || 0}}</em>人</span>
        </div>
        <span class="bg-d pad-17-28-15 br-r-30 col-9"
              v-if="infoData.status == 2"
              @click="goPointPage('/auxiliary/activity/details?activityId='+infoData.id)">已结束</span>
        <span class="bg-f52c2c pad-17-28-15 br-r-30 col-f"
              v-else
              @click="goPointPage('/auxiliary/activity/details?activityId='+infoData.id)">我要报名</span>
      </div>
    </div>
  </div>


</template>

<script>

  import DdLayoutImg from "../../layout/dd-layout-img";

  export default {
    components: {DdLayoutImg},
    props: {
      infoData: {
        type: Object,
        default: Object
      }
    },
    methods: {
      intercept(val) {
        try{
          if (val.length > 40) {
            return val.substring(0, 38) + '...'
          } else {
            return val
          }
        }catch (e) {
          console.log(e)
        }

      }
    }
  }

</script>
