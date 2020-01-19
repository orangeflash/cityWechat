<template>
  <div class="personal-attest">
    <!--<AttestHeader v-bind="defaultData"/>-->
    <img-wrapper not-load="true" :src="backendPath+'/wechatimg/testcenter/grrz.png'" class="attest-header"/>
    <article class="user-info">
      <van-cell-group>
        <van-field
          clearable
          label="基本信息"
          placeholder=""
          disabled
          class="user-input"
        />
        <van-field
          v-model="username"
          clearable
          label="姓名"
          placeholder="请输入姓名"
          class="info-input"
        />
        <van-field
          v-model="userNum"
          type="text"
          label="身份证号"
          placeholder="请输入正确的身份证号码"
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
        <strong class="title">手持身份证正面</strong>
        <van-uploader :after-read="onReadFacade('face')">
          <div class="upload">

            <img-wrapper v-if="facade" :src=" getPathByAssetPath(facade)"></img-wrapper>
            <i v-else class="iconfont icon-shouchishenfenzheng id-card-icon"></i>

            <span class="camera">
              <van-icon name="photograph" color="#fff" size="35px"/>
            </span>
          </div>
        </van-uploader>
        <strong class="footer-title">请确保身份证上的文字清晰</strong>
      </div>
      <div class="right public">
        <strong class="title">身份证反面</strong>
        <van-uploader :after-read="onReadFacade('obverse')">
          <div class="upload">
            <img-wrapper v-if="obverse" :src="getPathByAssetPath(obverse)"></img-wrapper>
            <i v-else class="iconfont icon-credentials_icon id-card-icon card"></i>
            <span class="camera">
               <van-icon name="photograph" color="#fff" size="35px"/>
            </span>
          </div>
        </van-uploader>
        <strong class="footer-title">请确保证件图片清晰</strong>
      </div>
    </footer>
    <AgreeAgreement
      :status="agreeAgreement"
      @choice="agreeAgreement = !agreeAgreement"
      color="rgba(37, 112, 183, 1)"
      :con="MarginSetting.identComment"
      name="用户协议条款"
    ></AgreeAgreement>
    <div class="submit">
      <van-button type="primary" size="large" class="submit" @click="handle">提交</van-button>
    </div>
  </div>
</template>

<script>
  import {Field, Uploader, Button} from 'vant';
  import AttestHeader from "../../components/attest/attest-header"
  import {publishUrl, backendPath} from "../../project-config/base"
  import {Toast} from "vant";
  import {
    hideLoading,
    randomNumber,
    showDialog,
    showHandleStatusByFlag,
    showLoading,
    validFormNotEmpty
  } from "../../util";
  import {requestByUpload} from "../../util/request";
  import {mapState, mapActions} from "vuex"
  import {uploadFileFormat} from "@/util"
  import AgreeAgreement from '@/components/template/agree-agreement'

  export default {
    name: "personal-attest",
    components: {AttestHeader, AgreeAgreement},
    data() {
      return {
        agreeAgreement: true,
        username: '',
        userNum: '',
        phoneTel: '',
        publishUrl,
        backendPath,
        facade: null,       //是否有身份证正面
        obverse: null,      //是否有身份证背面
        MarginSetting: {}
      }
    },
    methods: {
      ...mapActions("attest", ['postAttestByPost', 'getAttestByPost']),

      onReadFacade(type) {
        return async (e) => {
          const formData = new FormData();
          formData.append("file", e.file);
          showLoading();
          const res = await requestByUpload(formData);
          type == 'face' ? this.facade = res.src : this.obverse = res.src;
          hideLoading();
        }
      },
      onReadObverse(e) {
      },
      async handle() {
        console.log(this.MarginSetting)
        if (!this.username.trim()) return Toast('请输入姓名');
        if (!this.userNum.trim()) return Toast('请输入正确的身份证号码');
        if (!this.phoneTel.trim()) return Toast('请输入联系电话');
        if (!this.facade) return Toast('请上传您的手持身份证正面')
        if (!this.obverse) return Toast('请上传您的身份证反面');


        showLoading();
        const res = await this.postAttestByPost({
          name: this.username,
          linkTel: this.phoneTel,
          code: this.userNum,
          PositiveImg: uploadFileFormat(this.facade, 'img'),
          oppositeImg: uploadFileFormat(this.obverse, 'img'),
          userId: this.user.id,
          type: 1
        })
        hideLoading();
        if (res.code === 1) {

          Toast.success("提交成功")
          setTimeout(() => {
            this.$router.go(-1)
          }, 2000)
        } else {
          Toast.fail("提交失败")
        }
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      }),
      defaultData() {
        return {
          backgroundColor: "rgba(37,112,183,1)",
          title: "个人认证",
        }
      }
    },
    async created() {
      this.MarginSetting = await this.getAttestByPost();

      if (+this.MarginSetting.bondPersonal != 1) {
        Toast.fail({
          message: '个人认证未开启',
          duration: 1500
        })
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      }
    }
  }
</script>
<style lang="scss">
  .user-input .van-cell__title span {
    color: rgba(153, 153, 153, 1);
  }

  .personal-attest .van-cell__title {
    padding: 0 20px;
  }
</style>

<style scoped lang="scss">
  @import "../../assets/theme";

  .personal-attest {
    background-color: #eee;
  }

  .attest-header {
    height: 200px;
    width: 100%;
  }

  .header {
    width: 750px;
    height: 174px;
    background: rgba(37, 112, 183, 1);
    overflow: hidden;
    position: relative;

    .round {
      width: 673px;
      height: 300px;
      background: white;
      opacity: 0.05;
      border-radius: 50%;
      transform: translate(180px, 70px) rotateZ(-190deg);
    }

    .roundOne {
      display: inline-block;
      width: 673px;
      height: 500px;
      background: white;
      opacity: 0.06;
      border-radius: 50%;
      transform: translate(0px, 60px) rotateZ(-100deg);
      z-index: 80;
    }

    .title-line:after, .title-line:before {
      display: inline-block;
      content: '';
      width: 100px;
      height: 1PX;
      background: #eee;
      opacity: .5;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .title-line:after {
      transform: translate(200%, 400%);
    }

    .title-line:before {
      transform: translate(-300%, 400%);
    }

    .title {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 59px;
      font-family: FZLTDHK--GBK1-0;
      color: rgba(254, 254, 254, 1);

      &:after {
        content: '□';
        display: inline-block;
        color: #eee;
        opacity: .5;
        transform: rotateZ(-45deg);
        font-size: $font-size-lg;
        vertical-align: middle;
        margin-left: 20px;
      }

      &:before {
        content: '□';
        display: inline-block;
        color: #eee;
        opacity: .5;
        transform: rotateZ(-45deg);
        font-size: $font-size-lg;
        vertical-align: middle;
        margin-right: 20px;
      }
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
    margin: 15px 0px 35px 0px;
    background-color: #fff;
    overflow: hidden;
    padding-bottom: 40px;

    .left {
      float: left;
    }

    .public {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
      padding: 30px;
      box-sizing: border-box;

      .title {
        font-size: $font-size-base;
        font-family: PingFang-SC-Medium;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }

      .upload {
        margin-top: 33px;
        width: 281px;
        height: 183px;
        background: rgba(226, 241, 255, 1);
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
        background: rgba(37, 112, 183, 1);
        opacity: 0.3;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .footer-title {
        margin-top: 15px;
        font-size: $font-size-sm;
        color: rgba(153, 153, 153, 1);
      }
    }

    .right {
      float: right;
    }
  }

  .submit {

    overflow: hidden;
    background: rgba(37, 112, 183, 1);
    border-color: rgba(37, 112, 183, 1);
  }
</style>
