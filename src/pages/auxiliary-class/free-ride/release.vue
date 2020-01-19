<template>

  <!--发布人找车-顺风车-->

  <div id="freeRideRelease">
    <Header :childrenTitle="childrenTitle"></Header>
    <!--<p class="free-ride-release__tpis">您发布消息将在10个平台同步展示！苏州40.52万粉丝都有可能看到！本平台发布信息免费！<em>车找人收0.01元一条</em></p>-->
    <div class="free-ride-release__type">
      <div>乘车类型：</div>
      <div class="free-ride-release__type__choice">
        <ul>
          <li @click="choiceTypeFn(1)" :class="{active:params.type==1}"><em>单次拼车</em></li>
          <li @click="choiceTypeFn(2)" :class="{active:params.type==2}"><em>长期拼车</em></li>
        </ul>
      </div>
    </div>
    <div class="free-ride-release__form">
      <FormList
        :listInfo="listInfo"
        @choiceForm="listChoice"
        @inputForm="inputForm"
        @choiceRadio="choiceRadio"
      ></FormList>
    </div>
    <div class="free-ride-release__labels" v-if="labels.length">
      <i class="iconfont icon-biaoqian2"></i>
      <label>选择标签:</label>
      <div class="free-ride-release__labels__list">
        <ChoiceLabel
          @choice="choice"
          :labels="labels"
          :labelsDefault="labelsDefault"
        ></ChoiceLabel>
      </div>
    </div>
    <AgreeAgreement
      :status="agreeAgreement"
      @choice="agreeAgreement = !agreeAgreement"
      @open="showAgreement = !showAgreement"
      :con="config.agreement"
      name="顺风车发布协议"
    ></AgreeAgreement>
    <div class="free-ride-release__btn__box">
      <van-button
        :class="['free-ride-release__btn']"
        size="large"
        @click="release"
        round
      >{{$route.query.carId?'确认修改':releaseMoney>0?'需支付'+(+releaseMoney).toFixed(2)+"元":'确认发布'}}
      </van-button>
    </div>
    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        @confirm="confirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>
    <van-popup v-model="showTime" position="bottom">
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        :min-hour="minHour"
        :max-hour="maxHour"
        @confirm="confirm"
        @cancel="showTime = !showTime"
      />
    </van-popup>

    <Operation
      :show="showOperation"
      @close="closeOperation"
      @choice="actionsOperation"
      :actions="actions"
    ></Operation>

  </div>

</template>

<script>
  import FormList from '@/components/template/form-list'
  import ChoiceLabel from '@/components/template/choice-label'
  import AgreeAgreement from '@/components/template/agree-agreement'
  import {utilMixins} from "@/plugins/util-mixins";
  import {mapState, mapActions} from "vuex"
  import Operation from '../../../components/template/operation'
  import {Toast} from 'vant'
  import {hideLoading, showDialog, showLoading} from "../../../util";


  /**
   *  这个页面是我写得有点崩溃的页面，代码写着感觉有点乱，
   *
   *  若有人改这里的代码觉得烦躁，请原谅我
   *
   *      I'm sorry
   *
   *                            --- hssg
   *
   * */

  export default {
    components: {FormList, ChoiceLabel, Operation, AgreeAgreement},
    data() {
      return {
        showAgreement: false,
        agreeAgreement: true,
        childrenTitle: '顺风车',
        showTime: false,
        showDatetime: false,
        showOperation: false,
        showChoicePersoanl: false,
        labelsDefault: [],
        persoanlColumns: [1, 2, 3, 4, 5],
        showChoiceTime: false,
        choiceType: 2,
        minHour: 0,
        maxHour: 24,
        minDate: new Date(),
        currentDate: new Date(),
        currentTime: '10:24',
        config: {},
        index: null,
        releaseMoney: 0, //发布金额  默认0
        params: {     //发布信息的参数集
          typeId: null,    //发布的类型id
          startPlace: '',    //  出发地
          wayAddress: '',  //途径地
          endPlace: '',    //目的地
          rideTime: null,    //乘车时间
          num: 0,    //人数
          weight: '',    //车辆信息/货物信息
          other: '',    //其他
          startTime: null,    //开始时间
          endTime: null,    //结束时间
          type: 1,    //1,临时拼车,2长期拼车
          data: null,    //标签
          wholeCountry: 1,    //1.本地 默认本地  2全国
        },
        category: {},  //当前选择的分类信息
        categoryKey: null, //渲染指定的字段类型
        carId: null,     // 发布成功后，会返回一个顺风车id
        actions: [
          {
            title: '请选择发布类型',
            disabled: true
          }
        ],
        /**
         *
         * 发布时候的字段配置
         * releaseType 是用来取决了指定类型的所需要的字段
         *
         *
         * */
        listInfo: [
          {
            symbol: 'start',
            symbolName: '起',
            type: 'text',
            label: '出发地：',
            placeholder: '请输入出发地址',
            field: 'startPlace',
            releaseType: [1, 2, 3, 4]
          }, {
            symbol: 'end',
            symbolName: '终',
            type: 'text',
            label: '目的地：',
            placeholder: '请输入到达地址',
            field: 'endPlace',
            releaseType: [1, 2, 3, 4]
          }, {
            symbol: 'center',
            symbolName: '经',
            type: 'text',
            label: '途径地：',
            placeholder: '请输入中途经过地址，可不填',
            field: 'wayAddress',
            filter: true,
            releaseType: [2, 3]
          }, {
            icon: 'icon-Group-',
            label: '开始时间：',
            desc: '请选择',
            field: 'startTime',
            releaseType: [1, 2, 3, 4]
          }, {
            icon: 'icon-Group-',
            label: '结束时间：',
            desc: '请选择',
            field: 'endTime',
            releaseType: [1, 2, 3, 4]
          }, {
            icon: 'icon-Group-',
            label: '出发时间：',
            desc: '请选择',
            field: 'rideTime',
            releaseType: [1, 2, 3, 4]
          }, {
            icon: 'icon-ren3',
            label: '剩余座位：',
            desc: '',
            type: 'number',
            placeholder: '请输入剩余座位数量(位)',
            field: 'num',
            releaseType: [2]
          }, {
            icon: 'icon-ren3',
            label: '乘车人数：',
            desc: '',
            type: 'number',
            placeholder: '请输入乘车人数(位)',
            field: 'num',
            releaseType: [1]
          }, {
            icon: 'icon-ren3',
            label: '车辆信息：',
            placeholder: '请输入车辆信息(辆)',
            type: 'number',
            field: 'weight',
            releaseType: [3]
          }, {
            icon: 'icon-ren3',
            label: '货物信息：',
            type: 'text',
            field: 'weight',
            placeholder: '请输入货物信息（吨）',
            releaseType: [4]
          }, {
            icon: 'icon-ren111',
            label: '联系人：',
            type: 'input',
            placeholder: '请输入联系人名称',
            field: 'linkMan',
            releaseType: [1, 2, 3, 4]
          }, {
            icon: 'icon-dianhua3',
            label: '联系电话：',
            type: 'number',
            placeholder: '请输入联系电话',
            field: 'linkTel',
            releaseType: [1, 2, 3, 4]
          }, {
            icon: 'icon-icon-',
            label: '选择区域：',
            type: 'choice',
            desc: 0,
            field: 'wholeCountry',
            data: ["本地", '全国'],
          }, {
            icon: 'icon-bianji',
            label: '备注信息：',
            input: true,
            remarks: true,
            filter: true,
            placeholder: '简要补充其他说明：如上车时间，上车地点等等，为了保护隐私，请不要填写手机号和QQ',
            field: 'other',
            releaseType: [1, 2, 3, 4]
          }
        ],
        labels: [],
        categoryInfo: {
          local: {},
          country: {}
        }
      }
    },
    mixins: [utilMixins],
    methods: {
      ...mapActions('freeRide', ['getCarCategoryLabel', 'getFreeRideConfig', 'getCarCategory', 'releaseFreeRide', 'getCategoryInfo']),
      closeOperation() {
        this.category ? this.showOperation = !this.showOperation : this.$router.go(-1);

      },
      choiceTypeFn(type) {
        this.params.type = type;
        this.$set(this.listInfo[5], 'desc', '请选择');
        this.params.rideTime = '';
        if (type == 1) {
          this.$set(this.listInfo[3], 'isShow', false);
          this.$set(this.listInfo[4], 'isShow', false);
        } else {
          this.$set(this.listInfo[3], 'isShow', true);
          this.$set(this.listInfo[4], 'isShow', true);
        }
      },
      fieldJudeg() {
        let fields = this.listInfo;
        for (let i = 0; i < fields.length; i++) {
          const json = fields[i];
          if (json.isShow && !this.params[json.field] && !json.filter) {
            if (json.type) {
              return json.placeholder
            } else {
              return "请选择" + json.label.split("：").join('');
            }
          }
        }
        if (+this.params.type == 2) {
          const startTime = new Date(this.params.startTime).getTime(),
            endTime = new Date(this.params.endTime).getTime();
          if (endTime <= startTime) return "结束时间不能小于等于开始时间";
        }

        return false;
      },
      // 发布
      async release() {
        const res = this.fieldJudeg();
        if (res) return Toast({
          message: res,
          duration: 1000
        });
        if (!this.agreeAgreement) return Toast({
          message: '请同意并遵守发布协议',
          duration: 1500
        });
        // 防止重复提交信息
        showLoading();

        let result = await this.releaseFreeRide({
          ...this.params,
          id: this.$route.query.carId
        })
        hideLoading();
        if (typeof +result.data == 'number') {
          this.carId = +result.data;
          if (this.releaseMoney > 0 && !this.$route.query.carId) {
            this.releaseMoney = (+this.releaseMoney).toFixed(2);
            try {
              await showDialog("需要支付：" + this.releaseMoney + " 元");
              this.$router.push({
                name: 'cashier',
                params: {
                  type: 16,
                  param: {
                    carId: this.carId,
                  },
                  info: {
                    money: this.releaseMoney,
                    type: "发布顺风车信息",
                    callLink: "/auxiliary/freeRide"
                  }
                }
              });
            } catch (e) {
              console.log("老板，我是要生存的，连" + this.releaseMoney + "元都不给我，我不好办事啊")
            }

          } else {
            Toast.success({
              message: '发布成功',
              duration: 1500
            })
            setTimeout(() => {
              this.goPointPage({name: 'FreeRide'}, true);
            }, 1500)
          }
        } else {
          Toast.fail({
            message: '发布失败',
            duration: 1500
          })
        }
      },
      // 选择标签
      choice(arr) {
        let j = {}
        arr.map(v => {
          j[v.id] = v.name
        })

        this.params.data = j;
      },
      // 进来的时候就会执行弹窗，必须要进行选择 *******
      async actionsOperation(item, index) {
        showLoading();
        this.category = item;
        this.params.typeId = item.id;
        await this.showPointField();
        this.getCategoryInfo({
          typeId: this.params.typeId
        }).then(result => {
          if (result.code == 1) this.categoryInfo = result.data;
          this.releaseMoney = this.categoryInfo.local.release;
        })

        const result = await this.getCarCategoryLabel({
          categoryId: this.params.typeId
        })
        this.labels = result.data || [];
        this.childrenTitle = document.title = "发布" + item.name + " - 顺风车";
        this.choiceTypeFn(1)
        hideLoading();
      },
      // 显示指定的字段  通过名字筛选，名字是后台固定的
      showPointField() {
        if (!this.category.name) return Toast.fail({
          message: '缺少发布类型',
          duration: 1500
        });
        switch (this.category.name) {
          case '货找车':
            this.categoryKey = 4;
            break;
          case '车找货':
            this.categoryKey = 3;
            break;
          case '车找人':
            this.categoryKey = 2;
            break;
          case '人找车':
            this.categoryKey = 1;
            break;
        }
        this.listInfo.map((v, index) => v.releaseType && v.releaseType.indexOf(this.categoryKey) >= 0 || v.must ?
          this.$set(this.listInfo[index], 'isShow', true)
          : this.$set(this.listInfo[index], 'isShow', false))
      },
      //当选择radio的时候就进行触发
      choiceRadio(item, index, key) {
        this.params.wholeCountry = key + 1;
        this.releaseMoney = this.params.wholeCountry == 1 ? (+this.categoryInfo.local.release || 0) : (+this.categoryInfo.country.release || 0);
      },
      // 输入表单的时候触发
      inputForm(item, key) {
        item.desc && item.desc.trim() ? this.params[item.field] = item.desc : this.params[item.field] = null;
      },
      // 当用户点击表单选择的时候触发
      listChoice(item, key) {
        this.index = key;
        switch (item.field) {
          case 'startTime':
          case 'endTime':
            this.showDatetime = !this.showDatetime;
            return
          case 'rideTime':
            this.params.type == 2 ? this.showTime = !this.showTime : this.showDatetime = !this.showDatetime;
            return;
          case 'num':
            this.showChoicePersoanl = !this.showChoicePersoanl;
            return;
        }
      },
      choiceTime(index) {
        this.showDatetime = !this.showDatetime;
        this.index = index;
      },
      confirm(value) {
        this.showDatetime = false;
        this.showTime = false;
        if (this.index || this.index == 0) {
          let format = '',
            d = this.listInfo[this.index],
            desc = '';
          if (d.field == 'rideTime' && this.params.type == 2) {
            desc = value;
          } else {
            format = 'YYYY-MM-DD HH:mm';
            desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
          }
          this.$set(this.listInfo[this.index], 'desc', desc);
          this.params[this.listInfo[this.index].field] = desc;
        }
      },
      fillForm(data) {
        this.choiceTypeFn(data.type);
        for (let field in data) {
          this.listInfo.forEach(item => {
            if (item.field == field) {
              console.log(item.field);
              switch (item.field) {
                case 'startTime':
                case 'endTime':
                  item.desc = this.formatDateByTimeStamp(new Date(+data[field]).getTime(), 'YYYY-MM-DD HH:mm')
                  break;
                case 'rideTime':
                  item.desc = this.params.type == 1
                    ? this.formatDateByTimeStamp(new Date(+data[field]).getTime(), 'YYYY-MM-DD HH:mm')
                    : data[field];
                  break;
                default:
                  item.desc = data[field];
              }
              this.inputForm(item);
            } else if (item.field == 'wholeCountry') {
              item.disabled = true;
              item.desc = data.cityId ? 0 : 1;
            }


          })
        }

        this.labels = data.data || [];
        console.log('请求参数', this.params)
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    async created() {
      const bool = await this.checkBindTel({callBack: true})
      if (!bool) return this.$router.go(-1);
      this.config = await this.getFreeRideConfig();
      this.$set(this.listInfo[12], 'must', this.config.openCountry == 'open');
      if (this.$route.query.carId) {
        console.log('用户需要编辑')
        this.category = {
          name: this.$route.query.name
        }

        this.showPointField()
        showLoading();

        this.releaseFreeRide({
          carId: this.$route.query.carId
        }).then(result => {
          hideLoading();
          console.log('获取顺风车的信息', result)
          this.fillForm(result.data);
          this.getCarCategoryLabel({
            categoryId: result.data.typeId
          }).then(labels => {
            this.labels = labels.data || [];
            this.params.data = result.data.data;
            for (let label in this.params.data) this.labelsDefault.push(this.params.data[label]);
          })
        })
      } else if (this.$route.query.id) {
        this.actionsOperation(this.$route.query)
      } else {
        this.showOperation = true;
        this.getCarCategory().then(result => {
          this.actions = this.actions.concat(result.data);
        })
        // Toast.fail({
        //   message: '缺少参数',
        //   duration: 1500
        // });
        // setTimeout(() => {
        //   this.$router.go(-1)
        // }, 1500);
      }

    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  #freeRideRelease {
    background: #fff;

    .free-ride-release__tpis {
      background: #f4f4f4;
      padding: 30px;
      font-size: 26px;
      line-height: 48px;

      em {
        color: $themeColor;
      }
    }

    .free-ride-release__type {
      display: flex;
      justify-content: space-between;
      height: 80px;
      align-items: center;
      padding: 20px 60px;
      font-size: 30px;

      &__choice {

        ul {
          display: flex;
          align-items: center;
          border-radius: 30px;
          overflow: hidden;
          height: 60px;
          border: 1.1px solid #ddd;
          background: #e8e8e8;

          li {
            flex: 1;
            padding: 0 20px;
            color: #999;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 26px;

            em {
              margin: 0 auto;
            }
          }

          li.active {
            background: $themeColor;
            color: #fff;
            border-radius: 30px;
          }
        }

      }
    }

    .free-ride-release__form {
      margin: 0 30px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0px 0px 9px 0px rgba(153, 153, 153, 0.5);
    }

    .free-ride-release__labels {
      padding: 30px 50px 0;

      i {
        font-size: 32px;
        margin-right: 10px;
      }

      label {
        font-size: 30px;
      }

      &__list {
        padding: 30px 0;
      }
    }

    .free-ride-release__btn__box {
      padding: 30px;

      .free-ride-release__btn {
        border: none;
        background: $themeColor;
        color: #fff;
        box-shadow: 0px 2px 4px 0px $themeColor;
      }
    }
  }
</style>
