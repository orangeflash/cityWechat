<template>
  <div id="BasicForm">
    <ul class="form-list">
      <li class="form-list__item">
        <InputWithCmp
          v-model="shopName"
          placeholder="请输入商家名称"
          title="商家名称"
          name="storeName"
        />
      </li>
      <li class="form-list__item" v-if="businessDistrictOption.columns.length > 0" @click="showBusinessDistrictDialog">
        <input-with-cmp
          disabled="true"
          :value="selectedBusinessDistrictOption.join(' ')"
          placeholder="请选择所属区域"
          title="所属区域"
          name="tradArea"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </input-with-cmp>
      </li>
      <li class="form-list__item" @click="showIndustryDialog">
        <InputWithCmp
          disabled="true"
          :value="selectedIndustryOption.join(' ')"
          title="所属行业"
          placeholder="请选择所属行业"
          name="industry"
        >
          <i class="iconfont icon-jiantouarrow487 arrow"></i>
        </InputWithCmp>
      </li>
      <li class="form-list__item">
        <InputWithCmp
          v-model="shopPhone"
          type="number"
          placeholder="请输入联系电话"
          title="联系电话"
          name="linkTel"
        />
      </li>
      <li class="form-list__item" @click="showmap=true">
        <InputWithCmp
          disabled="true"
          readonly="true"
          v-model="address"
          title="详细地址"
          placeholder="请点击定位"
          name="address"
        >
          <aside class="location-btn">
            <i class="iconfont icon-location1 location-btn__icon"></i>
            <em>定位</em>
          </aside>
        </InputWithCmp>
      </li>
    </ul>
    <!--地图-->
    <DdMap @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress"></DdMap>


    <!--<van-popup position="bottom" v-model="showMapDialog">-->
    <!--<custom-map-->
    <!--@close="showMapDialog=false"-->
    <!--@confirm="changeLocation"-->
    <!--:latLng.sync="latLng"-->
    <!--:symbol="1"-->
    <!--/>-->
    <!--</van-popup>-->
    <!--选项-->
    <van-popup position="bottom" v-model="businessDistrictDialog">
      <van-picker
        show-toolbar
        @change="businessDistrictChangeHandle"
        :title="businessDistrictOption.title"
        :columns="businessDistrictOption.columns"
        @cancel="businessDistrictDialog=false"
        @confirm="selectionConfirm($event,'selectedBusinessDistrictOption')"
      />
    </van-popup>
    <van-popup position="bottom" v-model="industryDialog">
      <van-picker
        show-toolbar
        @change="industryChangeHandle"
        :title="industryOption.title"
        :columns="industryOption.columns"
        @cancel="industryDialog=false"
        @confirm="selectionConfirm($event,'selectedIndustryOption')"
      />
    </van-popup>
    <van-popup position="bottom" v-model="datePickerDialog">
      <van-datetime-picker
        @confirm="changeTime"
        @cancel="datePickerDialog=false"
        type="time"
      />
    </van-popup>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import InputWithCmp from "./input-with-cmp";
  // import CustomMap from "../basic/custom-map";
  import {utilMixins} from "../../plugins/util-mixins";
  import {defaultLatLng} from "../../project-config/base";
  import {getLocation} from "../../util/wechat-util";
  import _ from "lodash";
  import {hideLoading, isTellPhone, showDialog, showLoading} from "../../util";
  import DdMap from "../../components/template/dd-map"


  export default {
    name: "YellowForm",
    props: ["storeInfo"],
    components: {DdMap, InputWithCmp},
    data() {
      const beginDate = this.formatDateByTimeStamp(new Date(), "HH:mm");
      const endDate = this.formatDateByTimeStamp(new Date(), "HH:mm");
      return {
        address: "",
        chooseDdMapLocation: {},
        showmap: false,
        targetDateIndex: 0,
        //地图和日期选择器
        showMapDialog: false,
        datePickerDialog: false,
        //两个选项弹出框
        selectedBusinessDistrictOption: [],
        businessDistrictDialog: false,
        businessDistrictOption: {
          columns: [],
          options: [],
          title: "选择区域"
        },
        selectedIndustryOption: [],
        industryDialog: false,
        industryOption: {
          columns: [],
          options: [],
          title: "选择行业"
        },
        //两个选项弹出框
        latLng: {},
        //  form
        shopName: "",
        shopPhone: ""
      };
    },
    methods: {
      ...mapActions("publication/businessEnter", [
        "getTradeOptions",
        "getPostCategoryOptions"
      ]),
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
      businessDistrictChangeHandle(picker, values) {
        picker.setColumnValues(
          1,
          _.find(this["businessDistrictOption"].options, {
            name: values[0]
          }).son.map(item => item.tradeName)
        );
      },
      selectionConfirm(value, key) {
        this[key] = value;
        this.businessDistrictDialog = false;
        this.industryDialog = false;
      },
      industryChangeHandle(picker, values) {
        picker.setColumnValues(
          1,
          _.find(this["industryOption"].options, {
            name: values[0]
          }).son.map(item => item.name)
        );
      },
      changeTime(val) {
        this.dateList[this.targetDateIndex] = val;
        this.datePickerDialog = false;
      },
      showDatePickerDialog(index) {
        this.targetDateIndex = index;
        this.datePickerDialog = true;
      },
      async initSelections(key, type) {
        //如果请求过一次就不再请求
        if (this[key].columns.length) return;
        let data = [];
        if (type === 10) {
          data = (await this.getTradeOptions(type)) || [];
        } else {
          data = (await this.getPostCategoryOptions(type)) || [];
        }
        this[key].options = data;
        console.log("二级分类数据为", data);
        //如果存在多选
        if (data[0]) {
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
        }
      },
      showBusinessDistrictDialog() {
        this.businessDistrictDialog = true;
        this.initSelections("businessDistrictOption", 10);
      },
      showIndustryDialog() {
        this.industryDialog = true;
        this.initSelections("industryOption", 8);
      },
      getFormData() {
        const zoneName = this.selectedBusinessDistrictOption[0];
        const typePName = this.selectedIndustryOption[0];
        const zone = _.find(this.businessDistrictOption.options, {
          name: zoneName
        }) || {};
        const typeP = _.find(this.industryOption.options, {
          name: typePName
        }) || {};
        if (this.shopName == "") {
          showDialog("请填写商家名称");
          return null;
        } else if (!typeP.son) {
          showDialog("请选择所属行业");
          return null;
        } else if (!isTellPhone(this.shopPhone)) {
          showDialog("请输入合理的联系电话");
          return null;
        } else if (this.address == "") {
          showDialog("请点击定位");
          return null;
        }
        const tradeName = this.selectedBusinessDistrictOption[1];
        const trade = zone.son && zone.son.length
          ? _.find(zone.son, {tradeName})
          : {};

        const typeName = this.selectedIndustryOption[1];
        const type = typeP.son.length
          ? _.find(typeP.son, {name: typeName})
          : {};

        return {
          name: this.shopName,
          tel: this.shopPhone,
          address: this.address,
          lat: this.latLng.latitude,
          lng: this.latLng.longitude,
          zoneId: zone.id || '',
          typePid: typeP.id,
          typeId: type ? type.id : ""
        };
      }
    },
    mixins: [utilMixins],
    computed: {},
    watch: {
      async storeInfo(storeInfo) {
        if (storeInfo) {
          await this.initSelections("businessDistrictOption", 10);
          // 获取黄页的分类
          await this.initSelections("industryOption", 8);
          Object.assign(this, {
            shopName: storeInfo.name,
            shopPhone: storeInfo.tel,
            address: storeInfo.address,
            latLng: {
              latitude: storeInfo.lat,
              longitude: storeInfo.lng
            },
            zoneId: storeInfo.zoneId,
            typePid: storeInfo.typePid,
            typeId: storeInfo.typeId
          });
          const zone =
            _.find(this.businessDistrictOption.options, {
              id: storeInfo.zoneId
            }) || {};
          const typeP =
            _.find(this.industryOption.options, {
              id: storeInfo.typePid
            }) || {};
          this.selectedBusinessDistrictOption[0] = zone.name;
          this.selectedIndustryOption[0] = typeP.name;

          const trade = zone.son&&zone.son.length
            ? _.find(zone.son, {tradeId: storeInfo.tradeId}) || {}
            : {};
          this.selectedBusinessDistrictOption[1] = trade.tradeName;

          const type = typeP.son.length
            ? _.find(typeP.son, {id: storeInfo.typeId})
            : {};
          this.selectedIndustryOption[1] = type.name;
        }
      }
    },
    async created() {
      console.log("接收到的详情为", this.storeInfo);
      if (!_.isEmpty(this.storeInfo)) {
        return;
      }
      this.initSelections("businessDistrictOption", 10);

      window.wxReady(async () => {
        showLoading("定位中");
        this.latLng = await getLocation();
        this.changeLocation();
        hideLoading();
      });
    }
  };
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #BasicForm {
    .form-list {
      padding-left: 31px;
      background-color: #fff;

      &__item {
        .arrow {
          font-size: 34px;
          color: #c7c7c7;
          margin-right: 31px;
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
