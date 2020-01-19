<template>
  <div class="box">
    <Header></Header>
    <div class="header">
      <van-tabs
        @click="getLastDay"
        v-model="active"
        background="rgba(255,255,255,0)"
        title-inactive-color="#DDDDDD"
        title-active-color="#fff"
        :line-width="0">
        <van-tab title="总计"></van-tab>
        <van-tab title="今日"></van-tab>
        <van-tab title="昨日"></van-tab>
      </van-tabs>
      <div class="headerbox">
        <input class="agentsearch" type="text" placeholder="请输入查询日期" @click.stop="showData">
        <PickerColumn v-for="(item,key) in pickerData" :key="key" :list="item" @click="pickerChoice"
                      v-show="showFlag"></PickerColumn>
      </div>
    </div>
    <div class="nav">
      <van-tabs
        v-model="activeId"
        @click="changeState"
        background="#fff"
        title-inactive-color="#999"
        title-active-color="#000"
        :line-width="0">
        <!--点击切换的时候 根据状态显示不同页面-->
        <van-tab :title="item" v-for="(item,index) in tabList" :key="index">
          <div class="main" v-if="stateShow">
            <div class="maincell pad-30" v-for="(item,index) in drawal" :key="index">
              <div class="maincellhd">
                <p class="maincellreg">{{item.zoneName}}</p>
                <p class="maincellnum"><span class="gray">提现金额:</span><span class="blue">￥{{item.money}}</span></p>
              </div>
              <div class="maincellinfo">
                <p class="maininfopho">支付宝账号: <span>{{item.data.phone}}</span></p>
                <p class="maininfoid">订单号: <span>201903221512</span></p>
                <div class="maincefooter">
                  <p class="maininfodate">申请时间: <span>2019-03-22 15:12</span></p>
                  <div class="maincellbtn" @click="textShow">
                    <div class="maincelltext">
                      <p>{{state}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--<More v-if="drawal.length > 0" :status="haveMore"></More>-->
          </div>
          <!-- 暂无更多数据-->
          <not-data :tips="msg"/>
        </van-tab>
      </van-tabs>
    </div>

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
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "@/plugins/util-mixins";
  import PickerColumn from "@/components/template/picker/column"
  import More from '@/components/template/more';

  export default {
    name: "city-apply",
    data() {
      return {
        msg: "暂无更多数据",
        drawal: [],
        state: '',
        haveMore: true,
        pickerShow: false,
        pickertitle: '标题',
        columns: [],
        active: 1,
        activeId: 0,
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
        params: {
          cityId: this.$route.query.cityId,
          zoneId: this.$route.query.zoneId,
          startTime: null,
          endTime: null,
          endtTime: null
        },
        showDatetime: false,
        currentDate: new Date(),
        maxDate: new Date(),
        showFlag: false,
        btnFlag: false,
        stateShow: false
      }
    },
    methods: {
      ...mapActions("cityAgent", ["getWithdrawal", "getSingZone", "getSingleZoneList"]),
      async drawalList() {
        const drawalList = await this.getWithdrawal({cityId: this.$route.query.cityId});
        this.drawal = drawalList
        if (this.drawal[0].status == 2) {
          this.state = '通过'
        } else if (this.drawal[0].status == 1) {
          this.state = '待审核'
        } else if (this.drawal[0].status == 3) {
          this.state = '拒绝'
        }
      },
      async getSingZone() {
        this.params.startTime = new Date(this.startTime).getTime();
        this.params.endTime = new Date(this.endTime).getTime();

        const singZoneList = await this.getSingleZoneList(this.params)
        this.zongList = singZoneList
        console.log(this.zongList)
      },
      /*点击昨天*/
      async getLastDay(key) {
        if (key == 2) {
          let curDate = new Date()
          let preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000)
          this.params.endtTime = preDate.getTime()
          const singZoneList = await this.getSingleZoneList(this.params)
          this.zongList = singZoneList
        }
      },
      textShow() {
        this.btnFlag = !this.btnFlag
      },
      showData() {
        this.showFlag = !this.showFlag
      },
      // 根据状态切换显示内容
      changeState(key) {
        let status = +this.drawal[0].status
        if (key + 1 == status) {
          this.stateShow = true
          this.drawalList()
        } else {
          this.stateShow = false
        }
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
        switch (this.pickerField) {
          case 'startTime':
            this.startTime = desc
            break;
          case 'endTime':
            this.endTime = desc
            break;
        }
        if (this.endTime) {
          this.showFlag = false
          this.getSingZone()
        }
      },
    },
    components: {
      PickerColumn,
      More
    },
    computed: {
      tabList() {
        return ['待审核', '已通过', '拒绝  ']
      },
    },
    mixins: [utilMixins],
    created() {
      this.drawalList()
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .box {
    .header {
      background: url("../../../assets/img/city-agnet/background.png") no-repeat;
      background-size: cover;
      padding-bottom: 50px;

      .headerbox {
        padding: 0 30px;

        .agentsearch {
          border: none;
          width: 660px;
          height: 55px;
          padding: 0 15px;
          border-radius: 4px;
        }
      }
    }

    .main {
      padding: 14px 30px 14px;

      .maincell {
        background: #fff;
        border-radius: 20px;
        margin-bottom: 20px;

        .maincellhd {
          display: flex;
          justify-content: space-between;
          font-family: 'PingFang-SC-Medium';
          border-bottom: 1px solid #ddd;
          padding-bottom: 30px;

          .maincellreg {
            font-size: 32px;
            color: #333;
          }

          .maincellnum {
            .gray {
              font-size: 26px;
              color: #999999;
            }

            .blue {
              font-size: 30px;
              color: $themeColor;
            }
          }
        }

        .maincellinfo {
          font-family: 'PingFang-SC-Medium';
          font-size: 28px;
          color: #666;
          line-height: 60px;
          margin-top: 20px;

          .maininfopho, .maininfoid, .maininfodate {
            margin-right: 10px;
          }

          .maincefooter {
            display: flex;
            justify-content: space-between;

            .maincellbtn {
              width: 160px;
              height: 60px;
              color: #FF850E;
              text-align: center;
              border: 1px solid $themeColor;
              border-radius: 100px;
              margin-top: 15px;

              .maincelltext {
                p {
                  color: $themeColor;
                }
              }
            }

            .red {
              border: 1px solid #FF1F0E;
              color: #FF1F0E;
            }

            .blue {
              border: 1px solid #1F7DFA;
              color: #1F7DFA;
            }
          }
        }
      }

    }
  }

  .van-tabs__content {
    overflow: auto;
  }
</style>
