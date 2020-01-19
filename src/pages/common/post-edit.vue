<template>
  <div id="PostEdit">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <section class="feature-swipe" v-if="isGetDataOk">
      <edit-tab-graphic :editForm="editForm" v-if="+editForm.contentType===1" ref="graphicForm"/>
      <edit-tab-video :editForm="editForm" v-else-if="+editForm.contentType===3" ref="videoForm"/>
      <edit-tab-text :editForm="editForm" v-else ref="textForm"/>
    </section>
    <ul class="info-form">
      <li class="info-form__item">
        <InputCell label="联系人" v-model="editForm.linkMan" placeHolder="请输入联系人姓名" icon="icon-geren"/>
      </li>
      <li class="info-form__item">
        <InputCell type="number" label="联系电话" v-model="editForm.linkTel" placeHolder="请输入联系人电话号码" icon="icon-dianhua"/>
      </li>
      <li class="info-form__item">
        <InputCell label="信息地址" disabled="true" :value="editForm.address"
                   icon="icon-dingwei"
        />
      </li>
      <!--<li class="info-form__item">-->
      <!--<InputCell label="标签" v-model="editForm.tag" placeHolder="空格分隔，最多添加3个标签，如：求购 供应"-->
      <!--icon="icon-biaoqian1"/>-->
      <!--</li>-->
    </ul>
    <dd-form-chunk title="标签" v-if="feature.labels.length > 0">
      <div slot="content" class="pad-t pad-lr">
        <ChoiceLabel
          v-bind="feature"
          @choice="choiceLabel"
        ></ChoiceLabel>
      </div>
    </dd-form-chunk>
    <van-popup v-model="show" class="popupPact" position="right">
      <p class="pactBody" v-html="publicationConfig.agreement"></p>
      <div class="cancel" @click="show=!show">
        <span class="cancel-text">
          我已阅读并同意此协议
        </span>
      </div>
    </van-popup>
    <footer class="submit__container">
      <aside class="submit__container__top">
        <check-box :checked.sync="protocolChecked" class="checkbox"/>
        <em class="desc">阅读并同意</em>
        <em @click="show=!show" class="doc">《阅读协议条款》</em>
      </aside>
      <button class="submit__container__btn" @click="submitForm" :disabled="!protocolChecked">
        立即提交
      </button>
    </footer>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import InputCell from "../../components/publication/input-cell";
  import CheckBox from "../../components/basic/check-box";
  import EditTabGraphic from "../../components/publication/edit-tabs/edit-tab-graphic";
  import EditTabVideo from "../../components/publication/edit-tabs/edit-tab-video";
  import EditTabText from "../../components/publication/edit-tabs/edit-tab-text";
  import PayMask from "../../components/publication/pay-mask";
  import CustomMap from "../../components/basic/custom-map";
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import ChoiceLabel from '@/components/template/choice-label'

  import {
    hideLoading,
    showDialog,
    showHandleStatusByFlag,
    showLoading,
    validFormNotEmpty
  } from "../../util";
  import {Dialog} from "vant";
  import {chooseWXPay, getLocation, waitWxReady} from "../../util/wechat-util";
  import _ from 'lodash'
  import Header from "@/components/header";

  export default {
    name: "PostEdit",
    components: {
      CustomMap,
      PayMask,
      EditTabText,
      EditTabVideo,
      EditTabGraphic,
      CheckBox,
      InputCell,
      Header,
      DdFormChunk,
      ChoiceLabel
    },
    data() {
      return {
        checked: true,
        tabActive: 1,
        showPayMask: false,
        showMapDialog: false,
        latLng: {},
        postId: null,
        //form
        editForm: {
          address: "",
          tag: "",
          linkMan: "",
          linkTel: "",
        },
        protocolChecked: false,
        show: false,
        isGetDataOk: false,
        feature: {     //特色标签
          labels: [],
          labelsDefault: [],
        },
      }
    },
    methods: {
      ...mapActions("publication", ["postArticle", "getPublicationPrice", "postPayAction"]),
      ...mapActions("post", ["getPostListByParams", "getPostDetailById"]),
      ...mapActions("common", ["getPostConfig"]),
      choiceLabel(arr) {
        this.editForm.tag = arr.map(v => {
          return v.name
        }).join(",");
      },
      async submitForm() {

        const targetCmp = this.$refs.graphicForm || this.$refs.videoForm || this.$refs.textForm;
        const contentForm = targetCmp.getFormData();
        const needValidForm = {
          ...contentForm,
          linkMan: this.editForm.linkMan,
          linkTel: this.editForm.linkTel,
        };


        console.log("needValidForm", needValidForm);
        if (!validFormNotEmpty(needValidForm, ["media","from"])) {
          return showDialog("请填写完整信息!", "提示", false);
        }
        showLoading();
        if (this.editForm.contentType == 1) {
          let imgData = await Promise.all([this.uploadFile({files: contentForm.media})])
          contentForm.media = imgData[0]
        }
        const {code, data} = await this.postArticle({
          ...contentForm,
          postId: this.postId,
          userId: this.user.id,
          contentType: this.editForm.contentType,
          linkMan: this.editForm.linkMan,
          linkTel: this.editForm.linkTel,
          tag: this.editForm.tag,
        });
        hideLoading();
        if (code) {
          await showDialog("修改成功", "提示", false);
          this.$popRoute();
        } else {
          await showDialog("修改失败", "提示", false);
        }
      },
      async initForm() {
        const {data} = await this.getPostDetailById({
          postId: this.postId,
          isEdit: 1
        });
        this.editForm = data ? _.cloneDeep(data[0]) : {};

        this.getPublicationPrice({cid: this.editForm.typeId}).then(result => {


          this.feature.labels = result.data.label;

          this.feature.labelsDefault = this.editForm.tag.split(",");

        });

        this.isGetDataOk = true
      }

    },
    computed: {
      ...mapState("common", {
        publicationConfig: state => state.postConfig,
      }),
      ...mapState({
        user: state => state.user
      })
    },
    async created() {
      const {postId} = this.$route.query;
      this.postId = postId;
      this.initForm();
      this.getPostConfig();

    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #PostEdit {
    min-height: 100vh;
    position: relative;
    padding-bottom: 260px;
    box-sizing: border-box;

    .feature-tip {
      font-size: 24px;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
      line-height: 1.5;
      padding: 17px 30px;
    }

    .info-form {
      background: #fff;
      padding: 0 31px;

      &__item:not(:last-child) {
        border-bottom: 1PX solid #eee;
      }
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
        height: 88px;
        line-height: 88px;
        text-align: center;
        font-size: 34px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        background: $themeColor;
        width: 100%;

        &:disabled {
          background: #ccc;
        }
      }
    }

    .popupPact {
      padding: 30px 0;
      border-radius: 8px;
      min-height: 50%;
    }

    .pactBody {
      line-height: 40px;
      margin-top: 20px;
      max-height: 900px;
      overflow-Y: scroll;
      height: calc(100vh - 150px);
    }

    .pactTitle {
      background-color: #eee;
      color: #666;
      padding: 20px 0px;
      text-align: center;
      font-size: 34px;
      border-radius: 8px;
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
  }
</style>
