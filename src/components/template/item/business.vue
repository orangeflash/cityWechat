<template>


  <div class="bg-f br-r-20 pad-30 flex mar-b"
       @click="goPointPage({path:'/shopDetail',query:{storeId:business.id}})">
    <div class="posi-r mar-r">
      <dd-layout-img

        :width="1.8" :height="1.8" :fillet="0.2"
        :src="business.logo"/>
      <img :src="renzheng" v-if="business.isAuth == 1" class="mar-l-010 w-100 posi-a l0 t0">
    </div>
    <div class="flex-g-1 w100">
      <div class="dh-40 flex-y-center flex-bt"><span
        class="fon-wb fon-lg w100 hide-e dh-40 lineH-40">{{business.name}}</span>
        <span class="col-9 miw-175 t-r" v-if="sort == 'hot'">{{business.viewNum}}浏览</span>
        <span class="col-9 miw-175 t-r" v-if="sort == 'new'">{{business.enterTime}}</span>
        <span class="col-9 miw-175 t-r" v-if="sort == 'nearest'">~{{business.distance}}</span>
      </div>
      <div class="bg-FFECF2 dis-ib col-FF0E3B pad-8-10-4 mar-r-10 mar-t-10 br-r-4"
      >{{business.typeName}}
      </div>
      <div class="bg-FFECF2 dis-ib col-FF0E3B pad-8-10-4 mar-r-10 mar-t-10 br-r-4"
      >{{business.newName}}
      </div>
      <div class="flex-y-center mar-t-20 mar-b-10">
        <i class="iconfont icon-date-2 mar-r-10 fon-b"></i>
        营业时间 | {{business.startTime}}-{{business.endTime}}</div>
      <div class=" mar-b-20 flex-y-center dh-40 pad-t-10 hide-e">
        <i class="iconfont icon-dingwei1 mar-r-10 mar-t-010"></i>
        <div class="">{{business.address}}</div>
      </div>
      <ul class="w100">
        <li class="flex-y-center hide-e mar-b-20 dh-40 col-6 w100" v-if="business.list.coupon">
          <span class="col-f bg-FF7B00 br-r-8 pad-6-4-2 dis-ib mar-r-10 flex-g-0">劵</span>
          {{intercept(business.list.coupon.title)}}
        </li>
        <li class="flex-y-center hide-e mar-b-20 dh-40 col-6 w100" v-if="business.list.rush">
          <span class="col-f bg-FF4800 br-r-8 pad-6-4-2 mar-t-05 dis-ib mar-r-10 flex-g-0">抢</span>
          {{intercept(business.list.rush.title)}}
        </li>
        <li class="flex-y-center hide-e mar-b-20 dh-40  col-6 w100" v-if="business.list.group">
          <span class="col-f bg-5DD281 br-r-8 pad-6-4-2 dis-ib mar-r-10 flex-g-0">团</span>
          {{intercept(business.list.group.title)}}
        </li>
        <li class="flex-y-center hide-e mar-b-20  dh-40 col-6 w100" v-if="business.list.bargain">
          <span class="col-f bg-r  br-r-8 pad-6-4-2 dis-ib mar-r-10 flex-g-0">砍</span>
          {{intercept(business.list.bargain.title)}}
        </li>
      </ul>
    </div>
  </div>

</template>


<script>


  import DdLayoutImg from "../../layout/dd-layout-img";
  import renzheng from '../../../assets/img/attest/renzheng.png'

  export default {
    components: {DdLayoutImg},
    props: {
      business: {
        type: Object,
        default: Object
      },
      sort: {
        type: String,
        default: "hot"
      }
    },
    data() {
      return {
        renzheng
      }
    },
    methods: {
      intercept(val) {
        if (val.length > 15) {
          return val.substring(0, 15) + '...'
        } else {
          return val
        }

      }
    }
  }


</script>
