<template>

    <div class="base-pad bg-f mar-t"  @click="goPointPage({path:'/auxiliary/xx/details',query:{id:infoData.id}})">
      <div class="flex-x-bt br-b-e fon-b pad-tb">
        <div class="">
          <span class="yuan cbred" v-if="infoData.buyType=='1'">{{stateName(infoData.buyType)}}</span>
          <span class="yuan cbblue" v-else>{{stateName(infoData.buyType)}}</span>
          <span class="fon-w6">{{infoData.typeName}}</span>
        </div>
        <div class="fon-sm fon-w6 col-r">￥{{infoData.price}}元/{{infoData.unit}}</div>
      </div>
      <div class="col-6 flex w100 fon-sm pad-t-20 pad-b-10 listlh">
        <div class="flex-g-1 w60 hide-e">品牌：{{infoData.brand}}</div>
        <div class="flex-g-1 w40 hide-e">数量：{{infoData.number}}{{infoData.unit}}</div>
      </div>
      <div class="fon-sm col-6 flex w100 pad-tb pad-t-10 pad-b-10 listlh">
        <div class="flex-g-1 w60 hide-e">交货地：{{infoData.address}}</div>
        <div class="flex-g-1 w40 hide-e">规格：{{infoData.spec}}</div>
      </div>
      <div class="fon-sm col-9 flex-x-bt pad-t-10">
        <div class="fon-xss">
          <span class="textbox mar-r-5" :class="{'col-activeb':infoData.guarantee =='1'}">保</span>
          <span class="textbox mar-r-5" :class="{'col-activeg':infoData.isAuth=='1'}">实</span>
          <!--<span class="textbox mar-r-5">V</span>-->
        </div>
        <div>
          <span class="col-9 fon-xs mar-l flex-y-center"><i class="iconfont icon-Group- fon-xxl mar-r-10"></i>{{formatDateByTimeStamp(infoData.createdAt,"YYYY-MM-DD HH:mm")}}</span>
        </div>
      </div>
    </div>



</template>

<script>

  import {utilMixins} from "../../../plugins/util-mixins";
  export default {
    components: {},
    props: {
      infoData: {
        type: Object,
        default: Object
      }
    },
    methods: {
      stateName(buyType) {
        let s
        switch (buyType) {
          case '1':
            s = '买'
            break
          case '2':
            s = '卖'
            break
        }
        return s
      },
      // intercept(val) {
      //   try{
      //     if (val.length > 40) {
      //       return val.substring(0, 38) + '...'
      //     } else {
      //       return val
      //     }
      //   }catch (e) {
      //     console.log(e)
      //   }
      //
      // }
    },
    mixins: [utilMixins],
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";
  @import "../../../assets/theme";

  .box {
    margin: 16px 20px;
    border-radius: 8px;
  }
  .scroll-div{
    height: calc(100vh - 295px);
    position: relative;
    width: 100%;
  }
  .yuan{
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
  }
  .cbred{
    color: #f00;
    border:1.1px solid #f00;
  }
  .cbblue{
    color: #1C9BFC;
    border:1.1px solid #1C9BFC;
  }
  .textbox{
    border-radius: 5px;
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border:1.1px solid #999;
  }
  .col-activeg{
    color: #6EB7BE;
    border:1.1px solid #6EB7BE;
  }
  .col-activeb{
    color: #4DBFC6;
    border:1.1px solid #4DBFC6;
  }
  .w60{width:50%}
  .w40{width:50%}
  .listlh{
    height: 28px;
    line-height: 28px;
  }
</style>
