<template>
  <div>
    <Header/>
    <photo-header :max="3" @change-img="changeImgOne" :photo-list="pictures.imgUrlList"
                  title="上传商品主图，最多上传3张，建议尺寸：750*750px"></photo-header>
    <picker-column v-for="(item,key) in pickerData" :key="key" :class="{'mar-t-20':key=='dateData'}" :list="item" @click="pickerChoice" @inputForm="inputForm"></picker-column>
    <dd-form-chunk title="商品信息"></dd-form-chunk>
    <van-cell-group class="">
      <!--<van-field-->
        <!--clearable-->
        <!--label="星期"-->
        <!--placeholder="在星期几显示此优惠"-->
        <!--:value="formatCheckboxArr(checkboxPicker.week.selected)"-->
        <!--:readonly=true-->
        <!--@click="pickerChoice({field:'week',name:'星期'})"-->
      <!--&gt;-->
        <!--<i slot="button" class="iconfont icon-youjiantou1 col-9"></i>-->
      <!--</van-field>-->
      <!--<van-field-->
        <!--clearable-->
        <!--label="日期"-->
        <!--placeholder="在几号显示此优惠"-->
        <!--:value="formatCheckboxArr(checkboxPicker.month.selected)"-->
        <!--:readonly=true-->
        <!--@click="pickerChoice({field:'month',name:'日期'})"-->
      <!--&gt;-->
        <!--<i slot="button" class="iconfont icon-youjiantou1 col-9"></i>-->
      <!--</van-field>-->
      <van-field
        clearable
        v-model="params.rushPrice"
        label="抢购价格"
        type="number"
        placeholder="请填写抢购价格"
      ><span slot="button">元</span></van-field>
      <van-field
        clearable
        v-model="params.originalPrice"
        label="商品原价"
        type="number"
        placeholder="请填写商品原价"
      ><span slot="button">元</span></van-field>
      <van-field
        v-if="platform.openVip"
        clearable
        v-model="params.memberPrice"
        label="会员价"
        type="number"
        placeholder="请填写会员价，不填或为0则按正常价"
      ><span slot="button">元</span></van-field>
      <van-field
        clearable
        v-model="params.num"
        label="商品库存"
        type="number"
        placeholder="请填写商品库存"
      ></van-field>
      <van-field
        clearable
        v-model="params.limitNum"
        label="每人限购"
        type="number"
        placeholder="每人限购总件数"
      ></van-field>
      <van-field
      clearable
      label="配送方式"
      placeholder="请选择"
      v-model="params.delivery&&params.delivery.name"
      :readonly=true
      @click="pickerChoice({field:'delivery',name:'配送方式'})">
      <i slot="button" class="iconfont icon-youjiantou1"></i>
      </van-field>
      <!--<van-field-->
        <!--clearable-->
        <!--v-model="params.discount"-->
        <!--label="运费"-->
        <!--type="number"-->
        <!--placeholder="请填写商品运费"-->
      <!--&gt;<span slot="button">元</span></van-field>-->
    </van-cell-group>
    <dd-form-chunk title="商品详情">
      <div slot="content">
        <van-field label="背景音乐" v-model="params.music" placeholder="请填写活动音乐链接">
          <dd-music slot="right-icon"  v-model="params.music" />
        </van-field>
        <van-field label="商品视频" v-model="params.video" placeholder="请填写活动视频链接">
          <dd-video slot="right-icon" v-model="params.video"/>
        </van-field>
        <dd-form-textarea class="pad-30 fon-b" v-model="params.details" height="150"
                          placeholder="请填写商品详情"/>
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
      :con="config.goodsBody"
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
    <van-popup
      position="bottom"
      v-model="pickerShow">
      <van-picker
        show-toolbar
        value-key="name"
        :title="pickerTitle"
        :columns="columns"
        @confirm="pickerConfirm"
        @cancel="pickerShow = !pickerShow"
      />
    </van-popup>
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
  import DdMusic from "../../../components/template/other/music"
  import DdVideo from "../../../components/template/other/video"
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  import {Toast} from 'vant'
  import {mapActions,mapState} from 'vuex'
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
      Operation,
      DdMusic,
      DdVideo,
    },
    data() {
      return {
        //picker
        pickerShow: false,
        pickerTitle: '标题',
        columns: [],
        columnsData: {
          delivery: [{name:'快递发货',type:'1'}, {name:'到店核销',type:'2'},],
          goodType: {},
        },
        pickerData: {
          coupon:[
            {
              name: '抢购标题',
              desc: '',
              type:'text',
              placeholder: '限时抢购标题',
              field: 'title'
            },
          ],
          goodType:[
            {
              name: '商品分类',
              desc: '请选择',
              field: 'goodType'
            },
          ],
          dateData:[
            {
              name: '抢购开始时间',
              desc: '请选择',
              field: 'startTime'
            },
            {
              name: '抢购结束时间',
              desc: '请选择',
              field: 'endTime'
            },
          ],
          dateDataTwo:[
            {
              name: '消费截止时间',
              desc: '请选择',
              field: 'expireTime'
            },
          ],
        },
        //checkboxPicker
        checkboxPicker:{
          week:{
            list:[{name:'周一',id:'1'},{name:'周二',id:'2'},{name:'周三',id:'3'},{name:'周四',id:'4'},{name:'周五',id:'5'},{name:'周六',id:'6'},{name:'周日',id:'7'}],
            result:[],
            title:'会在选中的周几显示此活动',
            titleBefore:'',
            titleAfter:'',
            show:false,
            selected:[],
          },
          month:{
            list:[{name:'01',id:'01'},{name:'02',id:'02'},{name:'03',id:'03'},{name:'04',id:'04'},{name:'05',id:'05'},{name:'06',id:'06'},{name:'07',id:'07'},
              {name:'08',id:'08'}, {name:'09',id:'09'},{name:'10',id:'10'},{name:'11',id:'11'},{name:'12',id:'12'},{name:'13',id:'13'},{name:'14',id:'14'},
              {name:'15',id:'15'}, {name:'16',id:'16'},{name:'17',id:'17'},{name:'18',id:'18'},{name:'19',id:'19'},{name:'20',id:'20'},{name:'21',id:'21'},
              {name:'22',id:'22'}, {name:'23',id:'23'},{name:'24',id:'24'},{name:'25',id:'25'},{name:'26',id:'26'},{name:'27',id:'27'},{name:'28',id:'28'},
              {name:'29',id:'29'},{name:'30',id:'30'},{name:'31',id:'31'}],
            result:[],
            title:'会在选中的日期显示此活动',
            titleBefore:'每月',
            titleAfter:'日',
            show:false,
            selected:[],
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
          id:'',
          title:'',
          originalPrice:'',//副标题
          rushPrice:'',
          memberPrice:'',
          typeId:'',
          num:'',
          showImgs:'',
          delivery:'',
          detailImgs:'',
          music:'',
          video:'',
          details:'',
          label:[],
          limitNum:'',
          startTime:'',
          endTime:'',
          expireTime:'',
          storeId: null, //商家id
        }
      }
    },
    methods: {
      ...mapActions('storeAuxiliary/storeRushbuy', ['postRushSaveGoods','getRushLabel','getRushGoodsCategory']),
      ...mapActions('rushBuy',['getRushConfig',]),
      changeImgOne(e) {
        this.pictures.upImg = e
      },
      changeImgTwo(e) {
        this.pictures.upImgTwo = e
      },
      // PickerColumn输入表单的时候触发
      inputForm(item, key) {
        console.log(item,key,this.params)
        item.desc && item.desc.trim() ? this.params[item.field] = item.desc : this.params[item.field] = '';
      },
      formatCheckboxArr(arr){
        return arr.map(item=>item.name).toString()||''
      },
      pickerChoice(item, index) {
        console.log(item,index)
        this.pickerField=item.field
        this.pickerIndex=index
        switch (item.field) {
          case 'startTime':
          case 'endTime':
          case 'expireTime':
            this.showDatetime = !this.showDatetime;
            return
          case 'week':
          case 'month':
            this.checkboxPicker[item.field].show = !this.checkboxPicker[item.field].show;
            console.log('this.checkboxPicker',this.checkboxPicker)
            return
          case 'goodType':
            this.columns = this.columnsData[item.field].columns;
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
          case 'delivery':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
        }
      },
      pickerConfirm(value) {
        this.showDatetime = false;
        this.pickerShow = false;
        let desc='',format = 'YYYY-MM-DD HH:mm';
        console.log(this.pickerField,this.pickerIndex)
        switch (this.pickerField) {
          case 'startTime':
          case 'endTime':
            desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
            this.$set(this.pickerData.dateData[this.pickerIndex], 'desc', desc);
            this.params[this.pickerData.dateData[this.pickerIndex].field] =  Math.round(new Date(value).getTime() / 1000);
            break;
          case 'expireTime':
            desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
            this.$set(this.pickerData.dateDataTwo[this.pickerIndex], 'desc', desc);
            this.params[this.pickerData.dateDataTwo[this.pickerIndex].field] =  Math.round(new Date(value).getTime() / 1000);
            break;
          case 'week':
          case 'month':
            this.checkboxPicker[this.pickerField].selected=value
            this.checkboxPicker[this.pickerField].show=false
            break;
          case 'goodType':
            this.$set(this.pickerData.goodType[this.pickerIndex], 'desc', value[0].name);
            this.params.typeId=value[0].id
            break;
          case 'delivery':
            this.params[this.pickerField] = value;
            break;
        }
        console.log(value,this.params)
      },
      judge() {
        if (!this.pictures.upImg.length) {
          showHandleStatusByFlag([false,'上传商品主图'])
          return false;
        }
        else if (!this.params.typeId.length) {
          showHandleStatusByFlag([false,'请选择商品分类'])
          return false;
        }
        else if (this.params.memberPrice && +this.params.memberPrice >= this.params.rushPrice) {
          showHandleStatusByFlag([false, '会员价要低于正常价'])
          return false;
        }
        return this.isFailParams({
          field: this.params,
          filter: ['id','typeId', 'showImgs','music','video', 'detailImgs','memberPrice','label'],
          tips: {
            title: "请输入标题",
            rushPrice: "请输入抢购价",
            originalPrice: "请输入原价",
            startTime: "请选择开始时间",
            endTime: "请选择结束时间",
            expireTime:'请选择截止时间',
            num:"请输入库存",
            delivery:'请选择配送方式',
            limitNum:'请输入限购总数',
            details:'请输入抢购详情',
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
        if(this.params.startTime>=this.params.endTime||this.params.endTime>=this.params.expireTime){
          return showHandleStatusByFlag([false,'时间不合理'])
        }
        // else if(this.platform.openVip&&this.params.memberPrice){
        //   return showHandleStatusByFlag([false,'请输入会员价'])
        // }
        if (!this.agreeAgreement) return Toast({
          message: '请同意并遵守用户协议条款',
          duration: 1000
        });
        showLoading('图片上传中');
        let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImg}), this.uploadFile({files: this.pictures.upImgTwo})])
        this.params.showImgs = imgData[0];
        this.params.detailImgs = imgData[1];
        this.params.delivery=this.params.delivery.type;
        // console.log(this.params)
        showLoading('发布中')
        const res = await this.postRushSaveGoods(this.params);
        showHandleStatusByFlag(res.code,'发布成功',res.msg)
        res.code&&setTimeout(() => {
          this.$popRoute()
        }, 1000)
      },
      async getGoodType(key) {
        let data = await this.getRushGoodsCategory({term:16})
        if(!data.length) return showText('未添加商品分类，将无法正常发布')
        this.columnsData[key].options = data;
        console.log("二级分类数据为", data);
        //如果存在二级
        if (data[0].son.length) {
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
              values: data.map(item => ({name:item.name,id:item.id}))
            },
          ];
        }
        console.log(this.columnsData[key])
        hideLoading()
      },
    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    async created() {
      this.params.storeId = this.storeId;
      let query = this.$route.query;
      showLoading()
      await this.getGoodType('goodType');
      if (query.goodsId) {
        const result = await this.postRushSaveGoods({
          goodsId: query.goodsId
        });

        for (let k in this.params) this.params[k] = result.data[k]
        this.pictures.upImg = this.pictures.imgUrlList = this.params.showImgs.map(item => this.getSingleImg(item.url));
        this.pictures.upImgTwo = this.pictures.imgUrlListTwo = this.params.detailImgs.map(item => this.getSingleImg(item.url));
        this.params.delivery=_.find(this.columnsData.delivery,['type',this.params.delivery])
        for(let i in this.pickerData){
          this.pickerData[i].forEach(item => {
            console.log(item.field);
            switch (item.field) {
              case 'startTime':
              case 'endTime':
              case 'expireTime':
                item.desc = this.formatDateByTimeStamp(+result.data[item.field], 'YYYY-MM-DD HH:mm')
                break;
              case 'goodType':
                item.desc =_.find(this.columnsData['goodType'].options,{id:result.data.typeId}).name
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
        console.log(this.params)
      }
      this.getRushLabel().then(res => {
        this.feature.labels = res;
        console.log("this.params.service", this.params.service)
      });
      this.getRushConfig().then(res => {
        this.config = res;
      });
    }
  }
</script>
