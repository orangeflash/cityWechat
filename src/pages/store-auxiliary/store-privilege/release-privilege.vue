<template>
  <div>
    <Header/>
    <photo-header :max="3" @change-img="changeImgOne" :photo-list="pictures.imgUrlList"
                  title="上传特权轮播图，最多可上传3张"></photo-header>
    <dd-form-chunk title="基本信息"></dd-form-chunk>
    <van-cell-group>
      <van-field
        v-model="params.title"
        clearable
        label="特权标题"
        placeholder="请输入特权标题"
      />
      <van-field
        v-model="params.subheading"
        clearable
        label="副标题"
        placeholder="请输入特权副标题"
      />
      <picker-column v-for="(item,key) in pickerData" :key="key" :list="item" @click="pickerChoice"
                     @inputForm="inputForm"></picker-column>
    </van-cell-group>
    <dd-form-chunk title="折扣设置"></dd-form-chunk>
    <van-cell-group class="">
      <van-field
        clearable
        label="星期"
        placeholder="在星期几显示此优惠"
        :value="formatCheckboxArr(checkboxPicker.week.selected)"
        :readonly=true
        @click="pickerChoice({field:'week',name:'星期'})"
      >
        <i slot="button" class="iconfont icon-youjiantou1 col-9"></i>
      </van-field>
      <van-field
        clearable
        label="日期"
        placeholder="在几号显示此优惠"
        :value="formatCheckboxArr(checkboxPicker.month.selected)"
        :readonly=true
        @click="pickerChoice({field:'month',name:'日期'})"
      >
        <i slot="button" class="iconfont icon-youjiantou1 col-9"></i>
      </van-field>
      <van-field
        clearable
        v-model="params.discount"
        label="折扣"
        type="number"
        placeholder="五折填写数字5"
      ><span slot="button">折</span></van-field>
    </van-cell-group>
    <dd-form-chunk title="规则设置"></dd-form-chunk>
    <van-cell-group class="">
      <van-field
        clearable
        v-model="params.max"
        label="每卡限领"
        type="number"
        placeholder="每人领取上限"
      ><span slot="button">次</span></van-field>
      <van-field
        clearable
        v-model="params.condition"
        label="使用条件"
        type="number"
        placeholder="满多少元可使用此优惠"
      ><span slot="button">元</span></van-field>
      <van-field
        clearable
        label="库存数量"
        v-model="params.stock"
        type="number"
        placeholder="如不填则表示无库存上限"
      />
      <van-field
        label="使用说明"
        :readonly=true
      />
      <dd-form-textarea class="pad-30 fon-b" v-model="params.explain" height="150"
                        placeholder="请输入使用说明"/>
    </van-cell-group>
    <dd-form-chunk title="特权详情">
      <div slot="content">
        <dd-form-textarea class="pad-30 fon-b" v-model="params.details" height="150"
                          placeholder="请填写特权详情"/>
        <photo-body
          title="最多上传3张图片"
          @change-img="changeImgTwo"
          :max="3"
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
    <!--自定义数据picker-->
    <!--<checkbox-picker :list="pickerData.week.list" :result="pickerData.week.result" v-model="pickerShow"></checkbox-picker>-->
    <checkbox-picker
      v-for="(item,index) in checkboxPicker"
      :key="index"
      :title-before="item.titleBefore"
      :title-after="item.titleAfter"
      :title="item.title"
      :list="item.list"
      :result="item.result"
      v-model="item.show"
      @confirm="pickerConfirm">
    </checkbox-picker>
    <!--<van-popup
      position="bottom"
      v-model="pickerShow">
      <van-picker
        show-toolbar
        value-key="name"
        :title="pickertitle"
        :columns="columns"
        @confirm="pickerConfirm"
        @cancel="pickerShow = !pickerShow"
      />
    </van-popup>-->
    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="maxDate"
        @confirm="pickerConfirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>
  </div>

</template>

<script>
  import PhotoHeader from '../../../components/template/mall/release-photo/photo-header'
  import DdFormInput from "../../../components/template/dd-form/input"
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import DdFormTextarea from "@/components/template/dd-form/textarea"
  import PhotoBody from '../../../components/template/mall/release-photo/photo-body'
  import ChoiceLabel from '@/components/template/choice-label'
  import AgreeAgreement from '@/components/template/agree-agreement'
  import DdButton from "@/components/template/button"
  import Operation from "@/components/template/operation"
  import PickerColumn from "../../../components/template/picker/column"
  import CheckboxPicker from "../../../components/template/picker/checkbox-picker"
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {Toast} from 'vant'
  import {mapActions, mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {changeWeek} from "../../../plugins/auxiliary/auxiliary-config";

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
      PickerColumn,
      CheckboxPicker,
      Operation
    },
    data() {
      return {
        //picker
        pickerShow: false,
        pickertitle: '标题',
        columns: [],
        columnsData: {
          type: [{name: '满减券', type: 1}, {name: '折扣券', type: 2},],
        },
        pickerData: {
          // coupon:[
          //   {
          //     name: '优惠券名称',
          //     desc: '',
          //     type:'text',
          //     placeholder: '请输入优惠券名称',
          //     field: 'name'
          //   },
          // ],
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
        //checkboxPicker
        checkboxPicker: {
          week: {
            list: [{name: '周一', id: '1'}, {name: '周二', id: '2'}, {name: '周三', id: '3'}, {
              name: '周四',
              id: '4'
            }, {name: '周五', id: '5'}, {name: '周六', id: '6'}, {name: '周日', id: '7'}],
            result: [],
            title: '会在选中的周几显示此活动',
            titleBefore: '',
            titleAfter: '',
            show: false,
            selected: [],
          },
          month: {
            list: [{name: '01', id: '01'}, {name: '02', id: '02'}, {name: '03', id: '03'}, {
              name: '04',
              id: '04'
            }, {name: '05', id: '05'}, {name: '06', id: '06'}, {name: '07', id: '07'},
              {name: '08', id: '08'}, {name: '09', id: '09'}, {name: '10', id: '10'}, {
                name: '11',
                id: '11'
              }, {name: '12', id: '12'}, {name: '13', id: '13'}, {name: '14', id: '14'},
              {name: '15', id: '15'}, {name: '16', id: '16'}, {name: '17', id: '17'}, {
                name: '18',
                id: '18'
              }, {name: '19', id: '19'}, {name: '20', id: '20'}, {name: '21', id: '21'},
              {name: '22', id: '22'}, {name: '23', id: '23'}, {name: '24', id: '24'}, {
                name: '25',
                id: '25'
              }, {name: '26', id: '26'}, {name: '27', id: '27'}, {name: '28', id: '28'},
              {name: '29', id: '29'}, {name: '30', id: '30'}, {name: '31', id: '31'}],
            result: [],
            title: '会在选中的日期显示此活动',
            titleBefore: '每月',
            titleAfter: '日',
            show: false,
            selected: [],
          },
        },
        //时间选择器
        showDatetime: false,
        currentDate: new Date(),
        maxDate: new Date(),
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
        params: {
          id: '',
          title: '',
          subheading: '',//副标题
          logo: '',
          media: '',
          startTime: '',
          endTime: '',
          discount: '',
          week: [],
          month: [],
          max: '',//限领
          condition: '',//使用条件
          stock: '',//库存
          explain: '',//说明
          details: '',
          label: [],
          storeId: null, //商家id
        }
      }
    },
    methods: {
      ...mapActions('storeAuxiliary/storePrivilege', ['postAddPrivilege', 'getVipLabel']),
      ...mapActions('vip', ['getVipConfig',]),
      changeImgOne(e) {
        this.pictures.upImg = e
      },
      changeImgTwo(e) {
        this.pictures.upImgTwo = e
      },
      // PickerColumn输入表单的时候触发
      inputForm(item, key) {
        console.log(item, key, this.fillData)
        item.desc && item.desc.trim() ? this.fillData[item.field] = item.desc : this.fillData[item.field] = null;
      },
      formatCheckboxArr(arr) {
        return arr.map(item => item.name).toString() || ''
      },
      pickerChoice(item, index) {
        console.log(item, index)
        this.pickerField = item.field
        this.pickerIndex = index
        switch (item.field) {
          case 'startTime':
          case 'endTime':
            this.showDatetime = !this.showDatetime;
            return
          case 'week':
          case 'month':
            this.checkboxPicker[item.field].show = !this.checkboxPicker[item.field].show;
            console.log('this.checkboxPicker', this.checkboxPicker)
            return
          case 'type':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickertitle = item.name;
            return;
        }
      },
      pickerConfirm(value) {
        this.showDatetime = false;
        this.pickerShow = false;
        console.log(this.pickerField, this.pickerIndex)
        switch (this.pickerField) {
          case 'startTime':
          case 'endTime':
            let desc = '', format = 'YYYY-MM-DD HH:mm';
            desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
            this.$set(this.pickerData.dateData[this.pickerIndex], 'desc', desc);
            this.params[this.pickerData.dateData[this.pickerIndex].field] = Math.round(new Date(value).getTime() / 1000);
            // this.fillData[this.pickerData.dateData[this.pickerIndex].field] = this.getTimeStamp(value);
            break;
          case 'week':
          case 'month':
            this.checkboxPicker[this.pickerField].selected = value
            this.checkboxPicker[this.pickerField].show = false
            break;
          case "type":
            this.fillData[this.pickerField] = value;
            break;
        }
        console.log(value, this.fillData)
      },
      judge() {
        if (!this.pictures.upImg.length) {
          showHandleStatusByFlag([false, '上传特权轮播图'])
          return false;
        }
        return this.isFailParams({
          field: this.params,
          filter: ['id', 'logo', 'media', 'stock', 'week', 'month', 'label'],
          tips: {
            title: "请输入标题",
            subheading: "请输入副标题",
            startTime: "请选择开始时间",
            endTime: "请选择结束时间",
            discount: '请输入折扣',
            max: "请输入限领次数",//限领
            condition: '请输入使用条件',//使用条件
            stock: '请输入库存',//库存
            explain: '请输入说明',//说明
            details: '请输入特权详情',
            storeId: '缺少商家id,无法发布', //商家id
          },
          noBack: true
        })
      },
      choiceLabel(arr) {
        let j = {}
        arr.map(v => {
          j[v.id] = v.name
        })

        this.params.label = j;
      },
      async release() {
        if (!this.judge()) return;
        if (this.checkboxPicker.week.selected.length == 0 && this.checkboxPicker.month.selected.length == 0) {
          return showHandleStatusByFlag([false, '星期和日期设置至少选择一个'])
        } else if (this.params.startTime >= this.params.endTime) {
          return showHandleStatusByFlag([false, '结束时间不合理'])
        }
        if (!this.agreeAgreement) return Toast({
          message: '请同意并遵守用户协议条款',
          duration: 1000
        });
        this.params.week = this.checkboxPicker.week.selected.map(item => item.id).toString() || ''
        this.params.month = this.checkboxPicker.month.selected.map(item => item.id).toString() || ''
        showLoading('图片上传中');
        let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImg}), this.uploadFile({files: this.pictures.upImgTwo})])
        this.params.logo = imgData[0];
        this.params.media = imgData[1];
        // console.log(this.params)
        showLoading('发布中')
        const res = await this.postAddPrivilege(this.params);
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
    },
    async created() {
      this.params.storeId = this.storeId;
      let query = this.$route.query;
      if (query.privilegeId) {
        showLoading()
        const result = await this.postAddPrivilege({
          privilegeId: query.privilegeId
        });

        for (let k in this.params) this.params[k] = result.data[k]
        this.pictures.upImg = this.pictures.imgUrlList = this.params.logo.map(item => this.getSingleImg(item.url));
        this.pictures.upImgTwo = this.pictures.imgUrlListTwo = this.params.media.map(item => this.getSingleImg(item.url));
        result.data.week && (this.checkboxPicker['week'].result = this.checkboxPicker['week'].selected = result.data.week.split(',').map(item => {
          return {name: changeWeek(item), id: item}
        }))
        result.data.month && (this.checkboxPicker['month'].result = this.checkboxPicker['month'].selected = result.data.month.split(',').map(item => {
          return {name: item, id: item}
        }))
        for (let i in this.pickerData) {
          this.pickerData[i].forEach(item => {
            console.log(item.field);
            switch (item.field) {
              case 'startTime':
              case 'endTime':
                item.desc = this.formatDateByTimeStamp(+result.data[item.field], 'YYYY-MM-DD HH:mm')
                break;
              default:
                item.desc = result.data[item.field];
            }
            // this.inputForm(item);
          })
        }
        // this.endTime = format(new Date(this.params.endTime * 1000).getTime());


        if (this.params.label) {
          let labelsDefault = [];
          for (let k in this.params.label) {
            console.log("this.params.service", k)
            labelsDefault.push(this.params.label[k])
          }
          this.feature.labelsDefault = labelsDefault;
        }
        hideLoading()
        console.log(this.params)
      }
      this.getVipLabel().then(result => {
        this.feature.labels = result;
        console.log("this.params.service", this.params.service)
      });
      this.getVipConfig().then(result => {
        this.config = result;
      });
    }
  }
</script>
