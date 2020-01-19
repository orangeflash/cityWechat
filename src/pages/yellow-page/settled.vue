<template>
  <div id="BusinessEnterForm">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <header class="form-head">基本信息</header>
    <basic-form ref="basicForm" :storeInfo="yellowInfo"/>
    <header class="form-head">商家图片</header>
    <photo-body v-for="(item,index) in pictures" v-show="item.show" :key="index" @change-img="changeImgOne"
                :mark="index"
                :title="item.title" title-class="fon-lg col-6" :f-title="item.ftitle" :max="item.max"
                :photo-list="item.imgUrlList||[]"></photo-body>
    <header class="form-head" v-if="setUp.introduce=='open'">其他信息</header>
    <van-field
      v-model="shopIntroduction"
      v-if="setUp.introduce=='open'"
      type="textarea"
      placeholder="请填写商家介绍"
      rows="3"
    />
    <header class="form-head" v-if="isEdit&&setUp.openCountry=='open'">
      <em class="form-head__legend">请选择入驻城市</em>
    </header>
    <van-radio-group class="entering" v-model="settledCity" v-if="isEdit&&setUp.openCountry=='open'">
      <van-cell-group>
        <van-cell
          v-for="item in isSettledCity"
          :key="item.id"
          class="cell"
          :title="item.setName"
          @click="settledCity = item.id"
        >
          <van-radio class="cell-radio" @click="seleckCity(item.id)" :name="item.id"/>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <header class="form-head" v-if="isEdit">
      <em class="form-head__legend">请选择入驻套餐</em>
    </header>
    <van-radio-group class="entering" v-model="mealId" v-if="isEdit">
      <van-cell-group>
        <van-cell
          v-for="item in businessPackages"
          :key="item.id"
          class="cell"
          :title="item.setName"
          @click="mealId = item.id"
        >
          <van-radio class="cell-radio" :name="item.id"/>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <aside class="protocol__container">
      <check-box :checked.sync="checked" class="checkbox"/>
      <em class="desc">阅读并同意</em>
      <em @click="show=!show" class="doc">《用户协议条款》</em>
    </aside>
    <van-popup v-model="show" class="popupPact" position="right">
      <p class="pactBody" v-html="setUp.agreement"></p>
      <div class="cancel" @click="show=!show">
        <span class="cancel-text">我已阅读并同意此协议</span>
      </div>
    </van-popup>
    <footer class="submit__container">
      <button
        class="feature-btn"
        :disabled="!checked"
        @click="businessFormSubmit"
      >{{+chooseMeal.money?`支付金额 ${(+chooseMeal.money).toFixed(2)}`:'确认'}}
      </button>
    </footer>
    <pay-mask :show-mask.sync="showPayMask" :money="+chooseMeal.money" @pay="payHandle"/>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import InputWithCmp from "../../components/publication/input-with-cmp";
  import BasicForm from "../../components/publication/yellow-form";
  import CheckBox from "../../components/basic/check-box";
  // import CustomMap from "../../components/basic/custom-map";
  import PhotoBody from '../../components/template/mall/release-photo/photo-body'

  import {
    hideLoading,
    randomNumber,
    showDialog,
    showLoading,
    validFormNotEmpty
  } from "../../util";
  import {requestByUpload} from "../../util/request";
  import PayMask from "../../components/publication/pay-mask";
  import _ from "lodash";
  import {utilMixins} from "../../plugins/util-mixins";
  import {chooseWXPay} from "../../util/wechat-util";
  import Header from "@/components/header";
  import {Toast} from "vant";

  export default {
    name: "BusinessEnterForm",
    components: {
      CheckBox,
      BasicForm,
      InputWithCmp,
      PayMask,
      Header,
      PhotoBody
    },
    data() {
      return {
        cityId:
          (localStorage.getItem("GlobalData")
              ? JSON.parse(localStorage.getItem("GlobalData"))
              : {}
          ).cityId || 0,
        isEdit: false,
        settledCity: 1,
        isSettledCity: [
          {
            id: 0,
            setName: "全国"
          },
          {
            id: 1,
            setName: "当前城市"
          }
        ],
        radio: 1,
        yellowInfo: {}, //黄页详情
        setUp: "",
        inviteCode: "",
        checked: true,
        shopIntroduction: "",
        mealId: null, //选择的套餐
        bannerList: [],
        showPayMask: false,
        logo: {
          imgBaseList: [],
          imgUrlList: []
        },
        qrCode: {
          imgBaseList: [],
          imgUrlList: []
        },
        business: {
          imgBaseList: [],
          imgUrlList: []
        },
        show: false,
        storeId: null,
        pictures: [
          {
            title: "商家logo（320*320）",
            ftitle: '请上传商家logo或门头图',
            max: 1,
            upImg: [],
            imgUrlList: [],
            show: true,
          },
          {
            title: "客服微信二维码（320*320）",
            ftitle: '请上传客服微信二维码',
            max: 1,
            upImg: [],
            imgUrlList: [],
            show: true,
          },
          {
            title: "商家相册（320*320）",
            ftitle: '最多上传9张',
            max: 9,
            upImg: [],
            imgUrlList: [],
            show: true,
          },
        ],
      };
    },
    methods: {
      ...mapActions("publication/yellowEnter", [
        "getBusinessEnterVersion",
        "submitBusinessForm",
        "payYellowEnterAction",
        "getYellowPageSetUp"
      ]),
      ...mapActions("common", ["getBannerListByType"]),
      ...mapActions("YellowPage", ["getYellowInfo", "collectStore"]),
      //图片变化
      changeImgOne(e, mark) {
        console.log(e, mark, this.pictures)
        this.pictures[mark].upImg = e;
      },
      // get
      uploadHandle(key) {
        return async e => {
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
          console.log(key, this[key].imgUrlList);
          hideLoading();
          setTimeout(this.$previewRefresh.bind(this));
        };
      },
      removeHandle(id, key) {
        this[key].imgBaseList.splice(
          _.findIndex(this.imgBaseList, {id}),
          1
        );
        this[key].imgUrlList.splice(
          _.findIndex(this.imgBaseList, {id}),
          1
        );
      },

      // 发布
      async businessFormSubmit() {
        const meal = this.chooseMeal; //获取用户选择的套餐
        const contentForm = this.$refs.basicForm.getFormData();
        if (!contentForm) return;
        console.log(this.logo.imgUrlList);
        console.log(this.logo.imgBaseList);

        if (this.mealId == null && !this.yellowInfo.id) return Toast({
          message: '请选择入驻套餐',
          duration: 1500
        });
        const needValidForm = {
          ...contentForm,
          logo: this.pictures[0].upImg,
          qrcode: this.pictures[1].upImg,
          photoList: this.pictures[2].upImg,
          introduce: this.shopIntroduction,
          cityId: this.settledCity == 1 ? this.cityId : 0
        };
        //console.log(needValidForm,this.fileterArr);
        if (
          !validFormNotEmpty(needValidForm, [
            "typeId", "zoneId",
          ].concat(this.fileterArr))
        ) {
          return showDialog("请填写完整信息!", "提示", false);
        }
        const form = {
          ...needValidForm,
          storeId: this.yellowInfo.id || "",
          mealId: this.mealId,
          money: meal.money
        };
        //console.log(form);
        showLoading('图片上传中');
        //微信上传图片
        let imgData = await Promise.all([this.uploadFile({files: this.pictures[0].upImg}), this.uploadFile({files: this.pictures[1].upImg}), this.uploadFile({files: this.pictures[2].upImg})])
        showLoading();
        form.logo = imgData[0]
        form.qrcode = imgData[1]
        form.photoList = imgData[2]
        this.storeId = await this.submitBusinessForm(form);
        if (+meal.money > 0 && +this.storeConfig.charge === 1) {
          try {
            hideLoading();
            await showDialog(
              "入驻商家需要支付" + meal.money + "元",
              "提示"
            );
            this.$router.push({
              name: "cashier",
              params: {
                type: 12, //支付的类型
                param: {
                  yellowId: this.storeId
                },
                info: {
                  money: this.chooseMeal.money,
                  type: "入驻",
                  callLink: "/yellowPage"
                }
              }
            });
          } catch (e) {
            console.log("用户没同意进入支付页面");
          }

          return;
        }
        hideLoading();
        Toast.success({
          message: "入驻成功",
          duration: 800
        });
        let vueObj = this;
        setTimeout(function () {
          vueObj.$router.push("/yellowPage");
        }, 1000);
      },
      // 选择入驻套餐
      async seleckCity(e) {
        switch (e) {
          case 0:
            await this.getBusinessEnterVersion({
              cityId: 0
            });
            break;
          case 1:
            await this.getBusinessEnterVersion({
              cityId: this.cityId
            });
            break;
        }
      },
      async payHandle() {
        if (this.storeId) {
          try {
            showLoading();
            const config = await this.payYellowEnterAction({
              yellowId: this.storeId
            });
            hideLoading();
            await chooseWXPay(config, () => {
              this.$router.push("/yellowPage");
            });
          } catch (e) {
            showDialog("支付失败", "提示", false);
          }
        }
      },
      async getCmpInitializationData() {
        this.setUp = await this.getYellowPageSetUp();
        await this.getBusinessEnterVersion({
          cityId: this.cityId
        });
        this.bannerList = await this.getBannerListByType({
          type: 2,
          adType: 1
        });
        this.fileterArr = []
        if (this.setUp.code != 'open') {
          this.pictures[1].show = false
          this.fileterArr.push('qrcode')
        }
        if (this.setUp.photoList != 'open') {
          this.pictures[2].show = false
          this.fileterArr.push('photoList')
        }
        if (this.setUp.introduce != 'open') {
          this.fileterArr.push('introduce')
        }
      }
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        user: s => s.user,
        assetPath: s => s.assetPath,
        platform: s => s.platform
      }),
      ...mapState("publication/yellowEnter", {
        businessPackages: state => state.businessPackages,
        businessDistrictList: state => state.businessDistrictList
      }),
      ...mapState("common", {
        storeConfig: state => state.storeConfig
      }),
      chooseMeal() {
        if (+this.storeConfig.charge === 2) return {};
        console.log(
          "选择套餐",
          _.find(this.businessPackages, {id: this.mealId}) || {}
        );
        return _.find(this.businessPackages, {id: this.mealId}) || {};
      },
      previewId() {
        return this.randomNumber();
      }
    },
    async created() {
      await this.getCmpInitializationData();
      const storeId = this.$route.query["id"];
      this.isEdit = storeId ? false : true;
      if (storeId) {
        this.storeId = storeId;
        this.yellowInfo = await this.submitBusinessForm({
          id: storeId
        });
        // this.yellowInfo.logo = this.getImgArr(JSON.parse(this.yellowInfo.logo));
        // this.yellowInfo.photoList = this.getImgArr(JSON.parse(this.yellowInfo.photoList));
        // this.yellowInfo.qrcode = this.getImgArr(JSON.parse(this.yellowInfo.qrcode));
        this.cityId = this.yellowInfo.cityId
        this.pictures[0].upImg = this.pictures[0].imgUrlList = this.getImgArr(JSON.parse(this.yellowInfo.logo));
        this.pictures[1].upImg = this.pictures[1].imgUrlList = this.getImgArr(JSON.parse(this.yellowInfo.qrcode));
        this.pictures[2].upImg = this.pictures[2].imgUrlList = this.getImgArr(JSON.parse(this.yellowInfo.photoList));
        this.shopIntroduction = this.yellowInfo.introduce;
      }
    }
  };
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
          border-bottom: 1px solid #f9f9f9;
        }

        &__head {
          height: 90px;
          font-size: 26px;
          color: rgba(167, 167, 167, 1);
          @include flex-between;

          .bold {
            font-size: 32px;
            color: #5d5d5d;
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
          background-color: #f5f5f5;
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
      background-color: #f4f4f4;

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
      overflow-y: scroll;
      min-height: calc(100% - 160px);
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
