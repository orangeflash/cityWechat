<template>
    <div class="box">
      <Header></Header>
      <div class="header">
        <div class="headerbox pad-30">
          <div class="user">
            <p class="username">Hi,{{user.userName}}</p>
            <p class="userid">欢迎登陆城市后台!</p>
          </div>
          <div class="circular">
            <img :src="user.portrait" class="circular">
          </div>
        </div>
      </div>
      <div class="main">
        <div class="accountinfo">
          请选择登陆城市
        </div>
      </div>
      <div class="container">
        <div class="containerbox pad-30">
          <div class="containertop" v-for="(item,i) in cityList" :key="i" @click.stop="goAgentIndex(item)">
            <div class="login" ><p>{{item.cityName}}</p></div>
            <div class="website"><span class="iconfont icon-youjiantou2"></span></div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {mapActions, mapState, mapGetters,mapMutations} from 'vuex'
    export default {
        name: "city-login",
      data(){
        return {
          cityList:[]
        }
      },
      methods:{
        ...mapActions("cityAgent",["getCityList"]),
        ...mapMutations("cityAgent", ["SET_AGENT_INFO"]),
        //获取城市列表接口
        async getList() {
          const cityInfo = await this.getCityList({city: this.user.bindCity});
          this.cityList = cityInfo
        },
        goAgentIndex(item){
          this.SET_AGENT_INFO(item)
          this.goPointPage({path:'/agentIndex/cityAgent'})
          console.log(item)
        },
      },
      computed: {
        ...mapState({
          user: state => state.user,
        })
      },
      created() {
        this.getList()
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  .header {
    background: #fff;
    .headerbox {
      display: flex;
      justify-content: space-between;
    }
    .circular {
      width: 98px;
      height: 98px;
      border-radius: 50%;
      margin-right: 25px;
    }
    .user {
      line-height: 50px;
      .username {
        font-family: 'PingFang-SC-Medium';
        font-size: 36px;
        color: #333333;
      }
      .userid {
        font-family: 'PingFang-SC-Medium';
        font-size: 26px;
        color: #999999;
      }
    }
  }
  .main {
    .accountinfo{
      font-size: 28px;
      color: #999999;
      height: 90px;
      line-height: 110px;
      padding: 0 30px;
      background: #F3F4F8;
    }
  }
  .container {
    line-height: 90px;
    background: #fff;
    .containertop{
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      .login{
        font-size: 28px;
        color: #666666;
      }
      .website {
        font-size: 28px;
        color: $themeColor;
      }
    }
    .containermid {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      .site {
        font-size: 28px;
        color: #666666;
      }
      .city {
        font-size: 28px;
      }
    }
    .containerbot {
      display: flex;
      justify-content: space-between;
      .accnumber {
        font-size: 28px;
        color: #666666;
      }
      .payment {
        .parymentyun,.parymentxun{
          height: 60px;
          .yun{
            margin-right: 16px;
            font-size: 30px;
            color: #1F7DFA;
          }
          .xun {
            margin-right: 10px;
            font-size: 30px;
            color: #00C801;
          }
        }
        .paymentpho {
          font-size: 28px;
          color: #333333;
        }
      }
    }
  }
</style>
