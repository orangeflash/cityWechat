<template>
  <div id="ReleaseCoupon">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <PickerColumn v-for="(item,key) in pickerData" :key="key" :list="item" @click="pickerChoice" @inputForm="inputForm"></PickerColumn>
    <div class="mar-t">
      <van-cell-group v-if="fillData">
        <van-field
          clearable
          label="优惠类型"
          placeholder="请选择"
          v-model="fillData.type&&fillData.type.name"
          :readonly=true
          @click="pickerChoice({field:'type',name:'优惠券类型'})"
        >
          <i slot="button" class="iconfont icon-youjiantou1"></i>
        </van-field>
        <van-field
          v-model="fillData.discount"
          clearable
          type="number"
          :label="fillData.type.type=='1'?'优惠金额':'折扣比列'"
          placeholder="请输入"
        >
        <i slot="button" class="coupon-discount">{{fillData.type.type=='1'?'元':'折'}}</i>
        </van-field>
        <van-field
          v-model="fillData.reach"
          clearable
          type="number"
          label="使用门槛"
          placeholder="请输入（填0为无门槛）"
        />

        <van-field
          v-model="fillData.num"
          clearable
          type="number"
          label="优惠券数量"
          placeholder="请输入"
        />
        <!--<van-cell title="可叠加使用">-->
          <!--<van-switch-->
            <!--slot="right-icon"-->
            <!--size="24px"-->
            <!--v-model="fillData.superposition"-->
            <!--:active-color="$themeColor"-->
            <!--inactive-color="#d5d5d5"-->
          <!--/>-->
        <!--</van-cell>-->
      </van-cell-group>
    </div>
    <div class="mar-t" v-if="fillData">
      <dd-textarea max="50" title="使用说明" placeholder="请输入使用说明" :textarea-data.sync="fillData.introduce"/>
    </div>
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
      >保存
      </button>
    </footer>
    <van-popup
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
    </van-popup>
    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="maxDate"
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
  import PickerColumn from "../../../components/template/picker/column"
  import {utilMixins} from "../../../plugins/util-mixins";
  import {getParmasField} from "../../../plugins/auxiliary/http-params";
  import {compareStartEnd, hideLoading, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  export default {
    name: "ReleaseCoupon",
    props:[],
    components: {
      Header,
      AgreeAgreement,
      DdTextarea,
      PickerColumn,
    },
    data() {
      return {
        agreeAgreement: false,
        setUp: "",
        checked: true,
        pickerData: {
          coupon:[
            {
              name: '优惠券名称',
              desc: '',
              type:'text',
              placeholder: '请输入优惠券名称',
              field: 'name'
            },
          ],
          dateData:[
            {
              name: '开始时间',
              desc: '请选择',
              time:true,
              field: 'startTime'
            },
            {
              name: '结束时间',
              desc: '请选择',
              time:true,
              field: 'endTime'
            },
          ],
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
          type: [{name:'满减券',type:1}, {name:'折扣券',type:2},],
        },
        fillData: null,
      }
    },
    methods: {
      ...mapActions("jobHunt", ["getJobConfig","getJobInfo"]),
      ...mapActions("storeAuxiliary/storeCoupon", ["postSaveCoupon","getCouponInfo"]),
      async getConfig(){
        this.setUp = await this.getJobConfig();
      },
      // 输入表单的时候触发
      inputForm(item, key) {
        console.log(item,key,this.fillData)
        item.desc && item.desc.trim() ? this.fillData[item.field] = item.desc : this.fillData[item.field] = null;
      },
      pickerChoice(item, index) {
        console.log(item,index)
        this.pickerField=item.field
        this.pickerIndex=index
        switch (item.field) {
          case 'startTime':
          case 'endTime':
            this.showDatetime = !this.showDatetime;
            return
          case 'type':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickertitle = item.name;
            return;
          // case 'rideTime':
          //   this.params.type == 2 ? this.showTime = !this.showTime : this.showDatetime = !this.showDatetime;
          //   return;
        }
      },
      pickerConfirm(value) {
        this.showDatetime = false;
        this.pickerShow = false;
        console.log(this.pickerField,this.pickerIndex)
        switch (this.pickerField) {
          case 'startTime':
          case 'endTime':
            let desc='',format = 'YYYY-MM-DD';
            desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
            this.$set(this.pickerData.dateData[this.pickerIndex], 'desc', desc);
            this.fillData[this.pickerData.dateData[this.pickerIndex].field] = desc;
            // this.fillData[this.pickerData.dateData[this.pickerIndex].field] = this.getTimeStamp(value);
            break;
          case "type":
            this.fillData[this.pickerField] = value;
            break;
        }
        console.log(value,this.fillData)
      },
      judgeData() {
        this.fillData.storeId = this.storeId;
        const data = this.fillData;
        console.log("data", data,compareStartEnd(data.startTime, data.endTime));
        let res = {},msg='';
        if (!data.storeId) msg = "缺少商家id";
        else if (!data.name) msg = '请输入优惠券名称';
        else if (!data.startTime) msg = '请选择开始时间';
        else if (!data.endTime) msg = '请选择结束时间';
        else if (!compareStartEnd(data.startTime, data.endTime)) msg = '结束时间应大于开始时间';
        else if (!data.discount) msg = '请输入优惠金额/折扣比列';
        else if (data.type.type=='2'&&(+data.discount>=10||+data.discount<=0)) msg = '折扣比列应小于10大于0';
        else if (!data.reach) msg = '请输入使用门槛';
        else if (data.type.type=='1'&&(+data.discount>=+data.reach)) msg = '优惠金额应小于使用门槛';
        else if (!data.num) msg = '请输入数量';
        else if (!data.introduce) msg = '请输入使用说明';
        if (!msg) {
          res.status = true
        }
        res.msg=msg;
        return res;
      },
      async formSubmit() {
        const result = this.judgeData()
        if (result.status) {
          showLoading();
          const obj={
            type:this.fillData.type.type,
          };
          // console.log({...this.fillData,
          //   ...obj})
          // return
          let result = await this.postSaveCoupon({
            ...this.fillData,
            ...obj
          });
          if(result.code) {
            // hideLoading();
            showHandleStatusByFlag([true, '提交成功'])
            setTimeout(() => {
              this.$popRoute()
            }, 1000)
          }
          else {
            showText(result.msg,2000,true);
          }
        }
        else {
          showHandleStatusByFlag([false,result.msg])
        }
      },
      // 编辑的时候数据填充
      dataFill(data) {
        if (!data) {
          this.fillData=JSON.parse(JSON.stringify(getParmasField('releaseCoupon')))
          this.fillData.id = this.$route.query.id;

        } else {
          this.fillData=data
          this.fillData.type=data.type=='1'?{name:'满减券',type:1}:{name:'折扣券',type:2}
          for(let i in this.pickerData){
            this.pickerData[i].forEach(item => {
              console.log(item.field);
              switch (item.field) {
                case 'startTime':
                case 'endTime':
                  item.desc = this.formatDateByTimeStamp(new Date(+data[item.field]).getTime(), 'YYYY-MM-DD')
                  break;
                default:
                  item.desc = data[item.field];
              }
              this.inputForm(item);
            })
          }
          hideLoading();
        }
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    async created() {
      this.getConfig();
      let result = null;
      if (this.$route.query.id) {
        showLoading('填充数据中...')
        this.isEdit=true
        result = await this.getCouponInfo({
          couponId: this.$route.query.id
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
  }
</style>
