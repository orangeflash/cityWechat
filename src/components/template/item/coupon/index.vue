<template>


  <dd-layout-div :pad="[20,0]">
    <dd-layout-div class="bg-f posi-r over-h flex flex-bt" :fillet="20"
                   @click="goPointPage('/auxiliary/coupon/details?couponId='+item.id)"
                   v-for="(item,key) in getList"
                   :key="key" :mar="[0,30,20]">

      <dd-layout-div class="flex-g-1" :pad="[30,20]">

        <dd-layout-div class="hide-e-2 fon-xll fon-wb" :line-height="50">
          <dd-layout-div
            :bg="`linear-gradient(90deg,${item.color.label[0]} 0%,${item.color.label[1]} 100%)`"
            class="col-f fon-xs flex-g-0 dis-ib"
            :line-height="20"
            :fillet="[20,0,0,20]"
            :pad="[12,15,8]"
            :mar="[0,10,0,0]"
          >{{item.label}}
          </dd-layout-div>
          {{item.title}}
        </dd-layout-div>
        <dd-layout-div
          class="flex fon-wb flex-wrap flex-y-center"
          :pad="[20,0]"
        >
          <dd-layout-div class="col-price fon-xl mar-r">￥{{item.money}}</dd-layout-div>
          <dd-layout-div class="flex-g-0 fon-wb " bg="#FFE100" :pad="[10,12,6]" :fillet="8"
                         v-if="item.vipMoney > 0">
            会员￥{{item.vipMoney}}
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="col-9">已领{{item.receiveNum}}份</dd-layout-div>
      </dd-layout-div>
      <dd-layout-div
        class="flex-g-0 flex-col flex-bt posi-r flex-center"
        :pad="[30,20,30,10]"
        :bg="item.isOver?'#ddd':item.color.font"
        :width="250"
      >
        <dd-layout-div class="t-c flex-g-1">


          <dd-layout-div class="t-c">
            <dd-layout-div :font-size="40" :color="item.isOver?'#999':'#fff'">{{item.discount}}</dd-layout-div>
            <dd-layout-div class="fon-xs hide-e" :color="item.isOver?'#999':'#fff'" :pad="[25,0]">{{item.condition}}
            </dd-layout-div>
          </dd-layout-div>
          <dd-layout-div class="t-c">
            <dd-layout-div class="bg-f dis-ib fon-lg fon-wb"
                           :color="item.isOver?'#999':item.color.font" :pad="[18,30,14]" :fillet="40"
                           :br="`0.04rem solid ${item.isOver?'#999':item.color.border}`">
              {{item.isOver?'已领完':'立即领取'}}
            </dd-layout-div>
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="posi-a t0 b0 l0" :width="5"
                       :mar="[0,0,0,-7.5]">
          <dd-layout-div v-for="key in 10" :key="key" :bg="item.isOver?'#ddd':item.color.font" :width="20" :height="20"
                         :fillet="20" :mar="[0,0,10,0]"/>
        </dd-layout-div>
        <dd-layout-div :width="40" :height="40" :fillet="40" bg="#fff" :mar="[0,-20,0,0]" class="posi-a r0"/>
      </dd-layout-div>

    </dd-layout-div>

  </dd-layout-div>


  <!--<div class="flex coupon" @click="deliver?$emit('click',{name:'coupon',value:info}):$emit('click',info)">-->
  <!--<div class="flex-g-1 bg-f pad-30 flex">-->
  <!--<div>-->
  <!--<face-->
  <!--v-if="info.logo"-->
  <!--:src="info.logo"-->
  <!--size="69"-->
  <!--borderRadius="0.04"-->
  <!--&gt;</face>-->
  <!--</div>-->
  <!--<div class="flex-g-1 mar-l">-->
  <!--<h3 class="fon-b mar-b-20 flex flex-y-center hide-e"><span class="label fon-xs mar-r-10">{{info.type}}</span>{{info.title}}-->
  <!--</h3>-->
  <!--<p class="col-9 fon-sm mar-b-20 hide-e" style="padding-top: 2px">{{info.condition}}</p>-->
  <!--<div>-->
  <!--<p class="col-t mar-b-10">{{info.vipMoney}}</p>-->
  <!--<span class="col-t fon-40">{{info.discount}}</span>-->

  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="bg-t receive posi-r pad-b t-c">-->
  <!--<div class="mar-30">-->
  <!--<em class="col-f fon-20 ">已领{{info.receiveNum}}份</em>-->
  <!--<div class="posi-r proportion mar-t-20">-->
  <!--<div class="posi-a bg-f" :style="{'width': (info.percentage)+'%'}"></div>-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="pad-t">-->
  <!--<span class="col-t bg-f fon-xs">{{info.money}}领取</span>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->

</template>

<script>

  import Face from '@/components/template/face'

  export default {
    components: {Face},
    props: {
      deliver: {
        type: Boolean,
        default: false,
      },
      list: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      getList() {
        return this.list.map(item => {
          // item.type = +item.type == 1 ? '代金劵' : +item.type == 3 ? '优惠劵' : ' 折扣劵'
          const

            isOver = item.count - item.receiveNum <= 0,
            color = {
              font: +item.type == 1 ? '#F7B821' : +item.type == 3 ? '#FF3838' : ' #3699FF',
              label: +item.type == 1 ? ['rgba(247,184,33,1)', 'rgba(255,206,88,1)'] : +item.type == 3 ? ['rgba(249,50,69,1)', 'rgba(237,78,110,1)'] : ['rgba(54,153,255,1)', 'rgba(97,175,255,1)'],
              border: +item.type == 1 ? '#DD8410' : +item.type == 3 ? '#E10C0C' : ' #0D68C5',
            },
            money = (+item.money || 0).toFixed(2);
          return {
            ...item,
            vipMoney: (+item.vipMoney || 0).toFixed(2),
            money: money > 0 ? money : +item.stock > 0 ? '免费领取' : '不可领取',
            label: +item.type == 1 ? '代金劵' : +item.type == 3 ? '优惠劵' : ' 折扣劵',
            condition: +item.condition > 0 ? '满' + item.condition + '元，可使用' : '无最低消费',
            discount: item.type == 1 || item.type == 3 ? '￥' + item.reduce + '元' : item.type == 2 ? item.discount + '折' : '',
            color,
            isOver
          }
        })
      }
    }
  }

</script>
