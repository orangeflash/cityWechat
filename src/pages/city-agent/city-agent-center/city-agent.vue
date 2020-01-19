<template>
  <div class="box" v-if="boxShow">
    <Header></Header>
    <div class="header">
      <van-tabs
        v-model="active"
        :color="$themeColor"
        :line-width="25"
        @click="changeTab">
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
        <div class="agentinfo">
          <p class="agentcount">代理总数</p>
          <p class="agentnum">{{indexInfo.money.zone}}</p>
        </div>
      </div>
    </div>
    <!--<div @click.stop="goPointPage({path:'/agentIndex/cityAgent/cityApply',query:{cityId}})" class="main">-->
      <!--<div class="cash">-->
        <!--<div class="circular">-->
          <!--<i class="iconfont icon-qianbao"></i>-->
        <!--</div>-->
        <!--<div class="cashinfo">-->
          <!--<span class="iconfont icon-youjiantou2"></span>-->
          <!--<p class="cashtext">代理提现申请 </p>-->
          <!--<p class="cashmn">管理区域代理提现申请 </p>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <div class="rectangle"></div>
    <div class="region pad-30">
      <Region title="区域概况" :zone="[indexInfo.money.zone,zongList]"></Region>
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
  import Region from '../../../components/template/city-agent/region-box.vue'
  import PickerColumn from "@/components/template/picker/column"
  import {hideLoading, showDialog, showLoading} from "../../../util";
  export default {
    name: "city-set-up",
    components:{
      PickerColumn,Region,
    },
    data(){
      return {
        tabList:['今日','昨日'],
        active: 0,
        zongList:[],
        indexInfo:[],
        boxShow:false,
        cityId:this.$route.query.cityId,
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
        startTime:'',
        endTime:'',
        params:{
          cityId:null,
          startTime:null,
          endTime:null,
        }
      }
    },
    methods:{
      ...mapActions("cityAgent",["getSingleZoneList","getZoneBonus"]),
      ...mapActions("cityAgent",["getZoneList","getCityIndex"]),
      //  请求后台首页信息
      async getIndexInfo() {
        showLoading();
        const cityInfo = await this.getCityIndex({cityId:this.agentInfo.cityId});
        hideLoading()
        this.indexInfo = cityInfo
        this.boxShow = true
      },
      //请求区域代理列表
      async ZoneList() {
        const zongList = await this.getZoneList(this.params);
        this.zongList = zongList
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
      },
      serchBtn(){
        if(this.pickerData.dateData[0].desc=='请选择'||this.pickerData.dateData[1].desc=='请选择'){
          showDialog('请选择合理的时间段')
          return
        }
        this.params.startTime = this.getTimeStamp(new Date(this.pickerData.dateData[0].desc))
        this.params.endTime = this.getTimeStamp(new Date(this.pickerData.dateData[1].desc))
        if(this.params.endTime<=this.params.startTime){
          showDialog('请选择合理的时间段')
          return
        }
        this.showFlag = false
        this.ZoneList()
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
        this.ZoneList()
        console.log('changeTab',active)
      },
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
      this.changeTab(0)
      this.getIndexInfo()
    },
  }
</script>
import
<style scoped lang="scss">
  @import "../../../assets/theme";
  .circular{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    background-color: #F3F4F8;
    margin: 0 25px;
    border-radius: 50%;
  }
  .box,.height {
    background: #fff;
    .header {
      background: url("../../../assets/img/city-agnet/background.png") no-repeat;
      background-size: cover;
      margin-bottom: 25px;
      .headerbox {
        padding: 0 30px;
      }
      .agentsearch {
        border: none;
        width: 660px;
        height: 55px;
        padding: 0 15px;
        border-radius: 4px;
      }
      .agentinfo {
        margin-left: 24px;
        margin-top: 30px;
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
  .main {
    position: relative;
    .cash {
      display: flex;
      align-items: center;
      width: 50%;
      height: 100px;
      line-height:50px;
      padding: 0 30px;
      .cashinfo {
        span {
          position: absolute;
          top: 50%;
          margin-top: -26px;
          right: 30px;
          color: #dddddd;
        }
      }
      .org {
        color: #D19400;
      }
      .icon-qianbao {
        font-size: 36px;
        color:$themeColor;
      }
    }
    .cashtext {
      font-size: 30px;
      color: #000;
    }
    .cashmn {
      font-size: 24px;
      color: #999999;
    }
  }
  .height {
    height: 155px;
  }
  .rectangle {
    width: 100%;
    height: 16px;
    background: #F3F4F8;
  }
  .header {
    width: 100%;
    height: 330px;
    .van-tabs__line {
      width: 0 !important;
    }
    .van-tabs {
      font-size: 30px;
      color: #dddddd;
    }
  }
</style>
