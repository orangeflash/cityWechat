<template>
  <div class="box" v-if="boxShow">
    <Header></Header>
    <div class="header">
      <van-tabs
        v-model="active"
        :background="$themeColor"
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
            <button class="bg-t col-f br-r-16 pad-10 pad-lr fon-sm" slot="button" size="small" type="primary"
                    @click="serchBtn">查找
            </button>
          </van-field>
        </van-cell-group>
        <PickerColumn v-for="(item,key) in pickerData" :key="key" :list="item" @click="pickerChoice"
                      v-show="showFlag"></PickerColumn>
        <div class="infobox">
          <div class="agentinfo">
            <p class="agentcount">营业额</p>
            <p class="agentnum">{{this.zongList.money}}</p>
          </div>
          <div class="agentprop" @click="showPopup">佣金比例 <i class="iconfont icon-wenti"></i></div>
          <van-popup v-model="show" :close-on-click-overlay="false" style="border-radius: 20px">
            <div class="showbox pad-30">
              <div class="showboxhead">
                <p>城市代理提拥比例</p>
              </div>
              <div class="shouboxmain">
                <div class="showboxinfos">
                  <p class="infoprop">信息提拥比例: <span class="blue">{{bonusList.postBonus}}%</span></p>
                  <p class="infotips">包含信息发布+刷新+置顶费用，不包含红包金额</p>
                </div>
                <div class="showboxinfos">
                  <p class="infoprop">商家提佣比例: <span class="blue">{{bonusList.storeBonus}}%</span></p>
                  <p class="infotips">包含商家入驻费用、置顶费用、续费费用</p>
                </div>
                <div class="showboxinfos">
                  <p class="infoprop">资讯打赏提佣比例: <span class="blue">{{bonusList.informationBonus}}%</span></p>
                  <p class="infotips">包含城市所属资讯打赏费用</p>
                </div>
                <div class="showboxinfos">
                  <p class="infoprop">114提佣比例: <span class="blue">{{bonusList['114Bonus']}}%</span></p>
                  <p class="infotips">包含114发布、置顶费用</p>
                </div>
                <div class="showboxinfos">
                  <p class="infoprop">顺风车提佣比例: <span class="blue">{{bonusList.carBonus}}%</span></p>
                  <p class="infotips">包含发布顺风车费用、刷新费用、置顶费用</p>
                </div>
                <div class="showboxinfos">
                  <p class="infoprop">求职招聘提佣比例: <span class="blue">{{bonusList.jobBonus}}%</span></p>
                  <p class="infotips">包含发布求职招聘费用、刷新费用、置顶费用</p>
                </div>

              </div>
              <div class="showfooter">
                <div class="foot-mar-btn mb supplement" @click="showPopup">
                  <button>知道了</button>
                </div>
              </div>
            </div>
          </van-popup>
        </div>
      </div>
    </div>
    <div class="region pad-30">
      <Region title="佣金概况" no-link="true" :zone="['',zongList.list]"></Region>
    </div>
    <div class="height"></div>
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
  import {mapActions, mapState, mapGetters} from 'vuex';
  import {utilMixins} from "@/plugins/util-mixins";
  import Region from '../../../components/template/city-agent/region-box.vue'
  import PickerColumn from "@/components/template/picker/column"
  import {showDialog} from "../../../util";

  export default {
    name: "city-bonus",
    components: {
      PickerColumn,Region,
    },
    data() {
      return {
        tabList: ['今日', '昨日'],
        show: false,
        active: 0,
        showFlag: false,
        pickerShow: false,
        pickertitle: '标题',
        columns: [],
        // 时间组件
        pickerData: {
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
        showDatetime: false,
        currentDate: new Date(),
        maxDate: new Date(),

        zongList: [],
        bonusList: [],
        boxShow: false,
        params: {
          cityId: null,
          zoneId: null,
          startTime: null,
          endTime: null,
        }
      }
    },
    methods: {
      ...mapActions("cityAgent", ["getSingleZoneList", "getZoneBonus"]),
      async getSingZone() {
        const singZoneList = await this.getSingleZoneList(this.params)
        this.zongList = singZoneList
      },
      async getBonusZone() {
        const getBonusinfos = await this.getZoneBonus(this.params)
        this.bonusList = getBonusinfos
        this.boxShow = true
      },
      showPopup() {
        this.show = !this.show
      },
      // 时间选择
      pickerChoice(item, index) {
        this.pickerField = item.field
        this.pickerIndex = index
        switch (item.field) {
          case 'startTime':
          case 'endTime':
            this.showDatetime = !this.showDatetime;
            return
        }
      },
      pickerConfirm(value) {
        this.showDatetime = false;
        let desc = '', format = 'YYYY-MM-DD';
        desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
        this.$set(this.pickerData.dateData[this.pickerIndex], 'desc', desc);
      },
      serchBtn() {
        if (this.pickerData.dateData[0].desc == '请选择' || this.pickerData.dateData[1].desc == '请选择') {
          showDialog('请选择合理的时间段')
          return
        }
        this.params.startTime = this.getTimeStamp(new Date(this.pickerData.dateData[0].desc).setHours(0, 0, 0, 0))
        this.params.endTime = this.getTimeStamp(new Date(this.pickerData.dateData[1].desc).setHours(0, 0, 0, 0))
        if (this.params.endTime <= this.params.startTime) {
          showDialog('请选择合理的时间段')
          return
        }
        this.showFlag = false
        this.getSingZone()
      },
      changeTab(active) {
        if (active == 0) {
          this.params.startTime = null;
          this.params.endTime = null;
        } else if (active == 1) {
          this.params.startTime = this.getDayTimeStamp(-1, true);
          this.params.endTime = this.getDayTimeStamp(0, true);
        }
        this.getSingZone()
        console.log('changeTab', active)
      },
    },
    computed: {
      ...mapState("cityAgent", {
        agentInfo: state => state.agentInfo,
      }),
      searchTime() {
        return this.pickerData.dateData[1].desc == '请选择' ? '' : `${this.pickerData.dateData[0].desc}至${this.pickerData.dateData[1].desc}`
      },
    },
    mixins: [utilMixins],
    created() {
      this.params.cityId=this.agentInfo.cityId
      this.params.zoneId=this.$route.query.areaId
      document.title = `${this.$route.query.areaName}佣金明细`;
      this.changeTab(0)
      this.getBonusZone()
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
          margin-top: 30px;

          .agentprop {
            font-size: 26px;
            color: #fff;
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

  /*弹出层样式*/
  .showbox {
    background: #fff;
    width: 630px;
    height: 853px;

    .showboxhead {
      font-size: 28px;
      color: #333;
      text-align: center;
      margin: 30px 0;
    }

    .shouboxmain {
      line-height: 50px;
      overflow: auto;
      height: 700px;

      .showboxinfos {
        margin-bottom: 40px;
      }

      .infoprop {
        font-family: 'PingFang-SC-Medium';
        font-weight: bold;
        font-size: 32px;
        color: #333;

        span {
          margin-left: 15px;
        }
      }

      .infotips {
        font-size: 24px;
        color: #999;
      }

      .blue {
        font-size: 32px;
        color: $themeColor;
      }
    }

    .supplement {
      width: 90% !important;
      border-radius: 44px;

      button {
        background: $themeColor !important;
      }
    }
  }
</style>
