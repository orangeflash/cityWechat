<template>
    <div class="box" v-if="boxShow">
      <Header></Header>
        <div class="boxpad pad-30">
          <div class="header ">
            <div class="user">
              <p class="bulestrip fl"></p>
              <p class="username">Hi,{{user.userName}}</p>
              <p class="userpho">
                {{user.userTel}}
              </p>
            </div>
            <div class="usericon">
              <span class="usercitytip">当前城市：<span class="usercityname"> {{agentInfo.cityName}} </span></span>
            </div>
          </div>
          <div class="main ">
            <div class="panel">
              <div class="panelmain">
                <div class="panelhead">
                  <p class="panelcash">账户可提现余额</p>
                  <van-popup v-model="show" :close-on-click-overlay="false">
                    <div class="showbox pad-30">
                      <div class="showboxhead">
                        <p>城市代理提拥比例</p>
                      </div>
                      <div class="shouboxmain">
                        <div class="showboxinfos">
                          <p class="infoprop">信息提拥比例: <span class="blue">{{bonusInfo.postBonus}}%</span></p>
                          <p class="infotips">包含信息发布+刷新+置顶费用，不包含红包金额</p>
                        </div>
                        <div class="showboxinfos">
                          <p class="infoprop">商家提佣比例: <span class="blue">{{bonusInfo.storeBonus}}%</span></p>
                          <p class="infotips">包含商家入驻费用、置顶费用、续费费用</p>
                        </div>
                        <div class="showboxinfos">
                          <p class="infoprop">资讯打赏提佣比例: <span class="blue">{{bonusInfo.informationBonus}}%</span></p>
                          <p class="infotips">包含城市所属资讯打赏费用</p>
                        </div>
                        <div v-if="bonusInfo['114Bonus']" class="showboxinfos">
                          <p class="infoprop">114提佣比例: <span class="blue">{{bonusInfo['114Bonus']}}%</span></p>
                          <p class="infotips">包含114发布、置顶费用</p>
                        </div>
                        <div v-if="bonusInfo['carBonus']" class="showboxinfos">
                          <p class="infoprop">顺风车提佣比例: <span class="blue">{{bonusInfo.carBonus}}%</span></p>
                          <p class="infotips">包含发布顺风车费用、刷新费用、置顶费用</p>
                        </div>
                        <div v-if="bonusInfo['jobBonus']" class="showboxinfos">
                          <p class="infoprop">求职招聘提佣比例: <span class="blue">{{bonusInfo.jobBonus}}%</span></p>
                          <p class="infotips">包含发布求职招聘费用、刷新费用、置顶费用</p>
                        </div>

                      </div>
                      <div class="showfooter">
                        <div class="foot-mar-btn mb supplement" @click="showPopup">
                          <button>知道了</button>
                        </div>
                      </div>
                    </div>
                    <!--<AgentBouns :list="[bonusInfo,parameter]"></AgentBouns>-->
                  </van-popup>
                  <p class="panelbonus" @click="showPopup">分红比例 <span class="iconfont icon-youjiantou2"></span> </p>
                </div>
                <div class="panelmn" >{{indexInfo.money.canWithdrawal}}</div>
                <p class="hr"></p>
              </div>
              <div class="panelfooter">
                <div class="panelinfo pinfomb">
                  <div @click.stop="goPointPage({path:'/agentIndex/cityAgent/cityProfit',query:{activeid:0,title:'城市收益明细'}})" class="panelle">
                    <p class="panellemo">{{indexInfo.money.today}}</p>
                    <p class="panelleday">今日收益<span class="iconfont icon-youjiantou2"></span></p>
                  </div>
                  <div @click.stop="goPointPage({path:'/agentIndex/cityAgent/cityProfit',query:{activeid:1,title:'城市收益明细 '}})" class="panelri">
                    <p class="panellemo">{{indexInfo.money.yesterday}}</p>
                    <p class="panelleday">昨日收益<span class="iconfont icon-youjiantou2"></span></p>
                  </div>
                </div>
                <div @click.stop="goPointPage({path:'/agentIndex/cityAgent/cityProfit',query:{activeid:0,title:'城市收益明细 '}})"class="panelinfo">
                  <div class="panelle">
                    <p class="panellemo">{{indexInfo.money.money}}</p>
                    <p class="panelleday">总收益<span class="iconfont icon-youjiantou2"></span></p>
                  </div>
                  <div class="panelri">
                    <p class="panellemo">{{indexInfo.money.zone}}</p>
                    <p class="panelleday">总代理数<span class="iconfont icon-youjiantou2"></span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="rectangle"></div>
        <div class="waist pad-30" v-show="false">
          <div class="cash">
            <div class="circular">
              <i class="iconfont icon-qianbao"></i>
            </div>
            <div class="cashinfo">
              <p @click.stop="goPointPage({path:'/cityAgent/cityCash',query:{activeid:0,title:'总收益 '}})" class="cashtext">余额提现</p>
              <p class="cashmn">可提现余额 <span class="org">{{indexInfo.money.canWithdrawal}}</span></p>
            </div>
          </div>
          <div class="balance">
            <div class="circular">
              <i class="iconfont icon-wodeqianbao"></i>
            </div>
            <div class="balanceinfo">
              <p class="balancetext">提现明细</p>
              <p class="balancemn">查看往期提现记录</p>
            </div>
          </div>
        </div>
        <div class="footer pad-30">
            <div class="survey">
              <h4 class="todaysv">今日平台概况</h4>
              <div class="surveyinfo">
                <div class="infos">
                  <p class="surveycount">信息发布量</p>
                  <p class="surverynum">{{indexInfo.survey.post}}</p>
                </div>
                <div class="goods">
                  <p class="goodscount">商家入驻量</p>
                  <p class="goodsnum">{{indexInfo.survey.store}}</p>
                </div>
              </div>
            </div>
            <Region title="今日区域概况" right="true" :zone="[indexInfo.money.zone,indexInfo.zone]"></Region>
        </div>
    </div>
</template>

<script>
  //导入region组件
  import Region from '../../../components/template/city-agent/region-box.vue'
  import AgentBouns from '../../../components/template/city-agent/agent-bonus.vue'
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {hideLoading, showLoading} from "../../../util";
  export default {
        data(){
          return {
            show:false,
            boxShow:false,
            indexInfo:{},
            bonusInfo:{},
            citySetInfo:{},
            parameter:[
              { title:"信息提拥比例",tips:"包含商家入驻费用、置顶费用、续费费用"},
              { title:"商家提佣比例",tips:"包含信息发布+刷新+置顶费用，不包含红包金额"},
              { title:"资讯打赏提佣比例",tips:"包含城市所属资讯打赏费用"},
              { title:"114提佣比例",tips:"包含114发布、置顶费用"},
              { title:"顺风车提佣比例",tips:"包含发布顺风车费用、刷新费用、置顶费用"},
              { title:"求职招聘提佣比例",tips:"包含发布求职招聘费用、刷新费用、置顶费用"},
            ]
          }
        },
        methods:{
          ...mapActions("cityAgent",["getCityIndex","getCityBonus","getCitySet"]),
          // 请求后台首页信息
          async getIndexInfo() {
            const cityInfo = await this.getCityIndex({cityId:this.agentInfo.cityId});
            this.indexInfo = cityInfo
            this.boxShow = true
          },
          // 请求城市分红比例
          async getBonus() {
            showLoading()
            const cityBonus = await this.getCityBonus({cityId:this.agentInfo.cityId});
            this.bonusInfo = cityBonus
            hideLoading()
          },
          // 弹出层显示与否
          showPopup(){
            this.show = !this.show
          }
        },
        computed:{
          ...mapState({
            user: state => state.user,

          }),
          ...mapState("cityAgent",{
            agentInfo:state => state.agentInfo,
          }),
        },
        components:{
          Region,
          AgentBouns
        },
       created() {
          // console.log('agentInfo',this.agentInfo)
          this.getIndexInfo()
          this.getBonus()
        },

  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  .box {
    background: #fff;
    .yuan , .circular{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      background-color: #F3F4F8;
      border-radius: 50%;
    }
    .circular {
      margin: 0 25px;
      background: #E5FAFF;
    }
    .icon-youjiantou2 {
      font-size: 26px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      .user {
        width: 50%;line-height: 50px;
      }
      .bulestrip {
        margin-top: 4px;
        margin-right: 32px;
        width: 6px;
        height: 84px;
        background-color: $themeColor;
      }
      .username {
        font-size: 36px;
        color: #333;
      }
      .userpho {
        font-size: 26px;
        color: #333;
      }
      .usericon {
        margin-top: 8px;
        .usercitytip {
          font-family: "PingFang-SC-Medium";
          font-size: 28px;
          color: #999;
          .usercityname {
            color: $themeColor;
          }
        }
      }
    }
    .main {
      height: 460px;
      .panel {
        padding: 30px;
        width: 630px;
        height: 375px;
       /* background: linear-gradient(to right,#ccc,$themeColor);*/
        background: $themeColor;
        border-radius: 15px;
        .panelmain {
          margin-bottom: 30px;
        }
        .panelhead {
          display: flex;
          justify-content: space-between;
          .panelcash , .panelbonus , .big{
            font-size: 26px;
            color: #EEEEEE;
          }
        }
        .panelmn {
          margin: 28px 0;
          font-size: 66px;
          color: #fff;
        }
        .hr {
          margin-left: 10px;
          width: 171px;
          height: 1px;
          background-color:  #eee;
        }
        .big {
          margin-left: 15px;
        }
        .panelfooter {
          .pinfomb {
            margin-bottom: 10px;
          }
          .panelinfo, .panelinfo {
            display: flex;
            justify-content: space-between;
            .panelle , .panelri {
              text-align: left;
              line-height: 50px;
            }
            .panellemo {
              font-size: 36px;
              color: #fff;
            }
            .panelleday {
              font-size: 24px;
              color: #eee;
              span {
                margin-left: 15px;
              }
            }
          }
          .panelri {
            margin-right: 190px;

          }
        }
      }
    }
    .waist {
      display: flex;
      width: 100%;
      .cash , .balance {
        display: flex;
        align-items: center;
        width: 50%;
        height: 100px;
        line-height:50px;
      }
      .cash {
        .org {
          color: #D19400;
        }
        .icon-qianbao {
          font-size: 36px;
          color:$themeColor;
        }
      }
      .cashtext , .balancetext{
        font-size: 30px;
        color: #000;
      }
      .cashmn , .balancemn {
        font-size: 24px;
        color: #999999;
      }
      .icon-wodeqianbao {
        font-size: 36px;
        color: $themeColor;
      }
    }
    .rectangle {
      width: 100%;
      height: 16px;
      padding: 0 !important;
      background: #F3F4F8;
    }
    .footer {
      .survey {
        margin-bottom: 26px; margin-top:26px;
        .todaysv {
          font-size: 28px;
          margin-bottom: 32px;
        }
        .surveyinfo {
          display: flex;
          justify-content: space-between;
          padding: 30px 100px;
          line-height: 60px;
          border-radius: 20px;
          box-shadow: 5px 5px 5px #DDDDDD;
        }
        .surveycount,.goodscount{
          font-size: 26px;
          color: #999999;
        }
        .surverynum,.goodsnum {
          text-align: center;
          font-size: 36px;
          color: #333333;
        }
        .info {
          display: flex;
          width: 100%;
          .infos {
            width: 50%;
            height: 100px;
          }
          .goods {
            width: 50%;
            height: 100px;
          }
        }
      }
      .main-res {
        width: 690px;
        height: 417px;
      }
    }
  }
  .van-popup {
    border-radius: 20px !important;
  }
  .showbox {
    background: #fff;
    width: 630px;
    height: 853px;
    .showboxhead {
      font-size: 28px;
      color: #333;
      text-align: center;
      margin: 30px 0;
    }
    .shouboxmain {
      line-height: 50px;
      overflow: auto;
      height: 700px;
      .showboxinfos {
        margin-bottom: 40px;
      }
      .infoprop {
        font-family: 'PingFang-SC-Medium';
        font-weight: bold;
        font-size: 32px;
        color: #333;
        span {
          margin-left: 15px;
        }
      }
      .infotips {
        font-size: 24px;
        color: #999;
      }
      .blue {
        font-size: 32px;
        color: $themeColor;
      }
    }
    .supplement {
      width: 90% !important;
      border-radius: 44px;
      button {
        background:$themeColor !important;
      }
    }
  }

</style>
