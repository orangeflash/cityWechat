<template>
  <div class="points-details">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <header class="header">
      <em class="details-num">{{info.integral}}</em>
      <em class="header-title">总积分</em>
      <em class="points-mall"  @click="goPointPage({path:'/personal/integralMall'})"><i class="iconfont icon-jifen"></i>&nbsp;&nbsp;&nbsp;积分商城</em>
    </header>
    <van-tabs @click="onClick" :color="$themeColor">
      <van-tab title="积分明细">
         <div class="margin-t">
            <ExchangeItem  v-for="(item,index) in TotalList" :key="index"  :itemData="item"/>
            <footer class="getMore" @click="getmoreData">{{more ? "加载更多" : "没有更多了"}}</footer>
         </div>
      </van-tab>
      <van-tab title="兑换记录">
        <div class="margin-t">
          <OrderRecord v-if="orders.length > 0" v-for="(item,key) in orders" :key="key" :data="item"></OrderRecord>
            <not-data v-else></not-data>
        </div>
      </van-tab>
    </van-tabs>

  </div>
</template>

<script>
  import {Tab, Tabs, Toast} from 'vant';
  import ExchangeItem from "../../components/sign-in/exchange"
  import {hideLoading, showLoading} from "../../util/index";
  import { mapActions,mapState } from 'vuex';
  import Header from "@/components/header";
  import OrderRecord from "../common/order-record"


  export default {
    name: "pointsDetails",
    components:{ExchangeItem,Header,OrderRecord},
    data() {
      return {
        integralList:[],
        TotalList:[],
        pageNum:1,
        more:0,
        info:0,
        orders:[]
      }
    },
    methods: {
      ...mapActions("personal/integral",["getIntegralList"]),
      ...mapActions('personal',['getUserInfoById']),
      ...mapActions('integralMall', ["integralMyRecord"]),
      onClick(index, title) {
      },
      async getIntegralListInfo(){
        showLoading()
        const integralList =  await this.getIntegralList({
             size:10,
             page:this.pageNum,
        })
        if(!integralList.length){
          this.more=0;

        }else {
          this.more =1
        }
        this.TotalList = this.TotalList.concat( integralList);
        hideLoading();
        // if(typeof integralList != 'object'){
        //   integralList.map(item=>{
        //     console.log(item)
        //     this.TotalList.push(item)
        //
        //   })
        // }

      },
      async getmoreData(){
        if (!this.more) {
          return Toast("没有更多了，要多努力哦")
        }
        this.pageNum++
        await this.getIntegralListInfo()
      }
    },
    computed: {
      ...mapState({
        user: s => s.user
      }),
    },
    async created(){
      this.getIntegralListInfo();
      this.integralMyRecord().then(result=>{
        console.log(result);
        if(result.code == 1){
          this.orders = result.data.data;
        }
      })
      this.info = await this.getUserInfoById(this.user.id);

    }
  }
</script>

<style scoped lang="scss">
  @import '../../assets/theme';

  .header {
    height: 270px;
    /*background: linear-gradient(5deg, rgba(248, 73, 48, 1) 0%, rgba(238, 96, 48, 1) 100%);*/
    background: $themeColor;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    .details-num {
      font-size: 80px;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
    .header-title {
      margin-top: 20px;
      font-size: $font-size-sm;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      &:after {
        content: '';
        display: inline-block;
        width: 52px;
        height: 1PX;
        background: rgba(244, 244, 244, 1);
        vertical-align: middle;
        margin-left: 30px;
      }
      &:before {
        content: '';
        display: inline-block;
        width: 52px;
        height: 1PX;
        background: rgba(244, 244, 244, 1);
        vertical-align: middle;
        margin-right: 30px;
      }
    }
    .points-mall {
      position: absolute;
      right: 0px;
      top: 50%;
      transform: translateY(-50%);
      width: 188px;
      height: 56px;
      background: rgba(0, 0, 0, 1);
      opacity: 0.7;
      border-radius: 28px 0px 0px 28px;
      color: rgba(252, 220, 23, 1);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .margin-t{
    margin-top: 16px;
  }
  .getMore{
    width: 1005;
    height: 90px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #666;
  }
</style>
