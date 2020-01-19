<template>

  <div class="assemble-release">

    <Header/>
    <photo-header :max="3" @change-img="changeImgOne" :photo-list="pictures.imgUrlList"
                  title="上传商品主图，最多上传3张，建议尺寸：750*750px"></photo-header>
    <dd-form-chunk title="商品信息">
      <div slot="content">
        <van-field
          clearable
          v-model="params.title"
          label="商品标题"
          placeholder="请输入商品标题"
        ></van-field>
        <van-cell title="商品分类：" @click="selectType('goodType','商品分类')" is-link :value="typeName || tips.choice"/>
        <van-field
          clearable
          v-model="params.groupPrice"
          label="拼团价格"
          type="number"
          placeholder="请输入商品拼团价格"
        ><span slot="right-icon" class="col-3">元</span></van-field>
        <van-field
          clearable
          v-if="platform.openVip"
          v-model="params.memberPrice"
          label="会员拼团价"
          type="number"
          placeholder="请填写会员价，不填则正常价"
        ><span slot="right-icon" class="col-3">元</span></van-field>
        <van-field
          clearable
          v-model="params.alonePrice"
          label="单买原价"
          type="number"
          placeholder="请输入商品单买原价"
        ><span slot="right-icon" class="col-3">元</span></van-field>
        <van-field
          clearable
          v-model="params.originalPrice"
          label="商品原价"
          type="number"
          placeholder="请输入商品原价"
        ><span slot="right-icon" class="col-3">元</span></van-field>

      </div>
    </dd-form-chunk>
    <dd-form-chunk title="商品信息">
      <div slot="content">
        <!--<Radio-->
        <!--v-model="radioConfig.value"-->
        <!--v-bind="radioConfig"-->
        <!--@change="choiceRadio"-->
        <!--&gt;</Radio>-->
        <van-field
          clearable
          label="配送方式"
          disabled
          class="flex-y-center"
        >
          <dd-form-radio
            slot="right-icon"
            :radios="radioConfig.radios"
            v-model="radioConfig.value"
          ></dd-form-radio>
        </van-field>
        <!--<van-cell title="配送方式" @click="selectType('typeName','配送方式')" is-link :value="typeName || tips.choice"/>-->
        <van-field
          v-if="!radioConfig.value"
          clearable
          label="是否包邮"
          disabled
          class="flex-y-center"
        >
          <van-switch
            slot="right-icon"
            v-model="isPost"
            :active-color="$themeColor"
          />
        </van-field>
        <van-field
          v-if="!radioConfig.value&&!isPost"
          clearable
          v-model="params.satisfy"
          label="包邮条件"
          type="number"
          placeholder="满多少金额包邮"
        ><span slot="right-icon" class="col-3">元</span></van-field>
        <van-field
          clearable
          v-if="!radioConfig.value&&!isPost"
          v-model="params.freight"
          label="运费金额"
          type="number"
          placeholder="请输入运费金额"
        ><span slot="right-icon" class="col-3">元</span></van-field>
        <van-cell title="核销截止" @click="selectType('endTime','核销截止')" is-link :value="endTime || tips.choice"/>
      </div>
    </dd-form-chunk>
    <dd-form-chunk title="拼团设置">
      <div slot="content">
        <!--<van-cell title="几人拼" @click="selectType('typeName','几人拼')" is-link :value="params.groupNum || tips.choice"/>-->
        <van-field
          clearable
          v-model="params.groupNum"
          label="几人拼："
          type="number"
          placeholder="请填写拼团人数，最高99人"
        ><span slot="right-icon" class="col-3">人</span></van-field>
        <van-field
          clearable
          v-model="params.hour"
          label="拼团时限："
          type="number"
          placeholder="请填写拼团时限"
        ><span slot="right-icon" class="col-3">小时</span></van-field>
        <van-field
          clearable
          v-model="params.limitNum"
          label="每人限购："
          type="number"
          placeholder="请填写每人限购"
        ><span slot="right-icon" class="col-3">份</span></van-field>
        <van-field
          clearable
          v-model="params.num"
          label="商品库存："
          type="number"
          placeholder="请填写商品库存"
        ><span slot="right-icon" class="col-3">份</span></van-field>
      </div>
    </dd-form-chunk>
    <dd-form-chunk title="商品详情">
      <div slot="content">
        <dd-form-textarea v-model="params.details" class="pad-30 fon-b" height="150"
                          placeholder="填写商品详情"/>
        <photo-body
          @change-img="changeImgTwo"
          :max="4"
          :photo-list="pictures.imgUrlListTwo"
        ></photo-body>
      </div>
    </dd-form-chunk>
    <dd-form-chunk title="商品标签">
      <div slot="content" class="pad-30">
        <ChoiceLabel
          v-bind="feature"
          @choice="choiceLabel"
        ></ChoiceLabel>
      </div>
    </dd-form-chunk>
    <van-field label="拼团音乐" v-model="params.music" placeholder="请填写拼团音乐链接">
      <ddMusic slot="right-icon" v-model="params.music"/>
    </van-field>
    <van-field label="拼团视频" v-model="params.video" placeholder="请填写拼团视频链接">
      <dd-video slot="right-icon" v-model="params.video"/>
    </van-field>
    <AgreeAgreement
      :status="agreeAgreement"
      @choice="agreeAgreement = !agreeAgreement"
      :con="config.agreement"
      name="用户协议条款"
    ></AgreeAgreement>

    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-bind="dateTime"
        @confirm="confirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>
    <van-popup
      position="bottom"
      v-model="pickerShow">
      <van-picker
        show-toolbar
        value-key="name"
        @change="pickerChangeHandle"
        :title="pickertitle"
        :columns="columns"
        @confirm="pickerConfirm"
        @cancel="pickerShow = !pickerShow"
      />
    </van-popup>
    <dd-button
      class="mar-30"
      type="release"
      @click="release"
    ></dd-button>
  </div>

</template>

<script>
  import AgreeAgreement from '@/components/template/agree-agreement'
  import PhotoHeader from '@/components/template/mall/release-photo/photo-header'
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import ChoiceLabel from '@/components/template/choice-label'
  import DdFormTextarea from "@/components/template/dd-form/textarea"
  import PhotoBody from '@/components/template/mall/release-photo/photo-body'
  import DdButton from "@/components/template/button"
  import Radio from "@/components/template/radio"
  import Operation from "@/components/template/operation"
  import DdFormCell from "@/components/template/dd-form/cell"
  import DdFormRadio from "@/components/template/dd-form/radio"
  import DdMusic from "@/components/template/other/music"
  import DdVideo from "@/components/template/other/video"
  import {Toast} from 'vant'

  import {mapActions, mapState} from 'vuex';
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {
      DdFormRadio,
      DdFormCell,
      PhotoHeader,
      DdFormChunk,
      ChoiceLabel,
      AgreeAgreement,
      DdFormTextarea,
      PhotoBody,
      DdButton,
      Operation,
      Radio,
      DdMusic,
      DdVideo
    },
    data() {
      return {
        pickerShow: false,
        showDatetime: false,
        typeName: '',
        agreeAgreement: true,
        isStoreShow: false,
        pickertitle: '',
        columns: [],
        columnsCopy: [],
        config: {},
        tips: {
          choice: '请选择',
          input: '请输入',
          add: '请添加'
        },
        feature: {     //特色标签
          labels: [],
          labelsDefault: [],
        },
        radioConfig: {
          value: 0,
          label: '配送方式',
          radios: [
            "快递配送",
            "门店自取",
          ]
        },
        dateTime: {
          type: "datetime",
          currentDate: new Date(),
          minDate: new Date(),
        }, pictures: {
          imgUrlList: [],
          upImg: [],
          imgUrlListTwo: [],
          upImgTwo: [],
        },
        selfMentionList: [],
        endTime: null,
        isPost: false, //是否包邮
        params: {
          showImgs: [], //主图
          storeId: null,
          title: null, //商品标题
          originalPrice: null, //原价
          alonePrice: null, //单独够价
          groupPrice: null, //团购价格
          memberPrice: null, //会员团购价
          typePid: null, //一级Id
          typeId: null, //二级Id
          num: null, //库存
          delivery: 1,//配送方式1快递，2到店
          detailImgs: [], //详情图
          details: null, //详情
          freight: null, //运费
          isPost: null, //包邮 1是,2否
          satisfy: null, //包邮条件金额
          label: [], //服务标签（同商城的商品）
          limitNum: null, //限制购买数量
          groupNum: null, //几人团
          hour: null, //拼团时限（单位小时）
          endTime: null, //核销截止时间
          goodsId: null,
          music: '',
          video: ''
        }
      }
    },
    methods: {
      ...mapActions("shop", ["getShopInfoByParams"]),
      ...mapActions("storeAuxiliary/releaseGood", ["getCategoryList", 'getDeliverSet']),
      ...mapActions("storeAuxiliary/storeAssemble", ["getGoodsServiceLabel", "assembleConfig", "releaseAssemble", "getGoodsCategory"]),
      changeImgOne(e) {
        this.pictures.upImg = e
      },
      changeImgTwo(e) {
        this.pictures.upImgTwo = e
      },
      selectType(field, name) {
        console.log(field, name)
        switch (field) {
          case 'goodType':
            this.pickerShow = !this.pickerShow
            break;
          case 'endTime':
            this.showDatetime = !this.showDatetime
            break;
        }
      },
      //公用pickerchange事件
      pickerChangeHandle(picker, values, index) {
        if (values.length > 1) {
          picker.setColumnValues(
            1, _.find(this.columnsCopy, {
              name: values[0]
            }).son.map(item => item.name)
          );
        }
      },
      pickerConfirm(values) {
        this.typeName = values.join(' ');
        const data = _.find(this.columnsCopy, {
            name: values[0]
          }),
          children = _.find(data.son, {
            name: values[1]
          })
        this.params.typePid = data.id;
        this.params.typeId = children.id;
        console.log(this.params.typePid, this.params.typeId)
        this.pickerShow = !this.pickerShow
      },
      choiceLabel(arr) {
        let j = {}
        arr.map(v => {
          j[v.id] = v.name
        })
        this.params.label = j;
      },
      async choiceRadio(e) {
        console.log(e);
        this.params.delivery = e + 1;


        if (e && !this.selfMentionList.length) {
          try {
            await showDialog("您还没有添加自提点，是否现在就去添加？");
            this.goPointPage("/storeAuxiliary/storeGood/storeManageGood")
          } catch (e) {
            console.log(e)
          }

        }
      },
      confirm(value) {
        this.endTime = format(new Date(value).getTime());
        this.params.endTime = new Date(value).getTime() / 1000;
        this.showDatetime = false;
      },
      async release(e) {
        console.log('开始发布');
        if (!this.judge()) return
        if (this.params.groupNum < 2) return Toast({
          message: '至少两人拼团',
          duration: 1500
        })
        if (!this.agreeAgreement) return Toast({
          message: '请同意并遵守用户协议条款',
          duration: 1500
        });
        this.params.delivery = this.radioConfig.value + 1;
        if (this.params.delivery == 2 && !this.selfMentionList.length) {
          try {
            await showDialog("您还没有添加自提点,无法发布，是否现在就去添加？");
            this.goPointPage("/storeAuxiliary/storeGood/storeManageGood")
          } catch (e) {
            return console.log(e);
          }
        }
        this.params.isPost = this.isPost ? 1 : 2;
        showLoading('图片上传中');
        let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImg}), this.uploadFile({files: this.pictures.upImgTwo})])
        this.params.showImgs = imgData[0];
        this.params.detailImgs = imgData[1];

        showLoading("数据提交中...");
        const res = await this.releaseAssemble(this.params);
        hideLoading()
        showHandleStatusByFlag(res.code, "操作成功", res.msg)
        if (res.code) {
          setTimeout(() => {
            this.$router.go(-1)
          }, 1500)
        }
      },
      judge() {
        if (!this.pictures.upImg.length) {
          Toast.fail({
            message: '请上传商品主图',
            duration: 1500
          })
          return false;
        }
        let filter = ['showImgs', 'detailImgs', 'isPost', 'goodsId', 'music', 'video'],
          msg
        if (this.radioConfig.value || (!this.radioConfig.value && this.isPost)) filter = filter.concat(['freight', 'satisfy'])
        if (!this.platform.openVip) filter = filter.concat(['memberPrice'])
        if (this.params.memberPrice && this.params.memberPrice >= this.params.groupPrice) {
          msg = '会员拼团价要低于正常拼团价';
          showHandleStatusByFlag([false, msg])
          return  false
        }
        return this.isFailParams({
          field: this.params,
          filter,
          number: ['originalPrice', 'alonePrice', 'groupPrice', 'memberPrice', 'num', 'freight', 'satisfy', 'groupNum', 'limitNum', 'hour'],
          tips: {
            showImgs: this.tips.add + '商品主图', //主图
            storeId: '无商家Id',
            title: this.tips.input + '商品标题', //商品标题
            originalPrice: this.tips.input + '商品原价', //原价
            alonePrice: this.tips.input + '单独购价', //单独够价
            groupPrice: this.tips.input + '团购价格', //团购价格
            memberPrice: this.tips.input + '会员团购价', //会员团购价
            typePid: this.tips.choice + '商品分类', //一级Id
            typeId: this.tips.choice + '商品分类', //二级Id
            num: this.tips.input + '商品库存', //库存
            delivery: this.tips.choice + '配送方式',//配送方式1快递，2到店
            detailImgs: this.tips.add + '详情图', //详情图
            details: this.tips.input + '商品详情', //详情
            freight: this.tips.input + '商品运费', //运费
            isPost: this.tips.choice + '是否包邮', //包邮 1是,2否
            satisfy: this.tips.input + '包邮条件金额', //包邮条件金额
            label: this.tips.choice + '服务标签', //服务标签（同商城的商品）
            limitNum: this.tips.input + '限制购买数量', //限制购买数量
            groupNum: this.tips.input + '几人拼团', //几人团
            hour: this.tips.input + '拼团时限', //拼团时限（单位小时）
            endTime: this.tips.choice + '核销截止时间', //核销截止时间
          },
          noBack: true
        })
      },
      getCategoty() {
        this.getGoodsCategory({term: 15}).then(result => {
          console.log('getGoodsCategory', result)
          this.columnsCopy = result;
          console.log("二级分类数据为", result);
          if (result[0].son) {
            this.columns = [
              {
                values: result.map(item => item.name)
              },
              {
                values: result[0].son.map(
                  item => item.tradeName || item.name
                ),
                defaultIndex: 0
              }
            ];
          }

          if (this.params.id) {
            const data = _.find(this.columnsCopy, {
                id: this.params.typePid
              }),
              son = _.find(data.son, {
                id: this.params.typeId
              });
            console.log(data, son);
            this.typeName = data.name + " " + son.name;
          }

        })
      },
      fillData(params) {
        for (let k in this.params) this.params[k] = params.data[k];
        this.pictures.upImg = this.pictures.imgUrlList = this.params.showImgs.map(item => this.getSingleImg(item.url));
        this.pictures.upImgTwo = this.pictures.imgUrlListTwo = this.params.detailImgs.map(item => this.getSingleImg(item.url));
        this.isPost = +this.params.isPost == 1;
        if (this.params.label) {
          let labelsDefault = [];
          for (let k in this.params.label) labelsDefault.push(this.params.label[k])
          this.feature.labelsDefault = labelsDefault;
        }
        this.endTime = format(this.params.endTime * 1000);
        this.radioConfig.value = this.params.delivery - 1;
        console.log("this.radioConfig.value", this.radioConfig.value)
        console.log(this.params);


        this.params.id = this.$route.query.assembleId;
        delete this.params.goodsId;
        console.log(this.params);
      }

    },
    computed: {
      ...mapState({
        platform: s => s.platform,
      }),
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    async created() {
      this.params.storeId = this.storeId
      const query = this.$route.query;
      if (query.assembleId) {
        this.params.goodsId = query.assembleId
        const res = await this.releaseAssemble(this.params)
        this.fillData(res)
      }

      this.getDeliverSet(this.params).then(result => {
        console.log("getDeliverSet", result);
        this.selfMentionList = result;
      })

      this.assembleConfig().then(result => {
        console.log("assembleConfig", result)
        this.config = result;
      })

      this.getGoodsServiceLabel().then(result => {
        this.feature.labels = result;
      })
      this.getCategoty()

    }
  }

</script>
