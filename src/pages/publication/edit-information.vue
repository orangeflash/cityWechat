<template>
  <div id="EditInformation">
    <!--这个头部是组件来的 S-->
    <Header :childrenTitle="$route.query.childrenTitle"></Header>
    <!--这个头部是组件来的 E-->
    <section class="feature-swipe">
      <van-tabs v-model="tabActive" :value="'文章'" :color="$themeColor">
        <van-tab v-if="checkCanUseType('图文')" title="图文">
          <edit-tab-graphic ref="graphicForm"/>
        </van-tab>
        <van-tab v-if="checkCanUseType('文章')" title="文章">
          <edit-tab-text ref="textForm"/>
        </van-tab>
        <van-tab v-if="checkCanUseType('视频')" title="视频">
          <edit-tab-video ref="videoForm"/>
        </van-tab>
      </van-tabs>
    </section>
    <p class="feature-tip">
      本分类发布信息：
      <em>
        {{platform.openVip&& vipConfig.freeNum > 0 && (postType==0&& vipConfig.local.isFree == 1 || postType==1&&
        vipConfig.country.isFree
        == 1)? '会员免费('+vipConfig.freeNum+'次)': postType ==0 ?+publicationPrice.money&&publicationPrice.money+'元/条'
        ||'免费' :
        publicationPrice.countryMoney&&publicationPrice.countryMoney+'元/条' ||'免费'}}
      </em>，有效期：
      <em>{{publicationConfig.validDay}}</em>
      天
    </p>
    <ul class="info-form">
      <li class="info-form__item">
        <InputCell label="联系人：" v-model="linkMan" placeholder="请输入联系人姓名" icon="icon-geren"/>
      </li>
      <li class="info-form__item">
        <InputCell
          type="number"
          label="联系电话："
          v-model="linkTel"
          placeholder="请输入联系人电话号码"
          icon="icon-dianhua"
        />
      </li>
      <li class="info-form__item" v-if="config.openCountry === 'open'">
        <InputCell type="radio" label="发布类型：" v-model="postType" :radioData="radioData"/>
      </li>
      <li class="info-form__item">
        <InputCell
          label="选择位置："
          v-model="address"
          :readonly="false"
          icon="icon-dingwei"
          :show-arrow="true"
          @click-row="showMap"
        />
      </li>
      <!--<li class="info-form__item">-->
      <!--<InputCell-->
      <!--label="标签："-->
      <!--v-model="tag"-->
      <!--placeHolder="空格分隔，最多添加3个标签"-->
      <!--icon="icon-biaoqian1"-->
      <!--/>-->
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

    <footer class="submit__container">
      <aside class="submit__container__top">
        <check-box :checked.sync="protocolChecked" class="checkbox"/>
        <em class="desc">阅读并同意</em>
        <em @click="show=!show" class="doc">《用户协议条款》</em>
        <em class="desc">，保证信息合法合规</em>
      </aside>
      <button class="submit__container__btn" :disabled="!protocolChecked" @click="submitForm">
        立即发布
        {{ platform.openVip&&vipConfig.freeNum > 0 && (postType==0&& vipConfig.local.isFree == 1 || postType==1&&
        vipConfig.country.isFree
        == 1)? '(会员免费)':''}}
        <!--{{ vipConfig.freeNum > 0 && (postType==0&& vipConfig.local.isFree == 1 || postType==1&&-->
        <!--vipConfig.country.isFree-->
        <!--== 1)? '(会员免费)':postType ==0 ? +publicationPrice.money&&'￥'+publicationPrice.money ||'' :-->
        <!--publicationPrice.countryMoney&&'￥'+publicationPrice.countryMoney ||''}}-->
      </button>
    </footer>
    <pay-mask :money="postPrice" @pay="payHandle" :show-mask.sync="showPayMask"/>
    <!--<van-popup position="bottom" v-model="showMapDialog">-->
    <!--<CustomMap-->
    <!--@close="showMapDialog=false"-->
    <!--@confirm="changeLocation"-->
    <!--:latLng.sync="latLng"-->
    <!--:symbol="1"-->
    <!--/>-->
    <!--</van-popup>-->
    <van-popup v-model="show" class="popupPact" position="right">
      <p class="pactBody" v-html="config.agreement"></p>
      <div class="cancel" @click="show=!show">
        <span class="cancel-text">我已阅读并同意此协议</span>
      </div>
    </van-popup>
    <DdMap @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress"></DdMap>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import InputCell from "../../components/publication/input-cell";
  import CheckBox from "../../components/basic/check-box";
  import EditTabGraphic from "../../components/publication/edit-tabs/edit-tab-graphic";
  import EditTabVideo from "../../components/publication/edit-tabs/edit-tab-video";
  import EditTabText from "../../components/publication/edit-tabs/edit-tab-text";
  import PayMask from "../../components/publication/pay-mask";
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import ChoiceLabel from '@/components/template/choice-label'
  // import CustomMap from "../../components/basic/custom-map";
  import DdMap from "@/components/template/dd-map"
  import {Toast} from "vant";
  import {
    asyncSleep,
    hideLoading,
    showDialog,
    showHandleStatusByFlag,
    showLoading,
    validFormNotEmpty
  } from "../../util";
  import {Dialog} from "vant";
  import {
    chooseWXPay,
    getLocation,
    registerByRequestConfig,
    waitWxReady
  } from "../../util/wechat-util";
  import _ from "lodash";
  import Header from "@/components/header";

  export default {
    name: "EditInformation",
    components: {
      DdMap,
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
        tabActive: 0,
        showPayMask: false,
        showmap: false,
        showMapDialog: false,
        latLng: {},
        //form
        typePid: null,
        typeId: null,
        protocolChecked: true,
        address: "",
        tag: "",
        linkMan: "",
        linkTel: "",
        show: false,
        postId: null, //帖子的id
        postType: 0, //发布类型
        config: {},
        radioData: ["本地显示", "全国显示"],
        postFee: null,
        contentType: 1,
        contentTypeList: [],
        vipConfig: {},
        feature: {     //特色标签
          labels: [],
          labelsDefault: [],
        },
      };
    },
    methods: {
      ...mapActions("publication", [
        "postArticle",
        "getPublicationPrice",
        "postPayAction",
        "queryVipFreeReleasePost"
      ]),
      choiceLabel(arr) {
        this.tag = arr.map(v => {
          return v.name
        }).join(",");
      },
      ...mapActions("common", ["getPostConfig", "getLocationByLatLng"]),
      choiceAddress(v) {
        console.log(v)
        this.latLng = {latitude: v.latlng.lat, longitude: v.latlng.lng}
        this.address = v.poiaddress + '-' + v.poiname
      },
      // async changeLocation() {
      //   this.showMapDialog = false;
      //   const {latitude, longitude} = this.latLng;
      //   const data = await this.getLocationByLatLng({
      //     latitude,
      //     longitude
      //   });
      //   this.address = data.address;
      // },
      showMap() {
        this.showmap = true;
      },
      getContentType() {
        const postType = this.publicationConfig.postType,
          itemType = this.contentTypeList[this.tabActive];
        for (let type in postType) {
          if (postType[type] == itemType) {
            this.contentType = type;
          }
        }
      },
      checkCanUseType(type) {
        if (!this.publicationConfig.postType) return;
        const list = _.toArray(this.publicationConfig.postType);
        this.contentTypeList = list;
        return list.indexOf(type) > -1;
      },
      async submitForm() {
        //显示支付弹窗
        // this.showPayMask = true;
        if (!this.typePid && !this.typeId) {
          return Dialog.alert({
            title: "标题",
            message: "请先选择分类再发帖"
          }).then(() => {
            this.$popRoute();
          });
        }
        console.log(this.$refs)
        // let cmpRefs = [
        //   this.$refs.graphicForm,
        //   this.$refs.textForm,
        //   this.$refs.videoForm
        // ];
        // cmpRefs.forEach((item, index) => {
        //   if (!item) {
        //     cmpRefs.splice(index, 1);
        //   }
        // });
        //const targetCmp = cmpRefs[this.tabActive];
        //获取选择的发布type
        this.getContentType();
        //根据后台控制可允许发布的类型和选择的发布type，获取不同子节点
        let targetCmp;
        switch (this.contentType) {
          case '1':
            targetCmp = this.$refs.graphicForm;
            break;
          case '2':
            targetCmp = this.$refs.textForm;
            break;
          case '3':
            targetCmp = this.$refs.videoForm;
            break;
        }
        const contentForm = targetCmp.getFormData();
        // console.log(contentForm,this.contentType,targetCmp)
        // return
        const needValidForm = {
          body: contentForm.body,
          address: this.address,
          linkMan: this.linkMan,
          linkTel: this.linkTel,
          lat: this.latLng.latitude,
          lng: this.latLng.longitude,
          userId: this.user.id,
          wholeCountry: this.postType + 1
        };
        console.log(needValidForm);
        if (!validFormNotEmpty(needValidForm)) {
          return Toast("请填写完整信息!", "提示", false);
        }
        showLoading();
        if (this.contentType == 1) {


          // let imgData = await Promise.all([this.wxUploadImg(contentForm.media)])


          let imgData = await this.uploadFile({
            files: contentForm.media,
            from: contentForm.from
          })
          contentForm.media = imgData

        }

        const {code, data: postId, msg} = await this.postArticle({
          ...contentForm,
          ...needValidForm,
          typePid: this.typePid,
          typeId: this.typeId,
          tag: this.tag,
          expireTime: this.publicationConfig.validDay,
          contentType: this.contentType,
          postFee:
            this.postType == 0
              ? this.publicationPrice.money || null
              : this.publicationPrice.countryMoney || null
        });
        this.postId = postId;
        if (code) {
          if ((this.platform.openVip && this.vipConfig.freeNum > 0) || +this.postPrice <= 0) {
            showHandleStatusByFlag([true, this.publicationConfig.audit == 'open' ? '提交成功，请等待审核' : '提交成功'])
            return this.goPointPage({
              path: "/publication/publishStatus",
              query: {postId}
            })
          } else {
            try {
              await showDialog("需要支付：" + this.postPrice + "元");
              this.$router.push({
                name: "cashier",
                params: {
                  type: 7,
                  param: {
                    money: this.postPrice,
                    postId: this.postId,
                    userId: this.user.id
                  },
                  info: {
                    money: this.postPrice,
                    type: "发布帖子",
                    callLink:
                      "/publication/publishStatus?postId=" +
                      this.postId
                  }
                }
              });
            } catch (e) {
            }
          }
        } else {
          showHandleStatusByFlag([false, msg])
          setTimeout(() => {
            this.$router.go(-1)
          }, 1000)
        }
        //showHandleStatusByFlag(code);


      },
      async payHandle() {
        showLoading();

        const payConfig = await this.postPayAction({
          money: this.postPrice,
          postId: this.postId,
          userId: this.user.id
        });

        showLoading();
        await chooseWXPay(payConfig, () => {
          this.goPointPage({
            path: "/publication/publishStatus",
            query: {postId: this.postId}
          });
        });
        hideLoading();
      },
      async initLocation() {
        try {
          showLoading("定位中", "提示", false);
          const {latitude, longitude} = await getLocation();
          this.latLng = {
            latitude,
            longitude
          };
          this.address = (await this.getLocationByLatLng({
            latitude,
            longitude
          })).address;
          hideLoading();
        } catch (e) {
          console.log(
            "%c 是不是没有配置白名单的原因啊？？？",
            "color:blue;font-size:18px"
          );
          Toast("定位失败");
        }
      },
      initForm() {
        this.linkMan = this.user.userName;
        this.linkTel = this.user.userTel;
      }
    }
    ,
    computed: {
      ...
        mapState("publication", {
          publicationPrice: state => state.publicationPrice
        }),
      ...
        mapState("common", {
          publicationConfig: state => state.postConfig
        }),
      ...
        mapState({
          user: state => state.user,
          platform: state => state.platform,
        }),
      postPrice() {
        return this.postType == 0
          ? this.publicationPrice.money || 0
          : this.publicationPrice.countryMoney || 0;
      }
    }
    ,

    async created() {
      window.wxReady(() => {
        this.initLocation();
      });
      const {cid, pid} = this.$route.query;
      this.typeId = cid;
      this.typePid = pid;

      this.getPublicationPrice({cid}).then(result => {
        console.log("getPublicationPrice", result)
        this.feature.labels = result.data.label;
      });
      this.config = await this.getPostConfig();
      this.queryVipFreeReleasePost({
        typeId: cid
      }).then(result => {
        console.log('queryVipFreeReleasePost', result);
        this.vipConfig = result;
      })
      this.initForm();
      await asyncSleep(1000);
    }
  }
  ;
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  .van-ellipsis {
    font-size: 29px;
  }

  #EditInformation {
    min-height: 100vh;
    position: relative;
    padding-bottom: 240px;
    box-sizing: border-box;

    .feature-tip {
      font-size: 28px;
      color: rgba(153, 153, 153, 1);
      line-height: 1.5;
      padding: 17px 30px;

      em {
        color: red;
      }
    }

    .info-form {
      background: #fff;
      padding: 0 31px;

      &__item:not(:last-child) {
        border-bottom: 1.1px solid #eee;
      }
    }

    .submit__container {
      display: flex;
      flex-direction: column;
      @include positionAbsolute(null, 0, 0, 0);
      background: #fff;
      padding-bottom: 30px;

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
        color: rgba(255, 255, 255, 1);
        background: $themeColor;
        width: 94%;
        margin: 0 3%;
        border-radius: 10px;

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
      margin-top: 20px;
      overflow-y: scroll;
      min-height: 90%;
      padding: 0 30px;
      font-size: 30px;
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
