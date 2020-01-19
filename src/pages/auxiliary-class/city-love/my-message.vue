<template>

  <dd-layout-div class="bg-f" mi-h="100vh" :pad="[0,30,30]">
    <div class="dh-100 flex-y-center flex-bt br-b-EFF3F6">
      <div class="dh-100 flex-center fon-wb fon-xxl" @click="goPointPage('/auxiliary/cityLove/releaseDynamic')">消息(3)
      </div>
      <div class="dh-100 flex-center">
        <i class="iconfont icon-add-comment fon-w3 fon-40"></i>
      </div>
    </div>

    <div>

      <ul>
        <li class="flex-bt pad-t" v-for="(item,i) in 10" :key="i">
          <div class="flex-y-center flex-g-1">
            <dd-layout-img
              :width="1.14"
              :height="1.14"
              :fillet="1.14"
              src="https://b-ssl.duitang.com/uploads/item/201906/08/20190608135933_83Yzm.thumb.700_0.jpeg"/>
            <div class="mar-l flex-g-1">
              <div class="fon-xl fon-wb mar-b-20">白桃软糖</div>
              <div class="hide-e col-9 fon-sm w100">为啥要收藏我的瞬间？是有什么共为啥要收藏我的瞬间？是有什么共为啥要收藏我的瞬间？是有什么共为啥要收藏我的瞬间？是有什么共...</div>
            </div>
          </div>
          <dd-layout-div class="flex flex-col" :mi-w="150">
            <p class="col-9 fon-xs t-r">10分钟前</p>
            <div class="flex-g-1 flex-y-center flex-x-end">
              <dd-layout-div :pad="[7,20,5]" class=" bg-t col-f fon-xs br-r-16">2</dd-layout-div>
            </div>
          </dd-layout-div>
        </li>
      </ul>
    </div>

  </dd-layout-div>


</template>
<script>
  import DdLayoutImg from "../../../components/layout/dd-layout-img";

  export default {
    components: {DdLayoutImg}
  }
</script>
