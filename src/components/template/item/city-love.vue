<template>

  <div class="pad-lr pad-tb flex-wrap flex-bt">
    <dd-layout-div v-for="(item,k) in list" :width="334" :fillet="20" class="bg-f mar-b-20" :key="k">
      <dd-layout-img :width="3.34" :height="4.11" :src="item.cover" :fillet="0.2">
        <div class="posi-a bg-0-1 t0 l0 r0 b0 flex-col flex-bt flex"
             @click="goPointPage('/auxiliary/cityLove/details?id='+item.id)">
          <dd-layout-div class="posi-a mar-20 col-f" v-if="item.isTop" :fillet="20" bg="linear-gradient(90deg,rgba(247,168,97,1) 0%,rgba(255,119,111,1) 100%)" :pad="[10,18,7]" br="0.02rem solid rgba(255,214,142,1)">置顶
          </dd-layout-div>
          <div class="flex-x-end">
            <span class="col-f pad-10-20-8 mar-t-20 mar-r br-r-20 " :class="item.follow?'bg-t-5':' bg-0-5 '">{{item.follow?'已关注':'未关注'}}</span>
          </div>
          <div class="flex-bt dh-76 flex-y-center pad-lr-10">
            <div class="fon-wb fon-b flex-g-1 hide-e dh-44 lineH-44 col-f">{{item.nickname}}</div>
            <div class=" flex-g-0 flex">
              <dd-layout-div :bg="item.sex==1?'#4FA6F6':'#F871A4'"
                             class="col-f fon-xsss pad-6-4-4 mar-l-10 br-r-4 flex-y-center"><i
                class="iconfont  col-f fon-xsss mar-r-5" :class="item.sex==1?'icon-nanxianxing':'icon-nvxianxing'"></i>{{item.age}}岁
              </dd-layout-div>
              <span class="col-f bg-CA99F3 fon-xsss pad-6-4-4 mar-l-10 br-r-4 flex-y-center"><i
                class="iconfont icon-dingwei1 col-f fon-xsss mar-r-5"></i>{{item.city}}</span>
            </div>
          </div>
        </div>
      </dd-layout-img>
    </dd-layout-div>
    <div v-if="list.length%2 > 0"></div>
  </div>

</template>
<script>
  import DdLayoutImg from "../../layout/dd-layout-img";

  export default {
    components: {DdLayoutImg},
    props: {
      list: {
        type: Array,
        default: () => []
      }
    }
  }
</script>
