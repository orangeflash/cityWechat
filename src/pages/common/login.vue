<template>
  <dd-layout-div mi-h="100vh" class="bg-f">
    <!--这个头部是组件来的 S-->
    <!--<Header></Header>-->
    <div class="dh-100 flex-y-center pad-lr fon-b col-6 flex-bt">
      <div @click="$router.go(-1)">
        <i class="iconfont icon-fanhui1 fon-35 mar-t-5 mar-r-10 col-6"></i>
        返回
      </div>
    </div>
    <!--这个头部是组件来的 E-->
    <div class="pad-t pad-lr bg-f">

      <div class="fon-46">手机快捷登录</div>
      <p class="col-9 mar-t pad-b">未注册过的手机号将自动创建账号</p>

      <div class="mar-t pad-t pad-b">
        <div class="flex-bt br-b-e flex-y-center">
          <div @click="show=true" class="flex-g-0 fon-xl pad-t-20 pad-b-20 col-9">
            <span class="mar-r-10">{{areaCode}}</span>
            <i class="iconfont icon-youjiantou2 mar-r-10"></i>
          </div>
          <div class="flex-g-1 flex-bt flex-y-center">
            <input v-model="phone" @blur="temporaryRepair" class="dh br-n fon-xl input-p-b flex-g-1" type="text"
                   placeholder="请输入手机号码"
                   style="outline: none"
            />
            <span class="fon-lg col-9 flex-g-0 t-r" v-if="!waitTime" @click="getVerificationCode">获取验证码</span>
            <span class="fon-lg col-9 flex-g-0 t-r" v-else>{{`(${waitTime}s)后重新获取`}}</span>
          </div>
        </div>
        <div class="flex-bt br-b-e flex-y-center pad-t pad-b-10">
          <input v-model="code" @blur="temporaryRepair" class="dh br-n fon-xl input-p-b flex-g-1 mar-r" type="text"
                 placeholder="请输入验证码"
                 style="outline: none"/>
        </div>
      </div>
    </div>
    <AgreeAgreement
      :status="agreeAgreement"
      @choice="agreeAgreement = !agreeAgreement"
      :con="agreementHtml"
      :name='platform.name + "用户服务协议"'
      before="登录即表示您"
    ></AgreeAgreement>
    <div class="dh"></div>
    <div class="mar-t mar-lr dh flex-center fon-lg bg-t col-f br-r-40"
         :class="!canLogin&&'op-6'"
         @click="login"
    >
      登录
    </div>
    <van-popup v-model="show" position="bottom" class="flex-col">
      <dd-layout-div class="over-y-s flex-g-1">
        <dd-layout-div :class="{'col-t':item.phoneCo==areaCode,}" @click="selectCode(item.phoneCo)" v-for="(item,index) in countryData" :key="index" class="dd-cell pad-30">
          <span>{{item.county}}</span>
          <span>{{item.phoneCo}}</span>
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="flex-g-0 pad-30">
        <dd-button
          class="bg-t"
          type="release"
          @click="show=false"
          :style="{background:$themeColor}"
          name="确定"
        ></dd-button>
      </dd-layout-div>
    </van-popup>
  </dd-layout-div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import CheckBox from "../../components/basic/check-box";
  import {BaseTimer, DEFAULT_VERIFICATION_TIME_OUT} from "../../util/timer";
  import DdButton from "../../components/template/button"
  import {Toast} from 'vant'
  import countryData from "../../../static/countryJson"

  import AgreeAgreement from '@/components/template/agree-agreement'

  import {
    showDialog,
    showHandleStatusByFlag,
    validFormNotEmpty,
    isTellPhone,
    getGlobalData,
    showLoading, hideLoading, showText
  } from "../../util";
  import Agreement from "../../components/publication/agreement";
  import Header from "@/components/header";
  import {isH5} from "../../project-config/base";

  export default {
    name: "Login",
    components: {CheckBox, AgreeAgreement, DdButton},
    data() {
      return {
        phone: "",
        code: "",
        openId: "",
        checked: false,
        waitTime: 0,
        isSendCode: false,
        agreeAgreement: true,
        agreementHtml: "",
        show: false,//国家区号相关
        areaCode:'',
        language: 'cn',
        languageData: '',
        countryData: '',
        countryDataList: [],
      }
    },
    methods: {
      ...mapActions("common/login", ["sendVerificationCodeAction", "bindUserPhoneAndInfo", "getH5VerificationCode"]),
      ...mapActions(["loginAction", "userLogin"]),
      ...mapActions("home", ['getPlatformInfo']),
      ...mapActions("partner/partnerEnter", ["getpartnerBindDistribution"]),
      selectCode(e){
        this.areaCode=e
        this.show=false
      },
      getData() {
        this.countryData = countryData[this.language]
        this.areaCode=countryData[this.language][0].phoneCo
        //console.log(countryData, this.countryData)
      },
      async getVerificationCode() {
        /*
          if (!validFormNotEmpty({phone: this.phone})) {
            return showDialog("请填写手机号后再发送验证码！")
          }
        */
        if (!isTellPhone(this.phone)) {
          return showDialog("请填写正确的手机号", '提示', false)
        }

        showLoading()
        const params = {
          code: this.verificationCode,
          tel: this.phone,
          areaCode:this.areaCode.substr(1),
        }
        const res = isH5() ? await this.getH5VerificationCode(params) : await this.sendVerificationCodeAction(params);
        if (res.code == 0) {
          return Toast({
            message: res.msg,
            duration: 3000
          })
        }else {
          showText('发送成功')
        }


        // 如果用户点击了发送验证码的按钮就变成true
        this.isSendCode = true;
        this.waitTime = DEFAULT_VERIFICATION_TIME_OUT;
        new BaseTimer(this.waitTime, ({count}) => {
          this.waitTime = count;
        });
      },
      hide() {
        this.isShow = false;
      },
      async login() {
        // if (!this.codeIsValid) {
        //   return showDialog("请输入正确的验证码");
        // }
        // return false;


        if (!this.isSendCode) {
          return showDialog("请先获取验证码，再进行登入", '提示', false);
        }

        if (!isTellPhone(this.phone)) {
          return showDialog("请填写正确的手机号", '提示', false);
        }

        if (!this.code.toString().trim()) {
          return showDialog("请填写验证码", '提示', false);
        }

        if (!isH5() && this.randomCode != this.code) {
          return showDialog("验证码不正确", '提示', false);
        }

        if (!this.agreeAgreement) {
          return showDialog("请同意并遵守《用户登录协议条款》", '提示', false)
        }

        const {data, code, msg} = isH5() ? await this.userLogin({
          tel: this.phone,
          code: this.code
        }) : await this.loginAction({
          userTel: this.phone,
          type: 'weChat',
          openId: localStorage.openId,
          userName: this.userInfo.userName,
          portrait: this.userInfo.portrait,
          sex: this.userInfo.sex
        });

        //code && this.$pushRoute("/home?appId="+localStorage.projectAppId);
        // if (code && Number(getGlobalData("partnerId")) > 0) {

        // }

        if (isH5()) {
          showHandleStatusByFlag(code, "登录成功", msg, (bool) => {
            if (bool) {
              this.$route.query.callBack ? this.$router.go(-1) : this.goPointPage({
                path: "/home"
              })
            }
          });
        } else {
          this.getpartnerBindDistribution({inviterId: getGlobalData("partnerId")})
          showHandleStatusByFlag(code, "绑定成功", msg);
          code && this.$route.query.callBack ? this.$router.go(-1) : this.goPointPage({
            path: "/home"
          })
        }


      }
    },
    computed: {
      ...mapState({
        platform: state => state.platform,
        userInfo: state => state.user,
      }),
      verificationCode() {
        this.randomCode = this.randomNumber(6);
        return this.randomCode;
      },
      codeIsValid() {
        return +this.verificationCode === +this.code;
      },
      canLogin() {

        return this.isSendCode && +this.code && this.agreeAgreement

      }
    },
    async created() {
      this.openId = this.$route.query["openId"];
      this.getData()
      const data = await this.getPlatformInfo();
      this.agreementHtml = data.data.platformAgreement;

    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #Login {
    overflow: hidden;

    .c-form {
      background-color: #FFFFFF;
      padding-top: 10px;
      padding-bottom: 60px;

      .c-form-cmp {
        padding: 0 30px;

        .c-form-cmp__item {
          padding: 30px 0;
          @include alignCenter;
          border-bottom: 1PX solid #DDDDDD;
        }

        .c-form-cmp__feature-btn {
          padding: 20px 30px;
          @include flex-center;
          background: $themeColor;
          border-radius: 31px;
          font-size: 26px;
          color: rgba(255, 255, 255, 1);
        }

        .c-form-cmp__feature-btn--disabled {
          @extend .c-form-cmp__feature-btn;
          background-color: #ccc;

          &:active {
            opacity: 1;
          }
        }

        .c-form-cmp__input {
          border: none;
          flex: 1;
          height: 60px;
          font-size: 30px;
          padding: 0 20px;

          &::-webkit-input-placeholder {
            color: rgba(187, 187, 187, 1);
          }
        }
      }

      .c-protocol {
        @include alignCenter;
        margin-left: 50px;
        margin-top: 61px;

        .c-protocol__legend {
          vertical-align: middle;
          margin-left: 15px;
          margin-bottom: -3px;
          font-size: 26px;
          color: rgba(102, 102, 102, 1);
        }

        .c-protocol__link {
          color: #56A2FF;
        }
      }

      .c-form__submit {
        width: 690px;
        height: 88px;
        background: $themeColor;
        border-radius: 44px;
        @include flex-center;
        margin: 0 auto;
        margin-top: 41px;
        font-size: 34px;
        color: rgba(255, 255, 255, 1);

        &--disabled {
          @extend .c-form__submit;
          background-color: #ccc;
        }
      }
    }

    .popupPact {
      position: fixed;
      width: 100%;
      height: 100%;
    }
  }
</style>
