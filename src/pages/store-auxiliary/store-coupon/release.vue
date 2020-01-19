<template>
  <div>
    <Header/>
    <photo-header :max="1" @change-img="changeImgOne" :portrait="true" :photo-list="pictures.imgUrlList"
                  title="上传优惠券背景图，最多可上传1张"/>
    <dd-form-input
      v-model="params.title"
      label="优惠券标题"
      placeholder="请输入优惠券标题"
      :brb="true"
    ></dd-form-input>
    <dd-form-input
      :value="endTime || tips.choice"
      field="endTime"
      label="核销截止时间"
      type="select"
      @select="selectType"
    ></dd-form-input>
    <van-cell-group class="mar-t">
      <van-field
        clearable
        v-model="params.money"
        label="购买价格"
        type="number"
        right-icon="question-o"
        placeholder="不填可免费领取"
      ><span slot="right-icon" class="col-3">元</span></van-field>
      <van-field
        clearable
        v-if="platform.openVip"
        v-model="params.vipMoney"
        label="会员价"
        type="number"
        right-icon="question-o"
        placeholder="不填可免费领取"
      ><span slot="right-icon" class="col-3">元</span></van-field>
      <van-cell title="优惠券类型" @click="selectType('typeName','优惠券类型')" is-link :value="typeName || tips.choice"/>
      <van-field
        clearable
        v-if="params.type == 1 || params.type == 3"
        v-model="params.reduce"
        label="券的面额"
        right-icon="question-o"
        type="number"
        placeholder="请填写券的面额"
      ><span slot="right-icon" class="col-3">元</span></van-field>
      <van-field
        clearable
        v-else-if="params.type == 2"
        v-model="params.discount"
        label="折扣比例"
        right-icon="question-o"
        placeholder="请填写券的折扣比例"
        type="number"
      ><span slot="right-icon" class="col-3">折</span></van-field>
      <van-field
        clearable
        label="使用条件"
        v-model="params.condition"
        right-icon="question-o"
        type="number"
        placeholder="消费满此金额可以使用此优惠"
      ><span slot="right-icon" class="col-3">元</span></van-field>
      <van-field
        clearable
        v-model="params.stock"
        label="库存数量"
        type="number"
        right-icon="question-o"
        placeholder="请填写库存数量"
      ><span slot="right-icon" class="col-3">份</span></van-field>
      <van-field
        clearable
        v-model="params.max"
        label="每人限领"
        type="number"
        right-icon="question-o"
        placeholder="每人限领份数，不填则无限制"
      ><span slot="right-icon" class="col-3">份</span></van-field>
      <van-field
        clearable
        label="在店铺中显示"
        right-icon="question-o"
        placeholder="在您的店铺中公开显示"
        disabled
      >
        <van-switch
          slot="right-icon"
          v-model="isStoreShow"
          :active-color="$themeColor"
        />
      </van-field>

    </van-cell-group>
    <dd-form-chunk title="优惠详情">
      <div slot="content">
        <dd-form-textarea class="pad-30 fon-b" v-model="params.body" height="150"
                          placeholder="填写优惠详情"/>
        <photo-body
          @change-img="changeImgTwo"
          :max="4"
          :photo-list="pictures.imgUrlListTwo"
        ></photo-body>
      </div>
    </dd-form-chunk>
    <dd-form-chunk title="服务范围">
      <div slot="content" class="pad-30">
        <ChoiceLabel
          v-bind="feature"
          @choice="choiceLabel"
        ></ChoiceLabel>
      </div>
    </dd-form-chunk>

    <van-field label="详情音乐" class="mar-t" v-model="params.music" placeholder="请填写详情音乐链接">
      <ddMusic slot="right-icon" v-model="params.music"/>
    </van-field>
    <van-field label="详情视频" v-model="params.video" placeholder="请填写详情视频链接">
      <dd-video slot="right-icon" v-model="params.video"/>
    </van-field>
    <AgreeAgreement
      :status="agreeAgreement"
      @choice="agreeAgreement = !agreeAgreement"
      :con="config.agreement"
      name="用户协议条款"
    ></AgreeAgreement>
    <dd-button
      class="mar-30"
      type="release"
      @click="release"
    ></dd-button>
    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-bind="dateTime"
        @confirm="confirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>
    <operation
      :show="showOperation"
      @close="showOperation = !showOperation"
      @choice="actionsOperation"
      :actions="actions"
    ></operation>
  </div>

</template>

<script>
  import PhotoHeader from '@/components/template/mall/release-photo/photo-header'
  import DdFormInput from "@/components/template/dd-form/input"
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import DdFormTextarea from "@/components/template/dd-form/textarea"
  import PhotoBody from '../../../components/template/mall/release-photo/photo-body'
  import ChoiceLabel from '@/components/template/choice-label'
  import AgreeAgreement from '@/components/template/agree-agreement'
  import DdButton from "@/components/template/button"
  import Operation from "@/components/template/operation"
  import DdMap from "@/components/template/dd-map"
  import DdMusic from "@/components/template/other/music"
  import DdVideo from "@/components/template/other/video"
  import {format, hideLoading, showDialog, showLoading} from "../../../util";
  import {Toast} from 'vant'
  import {mapActions, mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {
      PhotoHeader,
      DdFormInput,
      DdFormChunk,
      PhotoBody,
      DdFormTextarea,
      ChoiceLabel,
      AgreeAgreement,
      DdButton,
      Operation,
      DdMap,
      DdVideo,
      DdMusic
    },
    data() {
      return {
        showDatetime: false,
        showOperation: false,
        dateTime: {
          type: "datetime",
          currentDate: new Date(),
          minDate: new Date(),
        },
        agreeAgreement: true,
        checked: false,
        pictures: {
          imgUrlList: [],
          upImg: [],
          imgUrlListTwo: [],
          upImgTwo: [],
        },
        tips: {
          choice: '请选择',
          input: '请输入',
        },
        feature: {     //特色标签
          labels: [],
          labelsDefault: [],
        },
        config: {},
        isStoreShow: false,
        field: null,
        actions: [],
        typeName: null,
        endTime: '',
        params: {
          logo: [],    //背景图
          couponId: null,//渲染数据用
          id: null,//修改提交用
          title: null,//标题
          endTime: null,//结束时间
          money: null,//购买金额
          vipMoney: null,//会员价
          type: null,//1.满减券2折扣券
          reduce: null,//减
          condition: null,//条件
          discount: null,//折扣
          stock: null,//库存
          max: null,//每人限领
          isStoreShow: null,//1显示2隐藏
          body: null,//描述
          media: [],//详情图片
          service: null,//服务范围 (字符串用逗号隔开)
          storeId: null, //商家id
          music: '',
          video: ''
        }
      }
    },
    methods: {
      ...mapActions('coupon', ['releaseCoupon', 'getServiceRange', 'getCouponConfig']),
      ...mapActions("shop", ["getShopInfoByParams"]),
      changeImgOne(e) {
        this.pictures.upImg = e
      },
      changeImgTwo(e) {
        this.pictures.upImgTwo = e
      },
      judge() {
        if (!this.pictures.upImg.length) {
          Toast.fail({
            message: '上传优惠券背景图',
            duration: 1500
          })
          return false;
        }
        return this.isFailParams({
          field: this.params,
          filter: ['couponId', 'id', 'logo', 'money', 'max', 'reduce', 'discount', 'isStoreShow', 'media', 'service', 'sort', 'vipMoney', 'music', 'video'],
          tips: {
            title: "请输入标题",//标题
            endTime: "请选择结束时间",//结束时间
            money: "请输入购买金额",//购买金额
            type: '请选择优惠劵类型',//1.满减券2折扣券
            reduce: null,//减
            condition: '请输入优惠条件',//条件
            discount: null,//折扣
            stock: '请输入库存数量',//库存
            max: '请输入每人限领数量',//每人限领
            isStoreShow: null,//1显示2隐藏
            body: '请输入优惠描述',//描述
            media: null,//详情图片
            service: null,//服务范围 (字符串用逗号隔开)
            storeId: '缺少商家id,无法发布', //商家id
          },
          noBack: true
        })
      },
      actionsOperation(item) {
        console.log(item);
        if (this.field == 'typeName') {
          this.typeName = item.name;
          this.params.type = item.id;
        } else {
          this.params[this.field] = item.name
        }
      },
      selectType(field, label) {
        console.log("selectType", field);
        this.field = field;
        switch (field) {
          case 'endTime':
            this.showDatetime = true;
            break;
          case 'typeName':
            this.actions = [{
              title: label
            }, {
              name: '优惠劵',
              id: 3,
            }, {
              name: '折扣劵',
              id: 2,
            }, {
              name: '代金劵',
              id: 1
            }];
            this.showOperation = !this.showOperation
            break;
        }
      },
      confirm(value) {
        this.endTime = format(new Date(value).getTime());
        this.params.endTime = new Date(value).getTime() / 1000;
        this.showDatetime = false;
      },
      choiceLabel(arr) {
        let j = {}
        arr.map(v => {
          j[v.id] = v.name
        })

        this.params.service = j;
      },
      async release() {
        if (!this.judge()) return;
        if (this.params.type == 1 || this.params.type == 3) {
          if (!this.params.reduce) return Toast.fail({
            message: '请输入优惠金额',
            duration: 1500
          })
        } else if (this.params.type == 2) {
          if (!this.params.discount) return Toast.fail({
            message: '请输入折扣比例',
            duration: 1500
          })
        }
        if (!this.agreeAgreement) return Toast({
          message: '请同意并遵守用户协议条款',
          duration: 1500
        });

        this.params.isStoreShow = this.params.isStoreShow ? 1 : 2;
        showLoading('图片上传中');
        let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImg}), this.uploadFile({files: this.pictures.upImgTwo})])
        this.params.logo = imgData[0];
        this.params.media = imgData[1];
        console.log(this.params)
        showLoading('发布中')
        const res = await this.releaseCoupon(this.params);
        hideLoading();
        if (+res.code == 1 && !isNaN(res.data)) {
          Toast.success({
            message: '发布成功',
            duration: 1500,
          });
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        } else {
          Toast.fail({
            message: res.msg,
            duration: 1500
          })
        }
      }
    },
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    async created() {
      this.params.storeId = this.storeId

      this.getCouponConfig().then(reuslt => {
        this.config = reuslt
      })

      let query = this.$route.query;
      if (query.counponId) {
        const result = await this.releaseCoupon({
          couponId: query.counponId
        });


        for (let k in this.params) this.params[k] = result.data[k]

        this.params.id = query.counponId;
        this.pictures.upImg = this.pictures.imgUrlList = this.params.logo.map(item => this.getSingleImg(item.url));
        this.pictures.upImgTwo = this.pictures.imgUrlListTwo = this.params.media.map(item => this.getSingleImg(item.url));
        this.typeName = +this.params.type == 1 ? '优惠劵' : +this.params.type == 2 ? '折扣劵' : '代金劵'
        this.endTime = format(new Date(this.params.endTime * 1000).getTime());
        this.isStoreShow = +this.params.isStoreShow == 1;


        if (this.params.service) {
          let labelsDefault = [];
          for (let k in this.params.service) {
            console.log("this.params.service", k)
            labelsDefault.push(this.params.service[k])
          }
          this.feature.labelsDefault = labelsDefault;

        }

      }
      this.getServiceRange().then(result => {
        this.feature.labels = result;
        console.log("this.params.service", this.params.service)

      });

    }
  }
</script>
