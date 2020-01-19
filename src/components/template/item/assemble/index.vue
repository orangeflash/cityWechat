<template>


  <dd-layout-div
    :pad="[30]"
    :mar="[0,0,20]"
    class="bg-f"
    @click="goPointPage('/auxiliary/assemble/goodsDetails?assembleId='+order.id)"
  >
    <dd-layout-img :src="order.cover.src" :width="6.90" :height="4" :fillet="0.3">
      <dd-layout-div
        class="posi-a t0 l0 col-f fon-b fon-wb br-br-r-30"
        bg="linear-gradient(90deg, #f93245 0%, #ed4e6e 100%)"
        :pad="[15,30,12]"
      >{{order.groupNum}}人拼
      </dd-layout-div>
    </dd-layout-img>
    <dd-layout-div class="fon-b fon-wb hide-e pad-t-5" :mar="[30,0]">{{order.name}}</dd-layout-div>
    <dd-layout-div class="flex-bt flex-y-center">
      <dd-layout-div>
        <dd-layout-div>
          <span class="col-price fon-xxll fon-wb mar-r-10">￥{{order.money}}</span>
          <em class="col-9 t-d-l fon-xss"> ￥{{order.originalPrice}} </em>
        </dd-layout-div>
        <dd-layout-div :font-size="0" :mar="[30,0,0]">
          <dd-layout-tag v-for="(name,key) in order.lables" class="mar-r" :key="key" :name="name" color="#E97D96"/>
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div
        :pad="[18,35,16]"
        :fillet="35"
        class="col-f fon-b col-f bg-f52c2c flex-g-0"
      >立即拼团
      </dd-layout-div>

    </dd-layout-div>
  </dd-layout-div>


  <!--<dd-store-order-->
  <!--:order="order"-->
  <!--class="bg-f mar-b-20 mar-t-10"-->
  <!--@click="goPointPage('/auxiliary/assemble/goodsDetails?assembleId='+order.id)"-->
  <!--&gt;-->
  <!--<div slot="cover-mask"-->
  <!--class="posi-a t0 l0 col-f pad-8-10-4 br-br-r-15"-->
  <!--style="background: linear-gradient(90deg,rgba(255,56,56,1) 0%,rgba(255,102,102,1) 100%);-->
  <!--box-shadow:0px 2px 4px 0px rgba(255,57,56,0.56);">{{order.groupNum}}人拼-->
  <!--</div>-->
  <!--<div slot="title" class="order-title-r2">{{order.name}}</div>-->
  <!--<div slot="desc" class="flex mar-t-20 mar-b">-->
  <!--<span class="bg-f8 col-9 br-r-10 pad-14-20-10 mar-r"-->
  <!--v-for="(name,key) in order.lables"-->
  <!--v-if="key<2"-->
  <!--:key="key">{{name}}</span>-->
  <!--</div>-->
  <!--<div slot="down" class="flex-y-center flex-bt">-->
  <!--<div>-->
  <!--<div class="mar-b-10">-->
  <!--<span class="col-t fon-lg mar-r-10">￥{{order.money}}</span>-->
  <!--<em class="col-9 t-d-l"> ￥{{order.originalPrice}} </em>-->
  <!--</div>-->
  <!--<div class="col-9">已拼{{order.salesNum}}件</div>-->
  <!--</div>-->
  <!--<div class="br-r-30 col-f pad-14-20-10"-->
  <!--style="background:linear-gradient(90deg,rgba(255,56,56,1) 0%,rgba(255,102,102,1) 100%);-->
  <!--box-shadow:0px 2px 4px 0px rgba(255,57,56,0.56);">去购买-->
  <!--</div>-->
  <!--</div>-->
  <!--</dd-store-order>-->
</template>


<script>

  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import DdLayoutImg from "../../../layout/dd-layout-img";

  export default {
    components: {DdLayoutImg, DdStoreOrder},
    props: {
      order: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }


</script>
