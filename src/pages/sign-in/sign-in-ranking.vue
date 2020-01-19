<template>
    <div class="sign-in-ranking">

      <!--这个头部是组件来的 S-->
      <Header></Header>
      <!--这个头部是组件来的 E-->

      <header class="ranking-header">
          <strong class="total-points">{{userInfo.integral}}</strong>
          <em class="num-title">总积分</em>
          <div class="ranking-header-footer">
             <em class="detail" @click="goPointPage({path:'/sign/signInPointsDetails'})">积分明细</em>
             <em class="detail" @click="goPointPage({path:'/sign/signInPointsDetails'})">兑换记录</em>
          </div>
      </header>
      <article>
        <van-tabs @click="onClick" color="RGBA(248, 73, 48, 1)">
          <van-tab title="今日排名">
             <RankItem v-if="toDay.length" :data="toDay" :myRank="myRankToDay"/>
            <!--<no-date v-else tips="暂无人签到"></no-date>-->
          </van-tab>
          <van-tab title="总排行">

             <RankItem v-if="all.length" :data="all" :myRank="myRankAll"/>
            <no-date v-else  tips="暂无人上榜"></no-date>
          </van-tab>
        </van-tabs>
      </article>
    </div>
</template>

<script>
    import { Tab, Tabs } from 'vant';
    import RankItem from "../../components/sign-in/rank-item"
    import Header from "@/components/header";
    import {mapActions, mapState, mapGetters} from 'vuex'
    import {Toast} from 'vant';
    import NoDate from "@/components/no-data";

    export default {
      name: "signInRanking",
      components:{RankItem,Header,NoDate},
      data(){
          return {
            titleIndex:0,
            toDay:[],
            all:[],
            myRankToDay:null,      //我的今日排行
            myRankAll:null,        //我的总排行排名
            userInfo:{}
          }
      },
      methods:{
        ...mapActions("signIn",["signRank"]),
        ...mapActions('personal',['getUserInfoById']),
        onClick(index){
          this.titleIndex=index;
        }
      },
      computed:{
      },
      created(){
        this.getUserInfoById().then(result=>{
          this.userInfo = result;
        });
        this.signRank().then(result=>{
          if(result.code === 1){
            this.toDay = result.data.today;
            this.all = result.data.all;
            this.myRankToDay = result.data.myRank;
            this.myRankAll = result.data.myRankAll;
          }else{
            Toast.fail({
              message:"获取信息失败",
              duration:1500
            })
          }
        })
      }
    }
</script>

<style scoped lang="scss">
  @import "../../assets/theme";
  @import "../../assets/common";
   .sign-in-ranking{
     background-color: #eee;
   }
   .ranking-header{
     height:340px;
     background:linear-gradient(5deg,rgba(248,73,48,1) 0%,rgba(238,96,48,1) 100%);
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     .total-points{
       font-size:80px;
       font-family:PingFang-SC-Medium;
       font-weight:500;
       color:rgba(255,255,255,1);
     }
     .num-title{
       margin-top: 20px;
       font-size:$font-size-sm;
       font-family:PingFang-SC-Medium;
       font-weight:500;
       color:rgba(255,255,255,1);
       &:before{
          content: '';
          display: inline-block;
          width:52px;
          height:1PX;
          background:#fff;
         margin-right: 40px;
         vertical-align: middle;
        }
       &:after{
         content: '';
         display: inline-block;
         width:52px;
         height:1PX;
         background:#fff;
         margin-left: 40px;
         vertical-align: middle;
       }
     }
     .ranking-header-footer{
       padding: 40px 0px 0px 0px;
       display: flex;
       justify-content: space-between;
       width: 50%;
       .detail{
         display:inline-block;
         width:154px;
         height:58px;
         text-align: center;
         line-height: 58px;
         border:1PX solid rgba(255,255,255,1);
         border-radius:28px;
         font-size:$font-size-sm;
         font-family:PingFang-SC-Medium;
         font-weight:500;
         color:rgba(255,255,255,1);
       }
     }
   }

</style>
