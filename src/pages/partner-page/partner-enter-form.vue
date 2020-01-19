<template>
  <div id="BusinessEnterForm">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <section class="banner__wrap" v-if="bannerList.length">
      <!--<van-swipe :autoplay="3000" :height="200">-->
      <!--<van-swipe-item v-for="(item,index) in bannerList" :key="index">-->
      <!--<img :src="getPathByAssetPath(item.url)" style="width: 100%; height:100%" />-->
      <!--</van-swipe-item>-->
      <!--</van-swipe>-->
      <Banner
        :height="platform.slideNum"
        :notHost="false" :swiper="{children:bannerList}"></Banner>
    </section>
    <header class="form-head">请填写合伙人信息</header>
    <van-cell-group>
      <van-field
        :is-link="!myboss.userId"
        disabled
        error
        label="邀请人"
        @click-icon="yqmClick"
        :placeholder="myboss.name||platform.name">
        <aside v-if="!myboss.userId" slot="icon" class="yqm">
          <em>邀请码绑定</em>
        </aside>
      </van-field>

      <van-field
        v-model="name"
        label="姓名"
        placeholder="请输入您的姓名"
        required
      />
      <van-field
        v-model="tel"
        type="tel"
        label="手机号"
        placeholder="请输入您的手机号"
        :required="partnerConfig.bind=='open'"
      />
      <aside class="protocol__container">
        <check-box :checked.sync="checked" class="checkbox"/>
        <em class="desc">阅读并同意</em>
        <em @click="show=!show" class="doc">《合伙人申请协议》</em>
      </aside>
    </van-cell-group>
    <header class="form-head">请选择合伙人等级</header>
    <van-radio-group v-model="mealId">
      <van-cell-group>
        <van-cell center v-for="item in businessPackages" :key="item.id"  @click="radioChange(item.id)">
          <van-radio :checked-color="$themeColor" slot="icon" :name="item.id"/>
          <van-cell>
            <template slot="title">
              <div class="hhrdj">
                <div>{{item.name}}<span class="hhrdjzq">账期：{{item.days}}天</span></div>
                <div class="hhmoney">{{+item.money?item.money+'元':'免费'}}</div>
              </div>
              <div class="hhrdj" style="margin-top: 5px;">
                <div @click="gradeInfoshow=true" class="hhjrfy">提成比例:<span class="hhrdjtcbl">查看</span></div>
                <div class="hhjrfy">加入费用</div>
              </div>
            </template>
          </van-cell>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <header class="form-head">提成比例及说明</header>
    <div class="tcblsm">
      <ul>
        <li><span>{{chooseMeal.name}}</span>加入费用<span>¥{{chooseMeal.money}}</span></li>
        <!--<li>您的粉丝付费发布、置顶、刷新、入驻商户、加入合伙人等操作，您可获得提成<span>8%（二级6%）</span>，躺着就能赚钱。</li>-->
        <li>您的粉丝付费发布、置顶、刷新、入驻商户、加入合伙人等操作，您可获得提成，躺着就能赚钱。</li>
        <li style="margin-top: 10px;">收益账期为<span>T+{{chooseMeal.days}}天</span>，产生的收益会在<span>{{chooseMeal.days}}天</span>后自动转入您的钱包。</li>
      </ul>
    </div>
    <!--分销等级弹出框-->
    <van-dialog
      class="dialog"
      :title="chooseMeal.name"
      v-model="gradeInfoshow"
    >
      <ul class="gradeInfo">
        <li>加入合伙人比例<span>{{gradeInfo.partnerFirst}}%<span v-if="partnerConfig.class=='2'">（二级{{gradeInfo.partnerSecond}}%）</span></span></li>
        <li>信息相关比例<span>{{gradeInfo.postFirst}}%<span v-if="partnerConfig.class=='2'">（二级{{gradeInfo.postSecond}}%）</span></span></li>
        <li>商家相关比例<span>{{gradeInfo.storeFirst}}%<span v-if="partnerConfig.class=='2'">（二级{{gradeInfo.storeSecond}}%）</span></span></li>
      </ul>
    </van-dialog>
    <!--邀请码弹出框-->
    <van-dialog
      class="dialog"
      title="邀请码绑定"
      v-model="dialogshow"
      show-cancel-button
      :before-close="beforeClose"
    >
      <van-field
        class="dialogyqm"
        v-model="yqm"
        placeholder="请输入您好友的邀请码"
      />
      <div class="dialogts">注意：绑定合伙人成功后，将无法修改上下级关系哦！</div>
    </van-dialog>
    <!--协议弹出框-->
    <van-popup v-model="show" class="popupPact" position="right">
      <p class="pactBody" v-html="partnerConfig.agreement"></p>
      <div class="cancel" @click="show=!show">
        <span class="cancel-text">
          我已阅读并同意此协议
        </span>
      </div>
    </van-popup>
    <footer class="submit__container">
      <button class="feature-btn" :disabled="!checked" @click="partnerFormSubmit">
        {{+chooseMeal.money?`支付金额 ${(+chooseMeal.money).toFixed(2)}`:'确认'}}
      </button>
    </footer>
    <!--<pay-mask :show-mask.sync="showPayMask" :money="+chooseMeal.money" @pay="payHandle"/>-->
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import Banner from '../../components/home/banner'    //首页banner
  import InputWithCmp from "../../components/publication/input-with-cmp";
  import BasicForm from "../../components/publication/basic-form";
  import CheckBox from "../../components/basic/check-box";
  import {hideLoading, randomNumber, showDialog, showLoading,showHandleStatusByFlag, validFormNotEmpty} from "../../util";
  import PayMask from "../../components/publication/pay-mask";
  import _ from 'lodash'
  import {Popup, Dialog} from 'vant';
  import {chooseWXPay} from "../../util/wechat-util";
  import Header from "@/components/header";
  import {Toast} from 'vant';

  export default {
    name: "PartnerEnterForm",
    components: {Banner, CheckBox, BasicForm, InputWithCmp, PayMask, Header},
    data() {
      return {
        yqm: "",
        checked: true,
        shopIntroduction: "",
        mealId: 0,            //选择的套餐
        bannerList: [],
        showPayMask: false,
        show: false,
        dialogshow: false,
        gradeInfoshow:false,
        gradeInfo:'',
        myboss:{name:"",userId:0},
        name: '',
        tel: '',
      }
    },
    methods: {
      ...mapActions("partner", ["getBannerList", "getPartnergrade","getPartnerconfig","getPartnergradeInfo","getPartnerstatus"]),
      ...mapActions('personal',['getUserInfoById']),
      ...mapActions("partner/partnerEnter", ["submitPartnerForm","getpartnerMyBoss","getFindsuperior","payPartnerEnterAction"]),
      async yqmClick(){
        const bool=await this.checkBindTel()
        if(!bool) return
        this.dialogshow=true
      },
      async beforeClose(action, done) {
        console.log(action)
        if (action === 'confirm') {
          if(this.yqm==''){
            done()
            Toast({message:'请填写邀请码',duration:1000})
            setTimeout(()=>{
              this.dialogshow=true
            }, 1000);
            return
          }
          // showLoading()
          const yqminfo=await this.getFindsuperior({inviteCode:this.yqm})
          yqminfo.code||showHandleStatusByFlag(yqminfo.code,'绑定成功',yqminfo.msg)
          if(yqminfo.code){
          this.myboss=yqminfo.data
          }
          done();
          // showHandleStatusByFlag(true,'绑定成功')
          // showHandleStatusByFlag([true,'绑定成功'])
          // setTimeout(done, 1000);
        } else {
          done();
        }
      },
      // 提交
      async partnerFormSubmit() {
        const bool=await this.checkBindTel()
        if(!bool) return
      //   this.goPointPage({name:"PartnerHome"})
      //   return
        const meal = this.chooseMeal, mealId = this.mealId,name=this.name,tel=this.tel,excludeList=this.partnerConfig.bind=='open'?[]:['tel'],
          inviter=this.myboss.name||this.platform.name,inviterId=this.myboss.userId||0;
        console.log(meal,mealId,name,tel,inviter,inviterId)
        const needValidForm = {gradeId: mealId,name,tel}
        if (!validFormNotEmpty(needValidForm,excludeList)) {
              return showDialog("请填写完整信息!", "提示", false);
        }
        const form = {
          ...needValidForm,
          inviter,
          inviterId,
          money:meal.money,
        }
        console.log(form)
        showLoading();
        this.hhroid = await this.submitPartnerForm(form);
        if (+meal.money >0 ) {
          try {
            hideLoading();
            await showDialog("成为合伙人需要支付" + meal.money + "元", "提示");
            this.$router.push({
              name: 'cashier',
              params: {
                type: 14,
                param: {
                  distributionId: this.hhroid,
                },
                info: {
                  money: meal.money,
                  type: "申请合伙人",
                  callLink: "/partner"
                }
              }
            });
          } catch (e) {
            console.log('用户没同意进入支付页面')
          }

          return;
        }
        // hideLoading();
        showHandleStatusByFlag([true,'提交成功'])
        let vueObj = this;
        setTimeout(function () {
          vueObj.goPointPage({name:'PartnerIndex'},true)
        }, 1000)
      //
      },
      async getUserInfo(){
        this.userinfo=await this.getUserInfoById()
        console.log(this.userinfo)
        if (this.userinfo.isPartner=='1') {
          await showDialog("您已成为合伙人", "提示", false);
          this.$replaceRoute({name:'PartnerIndex'});
        }
      },
      async banner(){
        this.bannerList = await this.getBannerList({
          type: 8, adType: 2
        });
      },
      async getGrade(){
        // 默认选中第一个
        await this.getPartnergrade();
        this.mealId = this.businessPackages[0].id;
        this.radioChange(this.mealId)
      },
      async gethhrpz(){
        await this.getPartnerconfig();
        console.log(this.partnerConfig)
      },
      async getMyboss(){
        this.myboss=await this.getpartnerMyBoss();
        console.log('myboss',this.myboss)
      },
      async getCmpInitializationData() {
        //获取用户信息
        this.getUserInfo();
        //获取轮播图
        this.banner();
        //获取等级
        this.getGrade();
        //合伙人配置
        this.gethhrpz();
        //我的上线
        this.getMyboss()
      },
      async radioChange(id){
        this.mealId=id;
        this.gradeInfo=await this.getPartnergradeInfo({gradeId:id})
        console.log(this.gradeInfo)
      },
    },
    computed: {
      ...mapState({
        user: s => s.user
      }),
      // ...mapState("partner/partnerEnter", {
      //   businessPackages: state => state.businessPackages,
      // }),
      ...mapState("partner", {
        partnerConfig: state => state.partnerConfig,
        businessPackages: state => state.businessPackages,
      }),
      chooseMeal() {
        // if (+this.storeConfig.charge === 2) return {};
        return _.find(this.businessPackages, {id: this.mealId}) || {};
      },
      previewId() {
        return this.randomNumber();
      }
    },
    async created() {
      await this.getCmpInitializationData();
    }
  }
</script>


<style lang="scss">
  @import "../../assets/common";

  #BusinessEnterForm {
    .van-radio {
      font-size: 0;
    }

    .van-icon-check {
      color: $themeColor;
    }

    .van-icon-checked {
      color: $themeColor;
    }
  }

  .van-cell__title {
    color: #666;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  #BusinessEnterForm {
    padding-bottom: 120px;

    .banner__wrap {
      font-size: 0;

      img {
        width: 100%;
      }
    }

    .form-head {
      color: #777777;
      padding: 25px 29px;
      font-size: $font-size-base;
      @include flex-between;

      &__legend {
        font-size: $font-size-base;
      }

      &__version-info {
        color: $themeColor;
      }
    }

    .van-cell {
      font-size: 15px;
    }

    .yqm {
      color: #666;
    }

    .hhrdj {
      @include flex-between;

      .hhmoney {
        color: $themeColor;
        font-size: $font-size-xl;
      }

      .hhjrfy {
        color: #999;
        font-size: $font-size-sm;
      }

      &tcbl {
        color: #FF5669;
      }

      &zq {
        font-size: $font-size-sm;
        background: #FF5669;
        padding: 2px 10px;
        margin-left: 10px;
        border-radius: 10px;
        color: #fff;
      }
    }

    .tcblsm {
      background: #fff;
      padding: 25px 29px;
      line-height: 40px;

      span {
        color: $themeColor;
      }
    }

    .protocol__container {
      display: flex;
      align-items: center;
      height: 74px;
      padding: 0 30px;
      background-color: #fff;

      .checkbox {
        padding-right: 20px;
        padding-left: 4px;
      }

      .desc {
        font-size: 24px;
        color: #999999;

      }

      .doc {
        color: $themeColor;
      }
    }

    .submit__container {
      position: fixed;
      width: 100%;
      bottom: 0;
      @include flex-center;
      background-color: #fff;
      padding: 0;

      .feature-btn {
        flex: 1;
        height: 90px;
        background-color: $themeColor;
        border-radius: 0px;
        @include flex-center;
        font-size: 34px;
        color: rgba(255, 255, 255, 1);

        &:disabled {
          background-color: #ccc;

        }
      }
    }

    .popupPact {
      width: 100%;
      height: 100%;
      background-color: #f9f9f9;
    }

    .pactBody {
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
      line-height: 40px;
      overflow-Y: scroll;
      height: calc(100% - 130px);
      padding: 30px 30px 0;
      font-size: 28px;
    }
    .cancel {
      width: 100%;
      height: 130px;
      box-sizing: border-box;
      text-align: center;
      color: #fff;
      background-color: #fff;
      @include flex-center;

      .cancel-text {
        display: inline-block;
        height: 88px;
        line-height: 88px;
        width: 80%;
        font-size: 30px;
        background-color: $themeColor;
        border-radius: 10px;
      }
    }

    .dialogyqm {
      margin: 20px 10%;
      width: 80%;
      box-sizing: border-box;
      border: 1PX solid #ddd;
    }

    .dialogts {
      font-size: $font-size-xss;
      color: #FF8D39;
      padding-bottom: 40px;
    }
    .gradeInfo{
      padding: 50px 20px;
      font-size: $font-size-base;
      li{
        margin-bottom: 20px;
      }
      span{
        color: #FF5669;
        margin-left: 10px;
      }
    }
  }
</style>
