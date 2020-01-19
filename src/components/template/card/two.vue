<template>

  <dd-layout-div :pad="[20,0]">
    <dd-layout-div
      @click="goPointPage({path:'/auxiliary/card/details',query:{id:item.id}})"
      :mar="[0,30,30]" :fillet="15" class="bg-f flex" :pad="[30]" v-for="(item,key) in getList" :key="key">
      <dd-layout-img :width="1.32" :src="item.face" :height="1.32" :fillet="1.32"/>
      <dd-layout-div class="flex-g-1 mar-l flex">
        <dd-layout-div class="flex-g-1">
          <dd-layout-div class="flex flex-y-center" :pad="[0,0,15]">
            <dd-layout-div class="hide-e fon-wb fon-xxl " :pad="[5,0,10]">{{item.name}}</dd-layout-div>
            <img :src="top" v-if="item.isTop" class="w-88 mar-t-5 mar-l-10 flex-g-0">
          </dd-layout-div>
          <dd-layout-div class="hide-e" :pad="[5,0,25]">{{item.typeName}} | {{item.position}}</dd-layout-div>
          <dd-layout-div class="hide-e col-9" :pad="[5,0,25]">{{item.company}}</dd-layout-div>
          <dd-layout-div class="fon-sm col-9">
            <span class="mar-r">{{item.followNum}}关注</span>
            <span class="mar-r">{{item.loveNum}}点赞</span>
            <span>{{item.viewNum}}人气</span>
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="flex flex-col flex-bt" :pad="[30,0,30,30]">
          <i class="iconfont icon-- col-9 fon-46"
             @click.stop="goPointPage({path:'/conversation',query:{tId:item.userId}})"></i>
          <i class="iconfont icon-dianhua6 col-9  fon-46"></i>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
  </dd-layout-div>
</template>

<script>

  import Face from '@/components/template/face'
  import {utilMixins} from "../../../plugins/util-mixins";
  import DdLayoutImg from "../../layout/dd-layout-img";
  import top from '../../../assets/img/city-information/top.png'


  export default {
    components: {DdLayoutImg, Face},
    mixins: [utilMixins],
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        top
      }
    },
    computed: {
      getList() {


        return this.list.map((item, key) => {
          return {
            ...item,
            face: item.logo && item.logo.length > 0 ? this.getSingleImg(item.logo[0].url) : '',
            isTop: +item.isTop == 1,
            followNum: +item.followNum || 0,
            loveNum: +item.loveNum || 0,
            viewNum: +item.viewNum || 0,
          }
        })
      }
    }

  }

</script>
