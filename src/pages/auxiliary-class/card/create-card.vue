<template>
  <div id="ReleaseCard" v-if="cardConfig.openCountry">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <photo-header :max="1" portrait="true" @change-img="changeImgOne" title="完善个人名片的用户，更容易收获商业人脉，并获得平台名片榜单推荐"
                  :photo-list="pictures.imgUrlList||[]"></photo-header>
    <PickerColumn v-for="(item,key) in pickerData" :key="key" :list="item" @click="pickerChoice"
                  @inputForm="inputForm"></PickerColumn>
    <div class="head-title">信息</div>
    <div>
      <van-cell-group>
        <van-field
          v-model="fillData.company"
          label="公司名称"
          placeholder="请填写公司名称"
        >
        </van-field>
        <van-field
          v-model="fillData.department"
          label="部门"
          placeholder="请填写部门名称"
        >
        </van-field>
        <van-field
          v-model="fillData.position"
          label="职位"
          placeholder="请填写职位名称"
        >
        </van-field>

      </van-cell-group>
    </div>

    <div class="head-title">微信二维码</div>
    <dd-layout-div class="bg-f" :pad="[30]">
      <dd-file :width="200" :height="200" :fillet="15" v-model="wxImg.filePaths" @change="changeHandle">
        <dd-layout-div slot="cover" class="flex-center bsd-b" :width="200" :height="200" :fillet="15">
          <dd-layout-img :src="wxImg.filePaths[0]" v-if="wxImg.filePaths[0]" :width="2" :height="2" :fillet="0.15"/>
          <i v-else class="iconfont icon-jia1 fon-xxll"></i>
        </dd-layout-div>
      </dd-file>


    </dd-layout-div>
    <div class="mar-t">
      <dd-textarea max="500" placeholder="一句话介绍自己负责的业务" :textarea-data.sync="fillData.body"/>
      <!--<photo-body @change-img="changeImgTwo" max="6" :photo-list="fillData.detailImgs||[]"></photo-body>-->
    </div>
    <van-cell-group class="mar-t">
      <van-field
        label="地址"
        v-model="fillData.address"
        :readonly=true
      >
        <i slot="button" class="col-t" @click="showmap=true">定位</i>
      </van-field>
      <van-field
        label="行业"
        v-model="selectedObj.goodType.join(' ')"
        :readonly=true
        @click="pickerChoice({field:'goodType',name:'行业分类'})"
      >
        <i slot="button" class="iconfont icon-youjiantou1"></i>
      </van-field>
    </van-cell-group>
    <div class="head-title">隐私设置</div>
    <div>
      <van-cell-group>
        <!--<van-field-->
        <!--clearable-->
        <!--label="配送方式"-->
        <!--placeholder="请选择"-->
        <!--v-model="fillData.delivery&&fillData.delivery.name"-->
        <!--:readonly=true-->
        <!--@click="pickerChoice({field:'delivery',name:'配送方式'})"-->
        <!--&gt;-->
        <!--<i slot="button" class="iconfont icon-youjiantou1"></i>-->
        <!--</van-field>-->
        <van-cell title="公开名片上的手机号">
          <van-switch
            slot="right-icon"
            size="24px"
            v-model="fillData.isTel"
            :active-color="$themeColor"
            inactive-color="#d5d5d5"
          />
        </van-cell>
        <van-cell title="公开名片上的微信号">
          <van-switch
            slot="right-icon"
            size="24px"
            v-model="fillData.isWechat"
            :active-color="$themeColor"
            inactive-color="#d5d5d5"
          />
        </van-cell>
        <van-cell title="公开地址信息">
          <van-switch
            slot="right-icon"
            size="24px"
            v-model="fillData.isAddress"
            :active-color="$themeColor"
            inactive-color="#d5d5d5"
          />
        </van-cell>
      </van-cell-group>
    </div>
    <!--<div class="head-title">服务标签</div>-->
    <!--<ul class="labes-list">-->
    <!--<ChoiceLabel-->
    <!--@choice="choice"-->
    <!--:labelsDefault="labelsDefault"-->
    <!--max="5"-->
    <!--:labels="labels"-->
    <!--&gt;</ChoiceLabel>-->
    <!--</ul>-->

    <div
      v-if="cardConfig&&cardConfig.openCountry&&cardConfig.openCountry == 'open' && !fillData.id"
      class="head-title">选择套餐
    </div>
    <Radio
      v-if="cardConfig&&cardConfig.openCountry&&cardConfig.openCountry == 'open' && !fillData.id"
      v-bind="radioConfig"
      @change="choiceRadio"
    ></Radio>
    <van-radio-group v-model="mealId" class="mar-t">
      <van-cell-group>
        <van-cell v-for="(item,index) in mealArr" :key="index" clickable @click="radioChange(item.id,index)">
          <van-radio :checked-color="$themeColor" slot="icon" :name="item.id" @click="radioChange(item.id,index)"/>
          <div class="mar-l" slot="title">{{item.setName}}</div>
        </van-cell>
      </van-cell-group>
    </van-radio-group>

    <AgreeAgreement
      :status="checked"
      @choice="checked = !checked"
      :con="cardConfig.agreement"
      name="名片发布协议"
    ></AgreeAgreement>
    <footer class="foot-mar-btn rel">
      <button
        :disabled="!checked"
        @click="formSubmit"
      >{{releaseName}}
      </button>
    </footer>
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
    <!--<van-popup v-model="showDatetime" position="bottom">-->
    <!--<van-datetime-picker-->
    <!--v-model="currentDate"-->
    <!--type="date"-->
    <!--:max-date="maxDate"-->
    <!--@confirm="pickerConfirm"-->
    <!--@cancel="showDatetime = !showDatetime"-->
    <!--/>-->
    <!--</van-popup>-->
    <dd-map @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress"></dd-map>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import Header from "@/components/header";
  import AgreeAgreement from '@/components/template/agree-agreement'
  import DdTextarea from '../../../components/template/agree-agreement/dd-textarea'
  import PhotoHeader from '../../../components/template/mall/release-photo/photo-header'
  import PhotoBody from '../../../components/template/mall/release-photo/photo-body'
  // import ReleaseSpec from '../../../components/template/mall/release-photo/release-spec'
  import PickerColumn from "../../../components/template/picker/column"
  import ChoiceLabel from '@/components/template/choice-label'
  import DdMap from "../../../components/template/dd-map"
  import {utilMixins} from "../../../plugins/util-mixins";
  import {getParmasField} from "../../../plugins/auxiliary/http-params";
  import {hideLoading, isTellPhone, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  // import {uploadImage} from "../../../util/wechat-util";
  import Radio from "@/components/template/radio"
  import {getLocation} from "../../../util/wechat-util";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdFile from "../../../components/template/dd-form/dd-file";

  export default {
    name: "ReleaseCard",
    props: [],
    components: {
      DdFile,
      DdLayoutImg,
      Header,
      AgreeAgreement,
      DdTextarea,
      PickerColumn,
      PhotoHeader,
      PhotoBody,
      ChoiceLabel,
      DdMap,
      Radio
    },
    data() {
      return {
        cardConfig: {},
        mealId: 0,
        mealArr: [],
        showmap: false,
        isEdit: false,
        setUp: "",
        checked: true,
        //竖向列表PickerColumn需要的默认数据
        pickerData: {
          coupon: [
            {
              name: '真实姓名',
              desc: '',
              type: 'text',//有type值,表示输入框,
              placeholder: '请输入真实姓名',
              field: 'name'//定义为后台需要的字段名，在inputForm方法里设置为fillData里的字段值
            },
          ],
          dateData: [
            {
              name: '手机号',
              desc: '',
              type: 'number',
              placeholder: '请输入手机号',
              field: 'tel'
            },
            {
              name: '微信号',
              desc: '',
              type: 'text',
              placeholder: '请输入微信号',
              field: 'wechat'
            },
          ],
        },
        //自定义图片对象，属性名upImg为photoheader组件传出来的图片mediaId数组，作为上传使用， imgUrlList为编辑是作为渲染数据传入photoheader组件的props
        pictures: {
          upImg: [],
          imgUrlList: [],
        },
        //时间选择
        showDatetime: false,
        currentDate: new Date(),
        maxDate: new Date(),
        //picker需要的数据
        pickerShow: false,//共用控制piker显隐
        pickertitle: '标题',
        columns: [],//共用piker需要的cloumns数据，参考vant picker
        //自定义共用存放不同columnsData的对象
        columnsData: {
          delivery: [{name: '快递配送', type: 1}],
          goodType: []
        },
        //公用的picker标题的对象
        selectedObj: {
          goodType: [],
        },
        fillData: {},
        labels: [],
        labelsDefault: [],
        selectedLabel: null,
        radioConfig: {
          value: 0,
          label: '选择区域',
          radios: [
            "本地",
            "全国"
          ]
        },
        releaseName: "立即发布",
        releasePrice: "0",
        price: "0",
        wxImg: {
          filePaths: [],
          files: [],
        },
      }
    },
    methods: {
      ...mapActions("common", ["getWxUpload", "getLocationByLatLng"]),
      ...mapActions("card", ["getCardConfig", "getCategoryList", "getCardMeal", "postSaveCard"]),
      changeHandle(e) {
        this.wxImg = e;
      },
      //图片变化
      changeImgOne(e) {
        console.log(e, this.pictures)
        this.pictures.upImg = e
      },
      // 输入表单的时候触发
      inputForm(item, key) {
        console.log(item, key, this.fillData)
        item.desc && item.desc.trim() ? this.fillData[item.field] = item.desc : this.fillData[item.field] = null;
      },
      //选择地图触发的方法
      choiceAddress(v) {
        console.log('choiceAddress', v)
        this.fillData.address = `${v.poiaddress}+${v.poiname}`
        this.fillData.lat = v.latlng.lat;
        this.fillData.lng = v.latlng.lng;
      },
      //获取配置信息
      async getConfig() {
        this.cardConfig = await this.getCardConfig();
        console.log('cardConfig', this.cardConfig)
      },
      async choiceRadio(index) {
        console.log(index);
        showLoading()
        this.fillData.wholeCountry = (index || 0) + 1;
        await this.getGrade(this.fillData.wholeCountry);
      },
      //请求接口拿取套餐
      async getGrade(type) {
        // 默认选中第一个
        this.mealArr = await this.getCardMeal({wholeCountry: type});
        hideLoading()
        this.mealId = this.mealArr[0].id;
        this.radioChange(this.mealId, 0)
      },
      //切换套餐的方法
      async radioChange(id, k) {
        this.mealId = id;
        console.log("11111", this.mealId, this.fillData)
        // this.releasePrice = this.fillData.wholeCountry == 2 ? +this.price.country.release || 0 : +this.price.local.release || 0;
        this.releasePrice = +this.mealArr[k].money;
        console.log("this.mealArr[k].money", this.releasePrice);


        if (this.$route.query.cardId) {
          this.releaseName = '确认修改';
        } else {
          this.releaseName = this.releasePrice && !this.fillData.id ? '需要支付￥' + (+this.releasePrice).toFixed(2) + "元" : '立即发布';
        }

      },
      // 选择标签
      // choice(arr) {
      //   let j = {}
      //   arr.map(v => {
      //     j[v.id] = v.name
      //   })
      //   this.selectedLabel = j
      //   console.log("222222",arr, j)
      // },
      //获取分类公用的方法，构造picker数据
      async getGoodType(key) {
        try {


          let data = await this.getCategoryList({term: 13})
          this.columnsData[key].options = data;
          console.log("二级分类数据为", data);
          //如果存在二级
          if (data && data.length && data[0].son) {
            this.columnsData[key].columns = [
              {
                values: data.map(item => item.name)
              },
              {
                values: data[0].son.map(
                  item => item.tradeName || item.name
                ),
                defaultIndex: 0
              }
            ];
          } else if (data) {
            this.columnsData[key].columns = [
              {
                values: data.map(item => item.name)
              },
            ];
          }
        } catch (e) {
          showDialog(e);
        }
      },
      pickerChoice(item, index) {
        console.log(item, index)
        this.pickerField = item.field
        this.pickerIndex = index
        switch (item.field) {
          case 'startTime':
          case 'endTime':
            this.showDatetime = !this.showDatetime;
            break;
          case 'goodType':
            this.columns = this.columnsData[item.field].columns;
            this.pickerShow = !this.pickerShow;
            this.pickertitle = item.name;
            break;
          case 'name':
          case 'wechat':
          case 'tel':
            break;
          default:
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickertitle = item.name;
          // case 'rideTime':
          //   this.params.type == 2 ? this.showTime = !this.showTime : this.showDatetime = !this.showDatetime;
          //   return;
        }
      },
      //公用pickerchange事件
      pickerChangeHandle(picker, values, index) {
        if (values.length > 1) {
          picker.setColumnValues(
            1,
            _.find(this.columnsData[this.pickerField].options, {
              name: values[0]
            }).son.map(item => item.name)
          );
        }
        console.log(this.columnsData[this.pickerField], _.find(this.columnsData[this.pickerField].options, {
          name: values[0]
        }), picker, values, index)
      },
      pickerConfirm(value) {
        this.showDatetime = false;
        this.pickerShow = false;
        console.log(this.pickerField, this.pickerIndex)
        switch (this.pickerField) {
          case 'startTime':
          case 'endTime':
            let desc = '', format = 'YYYY-MM';
            desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
            this.$set(this.pickerData.dateData[this.pickerIndex], 'desc', desc);
            this.fillData[this.pickerData.dateData[this.pickerIndex].field] = this.getTimeStamp(value);
            break;
          case "delivery":
            this.fillData[this.pickerField] = value;
            break;
          default :
            this.selectedObj[this.pickerField] = value;
            break;
        }
        console.log(value, this.fillData)
        // if (this.pickerIndex || this.pickerIndex == 0) {
        //   // let format = '',
        //   //   d = this.listInfo[this.index],
        //   //   desc = '';
        //   // if (d.field == 'rideTime' && this.params.type == 2) {
        //   //   desc = value;
        //   // } else {
        //   //   format = 'YYYY-MM-DD HH:mm';
        //   //   desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
        //   // }
        //   let desc='',format = 'YYYY-MM';
        //   desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
        //   this.$set(this.pickerData.dateData[this.pickerIndex], 'desc', desc);
        //   this.fillData[this.pickerData.dateData[this.pickerIndex].field] = this.getTimeStamp(value);
        //   console.log(this.pickerIndex,value,this.fillData)
        // }
      },
      judgeData() {
        const data = this.fillData;
        // console.log("data", data,this.selectedObj.goodType);
        let res = {}, msg = '';
        // if (!data.storeId) msg = "缺少商家id";
        if (!this.pictures.upImg.length) msg = '请上传头像';
        else if (!data.name) msg = '请输入真实姓名';
        else if (!isTellPhone(data.tel)) msg = '请输入正确手机号';
        else if (!data.wechat) msg = '请输入您的微信';
        else if (!data.company) msg = '请输入您的公司';
        else if (!data.department) msg = '请输入您的部门';
        else if (!data.position) msg = '请输入您的职位';
        else if (!data.body) msg = '介绍一下您负责的业务';
        else if (!data.address) msg = '请定位您的地址';
        else if (!this.selectedObj.goodType.length) msg = '请选择您的行业';
        if (!msg) {
          const typePName = this.selectedObj.goodType[0],
            typeP = _.find(this.columnsData['goodType'].options, {
              name: typePName
            }),
            typeName = this.selectedObj.goodType[1],
            type = typeP.son.length
              ? _.find(typeP.son, {name: typeName}) || {}
              : {};
          console.log(typePName, typeP, typeName, type)
          this.fillData.typePid = typeP.id, this.fillData.typeId = type.id;
          //这样写会报错
          // this.fillData.delivery=this.fillData.delivery.type;
          // this.fillData.isPost=this.fillData.isPost?'1':'2';
          // this.fillData.label = this.selectedLabel;
          res.status = true
        }
        res.msg = msg;
        return res;
      },
      async formSubmit() {
        const result = this.judgeData()
        console.log(this.fillData)
        // return
        if (result.status) {
          showLoading('提交数据中')
          let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImg}), this.uploadFile({files: this.wxImg.files})])
          this.fillData.logo = imgData[0]
          this.fillData.wxImg = imgData[1]
          // hideLoading()
          this.beginRelease()
          //console.log('data',data)
        } else {
          showHandleStatusByFlag([false, result.msg])
        }
      },
      async beginRelease() {
        // showLoading();
        //编辑时候规格单独修改，这里传空
        // if (this.isEdit) {
        //   this.fillData.spec = []
        //   this.fillData.group = []
        // }
        const obj = {
          isTel: this.fillData.isTel ? '1' : '2',
          isWechat: this.fillData.isWechat ? '1' : '2',
          isAddress: this.fillData.isAddress ? '1' : '2',
          mealId: this.mealId,
        };
        // return console.log('postSaveGoods',{
        //   ...this.fillData,
        //   ...obj
        // })

        // return
        let result = await this.postSaveCard({
          ...this.fillData,
          ...obj
        });

        if (result.code) {
          // hideLoading();
          if (+this.releasePrice > 0 && !this.isEdit) {
            try {
              hideLoading();
              await showDialog("发布名片需要支付" + (+this.releasePrice).toFixed(2) + "元", "提示");
              this.$router.push({
                name: 'cashier',
                params: {
                  type: 30,
                  param: {
                    cardId: result.data,
                  },
                  info: {
                    money: this.releasePrice,
                    type: "发布名片",
                    callLink: "/auxiliary/card/myCard"
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
              this.goPointPage({path: '/auxiliary/card/myCard'}, true)
            }, 1000)
          }
        } else {
          showText(result.msg, 2000, true);
        }
      },
      // 编辑的时候数据填充
      dataFill(data) {
        if (!data) {

          this.fillData.id = this.$route.query.id;
          this.choiceRadio(0);
        } else {

          data.logo = data.logo.map(item => {
            return this.getSingleImg(item.url)
          });

          console.log("data.logo", data.logo)

          this.pictures.imgUrlList = data.logo;

          this.wxImg.files = data.wxImg || [];
          this.wxImg.filePaths = data.wxImg ? data.wxImg.map(item => {
            return this.getSingleImg(item.url)
          }) : []

          // data.showImgs = data.showImgs.map(item => {
          //   return this.getSingleImg(item.url)
          // })
          // data.detailImgs = data.detailImgs.map(item => {
          //   return this.getSingleImg(item.url)
          // })
          data.label = data.label && JSON.parse(data.label) || []
          this.fillData = data;
          const typeP =
            _.find(this.columnsData['goodType'].options, {
              id: data.typePid
            }) || {};
          this.selectedObj['goodType'][0] = typeP.name;
          console.log('typeP', typeP)
          const type = typeP.son && typeP.son.length
            ? _.find(typeP.son, {id: data.typeId}) || {}
            : {};
          this.selectedObj['goodType'][1] = type.name;
          if (!typeP.name && !type.name) {
            this.selectedObj['goodType'] = []
            showDialog('商品分类已被管理员删除，请重新选择分类')
          }
          this.fillData.isTel = data.isTel == '1' ? true : false
          this.fillData.isWechat = data.isWechat == '1' ? true : false
          this.fillData.isAddress = data.isAddress == '1' ? true : false
          this.parentSpec = data.spec
          this.parentGroup = data.group
          this.pictures.upImg = data.logo
          this.pictures.imgUrlList = data.logo
          // this.radioConfig.value = +this.fillData.city ? 0 : 1;
          // console.log("this.radioConfig.value", this.radioConfig.value);
          // if (data.imgs.length) {
          //   this.pictures = data.imgs.map(item => {
          //     return {
          //       content: this.getSingleImg(item.url)
          //     }
          //   })
          // }
          // for (let i in data.label){
          //   this.labelsDefault.push(data.label[i]);
          // }
          for (let i in data.label) this.labelsDefault.push(data.label[i])
          console.log(this.labelsDefault, data, this.fillData, this.pictures);


          this.pickerData.coupon[0].desc = this.fillData.name;
          this.pickerData.dateData[0].desc = this.fillData.tel;

          this.pickerData.dateData[1].desc = this.fillData.wechat

        }
        hideLoading();
        //请求标签
        // this.getGoodsLabel().then(res => {
        //   this.labels = res || [];
        // })
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("card", {
        //cardConfig: state => state.cardConfig,
      }),
    },
    async created() {
      const bool = await this.checkBindTel({callBack: true})
      if (!bool) return
      await this.getConfig();
      showLoading()
      await this.getGoodType('goodType');
      let result = null;
      this.fillData = JSON.parse(JSON.stringify(getParmasField('releaseCard')))
      if (this.$route.query.cardId) {
        // showLoading('填充数据中...')
        this.isEdit = true
        result = await this.postSaveCard({
          cardId: this.$route.query.cardId
        });
        if (result.code == 1) {
          this.dataFill(result.data);
        }
      } else {
        this.choiceRadio(0);
        const {latitude, longitude} = await getLocation();
        this.fillData.lat = latitude;
        this.fillData.lng = longitude;
        try {
          const res = await this.getLocationByLatLng({
            latitude,
            longitude
          });
          this.fillData.address = res.address
        } catch (e) {
          console.log(e);
        }
      }
      hideLoading();


    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #ReleaseCoupon {
    font-size: $font-size-base;
    /*padding-bottom: 120px;*/

    .head-title {
      font-size: $font-size-base;
      color: #999;
    }

    .labes-list {
      background: #fff;
      padding: 20px 30px 0;
    }

    .add-spec-btn {
      margin: 10px 0;
      padding: 16px 30px;
      border: 1PX solid #f5f5f5;
      border-radius: 10px;
      background: #f5f5f5;
      @include flex-center()
    }
  }
</style>
