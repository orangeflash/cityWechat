<template>
  <div id="Partnerinvite">
    <Header moreName="" :is-fixed="true" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <div class="headbox">
      <div class="hdgz" @click="goPointPage({name:'Rule',params:{rulefrom:'partnerrule'}})">活动规则</div>
      <div class="headboxbimg">
        <img-wrapper not-load="true" :src="bgimg" class="img"/>
      </div>
      <div class="headboxcontent">
        <img-wrapper not-load="true" :src="hhrimg" class="himg"/>
        <div class="htitle">邀请好友 加入合伙人</div>
        <div class="headboxcontentyqm" v-clipboard:copy="hhrzt.inviteCode"
             v-clipboard:success="onCopy"
             v-clipboard:error="onError">邀请码：<span>{{hhrzt.inviteCode}}</span><span>复制</span></div>
        <div class="headboxcontentsm">您的好友在注册时也可以填写邀请码</div>
        <div class="headboxcontentimg">
          <img-wrapper alt="二维码生成中" isShowView="true" not-load="true" :src="hhrcode" class="img"/>
        </div>
      </div>
      <div class="headboxfoot">
        <div @click="ljfx">转发分享</div>
        <div @click="tpfx">图片分享</div>
      </div>
    </div>
    <share-mask :show-mask.sync="showMask"/>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import ShareMask from "../../components/publication/share-mask";
  import Notice from "../../components/business-district/notice";
  import {utilMixins} from "../../plugins/util-mixins";
  import {updateShareConfig} from "../../util/wechat-util";
  import {hideLoading, showDialog, showLoading, getUrlParams, parseObjToParams} from "../../util";
  import {backendPath, isDev, redirectPath, appId} from "../../project-config/base";
  import bgimg from "../../assets/img/partner/bgimg.png";
  import hhrimg from "../../assets/img/partner/hhrimg.png";
  import btnimg from "../../assets/img/partner/btnimg.png";
  import {Toast} from 'vant';
  export default {
    name: "PartnerInvite",
    components: {ShareMask,Notice},
    data() {
      return {
        bgimg,hhrimg,btnimg,
        hhrzt:{},
        hhrcode:'',
        showMask: false,
      }
    },
    methods: {
      ...mapActions("partner", ["getBannerList","getPartnerconfig","getPartnerstatus","getpartnerCode"]),
      ...mapActions("partner/partnerEnter", ["getpartnerCode"]),
      ljfx(){
        this.showMask = true;
      },
      tpfx(){
        Toast({message:'点击预览二维码长按保存！',duration:1500})
      },
      onCopy: function (e) {
        console.log(e,'复制成功！')
        Toast({message:'复制成功！',duration:1000})
      },
      onError: function (e) {
        console.log(e,'复制失败！')
      },
      async gethhrzt(){
        this.hhrzt=await this.getPartnerstatus()
        console.log(this.hhrzt)
      },
      async gethhrCode(){
        showLoading('二维码加载中')
        this.hhrcode=await this.getpartnerCode()
        hideLoading()
        console.log(this.hhrcode)
      },
      async getPartnerInitializationData() {
        //合伙人状态
        this.gethhrzt()
        //合伙人code
        this.gethhrCode()
      },
    },
    mixins: [utilMixins],
    computed: {
      // ...mapState("common", {
      //   platform: state => state.platform
      // }),
      ...mapState({
        user: state => state.user,
        platform: state => state.platform
      }),
    },

    async created() {
      //
      this.getPartnerInitializationData();
      console.log(this.platform, this.user)
      //配置转发信息
      let data = await this.getPartnerconfig();
      console.log(data,redirectPath,this.user)
      if(data){
        updateShareConfig({
          title: data.title,
          imgUrl: data.shareImg,
          desc: data.shareDescription,
          link: redirectPath+'/home',
        });
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  #Partnerinvite {
    font-size: $font-size-base;
    position: fixed;
    height: calc(100vh - 88px);
    width: 100%;
    .headbox {
      position: relative;
      margin-top: 92px;
      .hdgz{
        position: absolute;
        top: 50px;
        right: 0;
        padding: 10px 20px 10px 30px;
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        color: #fff;
        background-color: $themeColor;
      }
      &bimg{
        width: 100%;
        height: 50%;
        .img{
          @include widhei();
        }
      }
      /*@include flex-center($direction:column,$align:stretch);*/
      @include widhei;
      &content{
        .himg{
          position: absolute;
          width: 70%;
          left: 15%;
          top: -38px;
          height: 80px;
        }
        .htitle{
          position: absolute;
          width: 70%;
          left: 15%;
          top: -38px;
          height: 80px;
          line-height: 80px;
          font-size: $font-size-lg;
          color: #fff;
          text-align: center;
        }
        @include absoluteCenter();
        top:60%;
        @include flex-center($direction:column);
        width: 90%;
        background: #fff;
        margin: 0 0%;
        box-sizing: border-box;
        border-radius: 30px;
        padding: 90px 0px 50px;
        &yqm{
          font-size: $font-size-xl;
          span:nth-child(1){
            color: #FF3838;
            margin: 0 30px 0 20px;
          }
          span:nth-child(2){
            color: $themeColor;
          }
        }
        &sm{
          margin-top: 20px;
          font-size: $font-size-sm;
          color: #999;
        }
        &img{
          width: 100%;
          margin-top: 40px;
          border-top: 1.1px solid #ddd;
          padding: 50px 0 0;
          @include flex-center;
          .img{
            width: 230px;
            height: 230px;
          }
        }
      }
      &foot{
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        padding: 0 5%;
        bottom: 50px;
        @include flex-center($justify:space-around);
        div{
          width: 40%;
          height: 80px;
          background-image: url("../../assets/img/partner/btnimg.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          -webkit-background-size: 100% 100%;
          -o-background-size: 100% 100%;
          background-position: center 0;
          @include flex-center;
          color: #fff;
          font-size: $font-size-xl;
          font-weight: bold;
        }
      }
    }
  }
</style>
