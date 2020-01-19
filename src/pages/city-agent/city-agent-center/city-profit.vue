<template>
  <div class="box">
    <Header></Header>
    <div class="header">
      <van-tabs
        v-model="active"
        :color="$themeColor"
        :line-width="25"
        @click="changeTab"
      >
        <van-tab :title="label" v-for="(label,key) in tabList" :key="key"></van-tab>
      </van-tabs>
      <div class="headerbox">
        <van-cell-group class="br-r-10">
          <van-field
            :value="searchTime"
            center
            readonly
            label="日期"
            placeholder="请选择日期"
            @click="showFlag = !showFlag"
          >
            <button class="bg-t col-f br-r-16 pad-10 pad-lr fon-sm" slot="button" size="small" type="primary" @click="serchBtn">查找</button>
          </van-field>
        </van-cell-group>
        <PickerColumn v-for="(item,key) in pickerData" :key="key" :list="item" @click="pickerChoice" v-show="showFlag"></PickerColumn>
        <div class="infobox">
          <div class="agentinfo">
            <p class="agentcount">营业额</p>
            <p class="agentnum">{{this.incomeList.money}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="region pad-30">
      <div class="regionalv">
        <div class="regions fon-lg">收益概况</div>
      </div>
      <div class="regionbox">
        <div class="regioninfos"
           v-for="(item,index) in incomeList.list" :key="index"
        >
          <p class="regionnum">{{item.money}}</p>
          <p class="regcity">{{item.note}}</p>
        </div>
      </div>
    </div>
    <div class="height"></div>
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
        :max-date="maxDate"
        @confirm="pickerConfirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "@/plugins/util-mixins";
  import PickerColumn from "@/components/template/picker/column"
  import {showDialog} from "../../../util";
  export default {
    name: "city-profit",
    data(){
      return {
        tabList:['今日','昨日'],
        active:this.$route.query.activeid||0,
        title:this.$route.query.title,
        incomeList:{},
        pickerShow:false,
        pickertitle: '标题',
        columns: [],
        // 时间组件
        pickerData: {
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
        showDatetime: false,
        currentDate: new Date(),
        maxDate: new Date(),
        showFlag:false,
        params:{
          cityId:null,
          startTime:null,
          endTime:null,
        }
      }
    },
    methods:{
      ...mapActions("cityAgent",["getincomeList","getSingleZoneList"]),
      // 城市收益明细
      async getIncomeList () {
        const incomeList = await this.getincomeList(this.params)
        this.incomeList = incomeList
        console.log(this.params,this.incomeList)
      },
      // 时间选择
      pickerChoice(item, index) {
        this.pickerField=item.field
        this.pickerIndex=index
        switch (item.field) {
          case 'startTime':
          case 'endTime':
            this.showDatetime = !this.showDatetime;
            return
        }
      },
      pickerConfirm(value) {
        this.showDatetime = false;
        let desc='',format = 'YYYY-MM-DD';
        desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
        this.$set(this.pickerData.dateData[this.pickerIndex], 'desc', desc);
        // switch (this.pickerField) {
        //   case 'startTime':
        //     this.params.startTime = this.getTimeStamp(new Date(desc).setHours(0,0,0,0))
        //     break;
        //   case 'endTime':
        //     this.params.endTime = this.getTimeStamp(new Date(desc).setHours(0,0,0,0))
        //     break;
        // }
      },
      serchBtn(){
        if(this.pickerData.dateData[0].desc=='请选择'||this.pickerData.dateData[1].desc=='请选择'){
          showDialog('请选择合理的时间段')
          return
        }
        this.params.startTime = this.getTimeStamp(new Date(this.pickerData.dateData[0].desc).setHours(0,0,0,0))
        this.params.endTime = this.getTimeStamp(new Date(this.pickerData.dateData[1].desc).setHours(0,0,0,0))
        if(this.params.endTime<=this.params.startTime){
          showDialog('请选择合理的时间段')
          return
        }
        this.showFlag = false
        this.getIncomeList()
      },
      changeTab(active) {
        if(active==0){
          this.params.startTime =null;
          this.params.endTime =null;
        }
        else if(active==1){
          this.params.startTime =this.getDayTimeStamp(-1,true);
          this.params.endTime =this.getDayTimeStamp(0,true);
        }
        this.getIncomeList()
        console.log('changeTab',active)
      },
    },
    components:{
      PickerColumn,
    },
    computed:{
      ...mapState("cityAgent",{
        agentInfo:state => state.agentInfo,
      }),
      searchTime(){
        return this.pickerData.dateData[1].desc=='请选择'?'':`${this.pickerData.dateData[0].desc}至${this.pickerData.dateData[1].desc}`
      },
    },
    mixins: [utilMixins],
    created() {
      this.params.cityId=this.agentInfo.cityId
      this.changeTab(this.$route.query.activeid)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  .box {
    background: #fff;
    .height {
      height: 175px;
    }
    .header {
      width: 100%;
      height: 330px;
      background: url("../../../assets/img/city-agnet/background.png") no-repeat;
      background-size: cover;
      .headerbox {
        padding: 0 30px;
        .infobox {
          display: flex;
          justify-content: space-between;
          .agentprop {
            font-size: 26px;
            color:#fff;
          }
        }
      }
      .agentsearch {
        border: none;
        width: 660px;
        height: 55px;
        padding: 0 15px;
        border-radius: 4px;
      }
      .agentinfo {
        margin-top: 30px;
        margin-left: 24px;
        .agentcount {
          font-size: 20px;
          color: #EEEEEE;
          margin-bottom: 20px;
        }
        .agentnum {
          font-size: 51px;
          color: #fff;
        }
      }
    }
  }

</style>
