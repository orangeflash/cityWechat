<template>
    <div class="box">
      <Header></Header>
      <div class="header">
        <div class="headerbox pad-30">
          <div class="circular">
            <img :src="user.portrait" class="circular">
          </div>
          <div class="user">
            <p class="username">{{user.userName}}</p>
            <p class="userid">UID:{{user.id}}</p>
          </div>
        </div>
      </div>
      <div class="head-title">
        账号信息
      </div>
      <van-cell-group>
        <van-cell title="pc端登录地址" :value="citySetInfo.url" />
        <van-cell title="站点" :value="citySetInfo.cityName" />
        <van-cell title="提现账号">
          <div>
            <i class="iconfont icon-zhifubao col-b"></i><span class="mar-l">{{citySetInfo.account}}</span>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {hideLoading, showLoading} from "../../../util";
  export default {
      name: "city-set-up",
       data(){
          return {
            citySetInfo:{}
          }
        },
        methods:{
          ...mapActions("cityAgent",["getCitySet"]),
          async setInfo () {
            showLoading()
            const citySetInfo = await this.getCitySet({cityId:this.agentInfo.cityId})
            this.citySetInfo = citySetInfo
            hideLoading()
          },
        },
        computed: {
          ...mapState({
            user: state => state.user,
          }),
          ...mapState("cityAgent",{
            agentInfo:state => state.agentInfo,
          }),
        },
        created() {
          this.setInfo()
        }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  .box {
    .header {
      background: #fff;
      .headerbox {
        display: flex;
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
  }
</style>
