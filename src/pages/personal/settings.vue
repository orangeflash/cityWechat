<template>
  <div class="settings">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <em class="material">基本资料</em>
    <van-cell-group class="setting-form">
      <van-field
        label="头像"
        class="pad-30 flex-y-center"
        disabled
      >
        <div slot="button" class="col-3 flex-y-center">
          <dd-file class="posi-a-i" :max="1" :multiple="true"
                   @change="getPhotos"/>
          <div>
            <img-wrapper :src="filePaths[0]||userForm.portrait|| user.portrait ||PlaceholderAvatar" alt=""
                         class="personal-img"/>
          </div>
          <i
            class="iconfont icon-youjiantou1 mar-l"></i></div>
      </van-field>
      <van-field
        v-model="userForm.userName"
        label="昵称"
        placeholder="请输入昵称"
        clearable
        class="pad-30"
        input-align="right"
      />
      <van-field
        label="性别"
        class="pad-30"
        disabled
      >
        <div slot="button" class="col-3" @click="showSexMask=true">{{+userForm.sex===2?'女':'男'}}<i
          class="iconfont icon-youjiantou1 mar-l"></i></div>
      </van-field>
      <div class="signature">
        <em class="signature-title">个性签名</em>
        <van-field
          v-model="userForm.sign"
          type="textarea"
          placeholder="请输入个性签名"
          rows="4"
          :autosize="{maxHeight:100,minHeight: 100}"
          class="messageText"
        />
      </div>
    </van-cell-group>
    <dd-form-chunk title="其它设置">
      <div slot="content">
        <van-field
          clearable
          label="红包提醒"
          disabled
          class="flex-y-center"
        >
          <van-switch
            slot="right-icon"
            v-model="followRed"
            :active-color="$themeColor"
          />
        </van-field>
      </div>
    </dd-form-chunk>

    <van-button size="large" class="save-btn" @click="clearLocalStorage">清除缓存</van-button>
    <van-button type="primary" size="large" class="save-btn mainColor" @click="saveSetting">保存修改</van-button>
    <van-actionsheet
      v-model="showSexMask"
      :actions="sexOptions"
      @select="sexSelectHandle"
    />
  </div>
</template>

<script>
  import {Field, Button, Uploader, Dialog} from 'vant';
  import personalImg from '../../assets/img/city-information/小头像.png'
  import {mapState, mapActions} from 'vuex';
  import _ from 'lodash'
  import {requestByUpload} from "../../util/request";
  import {backendPath, isDev, redirectPath, appId} from "@/project-config/base";
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import DdFile from "../../components/template/dd-form/dd-file";
  import {
    getUrlParams,
    hideLoading, parseObjToParams,
    showDialog,
    showHandleStatusByFlag,
    showLoading,
    validFormNotEmpty
  } from "../../util";
  import {PlaceholderAvatar} from "../../project-config/base";
  import {Toast} from 'vant';
  import Header from "@/components/header";
  import {homeRouter} from "../../router/home";

  export default {
    components: {Header, DdFormChunk, DdFile},
    data() {
      return {
        personalImg,
        userForm: {},
        showSexMask: false,
        PlaceholderAvatar,
        followRed: true,
        filePaths: [],
        files: [],
      }
    },
    methods: {
      ...mapActions("personal", ["saveUserInfo", 'getUserInfoById']),
      ...mapActions(["refreshUserInfo", 'resetUser']),
      async getPhotos(e) {
        this.filePaths = e.filePaths
        this.files = e.files
        console.log(this.filePaths, this.files)
      },
      clearLocalStorage() {

        // 清除缓存的时候先把一些必要的参数进行留下，然后再进清除缓存
        const projectId = localStorage.projectAppId;
        localStorage.clear();
        localStorage.projectAppId = projectId;

        localStorage.removeItem('GlobalData')

        Toast('清除成功...');


        this.resetUser();
        homeRouter.children[1].meta.alive = null
        // 清除完成以后直接跳转到首页，并告诉首页重新初始化 init就是重载
        setTimeout(() => {
          window.location.href = `${location.origin}/wechat/home?appId=` + getUrlParams(window.location.href).appId
          //this.$router.go(0);
          // this.goPointPage({
          //   path: "/home",
          //   query: {
          //     init: true,
          //     appId: projectId
          //   }
          // })
        }, 1000)

      },
      async saveSetting() {
        const form = {
          portrait: this.userForm.portrait,
          userId: this.$route.query.id,
          userName: this.userForm.userName,
          sex: this.userForm.sex,
          followRed: this.followRed ? 1 : 2
        };
        if (!validFormNotEmpty(form)) {
          return showDialog("请填写完整信息", "提示", false);
        }
        showLoading();
        if (this.filePaths.length) {
          const images = await this.uploadFile({
            files: this.files,
          })
          form.portrait = this.platform.url + (images[0] && images[0].url)
        }
        const {code} = await this.saveUserInfo({
          ...form,
          sign: this.userForm.sign || ' ',
        });
        showHandleStatusByFlag(code);
        code && this.refreshUserInfo();
        code && setTimeout(()=>{this.$router.go(-1)},1000)
      },

      /* 上拉选项 */
      sexSelectHandle({sex}) {
        this.userForm.sex = sex;
        this.showSexMask = false;
      },
      /** 获取初始化个人信息*/
      async initForm() {
        const id = this.$route.query.id
        this.userForm = await this.getUserInfoById(id)
        this.followRed = +this.userForm.followRed == 1
      }
    },
    created() {
      //console.log('%c backendPath', 'color: white; background-color: #D33F49',`${location.origin}/wechat/home?appId=`+getUrlParams(window.location.href).appId)
      this.initForm()
    },
    computed: {
      ...mapState({user: item => item.user}),
      sexOptions() {
        return [
          {
            name: '男',
            sex: 1,
          },
          {
            name: '女',
            sex: 2,
          }
        ];
      }
    }
  }
</script>
<style scoped lang="scss">
  @import '../../assets/common';
  @import '../../assets/theme';

  .settings {
    padding-bottom: 30px;
    background-color: rgba(244, 244, 244, 1);
    overflow: hidden;
  }

  .clear-local-storage {
    height: 132px;
    display: flex;
    align-items: center;
    background: #fff;

    .clear-local-storage-box {
      margin: 0 30px;
      border-bottom: 1.1px solid #eee;
      padding-bottom: 30px;
      flex: 1;

      .van-cell {
        padding: 0;
      }
    }
  }

  .material {
    font-size: 30px;
    color: #868686;
    margin: 30px;
    position: absolute;
  }

  .setting-form {
    margin-top: 90px;
    padding: 0px;
    position: relative;
  }

  .lineHeight {
    line-height: 80px;
    padding-left: 30px;
    padding-right: 30px;
  }

  .personal-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .right-arrow {
    position: absolute;
    right: 5%;
    top: 10%;
  }

  .gender-selection {
    display: flex;
    line-height: 120px;
    margin: 0px 30px;
    border-bottom: 1PX solid #eee;
    position: relative;

    .van-radio-group {
      display: flex;
      margin-left: 40px;
      justify-content: center;
      align-items: center;
      align-content: center;

      .van-radio {
        position: absolute;
        top: 10%;
        left: 20%;
        transform: translateY(70%);
        line-height: 0px;
      }

      .gennder-radio {
        left: 40%;
      }
    }

    em {
      font-size: 28px;
      color: #333;
    }
  }

  .gender-icon {
    right: -5%;
    top: 0px;
  }

  .right-username {
    top: 58%;
    transform: translateY(-50%);
  }

  .phone-icon {
    right: 38px;
    color: rgba(51, 51, 51, 1);
  }

  .signature {
    padding: 30px;
    background-color: #fff;
  }

  .signature-title {
    font-size: 28px;
    color: rgba(51, 51, 51, 1);
    display: block;
    margin: 0 0 20px;
  }

  .messageText {
    background: rgba(244, 244, 244, 1);
    border-radius: 8px;
  }

  .save-btn {
    margin: 30px 0px 10px 30px;
    width: 92%;
    border-radius: 8px;
    border: none;
    font-size: 32px;
    background: #e7e7e7;
  }

  .mainColor {
    background-color: $themeColor;
    color: #fff;
  }

  .drop-out {
    width: 92%;
    margin: 10px 0px 30px 30px;
    border-radius: 8px;
    background-color: rgba(221, 221, 221, 1);
    color: rgba(51, 51, 51, 1);
  }

  .header-img {
    line-height: 180px;
    padding: 0px 30px 0 0;
    margin-left: 30px;
    @include flex-between;
    border-bottom: 1Px solid #f4f4f4;

    em {
      font-size: 28px;
      color: #333;
    }

    .arrow {
      top: 0px;
      right: -25px;
    }
  }

  .updataImg {
    width: 100%;
    height: 100%;
    display: inline-block;
    line-height: 180px;
    border-bottom: 1PX solid #eee;
  }

  .phone-link {
    display: block;
    width: 100%;
    height: 120px;
    line-height: 120px;
    padding-left: 30px;
    z-index: 1000;
    position: relative;

    em {
      position: absolute;
      color: rgba(51, 51, 51, 1);
      font-size: 28px;
    }
  }

  .phoneNumDiv {
    width: 100%;
    height: 100%;
    padding: 10px 80px 0px 80px;
    font-size: 28px;
    color: #666;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .sex {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 28px;
    width: 80%;
    text-align: right;
  }

  .sexName {
    line-height: 90px;
    text-align: center;
    border-bottom: 1PX solid #eee;
    font-size: 40px;
    background-color: #fff;
    list-style: none;
  }

  .marginb {
    margin-bottom: 20px;
  }

  .sexName:active {
    background-color: #eee;
    color: $themeColor;
  }

  .sexPopup {
    background-color: #f5f5f5;
  }

  .van-cell__title {
    color: #333;
  }
</style>
