<template>
  <div class="firm-attest">
    <AttestHeader v-bind="defaultData"/>
    <article class="user-info">

      <van-cell-group>
        <div class="list-title">
          <span>企业/个体工商户认证</span>
        </div>
        <!--<van-field-->
          <!--clearable-->
          <!--label="企业/个体工商户认证"-->
          <!--placeholder=""-->
          <!--disabled-->
          <!--class="user-input"-->
        <!--/>-->
        <van-field
          v-model="username"
          clearable
          label="主体名称"
          placeholder="请输入企业/个体工商户名称"
          class="info-input"

        />
        <a class="a-box" @click="showSubjectType">
          <van-field
            v-model="subjectType"
            label="主体类型"
            :placeholder="subjectType"
            clearable
            class="subjectType"
            value="输入框已禁用"
          />
          <div class="a-box-plane"></div>
        </a>


        <van-field
          v-model="userNumber"
          label="执照注册号"
          placeholder="请输入营业执照注册号"
          clearable
          class="info-input"
        />
        <van-field
          v-model="phoneTel"
          type="tel"
          label="联系电话"
          placeholder="请输入联系电话"
          clearable
          class="info-input"
        />
      </van-cell-group>
    </article>
    <footer class="upDataImg">
      <van-field
        clearable
        label="材料证明"
        placeholder=""
        disabled
        class="user-input"
      />
      <div class="left public">
        <strong class="title">营业执照</strong>
        <van-uploader :after-read="onReadFacade">
          <div class="upload">
            <img-wrapper not-load="true" v-if="hasImg" :src="hasImg" class="show-img"/>
            <span class="camera" v-else>
              <van-icon name="photograph" color="#fff" size="35px"/>
            </span>
          </div>
        </van-uploader>
      </div>
      <div class="right">
        <img  :src="backendPath+'/wechatimg/testcenter/attestCenter.png'"  class="show-img"/>
        <!--<i class="iconfont icon-guanbi clone" @click="cloneClick" v-show="isShowClone"></i>-->
      </div>
    </footer>
    <p class="footer-title">请提供清晰的营业执照的照片、编号、文字需清晰可见</p>
    <aside class="submit__container__top">
      <check-box :checked.sync="protocolChecked" class="checkbox"/>
      <em class="desc">阅读并同意</em>
      <em @click="show=!show" class="doc">《认证协议条款》</em>
    </aside>
    <van-popup v-model="show" class="popupPact" position="right">
      <p class="pactBody" v-html="htmlBody"></p>
      <div class="cancel" @click="show=!show">
        <span class="cancel-text">
          我已阅读并同意此协议
        </span>
      </div>
    </van-popup>
    <div class="submit">
      <van-button type="primary" size="large" class="submit" :disabled="!protocolChecked" @click="submitAdd">提交
      </van-button>
    </div>
    <van-popup position="bottom" v-model="pickerIsShow">
      <van-picker
        show-toolbar
        title="主体类型"
        :columns="columns"
        @cancel="pickerIsShow=false"
        @confirm="onCubjectType"
      />
    </van-popup>

  </div>
</template>

<script>
  import {Toast} from 'vant';
  import AttestHeader from "../../components/attest/attest-header"
  import CheckBox from "../../components/basic/check-box";
  import {mapActions,mapState} from 'vuex';
  import {showLoading, hideLoading} from "../../util/index";
  import {requestByUpload} from "../../util/request.js";
  import attest from "../../assets/img/personal/attestCenter.png"
  import release from '../../assets/img/personal/release.png'

  import {backendPath} from "../../project-config/base"

  export default {
    name: "firmAttest",
    components: {AttestHeader, CheckBox},
    data() {
      return {
        backendPath,
        release,
        username: '',
        subjectType: '个体工商户',
        userNumber: '',
        phoneTel: '',
        protocolChecked: false,
        htmlBody: '',
        show: false,
        license: attest,
        hasImg : false,
        PositiveImg: '',
        attest,
        isShowClone: false,
        columns: ["个体工商户", "企业", "社会团体","事业单位","其他机构"],
        pickerIsShow: false,
      }
    },
    methods: {
      ...mapActions("attest", ["postAttestByPost", 'getAttestByPost']),
      async getAgreement() {
        const {identComment} = await this.getAttestByPost()
        this.htmlBody = identComment
      },
      async onReadFacade(e) {
        this.hasImg = e.content
        this.isShowClone = true;
        const formdata = new FormData()
        formdata.append("positiveImg", e.file)
        this.PositiveImg = await requestByUpload(formdata)
      },
      cloneClick() {
        this.license = this.attest;
      },
      async submitAdd() {
        showLoading("认证提交中，请稍等")
        if (!this.username.trim() || (!this.subjectType.trim() && this.subjectType != "请选择营业主体类型") || !this.phoneTel.trim() || !this.userNumber.trim().length || !this.PositiveImg) {
          return Toast.fail("缺少必填项,请填写完整")
        }
        const tempArr = [];
        tempArr.push({type: 'img', url: this.PositiveImg.src})
        const from = {
          name: this.username,
          themeType: this.subjectType,
          linkTel: this.phoneTel,
          code: this.userNumber,
          PositiveImg: tempArr,
          type: 2,
          userId : this.$route.query.id
        }
       const res = await this.postAttestByPost({
          ...from
        })
        hideLoading();
        Toast.success("申请成功");
        if(res.code === 1){
          setTimeout(() => {
            this.$router.go(-1);
          }, 1500)
        }else{
          Toast(res.msg)
        }

      },
      showSubjectType(){
        this.pickerIsShow = true;
      },
      onCubjectType( values){
        this.pickerIsShow=false
        this.subjectType = values
      }
    },
    created() {
      if (!this.$route.query.id) {
        Toast.fail("缺少id参数");
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500)
      }

      this.getAgreement()
    },
    computed: {
      ...mapState({
        user : state => state.user
      }),
      defaultData() {
        return {
          backgroundColor: "rgba(206,109,15,1)",
          title: "企业认证",
        }
      }

    },

  }
</script>
<style lang="scss">
  .user-input .van-cell__title span {
    color: rgba(153, 153, 153, 1);
    font-size: 14px;
  }
  .user-input .van-cell__title {
    max-width: 300px;
  }
  .van-cell__title{
    font-size: 14px;
  }
  .firm-attest .van-cell{
    padding: 10px 20px;
  }
</style>

<style scoped lang="scss">
  @import "../../assets/theme";
  .a-box{
    position: relative;
    overflow: hidden;
    display: block;
    .a-box-plane{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .user-info {
    margin-top: 20px;

    .user-input {
      height: 100px;
      line-height: 60px;
    }
  }

  .info-input {
    height: 100px;
    line-height: 60px;
  }

  .upDataImg {
    margin: 15px 0px 0px 0px;
    background-color: #fff;
    overflow: hidden;

    .public {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
      padding: 15px;
      box-sizing: border-box;

      .title {
        font-size: $font-size-base;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }

      .upload {
        margin-top: 33px;
        width: 250px;
        height:300px;
        background: rgba(255, 243, 232, 1);;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .id-card-icon {
        color: #ccc;
        font-size: 180px;
      }

      .card {
        transform: translate(10px, 10px);
      }

      .camera {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 120px;
        height: 120px;
        background: rgba(206, 109, 15, 1);
        opacity: 0.3;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .left {
      float: left;
      padding-top: 30px;
    }

    .right {
      float: right;
      padding: 30px;
      position: relative;
      width: 206px;
      height: 294px;
      right: 30px;
      top: 55px;
      .clone {
        position: absolute;
        right: 10px;
        top: 10px;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }

  .footer-title {
    width: 100%;
    text-align: center;
    padding: 15px 0px 30px 0px;
    font-size: $font-size-sm;
    color: rgba(153, 153, 153, 1);
    background-color: #fff;
    margin-bottom: 75px;
  }

  .submit {
    overflow: hidden;
    background: rgba(206, 109, 15, 1);
    border-color: rgba(206, 109, 15, 1);
  }

  .show-img {
    width: 100%;
    height: 100%;
  }

  .submit__container {
    display: flex;
    flex-direction: column;
    @include positionAbsolute(null, 0, 0, 0);

    &__top {
      display: flex;
      align-items: center;
      height: 106px;
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
    }

    &__btn {
      &:disabled {
        background: #ccc;
      }
    }
  }

  .popupPact {
    width: 100%;
    border-radius: 8px;
    height: 100%;
    background-color: #f9f9f9;
  }

  .pactBody {
    line-height: 40px;
    margin-top: 20px;
    overflow-Y: scroll;
    min-height: 90%;
    height: calc(100vh - 150px);
  }

  .doc {
    color: $themeColor;
  }

  .cancel {
    width: 100%;
    height: 100px;
    text-align: center;
    color: #fff;
    position: absolute;
    background-color: #fff;

    .cancel-text {
      display: inline-block;
      text-align: center;
      height: 60px;
      line-height: 60px;
      padding: 5px 0px;
      width: 80%;
      font-size: 28px;
      background-color: $themeColor;
      border-radius: 10px;
      position: absolute;
      left: 50%;
      bottom: 50%;
      transform: translate(-50%, 50%);
    }
  }
  .list-title {
    margin-left: 30px;
    padding: 20px 0;
    border-bottom: 1.1px solid #eee;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .list-title>span {
    color: #999;
    /*font-size: 24px;*/
  }

</style>
