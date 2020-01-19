<template>
  <div id="ReleaseCoupon">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <photo-header :max="3" @change-img="changeImgOne" title="上传商品主图，最多上传3张"
                  :photo-list="fillData.showImgs||[]"></photo-header>
    <!--<PickerColumn v-for="(item,key) in pickerData" :key="key" :list="item" @click="pickerChoice" @inputForm="inputForm"></PickerColumn>-->
    <div class="head-title">商品信息</div>
    <div>
      <van-cell-group>
        <van-field
          type="number"
          v-model="fillData.sort"
          clearable
          label="商品排序"
          placeholder="请输入商品排序"
        >
          <i slot="button" class="coupon-discount">（由大到小排序）</i>
        </van-field>
        <van-field
          v-model="fillData.title"
          clearable
          label="商品标题"
          placeholder="请输入商品标题"
        >
        </van-field>
        <!--<van-field-->
        <!--v-model="fillData.subhead"-->
        <!--clearable-->
        <!--label="副标题"-->
        <!--placeholder="请输入副标题"-->
        <!--&gt;-->
        <!--</van-field>-->
        <van-field
          clearable
          label="商品分类"
          placeholder="请选择商品分类"
          v-model="selectedObj.goodType.join(' ')"
          :readonly=true
          @click="pickerChoice({field:'goodType',name:'商品分类'})"
        >
          <i slot="button" class="iconfont icon-youjiantou1"></i>
        </van-field>
        <van-field
          v-model="fillData.currentPrice"
          clearable
          type="number"
          label="商品价格"
          placeholder="请输入商品价格"
        >
          <i slot="button" class="coupon-discount">元</i>
        </van-field>
        <van-field
          v-model="fillData.originalPrice"
          clearable
          type="number"
          label="商品原价"
          placeholder="请输入商品原价"
        >
          <i slot="button" class="coupon-discount">元</i>
        </van-field>
        <van-field
          v-model="fillData.vipMoney"
          v-if="platform.openVip"
          clearable
          type="number"
          label="商品会员价"
          placeholder="请输入商品会员价"
        >
          <i slot="button" class="coupon-discount">元</i>
        </van-field>
        <van-field
          v-model="fillData.num"
          clearable
          type="number"
          label="商品数量"
          placeholder="请输入商品数量"
        />
        <van-cell title="分销佣金类型">
          <div slot="default">
            <van-radio-group v-model="fillData.distributionModel" class="flex-y-center">
              <van-radio name="1" :checked-color="$themeColor">按比例</van-radio>
              <van-radio name="2" :checked-color="$themeColor" class="mar-l">按金额</van-radio>
            </van-radio-group>
          </div>
        </van-cell>
        <van-field
          class="flex-y-center"
          v-model="fillData.primaryDistribution"
          clearable
          type="number"
          :label="`一级分销${fillData.distributionModel==2?'金额':'比例'}`"
          placeholder="请输入"
        >
          <i slot="button" class="coupon-discount">{{fillData.distributionModel==2?'元':'%'}}</i>
        </van-field>
        <van-field
          class="flex-y-center"
          v-model="fillData.secondaryDistribution"
          clearable
          type="number"
          :label="`二级分销${fillData.distributionModel==2?'金额':'比例'}`"
          placeholder="请输入"
        >
          <i slot="button" class="coupon-discount">{{fillData.distributionModel==2?'元':'%'}}</i>
        </van-field>
        <van-cell title="商品规格">
          <van-switch
            slot="right-icon"
            size="24px"
            v-model="fillData.isSpec"
            :active-color="$themeColor"
            inactive-color="#d5d5d5"
          />
        </van-cell>
        <van-cell>
          <div class="add-spec-btn"
               @click="isEdit?goPointPage({path:'/storeAuxiliary/storeGood/storeEditSpec',query:{id:fillData.id}}):showSpec=true">
            <van-icon v-if="!isEdit"
                      name="add-o"
                      color="#BABABA"
                      size="20px"/>
            <div v-else style="color:#BABABA">编辑规格</div>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="head-title">配送设置</div>
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
        <van-cell title="是否包邮">
          <van-switch
            slot="right-icon"
            size="24px"
            v-model="fillData.isPost"
            :active-color="$themeColor"
            inactive-color="#d5d5d5"
          />
        </van-cell>
        <van-field
          v-if="!fillData.isPost"
          v-model="fillData.freight"
          clearable
          type="number"
          label="运费金额"
          placeholder="请输入运费金额"
        >
          <i slot="button" class="coupon-discount">元</i>
        </van-field>
        <van-field
          v-if="!fillData.isPost"
          v-model="fillData.satisfy"
          clearable
          type="number"
          label="包邮条件"
          placeholder="金额满足此条件则包邮"
        >
          <i slot="button" class="coupon-discount">元</i>
        </van-field>
        <!--<van-cell title="允许退款">-->
        <!--<van-switch-->
        <!--slot="right-icon"-->
        <!--size="24px"-->
        <!--v-model="fillData.isRefund"-->
        <!--:active-color="$themeColor"-->
        <!--inactive-color="#d5d5d5"-->
        <!--/>-->
        <!--</van-cell>-->
      </van-cell-group>
    </div>
    <div class="head-title">商品详情</div>
    <div>
      <dd-textarea max="500" placeholder="请输入商品说明" :textarea-data.sync="fillData.details"/>
      <photo-body @change-img="changeImgTwo" :max="6" :photo-list="fillData.detailImgs||[]"></photo-body>
    </div>
    <div class="head-title">服务标签</div>
    <ul class="labes-list">
      <ChoiceLabel
        @choice="choice"
        :labelsDefault="labelsDefault"
        max="5"
        :labels="labels"
      ></ChoiceLabel>
    </ul>
    <!--<AgreeAgreement-->
    <!--:status="checked"-->
    <!--@choice="checked = !checked"-->
    <!--:con="setUp.agreement"-->
    <!--name="求职发布协议"-->
    <!--&gt;</AgreeAgreement>-->
    <footer class="footer-container">
      <button
        class="footer-btn"
        :disabled="!checked"
        @click="formSubmit"
      >立即发布
      </button>
    </footer>
    <release-spec :parent-spec="parentSpec||[]" :parent-group="parentGroup||[]" @get-spec-group="getSpecGroup"
                  :show.sync="showSpec"/>
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
    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :max-date="maxDate"
        @confirm="pickerConfirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import Header from "@/components/header";
  import AgreeAgreement from '@/components/template/agree-agreement'
  import DdTextarea from '../../../components/template/agree-agreement/dd-textarea'
  import PhotoHeader from '../../../components/template/mall/release-photo/photo-header'
  import PhotoBody from '../../../components/template/mall/release-photo/photo-body'
  import ReleaseSpec from '../../../components/template/mall/release-photo/release-spec'
  import PickerColumn from "../../../components/template/picker/column"
  import ChoiceLabel from '@/components/template/choice-label'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {getParmasField} from "../../../plugins/auxiliary/http-params";
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  import {uploadImage} from "../../../util/wechat-util";

  export default {
    name: "ReleaseGood",
    props: [],
    components: {
      Header,
      AgreeAgreement,
      DdTextarea,
      PickerColumn,
      PhotoHeader,
      PhotoBody,
      ReleaseSpec,
      ChoiceLabel,
    },
    data() {
      return {
        isEdit: false,
        showSpec: false,
        parentSpec: [],
        parentGroup: [],
        agreeAgreement: false,
        setUp: "",
        checked: true,
        pickerData: {
          coupon: [
            {
              name: '优惠券名称',
              desc: '',
              type: 'text',
              placeholder: '请输入优惠券名称',
              field: 'name'
            },
          ],
          dateData: [
            {
              name: '开始时间',
              desc: '请选择',
              time: true,
              field: 'startTime'
            },
            {
              name: '结束时间',
              desc: '请选择',
              time: true,
              field: 'endTime'
            },
          ],
        },
        //图片
        pictures: {
          showImgs: [],
          detailImgs: [],
        },
        //提交时候用的
        uploadObj: {
          showImgs: [],
          detailImgs: [],
        },
        //时间选择
        showDatetime: false,
        currentDate: new Date(),
        maxDate: new Date(),
        //picker
        pickerShow: false,
        pickertitle: '标题',
        columns: [],
        columnsData: {
          delivery: [{name: '快递配送', type: 1}],
          goodType: []
        },
        selectedObj: {
          goodType: [],
        },
        fillData: {},
        labels: [],
        labelsDefault: [],
        selectedLabel: null,
      }
    },
    methods: {
      ...mapActions("common", ["getWxUpload"]),
      ...mapActions("jobHunt", ["getJobConfig", "getJobInfo"]),
      ...mapActions("jobHunt", ["getJobConfig", "getJobPosition", "getCategoryLabel"]),
      ...mapActions("storeAuxiliary/releaseGood", ["postSaveGoods", "getGoodsLabel", "getCategoryList", "getGoodsInfo"]),
      //规格组合
      getSpecGroup(spec, group) {
        console.log('添加的规格为', spec, group)
        this.fillData.spec = spec || [];
        this.fillData.group = group || [];
      },
      //图片变化
      changeImgOne(e) {
        console.log(e, this.pictures.showImgs)
        this.pictures.showImgs = e
      },
      changeImgTwo(e) {
        console.log(e, this.pictures.detailImgs)
        this.pictures.detailImgs = e
      },
      async uploadImg(key) {
        let that = this;
        console.log(key, this.assetPath, that.pictures[key])
        // return new Promise(function (resolve, reject) {
        //这种写法IOS系统无法并发请求wx.uploadImg
        //   const promiseArr = that.fillData[key].map(async (item) => {
        //     console.log(item)
        //     if(item.indexOf('http')>-1){
        //       return await item.substring(that.assetPath.length)
        //     }
        //     else {
        //       const {serverId} = await uploadImage(item);
        //       const url=await this.getWxUpload({mediaId:serverId})
        //       return url.data
        //     }
        //   });
        //   const arr= await Promise.all(promiseArr);
        //这种写法循环依次请求，非常耗时
        // let arr=[]
        // for (let item of that.fillData[key]) {
        //   if(item.indexOf('http')>-1){
        //     arr.push(item.substring(that.assetPath.length))
        //   }
        //   else {
        //     const {serverId} = await uploadImage(item);
        //     const url=await this.getWxUpload({mediaId:serverId})
        //     arr.push(url.data)
        //   }
        // }
        //这种更加优化为在选图片就已经上传到微信服务器，所以不用在这里递归了
        // let getServerIdArr=[]
        // for (let item of that.fillData[key]) {
        //   if(item.indexOf('http')>-1){
        //     getServerIdArr.push(item)
        //   }
        //   else {
        //     const {serverId} = await uploadImage(item);
        //     getServerIdArr.push(serverId)
        //   }
        // }
        let promiseArr = this.pictures[key].map(async (item) => {
          if (item.indexOf('http') > -1) {
            return await item.substring(that.assetPath.length)
          } else {
            const url = await this.getWxUpload({mediaId: item})
            return url.data
          }
        })
        let arr = await Promise.all(promiseArr);
        return arr
        // })
      },
      // 选择标签
      choice(arr) {
        let j = {}
        arr.map(v => {
          j[v.id] = v.name
        })
        this.selectedLabel = j
        console.log(arr, j)
      },
      async getGoodType(key) {
        let data = await this.getCategoryList()
        this.columnsData[key].options = data;
        console.log("二级分类数据为", data);
        //如果存在二级
        if (data[0].son) {
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
        } else {
          this.columnsData[key].columns = [
            {
              values: data.map(item => item.name)
            },
          ];
        }
      },
      async getConfig() {
        this.setUp = await this.getJobConfig();
      },
      // 输入表单的时候触发
      inputForm(item, key) {
        console.log(item, key, this.fillData)
        item.desc && item.desc.trim() ? this.fillData[item.field] = item.desc : this.fillData[item.field] = null;
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
          default:
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickertitle = item.name;
          // case 'rideTime':
          //   this.params.type == 2 ? this.showTime = !this.showTime : this.showDatetime = !this.showDatetime;
          //   return;
        }
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
        this.fillData.storeId = this.storeId;
        const data = this.fillData;
        // console.log("data", data,this.selectedObj.goodType);
        let res = {}, msg = '';
        if (!data.storeId) msg = "缺少商家id";
        else if (!this.pictures.showImgs.length) msg = '请上传商品主图';
        else if (!data.sort) msg = '请输入排序';
        else if (!data.title) msg = '请输入标题';
        // else if (!data.subhead) msg = '请输入副标题';
        else if (!this.selectedObj.goodType.length) msg = '请选择分类';
        else if (!data.currentPrice) msg = '请输入价格';
        else if (!data.originalPrice) msg = '请输入原价';
        else if (data.vipMoney && data.vipMoney >= data.currentPrice) msg = '会员价要低于正常价';
        else if (!data.num) msg = '请输入数量';
        else if (this.isEdit && data.isSpec && !this.parentSpec.length) msg = '请添加规格';
        else if (!this.isEdit && data.isSpec && !data.spec.length) msg = '请添加规格';
        else if (!data.isPost && !Number(data.satisfy)) msg = '请输入合理包邮条件';
        else if (!data.isPost && !Number(data.freight)) msg = '请输入合理运费';
        else if (!data.details) msg = '请输入商品详情';
        else if (!this.pictures.detailImgs.length) msg = '请上传商品详情图片';
        else if (_.isEmpty(this.selectedLabel)) msg = '请至少选择一个标签';
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
          this.fillData.label = this.selectedLabel;
          res.status = true
        }
        res.msg = msg;
        return res;
      },
      async formSubmit() {
        const result = this.judgeData()
        if (result.status) {
          showLoading('提交数据中')
          let data = await Promise.all([this.uploadFile({files: this.pictures.showImgs}), this.uploadFile({files: this.pictures.detailImgs})])
          // let showData=await this.uploadImg('showImgs')
          // let detailData=await this.uploadImg('detailImgs')
          // hideLoading()
          this.uploadObj.showImgs = data[0]
          this.uploadObj.detailImgs = data[1]
          this.beginRelease()
          //console.log('data',data)
        } else {
          showHandleStatusByFlag([false, result.msg])
        }
      },
      async beginRelease() {
        showLoading();
        //编辑时候规格单独修改，这里传空
        if (this.isEdit) {
          this.fillData.spec = []
          this.fillData.group = []
        }
        const obj = {
          delivery: this.fillData.delivery.type,
          isPost: this.fillData.isPost ? '1' : '2',
          isRefund: this.fillData.isRefund ? '1' : '2',
          isSpec: this.fillData.isSpec ? '1' : '2',
          showImgs: this.uploadObj.showImgs,
          detailImgs: this.uploadObj.detailImgs,
        };
        // console.log({...this.fillData,
        //   ...obj})
        // return
        let result = await this.postSaveGoods({
          ...this.fillData,
          ...obj
        });
        if (result.code) {
          // hideLoading();
          showHandleStatusByFlag([true, '提交成功'])
          setTimeout(() => {
            this.goPointPage({path: '/storeAuxiliary/storeGood/storeGoodList'}, true)
          }, 1000)
        } else {
          showText(result.msg, 2000, true);
        }
      },
      // 编辑的时候数据填充
      dataFill(data) {
        if (!data) {
          this.fillData = JSON.parse(JSON.stringify(getParmasField('releaseGood')))
          this.fillData.id = this.$route.query.id;

        } else {
          data.showImgs = data.showImgs.map(item => {
            return this.getSingleImg(item.url)
          })
          data.detailImgs = data.detailImgs.map(item => {
            return this.getSingleImg(item.url)
          })
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
          this.fillData.isPost = data.isPost == '1' ? true : false
          this.fillData.isSpec = data.isSpec == '1' ? true : false
          this.fillData.isRefund = data.isRefund == '1' ? true : false
          this.parentSpec = data.spec
          this.parentGroup = data.group
          this.pictures.showImgs = data.showImgs
          this.pictures.detailImgs = data.detailImgs
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

        }
        hideLoading();
        //请求标签
        this.getGoodsLabel().then(res => {
          this.labels = res || [];
        })
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    async created() {
      this.getConfig();
      showLoading()
      await this.getGoodType('goodType');
      let result = null;
      if (this.$route.query.goodsId) {
        // showLoading('填充数据中...')
        this.isEdit = true
        result = await this.getGoodsInfo({
          goodsId: this.$route.query.goodsId
        })
      }
      this.dataFill(result);
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #ReleaseCoupon {
    font-size: $font-size-base;
    padding-bottom: 120px;

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
