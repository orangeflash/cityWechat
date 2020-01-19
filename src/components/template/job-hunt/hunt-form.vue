<template>
  <div id="BasicForm">
    <ul class="form-list">
      <li class="form-list__item">
        <InputWithCmp
          v-model="title"
          placeholder="请输入招聘标题"
          title="招聘标题"
          name="title"
        />
      </li>
      <li class="form-list__item" @click="showIndustryDialog">
        <input-with-cmp
          disabled="true"
          :value="selectedindustryOption.join(' ')"
          placeholder="请选择招聘职位"
          title="招聘职位"
          name="industry"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </input-with-cmp>
      </li>
      <li class="form-list__item" @click="showPickerDialog('huntTypeOption')">
        <InputWithCmp
          disabled="true"
          :value="selectedhuntTypeOption.join(' ')"
          title="招聘类型"
          placeholder="请选择招聘类型"
          name="huntType"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </InputWithCmp>
      </li>
      <li class="form-list__item" @click="showPickerDialog('salaryOption')">
        <InputWithCmp
          disabled="true"
          :value="selectedsalaryOption.join(' ')"
          title="薪资待遇"
          placeholder="请选择薪资待遇"
          name="salary"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </InputWithCmp>
      </li>
      <li class="form-list__item">
        <InputWithCmp
          v-model="linkman"
          placeholder="请输入联系姓名"
          title="联系人"
          name="linkman"
        />
      </li>
      <li class="form-list__item">
        <InputWithCmp
          v-model="linkTel"
          type="number"
          placeholder="请输入联系电话"
          title="联系电话"
          name="linkTel"
        />
      </li>
      <li v-if="platform.mode==1" class="form-list__item">
        <InputWithCmp
          v-model="selectedArea"
          title="公司地址"
          placeholder="请输入所在城市"
          name="selectedArea"
        >
        </InputWithCmp>
      </li>
      <li v-else class="form-list__item" @click="areaPickerDialog=true">
        <InputWithCmp
          disabled="true"
          :value="selectedArea"
          title="公司地址"
          placeholder="请选择所在城市"
          name="selectedArea"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </InputWithCmp>
      </li>
      <!--<li class="form-list__item" @click="showmap=true">-->
      <!--<InputWithCmp-->
      <!--disabled="true"-->
      <!--readonly="true"-->
      <!--v-model="address"-->
      <!--title="公司地址"-->
      <!--placeholder="请点击定位"-->
      <!--name="address"-->
      <!--&gt;-->
      <!--<aside class="location-btn">-->
      <!--<i class="iconfont icon-location1 location-btn__icon"></i>-->
      <!--<em>定位</em>-->
      <!--</aside>-->
      <!--</InputWithCmp>-->
      <!--</li>-->
      <li class="form-list__item">
        <InputWithCmp
          v-model="address"
          placeholder="输入详细地址：区域，街道，楼宇，门牌号等"
          title=""
          name="address"
        />
      </li>
      <li class="form-list__item">
        <InputWithCmp
          disabled="true"
          title="职能描述"
          placeholder=""
        >
        </InputWithCmp>
      </li>
      <li class="form-list__item" style="padding-bottom: 20px;">
        <van-field
          v-model="description"
          type="textarea"
          placeholder="描述所招岗位的职责及要求"
          rows="4"
          autosize
        />
      </li>
    </ul>
    <header class="form-head">基本要求</header>
    <ul class="form-list">
      <li class="form-list__item" @click="showPickerDialog('sexTypeOption')">
        <InputWithCmp
          disabled="true"
          :value="selectedsexTypeOption.join(' ')"
          title="性别要求"
          placeholder="请选择"
          name="sexType"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </InputWithCmp>
      </li>
      <li class="form-list__item" @click="showPickerDialog('jyTypeOption')">
        <InputWithCmp
          disabled="true"
          :value="selectedjyTypeOption.join(' ')"
          title="经验要求"
          placeholder="请选择"
          name="jyType"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </InputWithCmp>
      </li>
      <li class="form-list__item" @click="showPickerDialog('xlTypeOption')">
        <input-with-cmp
          disabled="true"
          :value="selectedxlTypeOption.join(' ')"
          placeholder="请选择"
          title="学历要求"
          name="xlType"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </input-with-cmp>
      </li>
    </ul>
    <header class="form-head" v-if="labels.length > 0">标签选择</header>
    <ul class="labes-list" v-if="labels.length > 0">
      <ChoiceLabel
        @choice="choice"
        :labelsDefault="labelsDefault"
        max="5"
        :labels="labels"
      ></ChoiceLabel>
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
    <van-popup position="bottom" v-model="industryDialog">
      <van-picker
        ref="industry"
        show-toolbar
        @change="industryChangeHandle"
        :title="industryOption.title"
        :columns="industryOption.columns"
        @cancel="industryDialog=false"
        @confirm="selectionConfirm($event,'industryOption')"
      />
    </van-popup>
    <!--单一选项-->
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
    name: "HuntForm",
    props: ["storeInfo"],
    components: {DdMap, InputWithCmp, ChoiceLabel},
    data() {
      const beginDate = this.formatDateByTimeStamp(new Date(), "HH:mm");
      const endDate = this.formatDateByTimeStamp(new Date(), "HH:mm");
      return {
        areaList,
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
        industryDialog: false,
        industryOption: {
          columns: [],
          options: [],
          title: "选择招聘职位"
        },
        //单选picker公用变量
        singlechoosetitle: '',
        singlechoosecolumns: [],
        singleDialog: false,
        //薪资选项弹出框
        selectedsalaryOption: [],
        salaryOption: {
          columns: [],
          options: [],
          title: "选择薪资待遇"
        },
        //兼职类型弹出框
        selectedhuntTypeOption: [],
        huntTypeOption: {
          columns: [],
          options: [],
          title: "选择招聘类型"
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
          title: "选择经验要求"
        },
        //学历弹出框
        selectedxlTypeOption: [],
        xlTypeOption: {
          columns: [],
          options: [],
          title: "选择学历要求"
        },
        latLng: {},
        labelsDefault: [],
        //  form
        labels: [],
        selectedLabel: null,
        title: "",
        linkman: "",
        linkTel: "",
        address: "",
        description: "",
      };
    },
    methods: {
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
        this.industryDialog = false;
        console.log(this['selected' + key], value, key)
      },
      //单选pickerchange事件
      singleChangeHandle(picker, values, index) {
        // picker.setColumnValues(
        //   1,
        //   _.find(this["businessDistrictOption"].options, {
        //     name: values[0]
        //   }).son.map(item => item.tradeName)
        // );
        console.log(this[this.singlechooseKey], _.find(this[this.singlechooseKey].options, {
          name: values[0]
        }), picker, values, index)
      },
      //二级分类change事件
      industryChangeHandle(picker, values, index) {
        picker.setColumnValues(
          1,
          _.find(this["industryOption"].options, {
            name: values[0]
          }).son.map(item => item.name)
        );
        console.log(this["industryOption"], _.find(this["industryOption"].options, {
          name: values[0]
        }), picker, values, index)
      },
      //公用分类请求方法 将选中的key的值赋值给公用变量
      async initSelections(key, type) {
        this.singlechoosetitle = this[key].title
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
              {name: '经验不限'}, {name: '1年以内'}, {name: '1-2年'}, {name: '2-3年'}, {name: '3-5年'}, {name: '5-10年'}, {name: '10年以上'}
            ]
            break;
          case 'xlTypeOption':
            data = [
              {name: '学历不限'}, {name: '小学'}, {name: '初中'}, {name: '高中'}, {name: '专科'}, {name: '本科'}, {name: '研究生'}, {name: '硕士'}, {name: '博士'}, {name: '博士后'}
            ]
            break;
          case 'salaryOption':
            data = [
              {name: '面议'}, {name: '1K以下'}, {name: '1-2K'}, {name: '2-3K'}, {name: '3-5K'}, {name: '5-10K'}, {name: '10K以上'},
            ]
            break;
          default:
            data = (await this.getJobPosition()) || [];
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
      //请求一级数据
      showPickerDialog(key) {
        this.singleDialog = true;
        this.singlechooseKey = key;
        this.initSelections(key);
      },
      //请求二级分类数据
      showIndustryDialog() {
        this.industryDialog = true;
        this.initSelections("industryOption", 8);
      },
      //父级调用拿到formdata数据
      getFormData() {
        // console.log(this.$refs.industry.getIndexes())
        // const zoneName = this.selectedBusinessDistrictOption[0];
        // const zone = _.find(this.businessDistrictOption.options, {
        //   name: zoneName
        // });
        const typePName = this.selectedindustryOption[0], workNature = this.selectedhuntTypeOption[0] == '全职' ? 1 : 2,
          salary = this.selectedsalaryOption[0],
          sex = this.selectedsexTypeOption[0] == "男" ? '1' : this.selectedsexTypeOption[0] == "女" ? '2' : '0',
          experience = this.selectedjyTypeOption[0],
          education = this.selectedxlTypeOption[0];
        const typeP = _.find(this.industryOption.options, {
          name: typePName
        });
        console.log(typePName, typeP, workNature, salary, sex, experience, education, this.labels, _.findIndex(this.labels, {active: true}), this.selectedLabel)
        // return
        let warn = "", flag = true;
        if (this.title == "") {
          warn = "请填写招聘标题";
        } else if (!(typeP)) {
          warn = "请选择招聘职位";
        } else if (!(workNature)) {
          warn = "请选择招聘类型";
        } else if (!(salary)) {
          warn = "请选择薪资待遇";
        } else if (this.linkman == "") {
          warn = "请填写联系人";
        } else if (!isTellPhone(this.linkTel)) {
          warn = "请填写正确的联系电话";
        } else if (this.selectedArea == "" || this.address == "") {
          warn = "请完善公司地址信息";
        } else if (!(this.description)) {
          warn = "请填写职位描述";
        } else if (!(sex)) {
          warn = "请选择性别要求";
        } else if (!(experience)) {
          warn = "请选择经验要求";
        } else if (!(education)) {
          warn = "请选择学历要求";
        } else if (this.labels.length > 0 && _.isEmpty(this.selectedLabel)) {
          warn = "请至少选择一个标签";
        } else {
          flag = false;//若必要信息都填写，则不用弹框
          const typeName = this.selectedindustryOption[1];
          const type = typeP.son.length
            ? _.find(typeP.son, {name: typeName})
            : {};
          console.log(typeName, type)
          return {
            title: this.title,
            linkman: this.linkman,
            linkTel: this.linkTel,
            area: this.selectedArea,
            address: this.address,
            description: this.description,
            sex, experience, education, salary, workNature,
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
    computed: {},
    watch: {
      async storeInfo(storeInfo) {
        showLoading()
        storeInfo.label = JSON.parse(storeInfo.label)
        console.log('storeInfo', storeInfo)
        if (storeInfo) {
          Object.assign(this, {
            title: storeInfo.title,
            linkman: storeInfo.linkman,
            linkTel: storeInfo.linkTel,
            address: storeInfo.address,
            selectedArea: storeInfo.area,
            selectedsexTypeOption: storeInfo.sex == 1 ? ['男'] : storeInfo.sex == 2 ? ['女'] : ['性别不限'],
            description: storeInfo.description,
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

<style scoped lang="scss">
  @import "../../../assets/theme";

  #BasicForm {
    .form-head {
      color: #777777;
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
  }
</style>
