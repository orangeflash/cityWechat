<template>
  <div id="Partner">
    <Header moreName="" :children-title="hhrpz.field" :is-fixed="true" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <div class="banner-box">
      <Banner :notHost="false"
              :height="platform.slideNum"
              :swiper="{children:bannerList1}"></Banner>
    </div>
    <Notice class="notice"  :notice="noticeList"
            @featureClick="storeCanEnter&&featureClick()"/>
    <div class="Partner_main">
      <div class="Partner_mainzsql">
        <div class="Partner_mainzsql_hd">
          <img-wrapper  not-load="true":src="timg" class="himgl"></img-wrapper>
          <em>专属权益</em>
          <img-wrapper not-load="true" :src="timg" class="himgr"></img-wrapper>
        </div>
        <div class="Partner_mainzsql_cell" v-for="(item,index) in zsql" :key="index">
          <div class="Partner_mainzsql_cell_hd">
               <span>{{index+1}}</span>
          </div>
          <ul class="Partner_mainzsql_cell_bd">
              <li>{{item.title}}</li>
              <div class="Partner_mainzsql_cell_bd_f">
                <li>{{item.content}}</li>
                <div class="rimg">
                  <img-wrapper v-for="(imgitem,key) in item.photoList" :key="key" :src="getPathByAssetPath(imgitem.url)" ></img-wrapper>
                </div>

              </div>
          </ul>
        </div>
      </div>
      <div class="Partner_mainzsql Partner_maincjwt">
        <div class="Partner_mainzsql_hd">
          <img-wrapper  not-load="true":src="timg" class="himgl"></img-wrapper>
          <em>常见问题</em>
          <img-wrapper not-load="true" :src="timg" class="himgr"></img-wrapper>
        </div>
        <div class="Partner_mainzsql_cell" v-for="(item,index) in cjwt">
          <div class="Partner_mainzsql_cell_hd">
            <span>{{index+1}}</span>
          </div>
          <ul class="Partner_mainzsql_cell_bd">
            <li>{{item.title}}</li>
            <div class="Partner_mainzsql_cell_bd_f">
              <li>{{item.content}}</li>
              <!--<img-wrapper not-load="true" :src="item.img" class="rimg"></img-wrapper>-->
            </div>
          </ul>
        </div>
        <div class="Partner_mainzsql_cell">
          <div class="Partner_mainzsql_cell_hd">
            <span>{{cjwt.length+1}}</span>
          </div>
          <ul class="Partner_mainzsql_cell_bd">
            <li>招募城市合伙人</li>
            <div class="Partner_mainzsql_cell_bd_f">
              <li @click="callTel(`tel://${platform.phone}`)">
                平台招募各城市合伙人！加盟电话：<span>{{platform.phone}}</span>
              </li>
              <!--<img-wrapper not-load="true" :src="item.img" class="rimg"></img-wrapper>-->
            </div>
          </ul>
        </div>
      </div>
    </div>
    <div class="Partner_foot">
      <button @click="hhrclick">{{hhrzt.state=='0'?'待审核':hhrzt.state=='2'?'已拒绝':hhrzt.state=='1'?'我的合伙人':'我要成为合伙人'}}</button>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import Banner from '../../components/home/banner'    //首页banner
  import Notice from "../../components/business-district/notice";
  import {utilMixins} from "../../plugins/util-mixins";
  import {updateShareConfig} from "../../util/wechat-util";
  import {hideLoading, showDialog, showLoading, getUrlParams, parseObjToParams} from "../../util";
  import {Toast} from 'vant';
  import timg from "../../assets/img/partner/timg.png";
  import tjjl from "../../assets/img/partner/tjjl.png";
  import sstx from "../../assets/img/partner/sstx.png";
  import jdry from "../../assets/img/partner/jdry.png";
  import srys from "../../assets/img/partner/srys.png";

  export default {
    name: "Partner",
    components: {Banner, Notice},
    data() {
      return {
        zsqllsit: [
          {title:"推荐奖励",content:'你推荐的朋友只要首次进入生活网，他们付费发布、刷新、置顶信息、入驻好店、入驻电话本、开通一卡通、' +
              '商城购物、抢购都可以获得粉丝持续收益！推荐粉丝开通合伙人还可以成为你的合伙人享受持续收益！',img:tjjl}
              ],
        cjwtlsit: [
          {title:"加入好处",content:'推广持续收益：1、比上班轻松，比微商更赚钱。2、赚钱是自己的，客户是自己的。3、自己使用省钱，简单推广轻松赚钱。',},
        ],
        zsql:[],
        cjwt:[],
        bannerList1: [],
        timg,tjjl,sstx,jdry,srys,
        noticeList: [],
        hhrpz:{},
        hhrzt:{},
        userinfo:null,
      }
    },
    methods: {
      ...mapActions("partner", ["getBannerList", "getAnnounceList","getExclusive","getPartnerconfig","getPartnerstatus"]),
      ...mapActions("partner/partnerEnter", ["getpartnerStatistics","getpartnerNewlist"]),
      ...mapActions('personal',['getUserInfoById']),
      async getUserInfo(){
        this.userinfo=await this.getUserInfoById()
        console.log(this.userinfo)
      },
      async getqlwt(){
        this.qlwt=await this.getExclusive();
        let a=[],b=[];
        for(let i=0;i<this.qlwt.length;i++){
          if(this.qlwt[i].type==1){
            a.push(this.qlwt[i])
          }
          if(this.qlwt[i].type==2){
            b.push(this.qlwt[i])
          }
        }
        this.zsql=a,this.cjwt=b;
        console.log(a,b)
      },
      async gethhrpz(){
        this.hhrpz=await this.getPartnerconfig()
        updateShareConfig({
          title: this.hhrpz.title,
          imgUrl: this.hhrpz.shareImg,
          desc: this.hhrpz.shareDescription,
        })
        console.log(this.hhrpz)
      },
      async gethhrzt(){
        this.hhrzt=await this.getPartnerstatus()
        console.log(this.hhrzt)
      },
      async gethhrzxsy(){
        const hhrzxsy=await this.getpartnerNewlist();
        this.noticeList=_.map(hhrzxsy, (item) =>{
          return {title: `${item.userName}收入${(+item.income).toFixed(2)}元(${item.incomeType})`,'content':''}
        }) || []
        console.log(hhrzxsy,this.noticeList)
      },
      async getPartnerInitializationData() {
        //获取用户信息
        this.getUserInfo();
        //合伙人配置
        this.gethhrpz()
        //最新收益
        this.gethhrzxsy()
        //合伙人状态
        this.gethhrzt()
        //获取权利信息
        this.getqlwt();
        //获取轮播图
        const bannerAction = (adType) => this.getBannerList({
          type: 8, adType
        });

        bannerAction(1).then(val => {
          // val.forEach(v => v.notHost = true);
          this.bannerList1 = val;

        });
      },
      callTel(tel){
        location.href = tel;
      },
      async hhrclick(){
        const bool=await this.checkBindTel()
        if(!bool) return
        const userinfo=this.userinfo,hhrzt=this.hhrzt
        console.log(userinfo,hhrzt)
        if(userinfo.isPartner=='2'&&!hhrzt){
          this.goPointPage({name:'PartnerEnterForm'})
        }
        else if(hhrzt.state=='0') {
          return Toast('请等待管理员审核')
        }
        else if(hhrzt.state=='2') {
          return Toast('请联系管理员')
        }
        else if(userinfo.isPartner=='1'&&hhrzt.state=='1') {
          this.goPointPage({name:'PartnerHome'})
        }
      },
    },
    mixins: [utilMixins],
    computed: {
      // ...mapState({
      //   user: state => state.user,
      //   platform: state => state.platform
      // }),
    },

    async created() {
      //
      this.getPartnerInitializationData();
      console.log(this.platform,)
    }
  }
</script>
<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  #Partner {
    font-size: $font-size-base;
    /*min-height: calc(100vh - 80px);*/
    width: 100%;
    padding-bottom: 130px;

    .banner-box {
      margin-top: 88px;
    }

    .notice {
      border-radius: 0;
    }

    .Partner_main {
      padding: 20px 30px;

      &zsql {
        @include blockcontent;
        &_hd{
          margin: 20px 0 10px;
          @include flex-center;
          em{
            margin: 0 30px;
            font-size: $font-size-lg;
          }
          .himgl{
            width: 130px;
          }
          .himgr{
            width: 130px;
            transform:rotate(180deg);
          }
        }
        &_cell{
          @include flex-center($align:stretch);
          padding: 30px 0;
          border-bottom: 1PX solid #f5f5f5;
          &:last-child{
            border: none;
          }
          &_hd{
            span{
              @include flex-center();
              background: #FFDE00;
              @include widhei($width:30px,$height:30px,$brs:50%);
              font-size: $font-size-xs;
            }
            margin-right: 10px;
          }
          &_bd{
            flex: 1;
            @include flex-center($direction:column,$align:stretch);
            &_f{
              margin-top: 20px;
              color: #777777;
              font-size: $font-size-xs;
              @include flex-center($direction:row,$align:flex-start);
              li{
                flex: 1;
                line-height: 40px;
                span{
                  color: $themeColor;
                  font-weight: bold;
                }
              }
              .rimg{
                width: 100px;
                height: 100px;
                margin-left: 20px;
              }
            }
          }
        }
      }
      &cjwt {
        margin-top: 20px;
      }
    }

    .Partner_foot {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 30px;
      position: fixed;
      bottom: 0px;

      button {
        @include footbtn;
        box-shadow: 5px 10px 20px #cccccc;
      }
    }
  }
</style>
