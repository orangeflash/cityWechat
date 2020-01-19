<template>
  <div id="JobBasicForm">
    <ul class="form-list">
      <li class="job-cells">
        <div class="job-cell">
          <span>真实姓名</span>
          <van-field label-align="center" v-model="name" placeholder="请输入真实姓名"/>
        </div>
      </li>
      <li class="job-cells">
        <div class="job-cell">
          <span>性别</span>
          <span class="sex-cells">
            <div class="sex-cell"
                 :style="{'border-color':sexName==+key+1?$themeColor:'#eee',color:sexName==key?'':'#999'}"
                 v-for="(item, key) in sexarr" :key="key" @click="sexName=+key+1">
              <i class="topimg iconfont" :class="[item.icon]" :style="{color:item.color}"></i>
              <em>{{item.title}}</em>
            </div>
          </span>
        </div>
      </li>
      <li class="job-cells">
        <div class="job-cell">
          <span>手机号</span>
          <van-field type="tel" label-align="center" v-model="tel" placeholder="请输入手机号"/>
        </div>
      </li>
      <li class="job-cells">
        <div class="job-cell job-age">
          <span>年龄（岁）</span>
          <span><van-field type="number" label-align="center" v-model="age" placeholder="请输入"/></span>
        </div>
        <div class="job-cell" @click="showPickerDialog('xlTypeOption')">
          <span>最高学历</span>
          <span>{{selectedxlTypeOption.join(' ')||'请选择'}}</span>
        </div>
        <div class="job-cell" @click="showPickerDialog('jyTypeOption')">
          <span>工作时间</span>
          <span>{{selectedjyTypeOption.join(' ')||'请选择'}}</span>
        </div>
      </li>
    </ul>
    <header class="form-head">求职意向</header>
    <ul class="form-list">
      <li class="form-list__item" @click="showPickerDialog('industryOption','double')">
        <InputWithCmp
          disabled="true"
          :value="selectedindustryOption.join(' ')"
          title="期望职位"
          placeholder="请选择"
          name="industry"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </InputWithCmp>
      </li>
      <li class="form-list__item" @click="showPickerDialog('salaryOption')">
        <InputWithCmp
          disabled="true"
          :value="selectedsalaryOption.join(' ')"
          title="期望薪资"
          placeholder="请选择"
          name="industry"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </InputWithCmp>
      </li>
      <li class="form-list__item" @click="showPickerDialog('huntTypeOption')">
        <InputWithCmp
          disabled="true"
          :value="selectedhuntTypeOption.join(' ')"
          title="工作性质"
          placeholder="请选择"
          name="huntType"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </InputWithCmp>
      </li>
      <li v-if="platform.mode==1" class="form-list__item">
        <input-with-cmp
          v-model="selectedArea"
          placeholder="请输入求职区域"
          title="求职区域"
          name="tradArea"
        >
        </input-with-cmp>
      </li>
      <li v-else class="form-list__item" @click="areaPickerDialog=true">
        <input-with-cmp
          disabled="true"
          :value="selectedArea"
          placeholder="请选择"
          title="求职区域"
          name="tradArea"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </input-with-cmp>
      </li>
      <li class="form-list__item">
        <InputWithCmp
          v-model="jobStatus"
          placeholder="请输入求职状态"
          title="求职状态"
          name="jobStatus"
        />
      </li>
    </ul>
    <header class="form-head" v-if="labels.length > 0">我的标签（最多选择5个）</header>
    <ul class="labes-list" v-if="labels.length > 0">
      <ChoiceLabel
        @choice="choice"
        :labelsDefault="labelsDefault"
        max="5"
        :labels="labels"
      ></ChoiceLabel>
    </ul>
    <header class="form-head">介绍自己</header>
    <ul class="form-list">
      <li class="form-list__item" style="padding-bottom: 20px;">
        <van-field
          v-model="introduce"
          type="textarea"
          placeholder="自我描述，包括性格，特长，工作经历等..."
          rows="4"
          autosize
        />
      </li>
    </ul>
    <!--地图-->
    <!--<DdMap @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress" ></DdMap>-->


    <!--<van-popup position="bottom" v-model="showMapDialog">-->
    <!--<custom-map-->
    <!--@close="showMapDialog=false"-->
    <!--@confirm="changeLocation"-->
    <!--:latLng.sync="latLng"-->
    <!--:symbol="1"-->
    <!--/>-->
    <!--</van-popup>-->
    <!--公用选项-->
    <van-popup position="bottom" v-model="singleDialog">
      <van-picker
        ref="district"
        show-toolbar
        @change="singleChangeHandle"
        :title="singlechoosetitle"
        :columns="singlechoosecolumns"
        @cancel="singleDialog=false"
        @confirm="selectionConfirm($event,singlechooseKey)"
      />
    </van-popup>
    <van-popup position="bottom" v-model="datePickerDialog">
      <van-datetime-picker
        @confirm="changeTime"
        @cancel="datePickerDialog=false"
        type="time"
      />
    </van-popup>
    <van-popup position="bottom" v-model="areaPickerDialog">
      <van-area :area-list="areaList" :columns-num="3" title="请选择" @confirm="selectClick"
                @cancel="areaPickerDialog = !areaPickerDialog"/>
    </van-popup>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import InputWithCmp from "../../publication/input-with-cmp";
  import areaList from "../../../../static/area.js";
  import ChoiceLabel from '@/components/template/choice-label'
  // import CustomMap from "../basic/custom-map";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {defaultLatLng} from "../../../project-config/base";
  import {getLocation} from "../../../util/wechat-util";
  import _ from "lodash";
  import {hideLoading, isTellPhone, showDialog, showLoading} from "../../../util";
  import DdMap from "../../../components/template/dd-map"


  export default {
    name: "JobBasicForm",
    props: ["storeInfo"],
    components: {DdMap, InputWithCmp, ChoiceLabel},
    data() {
      const beginDate = this.formatDateByTimeStamp(new Date(), "HH:mm");
      const endDate = this.formatDateByTimeStamp(new Date(), "HH:mm");
      return {
        areaList,
        sexarr: [
          {
            title: '男',
            color: '#259FF5',
            icon: "icon-male",
          },
          {
            title: '女',
            color: '#FE5C9E',
            icon: "icon-nvxing",
          }
        ],
        address: "",
        chooseDdMapLocation: {},
        showmap: false,
        targetDateIndex: 0,
        //地图和日期选择器
        showMapDialog: false,
        datePickerDialog: false,
        areaPickerDialog: false,
        selectedArea: '',
        //职位类型弹出框
        selectedindustryOption: [],
        industryOption: {
          columns: [],
          options: [],
          title: "选择期望职位"
        },
        //picker公用变量
        singlechoosetitle: '',
        singlechoosecolumns: [],
        singleDialog: false,
        //薪资选项弹出框
        selectedsalaryOption: [],
        salaryOption: {
          columns: [],
          options: [],
          title: "选择期望薪资"
        },
        //兼职类型弹出框
        selectedhuntTypeOption: [],
        huntTypeOption: {
          columns: [],
          options: [],
          title: "选择工作性质"
        },
        //性别类型弹出框
        selectedsexTypeOption: [],
        sexTypeOption: {
          columns: [],
          options: [],
          title: "选择性别要求"
        },
        //经验弹出框
        selectedjyTypeOption: [],
        jyTypeOption: {
          columns: [],
          options: [],
          title: "选择工作时间"
        },
        //学历弹出框
        selectedxlTypeOption: [],
        xlTypeOption: {
          columns: [],
          options: [],
          title: "选择学历"
        },
        latLng: {},
        labelsDefault: [],
        //  form
        labels: [],
        selectedLabel: null,
        name: "",
        tel: "",
        introduce: "",
        sexName: 1,
        age: "",
        jobStatus: "",
      };
    },
    methods: {
      ...mapActions('personal', ['getUserInfoById']),
      ...mapActions("jobHunt", ["getJobConfig", "getJobPosition", "getCategoryLabel"]),
      // 选择标签
      choice(arr) {
        let j = {}
        arr.map(v => {
          j[v.id] = v.name
        })
        this.selectedLabel = j
        console.log(arr, j)
      },
      /**选择地址 */
      selectClick(save) {
        this.areaPickerDialog = !this.areaPickerDialog
        const arr = [];
        save.map(item => {
          arr.push(item.name)
        })
        this.selectedArea = arr.toString()
      },
      choiceAddress(address) {
        this.address = address.poiaddress + address.poiname;
        this.latLng = {
          latitude: address.latlng.lat,
          longitude: address.latlng.lng
        }
      },
      ...mapActions("common", ["getLocationByLatLng"]),
      async changeLocation() {
        this.showMapDialog = false;
        const {latitude, longitude} = this.latLng;
        this.address = (await this.getLocationByLatLng({
          latitude,
          longitude
        })).address;
        console.log(this.address)
      },
      //公用picker确认方法
      selectionConfirm(value, key) {
        this['selected' + key] = value;
        this.singleDialog = false;
        console.log(this['selected' + key], value, key)
      },
      //公用pickerchange事件
      singleChangeHandle(picker, values, index) {
        if (values.length > 1) {
          picker.setColumnValues(
            1,
            _.find(this[this.singlechooseKey].options, {
              name: values[0]
            }).son.map(item => item.name)
          );
        }
        console.log(this[this.singlechooseKey], _.find(this[this.singlechooseKey].options, {
          name: values[0]
        }), picker, values, index)
      },
      //公用分类请求方法 将选中的key的值赋值给公用变量
      async initSelections(key, type) {
        this.singlechoosecolumns = this[key].columns
        //如果请求过一次就不再请求
        if (this[key].columns.length) return;
        showLoading()
        let data = [];
        switch (key) {
          case 'salaryOption':
            data = [
              {name: '面议'}, {name: '1K以下'}, {name: '1-2K'}, {name: '2-3K'}, {name: '3-5K'}, {name: '5-10K'}, {name: '10K以上'},
            ]
            break;
          case 'huntTypeOption':
            data = [
              {name: '全职'}, {name: '兼职'}
            ]
            break;
          case 'sexTypeOption':
            data = [
              {name: '性别不限'}, {name: '男'}, {name: '女'}
            ]
            break;
          case 'jyTypeOption':
            data = [
              {name: '1年以内'}, {name: '1-2年'}, {name: '2-3年'}, {name: '3-5年'}, {name: '5-10年'}, {name: '10年以上'}
            ]
            break;
          case 'xlTypeOption':
            data = [
              {name: '小学'}, {name: '初中'}, {name: '高中'}, {name: '专科'}, {name: '本科'}, {name: '研究生'}, {name: '硕士'}, {name: '博士'}, {name: '博士后'}
            ]
            break;
          case 'salaryOption':
            data = [
              {name: '面议'}, {name: '1K以下'}, {name: '1-2K'}, {name: '2-3K'}, {name: '3-5K'}, {name: '5-10K'}, {name: '10K以上'},
            ]
            break;
          case 'industryOption':
            data = (await this.getJobPosition()) || [];
            break;
        }
        this[key].options = data;
        console.log("二级分类数据为", data);
        //如果存在二级
        if (data[0].son) {
          this[key].columns = [
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
          this[key].columns = [
            {
              values: data.map(item => item.name)
            },
          ];
        }
        this.singlechoosecolumns = this[key].columns
        hideLoading()
        console.log('this+' + key + '数据为', this[key])
      },
      //公用请求picker数据
      showPickerDialog(key, type) {
        console.log(key, type)
        this.singleDialog = true;
        this.singlechooseKey = key;
        this.singlechoosetitle = this[key].title
        if (type) {
          this.initSelections(key, 8);
        } else {
          this.initSelections(key);
        }
      },
      //父级调用拿到formdata数据
      getFormData() {
        const typePName = this.selectedindustryOption[0], workNature = this.selectedhuntTypeOption[0] == '全职' ? 1 : 2,
          salary = this.selectedsalaryOption[0], experience = this.selectedjyTypeOption[0],
          education = this.selectedxlTypeOption[0];
        const typeP = _.find(this.industryOption.options, {
          name: typePName
        });
        console.log(typePName, typeP, workNature, salary, experience, education, this.labels, _.findIndex(this.labels, {active: true}), this.selectedLabel)
        let warn = "", flag = true;
        if (this.name == "") {
          warn = "请填写真实姓名";
        } else if (!isTellPhone(this.tel)) {
          warn = "请填写正确的联系电话";
        } else if (this.age == "") {
          warn = "请填写年龄";
        } else if (!(education)) {
          warn = "请选择最高学历";
        } else if (!(experience)) {
          warn = "请选择工作时间";
        } else if (!(typeP)) {
          warn = "请选择期望职位";
        } else if (!(salary)) {
          warn = "请选择薪资待遇";
        } else if (!(workNature)) {
          warn = "请选择工作性质";
        } else if (this.selectedArea == "") {
          warn = "请完善求职区域信息";
        } else if (this.jobStatus == "") {
          warn = "请输入求职状态";
        } else if (this.labels.length > 0 && _.isEmpty(this.selectedLabel)) {
          warn = "请至少选择一个标签";
        } else if (!(this.introduce)) {
          warn = "请填写职位描述";
        } else {
          flag = false;//若必要信息都填写，则不用弹框
          const typeName = this.selectedindustryOption[1];
          const type = typeP.son.length
            ? _.find(typeP.son, {name: typeName})
            : {};
          console.log(typeName, type)
          return {
            name: this.name,
            sex: this.sexName || 1,
            tel: this.tel,
            age: this.age,
            area: this.selectedArea,
            introduce: this.introduce,
            experience, education, salary, workNature,
            jobStatus: this.jobStatus,
            // lat: this.latLng.latitude,
            // lng: this.latLng.longitude,
            label: this.selectedLabel,
            industryId: typeP.id,
            positionId: type ? type.id : ""
          };
        }
        if (flag == true) {
          showDialog(warn);
          return null
        }
      },
      changeTime(val) {
        this.dateList[this.targetDateIndex] = val;
        this.datePickerDialog = false;
      },
      showDatePickerDialog(index) {
        this.targetDateIndex = index;
        this.datePickerDialog = true;
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        user: s => s.user
      }),
    },
    watch: {
      async storeInfo(storeInfo) {
        showLoading()
        storeInfo.label = JSON.parse(storeInfo.label)
        console.log('storeInfo', storeInfo)
        if (storeInfo) {
          Object.assign(this, {
            name: storeInfo.name,
            sexName: storeInfo.sex,
            tel: storeInfo.tel,
            age: storeInfo.age,
            selectedArea: storeInfo.area,
            jobStatus: storeInfo.jobStatus,
            introduce: storeInfo.introduce,
            selectedjyTypeOption: [storeInfo.experience],
            selectedxlTypeOption: [storeInfo.education],
            selectedsalaryOption: [storeInfo.salary],
            selectedhuntTypeOption: storeInfo.workNature == 1 ? ['全职'] : ['兼职'],
            selectedLabel: storeInfo.label,
            industryId: storeInfo.industryId,
            positionId: storeInfo.positionId,
          });
          this.getCategoryLabel(
            {categoryId: this.$parent.categoryId}
          ).then(res => {
            this.labels = res || [];
            for (let i in storeInfo.label) this.labelsDefault.push(storeInfo.label[i])
            console.log(this.labelsDefault)
          })
          // 获取分类
          await this.initSelections("industryOption", 8);
          hideLoading()
          // const zone =
          //   _.find(this.businessDistrictOption.options, {
          //     id: storeInfo.zoneId
          //   }) || {};
          // const trade = zone.son.length
          //   ? _.find(zone.son, {tradeId: storeInfo.tradeId}) || {}
          //   : {};
          // this.selectedBusinessDistrictOption[1] = trade.tradeName;
          // this.selectedBusinessDistrictOption[0] = zone.name;

          const typeP =
            _.find(this.industryOption.options, {
              id: storeInfo.industryId
            }) || {};
          this.selectedindustryOption[0] = typeP.name;
          console.log('typeP', typeP)
          const type = typeP.son.length
            ? _.find(typeP.son, {id: storeInfo.positionId})
            : {};
          this.selectedindustryOption[1] = type.name;
        }
      }
    },
    async created() {
      console.log("接收到的详情为", this.storeInfo, this.$parent.categoryId, this.$parent.jobId);
      if (_.isEmpty(this.$parent.jobId)) {
        this.getCategoryLabel(
          {categoryId: this.$parent.categoryId}
        ).then(res => {
          this.labels = res || [];
        })
        //
        console.log(this.user)
        this.name = this.user.userName
        this.tel = this.user.userTel
        this.sexName = parseInt(this.user.sex)
        // showDialog('发布')
      }
      // window.wxReady(async () => {
      //   showLoading("定位中");
      //   this.latLng = await getLocation();
      //   this.changeLocation();
      //   hideLoading();
      // });
    }
  };
</script>
<style lang="scss">
  #JobBasicForm {
    .job-cell {
      .van-field__control {
        text-align: center;
      }
    }

    .job-age {
      .van-cell {
        margin-top: 0 !important;
      }
    }
  }
</style>
<style scoped lang="scss">
  @import "../../../assets/theme";

  #JobBasicForm {
    .form-head {
      margin-top: 20px;
      background: #fff;
      color: #999;
      padding: 25px 29px;
      font-size: $font-size-lg;
      @include flex-between;

      &__legend {
        font-size: $font-size-lg;
      }

      &__version-info {
        color: $themeColor;
      }
    }

    .labes-list {
      background: #fff;
      padding: 20px 30px 0;
    }

    .form-list {
      padding: 0px 30px;
      background-color: #fff;

      &__item {
        .arrow {
          font-size: 34px;
          color: #c7c7c7;
          margin-right: 5px;
        }

        .van-cell {
          background: #F4F5F7;
          color: #999;
        }

        &:not(:last-child) {
          border-bottom: 1.1px solid #eee;
        }

        .location-btn {
          height: 100%;
          @include alignCenter;
          padding: 0 29px;
          color: $themeColor;
          font-size: 32px;
          border-left: 1.1px solid #eeeeee;

          &__icon {
            margin-right: 14px;
          }
        }
      }

      .c-date-picker {
        height: 90px;
        display: block;
        width: 100%;
        @include flex-between;

        &__label {
          font-size: 32px;
          color: #666;
          margin-right: 44px;
        }

        .l-right {
          position: relative;
          height: 100%;
          @include alignCenter;
          margin-right: 14px;
          flex: 1;
        }

        &__date {
          font-size: 30px;
          display: inline-block;
          padding: 10px 20px;
          color: #666;
        }

        &__segment-line {
          display: inline-block;
          width: 40px;
          margin: 0 20px;
          background-color: #666;
          height: 4px;
        }
      }
    }

    .job-cells {
      @include flex-center;
      border-bottom: 1.1px solid #eee;
      padding: 35px 0px;

      &:last-child {
        border: none;
      }

      .job-cell {
        .van-cell {
          margin-top: 0.2rem;
          padding: 0;
          font-size: 16px;
          /*input{*/
          /*text-align: center;*/
          /*}*/
        }

        flex: 1;
        display: flex;
        flex-direction: column;
        @include flex-center($direction: column);
        border-right: 1.1px solid #eee;

        &:last-child {
          border: none;
        }

        span:nth-child(1) {
          color: #999;
          font-size: $font-size-base;
        }

        span:nth-child(2) {
          color: #666;
          margin-top: 20px;
          font-size: $font-size-lg;
        }
      }
    }

    .sex-cells {
      @include flex-center();

      .sex-cell {
        @include flex-center();

        .topimg {
          margin-right: 10px;
        }

        &:nth-child(1) {
          margin-right: 30px;
        }

        padding: 8px 20px;
        border-radius: 30px;
        border: 1.1px solid #eee;
      }
    }
  }
</style>
