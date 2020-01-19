<template>
  <div>
    <Header/>
    <dd-form-chunk title="申诉理由">
      <div slot="content">
        <dd-form-textarea class="pad-30 fon-b" v-model="params.content" height="150"
                          placeholder="请输入您的申诉理由"/>
        <photo-body
          title="请上传有效凭证，最多3张"
          @change-img="changeImgOne"
          :max="3"
          :photo-list="pictures.imgUrlList"
        ></photo-body>
      </div>
    </dd-form-chunk>
    <dd-button
      class="mar-30 bg-t"
      :style="{background:$themeColor}"
      type="release"
      @click="release"
    ></dd-button>
    <!--<dd-map @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress"></dd-map>-->
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
          id: '',
          type: '',
          content: '',
          media: '',
        }
      }
    },
    methods: {
      ...mapActions('storeAuxiliary/storePrivilege', ['postAddPrivilege', 'getVipLabel']),
      ...mapActions("yS", ["getRewardType", "saveReward", "rewardAppeal"]),
      /** 选择地址 */
      choiceAddress(res) {
        this.params.lat = res.latlng.lat;
        this.params.lng = res.latlng.lng;

        this.params.address = res.poiaddress + res.poiname;
      },
      changeImgOne(e) {
        this.pictures.upImg = this.params.media = e
      },
      judge() {
        // if (!this.pictures.upImg.length) {
        //   showHandleStatusByFlag([false, '上传特权轮播图'])
        //   return false;
        // }
        return this.isFailParams({
          field: this.params,
          filter: ['media'],
          tips: {
            id: "缺少应赏ID",
            content: "请输入申诉理由",
            media: "请上传请上传有效凭证",
          },
          noBack: true
        })
      },
      async release() {
        if (!this.judge()) return;
        showLoading('发布中')
        let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImg})])
        this.params.media = imgData[0];
        const res = await this.rewardAppeal(this.params);
        showHandleStatusByFlag(res.code, res.msg, res.msg)
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
      this.params.id = this.$route.query.id;
      this.params.type = this.$route.query.type;
      let query = this.$route.query;
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
