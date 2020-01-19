<template>
    <div class="rank-item">
      <!-- 自己的排行信息 S -->
      <div class="seniority-item margin-b">
        <div class="left">
          <img-wrapper :src="getIcon(myRank-1)"  not-load="true"  v-if="myRank && +myRank < 3 " class="champion-ranking"/>
          <em class="champion-serial" v-else-if="myRank">{{myRank}}</em>
          <span class="champion-serial champion-serial-none" v-else style="font-size: 12px;">未上榜</span>
          <!--<img-wrapper src="" class="champion-ranking"/>-->
          <div  class="user-img">
            <img-wrapper :src="user.portrait"/>
          </div>
          <em class="nick-name">{{user.userName}}</em>
        </div>
        <em class="right">{{user.integral}}</em>
      </div>
      <!-- 自己的排行信息 E -->
      <div class="seniority-item" v-for="(item,index) in data" :key="index">
        <div class="left">
          <!--<em class="nick-name">666</em>-->
          <img-wrapper :src="getIcon(index)" not-load="true" v-if="index<3" class="champion-ranking"/>
          <span class="champion-serial" v-else>{{index+1}}</span>
          <div  class="user-img">
            <img-wrapper :src="item.portrait"/>
          </div>
          <em class="nick-name">{{item.userName}}</em>
        </div>
        <em class="right">{{item.count}}</em>
      </div>
    </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import No1 from '@/assets/img/sign-in/No-1.png'
  import No2 from '@/assets/img/sign-in/No-2.png'
  import No3 from '@/assets/img/sign-in/No-3.png'


  import _ from "lodash"
    export default {
        name: "RankItem",
        props:["data",'myRank'],
        data(){
          return {
            listOther:[],
            No1,
            No2,
            No3,
          }
        },
        methods:{
          getIcon(index){
            return index===0?No1:index===1?No2:No3;
          }
        },
        computed:{
          ...mapState({
            platform: state => state.platform,
            user:state=>state.user
          }),
        },
        created(){
        }
    }
</script>

<style scoped lang="scss">
  @import "../../assets/theme";
  @import "../../assets/common";
  .seniority-item{
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 30px 30px 30px 0;
    line-height: 80px;
    border-top: 1PX solid #eee;
    .left{
      /*line-height: 80px;*/
      display: flex;
      align-items: center;
      .nick-name{
        font-size:30px;
        font-family:PingFang-SC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
      }
      .champion-ranking{
        width:51px;
        height:51px;
        border-radius: 50%;
        margin-left: 30px;
        margin-right: 40px;
      }
      .user-img{
        width:66px;
        height:66px;
        border-radius:50%;
        margin:0px 20px 0px 0px;
        overflow: hidden;
      }
      span.champion-serial{
        width: 120px;
        text-align: center;
        font-size: 34px;
      }
    }
    .right{
      font-size:$font-size-lg;
      font-family:PingFang-SC-Medium;
      font-weight:500;
      color:rgba(51,51,51,1);
    }
  }

  .margin-b{
    margin-bottom:16px;
  }
  .champion-serial-none{
    width: 120px;
    text-align: center;
    font-size: 24px;
  }
  .champion-serial{
    width: 120px;
    text-align: center;
    font-size: 34px;
  }
</style>
