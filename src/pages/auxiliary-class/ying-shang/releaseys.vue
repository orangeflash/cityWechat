<template>
  <div>
    <Header/>
    <dd-form-chunk title="应赏内容">
      <div slot="content">
        <dd-form-textarea class="pad-30 fon-b" v-model="params.content" height="150"
                          placeholder="请输入您的应赏内容"/>
        <photo-body
          title="最多上传3张图片"
          @change-img="changeImgOne"
          :max="3"
          :photo-list="pictures.imgUrlList"
        ></photo-body>
      </div>
    </dd-form-chunk>
    <van-cell-group class="mar-t">
      <van-field
        clearable
        v-model="params.userName"
        label="联系人"
        placeholder="请输入联系人"
      ></van-field>
      <van-field
        clearable
        v-model="params.userTel"
        label="联系电话"
        type="number"
        placeholder="请输入联系电话"
      ></van-field>
      <van-field
        clearable
        v-model="params.address"
        label="选择位置"
        placeholder="请选择位置"
      >
        <i @click="showmap=true" slot="button" class="iconfont icon-youjiantou1 col-9"></i>
      </van-field>
    </van-cell-group>
    <AgreeAgreement
      :status="agreeAgreement"
      @choice="agreeAgreement = !agreeAgreement"
      :con="postConfig.rewardRule"
      name="平台悬赏协议"
    ></AgreeAgreement>
    <dd-button
      class="mar-30 bg-t"
      :style="{background:$themeColor}"
      type="release"
      @click="release"
    ></dd-button>
    <dd-map @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress"></dd-map>
  </div>

</template>

<script>
  import DdFormInput from "../../../components/template/dd-form/input"
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import DdFormTextarea from "@/components/template/dd-form/textarea"
  import PhotoBody from '../../../components/template/mall/release-photo/photo-body'
  import AgreeAgreement from '@/components/template/agree-agreement'
  import DdButton from "@/components/template/button"
  import {format, hideLoading, isTellPhone, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {Toast} from 'vant'
  import {mapActions, mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import DdMap from "../../../components/template/dd-map"
  import {getLocation} from "../../../util/wechat-util";

  export default {
    mixins: [utilMixins],
    components: {
      DdFormInput,
      DdFormChunk,
      PhotoBody,
      DdFormTextarea,
      AgreeAgreement,
      DdButton,
      DdMap
    },
    data() {
      return {
        showmap: false,
        agreeAgreement: true,
        pictures: {
          imgUrlList: [],
          upImg: [],
        },
        config: {},
        params: {
          rewardId: '',
          content: '',
          userName: '',
          userTel: '',
          address: '',
          media: '',
        }
      }
    },
    methods: {
      ...mapActions('storeAuxiliary/storePrivilege', ['postAddPrivilege', 'getVipLabel']),
      ...mapActions("yS", ["getRewardType", "saveReward", "joinReward"]),
      ...mapActions("common", ["getLocationByLatLng"]),
      /** 选择地址 */
      choiceAddress(res) {
        this.params.lat = res.latlng.lat;
        this.params.lng = res.latlng.lng;

        this.params.address = res.poiaddress + res.poiname;
      },
      changeImgOne(e) {
        this.pictures.upImg = e
      },
      judge() {
        // if (!this.pictures.upImg.length) {
        //   showHandleStatusByFlag([false, '上传特权轮播图'])
        //   return false;
        // }
        if (!isTellPhone(this.params.userTel)) {
          showHandleStatusByFlag([false, '请输入合理联系电话'])
          return false;
        }
        return this.isFailParams({
          field: this.params,
          filter: ['id', 'media'],
          tips: {
            rewardId: "缺少悬赏ID",
            content: "请输入应赏内容",
            userName: "请输入联系人",
            userTel: "请输入联系电话",
            address: '请输入地址',
            media: "请上传图片",
          },
          noBack: true
        })
      },
      async release() {
        if (!this.judge()) return;
        if (!this.agreeAgreement) return Toast({
          message: '请同意并遵守平台悬赏协议',
          duration: 1000
        });
        showLoading('发布中')
        let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImg})])
        this.params.media = imgData[0];
        const res = await this.joinReward(this.params);
        showHandleStatusByFlag(res.code, '发布成功', res.msg)
        res.code && setTimeout(() => {
          this.$popRoute()
        }, 1000)
      }
    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
      ...mapState("common", {
        postConfig: state => state.postConfig
      }),
    },
    async created() {
      this.params.rewardId = this.$route.query.rewardId;
      this.params.userName=this.user.userName
      this.params.userTel=this.user.userTel
      let query = this.$route.query;
      window.wxReady(async () => {
        try {
          showLoading("定位中", "提示", false);
          const {latitude, longitude} = await getLocation();
          this.latLng = {
            latitude,
            longitude
          };
          this.params.address = (await this.getLocationByLatLng({
            latitude,
            longitude
          })).address;
          hideLoading();
        } catch (e) {
          Toast("定位失败");
        }
      });
      if (query.privilegeId) {
        showLoading()
        const result = await this.postAddPrivilege({
          privilegeId: query.privilegeId
        });
        for (let k in this.params) this.params[k] = result.data[k]
        hideLoading()
        console.log(this.params)
      }
    }
  }
</script>
