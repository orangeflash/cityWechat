<template>
  <div id="BusinessEditForm">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <!--<section class="banner__wrap"-->

    <!--v-for="(item,index) in bannerList"-->
    <!--:key="index">-->
    <!--<img-wrapper :src="getPathByAssetPath(item.url)" alt=""/>-->
    <!--</section>-->
    <!--<Banner :height="platform.slideNum" :swiper="{children:bannerList}"></Banner>-->
    <header class="form-head">基本信息</header>
    <basic-form :storeInfo="storeInfo" ref="basicForm"/>
    <header class="form-head">商家图片</header>
    <photo-body v-for="(item,index) in pictures" :key="index" @change-img="changeImgOne" :mark="index"
                :title="item.title" title-class="fon-lg col-6" :f-title="item.ftitle" :max="item.max"
                :photo-list="item.imgUrlList||[]"></photo-body>
    <header class="form-head">其他信息</header>
    <van-field
      v-model="shopIntroduction"
      type="textarea"
      placeholder="请填写商家介绍"
      rows="3"
    />
    <van-field label="详情视频" v-model="video" placeholder="请填写详情视频链接">
      <dd-video slot="right-icon" v-model="video"/>
    </van-field>

    <aside class="protocol__container">
      <check-box :checked.sync="checked" class="checkbox"/>
      <em class="desc">阅读并同意</em>
      <em @click="show=!show" class="doc">《阅读协议条款》</em>
    </aside>
    <van-popup v-model="show" class="popupPact" position="right">
      <p class="pactBody" v-html="storeConfig.businessJoinAgreement"></p>
      <div class="cancel" @click="show=!show">
        <span class="cancel-text">
          我已阅读并同意此协议
        </span>
      </div>
    </van-popup>
    <footer class="submit__container">
      <button class="feature-btn" :disabled="!checked" @click="businessFormSubmit">
        确认
      </button>
    </footer>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  // import bannerImg from '../../assets/img/publication/banner.png'
  import Banner from "../../components/home/banner";
  import InputWithCmp from "../../components/publication/input-with-cmp";
  import BasicForm from "../../components/publication/basic-form";
  import PhotoBody from '../../components/template/mall/release-photo/photo-body'
  import CheckBox from "../../components/basic/check-box";
  import CustomMap from "../../components/basic/custom-map";
  import DdVideo from "@/components/template/other/video"
  import {
    hideLoading,
    randomNumber,
    showDialog,
    showHandleStatusByFlag,
    showLoading,
    validFormNotEmpty
  } from "../../util";
  import {requestByUpload} from "../../util/request";
  import PayMask from "../../components/publication/pay-mask";
  import _ from 'lodash'
  import {Popup, Dialog} from 'vant';
  import {chooseWXPay} from "../../util/wechat-util";
  import {utilMixins} from "../../plugins/util-mixins";
  import Header from "@/components/header";
  import {Toast} from "vant";

  export default {
    name: "BusinessEditForm",
    components: {Banner, CustomMap, CheckBox, BasicForm, InputWithCmp, PhotoBody, PayMask, Header, DdVideo},
    data() {
      return {
        inviteCode: "",
        checked: false,
        shopIntroduction: "",
        bannerList: [],
        showPayMask: false,
        video: '',
        pictures: [
          {
            title: "商家logo（320*320）",
            ftitle: '请上传商家logo或门头图',
            max: 1,
            upImg: [],
            imgUrlList: [],
          },
          {
            title: "客服微信二维码（320*320）",
            ftitle: '请上传客服微信二维码',
            max: 1,
            upImg: [],
            imgUrlList: [],
          },
          {
            title: "商家相册（320*320）",
            ftitle: '最多上传9张',
            max: 9,
            upImg: [],
            imgUrlList: [],
          },
        ],
        show: false,
        storeId: null,
        storeInfo: {}
      }
    },
    methods: {
      ...mapActions("publication/businessEnter", ["getBusinessEnterVersion", "submitBusinessForm", "payBusinessEnterAction"]),
      ...mapActions("common", ["getBannerListByType"]),
      ...mapActions("shop", ["getShopInfoWithUserIdById"]),
      //图片变化
      changeImgOne(e, mark) {
        console.log(e, mark, this.pictures)
        this.pictures[mark].upImg = e;
      },
      async initForm(storeId) {
        showLoading('数据填充中')
        const data = await this.getShopInfoWithUserIdById(storeId);
        this.storeInfo = _.cloneDeep(data);
        this.pictures[0].upImg = this.pictures[0].imgUrlList = this.getImgArr(JSON.parse(this.storeInfo.storeLogo));
        this.pictures[1].upImg = this.pictures[1].imgUrlList = this.getImgArr(JSON.parse(this.storeInfo.wxImg));
        this.pictures[2].upImg = this.pictures[2].imgUrlList = this.getImgArr(this.storeInfo.photoList);
        this.shopIntroduction = this.storeInfo.introduce;
        this.video = this.storeInfo.video;
        hideLoading()
      },
      // get
      uploadHandle(key) {
        return async (e) => {
          const id = randomNumber();
          const formData = new FormData();
          formData.append("file", e.file);
          showLoading();
          const res = await requestByUpload(formData);
          this[key].imgUrlList.push({
            url: res.src,
            id
          });
          hideLoading();
          setTimeout(this.$previewRefresh.bind(this))
        }
      },
      removeHandle(id, key) {
        this[key].imgUrlList.splice(_.findIndex(this.imgBaseList, {id}), 1);
      },


      // 发布
      async businessFormSubmit() {
        const meal = this.chooseMeal;

        const contentForm = this.$refs.basicForm.getFormData();
        if (!contentForm) return;
        const needValidForm = {
          ...contentForm,
          storeLogo: this.pictures[0].upImg,
        };
        if (!validFormNotEmpty(needValidForm, ["zoneId", "tradeId", "typeId"])) {
          return showDialog("请填写完整信息!", "提示", false);
        }
        showLoading('加载中');
        //微信上传图片
        let imgData = await Promise.all([this.uploadFile({files: this.pictures[0].upImg}), this.uploadFile({files: this.pictures[1].upImg}), this.uploadFile({files: this.pictures[2].upImg})])
        const form = {
          storeId: this.storeId,
          ...needValidForm,
          storeLogo: imgData[0],
          wxImg: imgData[1],
          photoList: imgData[2],
          introduce: this.shopIntroduction,
          video: this.video
        };
        await this.submitBusinessForm(form);
        showHandleStatusByFlag([true, '提交成功'])
        setTimeout(() => {
          this.$popRoute()
        }, 1000);
      },
      async getCmpInitializationData() {
        this.bannerList = await this.getBannerListByType({
          type: 3, adType: 1
        });
      }
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("publication/businessEnter", {
        businessPackages: state => state.businessPackages,
        businessDistrictList: state => state.businessDistrictList,
      }),
      ...mapState("common", {
        storeConfig: state => state.storeConfig,
      }),
      ...mapState({
        platform: s => s.platform
      }),
      previewId() {
        return this.randomNumber();
      }
    },
    async created() {
      await this.getCmpInitializationData();
      const storeId = this.$route.query["storeId"];
      this.storeId = storeId;
      this.initForm(storeId);
      //console.log('storeConfig',this.storeConfig)
    }
  }
</script>
<style lang="scss">
  @import "../../assets/common";

  #BusinessEditForm {
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

  #BusinessEditForm {
    .banner__wrap {
      font-size: 0;

      img {
        width: 100%;
      }
    }

    .form-head {
      color: rgba(134, 134, 134, 1);
      padding: 25px 29px;
      font-size: 30px;
      @include flex-between;

      &__legend {
        font-size: 30px;
      }

      &__version-info {
        color: $themeColor;
      }
    }

    .upload {
      background-color: #fff;
      padding-left: 30px;
      overflow: hidden;

      &__item {
        padding-right: 30px;

        &:not(:last-child) {
          border-bottom: 1PX solid #f9f9f9;
        }

        &__head {
          height: 90px;
          font-size: 26px;
          color: rgba(167, 167, 167, 1);
          @include flex-between;

          .bold {
            font-size: 32px;
            color: #5D5D5D;
          }
        }
      }

      .upload-overflow-wrap {
        overflow: hidden;
        margin-bottom: 30px;
      }

      &__group {
        margin-bottom: -6px;
        padding-bottom: 6px;
        @include alignCenter;
        overflow-x: auto;
        overflow-y: hidden;

        &__item {
          flex-shrink: 0;
          margin-right: 10px;
          width: 160px;
          height: 160px;
          border-radius: 6px;
          background-color: #F5F5F5;
          position: relative;
          overflow: hidden;
          @include flex-center;

          img {
            width: 100%;
            height: 100%;
          }

          .close-icon {
            position: absolute;
            right: 0;
            top: 0;
            padding: 0 0 10px 10px;
            font-size: 24px;
          }

          .upload-icon {
            color: #e4e4e4;
            font-size: 50px;
          }
        }
      }
    }

    .entering {
      .cell {
        font-size: 30px;
        color: rgba(0, 0, 0, 1);
      }

      .cell-radio {
        margin-right: 24px;
      }
    }

    .protocol__container {
      display: flex;
      align-items: center;
      height: 74px;
      padding: 0 30px;
      background-color: #F4F4F4;

      .checkbox {
        padding-right: 20px;
        padding-left: 4px;
      }

      .desc {
        font-size: 24px;
        color: #999999;

      }
    }

    .submit__container {
      @include flex-center;
      background-color: #fff;
      padding: 37px 30px;

      .feature-btn {
        flex: 1;
        height: 90px;
        background-color: $themeColor;
        border-radius: 8px;
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
      margin-top: 20px;
      overflow-Y: scroll;
      min-height: 90%;
      height: calc(100vh - 150px);
    }

    .doc {
      color: $themeColor;
    }
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
      height: 80px;
      line-height: 80px;
      width: 90%;
      font-size: 28px;
      background-color: $themeColor;
      border-radius: 10px;
      position: absolute;
      left: 50%;
      bottom: 50%;
      transform: translate(-50%, 50%);
    }
  }
</style>
