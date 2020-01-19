<template>
  <div id="JobEnterForm">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <photo-header :max="1" portrait="true" @change-img="changeImgOne" :photo-list="pictures.imgUrlList"
                  title="上传头像，一个好工作的开始！"></photo-header>
    <job-form ref="basicForm" :storeInfo="jobInfo"/>
    <AgreeAgreement
      :status="checked"
      @choice="checked = !checked"
      :con="setUp.agreement"
      name="求职发布协议"
    ></AgreeAgreement>
    <footer class="submit__container">
      <button
        class="feature-btn"
        :disabled="!checked"
        @click="businessFormSubmit"
      >{{+huntMoney.money&&!isEdit?`支付金额 ${(+huntMoney.money).toFixed(2)}`:'确认'}}
      </button>
    </footer>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import PhotoHeader from '../../../components/template/mall/release-photo/photo-header'
  import JobForm from "../../../components/template/job-hunt/job-form";
  // import CustomMap from "../../components/basic/custom-map";
  import AgreeAgreement from '@/components/template/agree-agreement'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {
    hideLoading,
    randomNumber,
    showDialog, showHandleStatusByFlag,
    showLoading, showText,
    validFormNotEmpty
  } from "../../../util";

  export default {
    name: "JobEnterForm",
    components: {
      JobForm,
      PhotoHeader,
      AgreeAgreement,
    },
    data() {
      return {
        agreeAgreement: false,
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
        jobInfo: {}, //详情
        setUp: "",
        inviteCode: "",
        checked: true,
        mealId: null, //选择的套餐
        bannerList: [],
        pictures: {
          imgUrlList: [],
          upImg: [],
          imgUrlListTwo: [],
          upImgTwo: [],
        },
        show: false,
        jobId: null,
        huntMoney: {},
      };
    },
    methods: {
      ...mapActions("jobHunt/jobHuntEnter", [
        "getJobEnterMoney", "saveJobEnter"
      ]),
      ...mapActions("jobHunt", ["getJobConfig", "getJobInfo"]),
      ...mapActions("common", ["getBannerListByType"]),
      changeImgOne(e) {
        this.pictures.upImg = e
      },
      // 发布
      async businessFormSubmit() {
        const meal = this.huntMoney; //获取金额
        const contentForm = this.$refs.basicForm.getFormData();
        if (!this.pictures.upImg.length) {
          showHandleStatusByFlag([false, '请上传头像'])
          return;
        }
        if (!contentForm) return;
        showLoading();
        let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImg})])
        const needValidForm = {
          ...contentForm,
          typeId: this.categoryId,
          // cityId: this.settledCity == 1 ? this.cityId : 0
        };
        const form = {
          ...needValidForm,
          jobId: this.jobInfo.id || "",
          logo: imgData[0][0].url,
        };
        // console.log(imgData,form);
        // return
        // if (
        //     !validFormNotEmpty(needValidForm, [
        //         "typeId",
        //     ])
        // ) {
        //     return showDialog("请填写完整信息!", "提示", false);
        // }
        let result = await this.saveJobEnter(form);
        if (result.code) {
          if (+meal.money > 0 && !this.isEdit) {
            try {
              hideLoading();
              await showDialog("发布求职需要支付" + meal.money + "元", "提示");
              this.$router.push({
                name: 'cashier',
                params: {
                  type: 21,
                  param: {
                    jobId: result.data,
                  },
                  info: {
                    money: meal.money,
                    type: "发布求职",
                    callLink: "/auxiliary/jobHunt/myJobHunt"
                  }
                }
              });
            } catch (e) {
              console.log('用户没同意进入支付页面')
            }
          } else {
            // hideLoading();
            showHandleStatusByFlag([true, '提交成功'])
            setTimeout(() => {
              this.$popRoute()
            }, 1000)
          }
        } else {
          showText(result.msg, 2000, true);
        }
      }
      ,
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
      }
      ,
      async getConfig() {
        this.setUp = await this.getJobConfig();
      },
      async getMoney() {
        this.huntMoney = await this.getJobEnterMoney(
          {categoryId: this.categoryId}
        );
      },
      async getCmpInitializationData() {
        this.getConfig();
        this.getMoney();
        // this.bannerList = await this.getBannerListByType({
        //     type: 2,
        //     adType: 1
        // });
      }
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        user: s => s.user,
        assetPath: s => s.assetPath
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
      this.categoryId = this.$route.params.huntType
      // console.log('this.categoryId',this.categoryId)
      const jobId = this.$route.params["id"];
      this.jobId = jobId;
      this.isEdit = jobId ? true : false;
      await this.getCmpInitializationData();
      //编辑
      if (jobId) {
        const res = await this.getJobInfo({
          jobId: jobId
        })
        this.jobInfo = res.data.data;
        this.pictures.upImg = this.pictures.imgUrlList = [this.getSingleImg(res.data.data.logo)];
        console.log(this.jobId, this.jobInfo)
      }
    }
  };
</script>
<style lang="scss">
  @import "../../../assets/common";

  #JobEnterForm {
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
  @import "../../../assets/theme";

  #JobEnterForm {
    .head__upload {
      background: #fff;
    }

    .head__upload_bg {
      height: 120px;
      background: $themeColor;
    }

    .head__upload_bd {
      border-bottom: 1.1px solid #eee;
      background: #fff;
      box-sizing: border-box;
      height: 165px;
      padding: 30px;
      @include flex-center($direction: column, $justify: flex-end);
      position: relative;

      &top {
        position: absolute;
        border-radius: 50%;
        width: 150px;
        height: 150px;
        top: -75px;
        left: 50%;
        transform: translate(-50%, 0);
        box-shadow: 0px 0px 8px $themeColor;
        background: #fff;
        @include flex-center;

        .topimg {
          font-size: 60px;
          color: $themeColor;
        }
      }

      &ft {
        color: #999;
      }

      /*头像容器*/
      .head__upload_img {
        @include widhei();

        img {
          @include widhei($brs: 50%);
        }

        .close-icon {
          position: absolute;
          right: 2px;
          top: 2px;
          padding: 0 0 10px 10px;
          font-size: 34px;
        }
      }
    }

    font-size: $font-size-base;
    padding-bottom: 120px;

    .form-head {
      color: #999;
      padding: 25px 29px;
      font-size: $font-size-lg;
      @include flex-between;

      &__legend {
        font-size: $font-size-lg;
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
          border-bottom: 1.1px solid #f9f9f9;
        }

        &__head {
          height: 90px;
          color: rgba(167, 167, 167, 1);
          @include flex-between;

          .bold {
            font-size: $font-size-lg;
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
        font-size: $font-size-base;
        color: rgba(0, 0, 0, 1);
      }

      .cell-radio {
        margin-right: 24px;
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
  }

</style>
