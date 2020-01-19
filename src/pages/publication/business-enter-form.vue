<template>
  <div id="BusinessEnterForm">
    <!--这个头部是组件来的 S-->
    <Header :childrenTitle="storeConfig.field+'入驻'"></Header>
    <!--这个头部是组件来的 E-->
    <section class="banner__wrap" v-if="bannerList.length">
      <van-swipe :autoplay="3000" :height="+platform.slideNum">
        <van-swipe-item v-for="(item,index) in bannerList" :key="index">
          <img :src="getPathByAssetPath(item.url)" style="width: 100%; height:100%"/>
        </van-swipe-item>
      </van-swipe>
    </section>
    <header class="form-head">基本信息</header>
    <basic-form ref="basicForm"/>
    <header class="form-head">图片</header>
    <photo-body v-for="(item,index) in pictures" :key="index" @change-img="changeImgOne" :mark="index"
                :title="item.title" title-class="fon-lg col-6" :f-title="item.ftitle" :max="item.max"
                :photo-list="item.imgUrlList||[]"></photo-body>
    <header class="form-head">其他信息</header>
    <van-field
      v-model="shopIntroduction"
      type="textarea"
      placeholder="请填写介绍"
      rows="3"
    />
    <van-field label="详情视频" v-model="video" placeholder="请填写详情视频链接">
      <dd-video slot="right-icon" v-model="video"/>
    </van-field>

    <header class="form-head">
      <em class="form-head__legend">请选择入驻方式</em>
      <!--<em class="form-head__version-info">版本区别</em>-->
    </header>
    <van-radio-group class="entering" v-model="mealId">
      <van-cell-group>
        <van-cell v-for="item in businessPackages" :key="item.id" class="cell" :title="item.setName"
                  @click="mealId = item.id">
          <van-radio class="cell-radio" :name="item.id"/>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <aside class="protocol__container">
      <check-box :checked.sync="checked" class="checkbox"/>
      <em class="desc">阅读并同意</em>
      <em @click="show=!show" class="doc">《入驻协议条款》</em>
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
        {{+chooseMeal.money?`支付金额 ${(+chooseMeal.money).toFixed(2)}`:'确认'}}
      </button>
    </footer>
    <pay-mask :show-mask.sync="showPayMask" :money="+chooseMeal.money" @pay="payHandle"/>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  // import bannerImg from '../../assets/img/publication/banner.png'
  import InputWithCmp from "../../components/publication/input-with-cmp";
  import BasicForm from "../../components/publication/basic-form";
  import CheckBox from "../../components/basic/check-box";
  import CustomMap from "../../components/basic/custom-map";
  import PhotoBody from '../../components/template/mall/release-photo/photo-body'
  import {
    hideLoading,
    randomNumber,
    showDialog,
    showHandleStatusByFlag,
    showLoading,
    showText,
    validFormNotEmpty
  } from "../../util";
  import {requestByUpload} from "../../util/request";
  import PayMask from "../../components/publication/pay-mask";
  import _ from 'lodash'
  import {Popup, Dialog} from 'vant';
  import {chooseWXPay} from "../../util/wechat-util";
  import Header from "@/components/header";
  import {Toast} from 'vant';
  import DdVideo from "@/components/template/other/video"

  export default {
    name: "BusinessEnterForm",
    components: {CustomMap, CheckBox, BasicForm, InputWithCmp, PayMask, Header, PhotoBody, DdVideo},
    data() {
      return {
        inviteCode: "",
        checked: true,
        shopIntroduction: "",
        video: '',
        mealId: 0,            //选择的套餐
        bannerList: [],
        showPayMask: false,
        logo: {
          imgBaseList: [],
          imgUrlList: [],
        }, qrCode: {
          imgBaseList: [],
          imgUrlList: [],
        }, business: {
          imgBaseList: [],
          imgUrlList: [],
        },
        pictures: [
          {
            title: "logo（320*320）",
            ftitle: '请上传logo或门头图',
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
            title: "相册（320*320）",
            ftitle: '最多上传9张',
            max: 9,
            upImg: [],
            imgUrlList: [],
          },
        ],
        show: false,
        storeId: null
      }
    },
    methods: {
      ...mapActions("publication/businessEnter", ["getBusinessEnterVersion", "submitBusinessForm", "payBusinessEnterAction"]),
      ...mapActions("common", ["getBannerListByType"]),
      ...mapActions("businessDistrict", ["getStoreByAdminId"]),
      //图片变化
      changeImgOne(e, mark) {
        console.log(e, mark, this.pictures)
        this.pictures[mark].upImg = e;
      },
      async checkStore() {
        const storeInfo = await this.getStoreByAdminId({
          adminId: this.user.id
        });
        return storeInfo.length && storeInfo[0].status == '0';
      },
      // get
      uploadHandle(key) {
        return async (e) => {
          const id = randomNumber();
          this[key].imgBaseList.push({
            url: e.content,
            id
          });
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
        this[key].imgBaseList.splice(_.findIndex(this.imgBaseList, {id}), 1);
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
          mealId: this.mealId,
        };
        if (!validFormNotEmpty(needValidForm, ["zoneId", "tradeId", "typeId", "storeLabel"])) {
          return showDialog("请填写完整信息!", "提示", false);
        }
        showLoading('图片上传中');
        //微信上传图片
        let imgData = await Promise.all([this.uploadFile({files: this.pictures[0].upImg}), this.uploadFile({files: this.pictures[1].upImg}), this.uploadFile({files: this.pictures[2].upImg})])
        const form = {
          ...needValidForm,
          storeLogo: imgData[0],
          wxImg: imgData[1],
          photoList: imgData[2],
          introduce: this.shopIntroduction,
          video: this.video,
          money: meal.money,
        };
        this.storeId = await this.submitBusinessForm(form);

        if (+meal.money > 0 && +this.storeConfig.charge === 1) {
          try {
            hideLoading();
            await showDialog("入驻需要支付" + meal.money + "元", "提示");
            this.$router.push({
              name: 'cashier',
              params: {
                type: 8,
                param: {
                  postId: this.storeId,
                  money: this.chooseMeal.money
                },
                info: {
                  money: this.chooseMeal.money,
                  type: "入驻",
                  callLink: "/businessDistrict"
                }
              }
            });
          } catch (e) {
            console.log('用户没同意进入支付页面')
          }

          return;
        }
        showHandleStatusByFlag([true, this.storeConfig.audit == '1' ? '提交成功，请等待审核' : '入驻成功'])
        let vueObj = this;
        setTimeout(function () {
          vueObj.$router.push("/businessDistrict");
        }, 1000)

      },
      async payHandle() {
        if (this.storeId) {
          try {
            showLoading();
            const config = await this.payBusinessEnterAction({
              postId: this.storeId,
              money: this.chooseMeal.money
            });
            hideLoading();
            await chooseWXPay(config, () => {
              this.$router.push("/businessDistrict")
            });
          } catch (e) {
            showDialog("支付失败", "提示", false)
          }

        }
      },
      async getCmpInitializationData() {
        await this.getBusinessEnterVersion();
        this.bannerList = await this.getBannerListByType({
          type: 2, adType: 1
        });
      }
    },
    computed: {
      ...mapState({
        user: s => s.user,
        platform: s => s.platform
      }),
      ...mapState("publication/businessEnter", {
        businessPackages: state => state.businessPackages,
        businessDistrictList: state => state.businessDistrictList,
      }),
      ...mapState("common", {
        storeConfig: state => state.storeConfig,
      }),
      chooseMeal() {
        if (+this.storeConfig.charge === 2) return {};
        return _.find(this.businessPackages, {id: this.mealId}) || {};
      },
      previewId() {
        return this.randomNumber();
      }
    },
    async created() {
      document.title = this.storeConfig.field + '入驻'
      await this.getCmpInitializationData();
      // 默认选中第一个
      this.mealId = this.businessPackages[0].id;
      const isEntered = await this.checkStore();
      if (isEntered) {
        await showDialog("您的门店待审核中", "提示", false);
        this.$popRoute();
      } else {
        const bool = await this.checkBindTel({callBack: true})
        console.log(bool)
        if (bool==false) {
          this.goPointPage("/home")
        }
      }
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

  #BusinessEnterForm {
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
            right: 2px;
            top: 2px;
            padding: 0 0 10px 10px;
            font-size: 34px;
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
      border-radius: 8px;
      height: 100%;
      background-color: #f9f9f9;
    }

    .pactBody {
      line-height: 40px;
      overflow-Y: scroll;
      height: calc(100% - 160px);
      padding: 30px 30px 0;
      font-size: 28px;
    }

    .doc {
      color: $themeColor;
    }
  }

  .cancel {
    width: 100%;
    height: 120px;
    padding: 10px 0px;
    text-align: center;
    color: #fff;
    position: absolute;
    background-color: #fff;
    align-items: center;
    display: flex;

    .cancel-text {
      display: inline-block;
      text-align: center;
      height: 88px;
      line-height: 60px;
      line-height: 88px;
      width: 80%;
      font-size: 30px;
      background-color: $themeColor;
      border-radius: 10px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
