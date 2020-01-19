<template>
  <div class="housing-deal-release" v-if="releaseType">
    <Header></Header>
    <photo-header :max="9"
                  @change-img="changeImgOne"
                  v-if="releaseType == 'lease'" :photo-list="pictures.imgUrlList||[]"
                  title="上传房屋照片，最多上传9张"></photo-header>
    <!--<div class="housing-deal-release_choice_pic">-->
    <!--<div class="choice-pic-back"></div>-->
    <!--<div class="choice-pic-btn">-->
    <!--<i class="iconfont icon-ai-camera"></i>-->
    <!--<van-uploader-->
    <!--v-if="pictures.length<9"-->
    <!--multiple-->
    <!--:after-read="onRead"></van-uploader>-->
    <!--</div>-->
    <!--<div class="choice-pic-list-box">-->
    <!--<p>上传房屋照片，最多上传9张</p>-->
    <!--<ul class="choice-pic-list">-->
    <!--<li class="choice-pic-single" v-for="(item,key) in pictures">-->
    <!--<i class="iconfont icon-Closewithcircle" @click="deletePic(key)"></i>-->
    <!--<div>-->
    <!--<img-wrapper :src="item.content"></img-wrapper>-->
    <!--</div>-->
    <!--</li>-->
    <!--</ul>-->
    <!--</div>-->
    <!--</div>-->
    <div class="housing-deal-release_from">
      <div class="from-area">
        <div class="from-area_title">基本信息</div>
        <van-field
          clearable
          right-icon="question-o"
          label="发布标题"
          placeholder="请输入发布标题"
          v-model="fillData.title"
        />
        <van-field
          clearable
          label="房屋租金"
          right-icon="question-o"
          placeholder="请输入"
          type="number"
          v-model="fillData.rent"
          :disabled="fillData.faceToFace"
        >
          <!--:disabled="fillData.backupsRen==0||params.faceToFace"-->
          <div slot="button" class="from-input_after">
            <em>THB/月</em>
            <div
              @click="fillData.faceToFace = !fillData.faceToFace"
              :class="{'active':fillData.faceToFace}"
            >
              <i class="iconfont " :class="fillData.faceToFace?'icon-multiple_choice ':'icon-choose_none_line'"></i>
              面议
            </div>
          </div>
        </van-field>
        <PickerColumn :list="pickerData[releaseType]" @click="pickerChoice" @inputForm="inputForm"></PickerColumn>
      </div>
      <div class="from-area" v-if="releaseType == 'lease'">
        <van-field
          clearable
          label="小区名称"
          right-icon="question-o"
          placeholder="请输入小区名称"
          v-model="fillData.communityName"
        />
        <van-field
          clearable
          label="所在区域"
          placeholder="请选择（市、区）"
          v-model="fillData.area"
          :readonly=true
          @click="showmap = !showmap"
        >
          <i slot="button" class="iconfont icon-youjiantou1"></i>

        </van-field>
        <van-field
          placeholder="请输入详细地址：区域，街道，楼宇，门牌号等"
          v-model="fillData.address"

        >
          <!--<span slot="button"-->
          <!--@click="showmap = !showmap"-->
          <!--&gt;-->
          <!--<i class="iconfont icon-dizhi2"></i>定位</span>-->


        </van-field>
      </div>
      <div class="from-area" v-if="releaseType == 'lease'">
        <div class="from-area_title">房源信息</div>
        <van-field
          clearable
          label="房源装修"
          placeholder="请选择"
          v-model="fillData.renovation"
          :readonly=true
          @click="pickerChoice({field:'renovation',name:'房源装修'})"
        >
          <i slot="button" class="iconfont icon-youjiantou1"></i>

        </van-field>
        <van-field
          clearable
          label="房源面积"
          type="number"
          placeholder="请输入房屋面积"
          v-model="fillData.measure"
        >
          <span slot="button">㎡</span>

        </van-field>
        <van-field
          clearable
          label="房源楼层"
          placeholder="请选择(房屋所在楼层 - 总楼层数）"
          v-model="fillData.floor"
          :readonly=true
          @click="pickerChoice({field:'floor',name:'房源楼层'})"
        >
          <i slot="button" class="iconfont icon-youjiantou1"></i>

        </van-field>
        <van-field
          clearable
          label="房源朝向"
          placeholder="请选择"
          v-model="fillData.orientation"
          @click="pickerChoice({field:'orientation',name:'房源朝向'})"
          :readonly=true
        >
          <i slot="button" class="iconfont icon-youjiantou1"></i>

        </van-field>
      </div>
      <div class="from-area">
        <div class="from-area_title">联系人信息</div>
        <van-field
          clearable
          v-model="fillData.linkMan"
          label="联系人姓名"
          right-icon="question-o"
          placeholder="请输入联系人姓名"
        />
        <van-field
          clearable
          v-model="fillData.linkTel"
          type="number"
          label="联系人电话"
          right-icon="question-o"
          placeholder="请输入联系人电话"
        />
      </div>
      <div class="from-area">
        <div class="from-area_title">房屋配置</div>
        <div class="from-area_content">
          <ChoiceLabel
            v-bind="attribute"
            @choice="choiceDataLabel"
          ></ChoiceLabel>
        </div>
      </div>
      <div class="from-area">
        <div class="from-area_title">特色标签</div>
        <div class="from-area_content">
          <ChoiceLabel
            v-bind="feature"
            @choice="choiceLabel"
          ></ChoiceLabel>
        </div>
      </div>
      <div class="from-area">
        <div class="from-area_title">{{releaseType == 'lease'?'房源描述':'信息补充'}}</div>
        <div class="from-area_content">
          <div class="from-area_content_input">
            <textarea
              v-model="fillData.body"
              :placeholder="releaseType == 'lease'?'描述出租房屋的房屋特征，以及对租客的要求等信息':'例如：小区/楼层/位置/总价/租金/装修/朝向等 方面的要求'"></textarea>
            <p>（<em
              :class="{error:fillData.body&&fillData.body.length>500}">{{(fillData.body&&fillData.body.length) ||
              0}}</em>-500）
            </p>
          </div>
        </div>
      </div>
    </div>
    <Radio
      v-if="config.openCountry == 'open' && !fillData.id"
      v-bind="radioConfig"
      @change="choiceRadio"
    ></Radio>
    <div class="release-agree-agreement">
      <AgreeAgreement
        :status="agreeAgreement"
        @choice="agreeAgreement = !agreeAgreement"
        :con="config.agreement"
        name="用户协议条款"
      ></AgreeAgreement>
    </div>
    <div class="release-btn">
      <DdButton type="release"
                :name="releaseName"
                :bottom="true"
                @click="releaseBefore"
                :style="{background:$themeColor,borderRadius: 0}"
      ></DdButton>
    </div>
    <van-popup
      position="bottom"
      v-model="pickerShow">
      <van-picker
        show-toolbar
        :title="pickertitle"
        :columns="columns"
        @confirm="pickerConfirm"
        @cancel="pickerShow = !pickerShow"
      />
    </van-popup>
    <van-actionsheet
      v-model="showChoiceAddress"
    >
      <van-area :area-list="areaList"
                :columns-num="3"
                title="请选择"
                @confirm="selectClick"
                @cancel="showChoiceAddress = !showChoiceAddress"/>
    </van-actionsheet>
    <DdMap @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress"></DdMap>
  </div>
</template>
<script>
  import AgreeAgreement from '@/components/template/agree-agreement'
  import ChoiceLabel from '@/components/template/choice-label'
  import DdButton from "@/components/template/button"
  import PickerColumn from "@/components/template/picker/column"
  import Radio from "@/components/template/radio"
  import areaList from "../../../../static/area.js"
  import {requestByUpload} from "../../../util/request";
  import {Toast} from 'vant'
  import {mapActions} from "vuex"
  import {hideLoading, showLoading, picCompress} from "@/util";
  import {updateShareConfig, getLocation} from "@/util/wechat-util";
  import {isTellPhone, showDialog} from "../../../util";
  import DdMap from "@/components/template/dd-map"
  import {getParmasField} from "@/plugins/auxiliary/http-params";
  import {utilMixins} from "@/plugins/util-mixins";
  import {getAuxiliaryConfigColor} from "@/plugins/auxiliary/auxiliary-config";
  import PhotoHeader from '@/components/template/mall/release-photo/photo-header'


  function createColumnsData(length = 9, {before, after, start = 1} = {}) {
    let values = [];
    for (let i = start; i < length + 1; i++) values.push((before || '') + i + (after || ''))
    return values
  }

  export default {
    mixins: [utilMixins],
    components: {ChoiceLabel, AgreeAgreement, DdButton, PickerColumn, Radio, DdMap, PhotoHeader},
    data() {
      return {
        chnNumChar: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
        showmap: false,
        showChoiceAddress: false,
        config: {},    //发布的配置信息
        areaList,
        agreeAgreement: true,
        releaseName: '立即发布',
        releasePrice: 0, //发布的价格
        releaseType: '',
        columns: [],
        pictures: {
          upImg: [],
          imgUrlList: [],
        },
        attribute: {    //房屋配置
          labels: [],
          labelsDefault: [],
        },
        attributeLabelsDefault: [],
        price: {},     //发布的价格
        feature: {     //特色标签
          labels: [],
          labelsDefault: [],
        },
        pickerShow: false,
        pickertitle: '标题',
        radioConfig: {
          value: 0,
          label: '选择区域',
          radios: [
            "本地",
            "全国"
          ]
        },
        pickerData: {
          lease: [
            {
              name: '类型',
              desc: '请选择',
              field: 'rentType',
              param: 'rentType'
            },
            {
              name: '户型',
              desc: '请选择',
              field: 'apartment',
              param: 'apartment'
            },
            {
              name: '押金',
              desc: '请选择',
              field: 'deposit',
              param: 'deposit'
            }
          ],
          rentSeeking: [
            {
              name: '类型',
              desc: '请选择',
              field: 'rentType',
              param: 'rentType'
            },
            {
              name: '押金',
              desc: '请选择',
              field: 'deposit',
              param: 'deposit'
            },
            {
              name: '地区',
              desc: '请选择',
              field: 'area',
              param: 'area'
            }
          ],
        },
        columnsData: {
          rentType: ['整租', '次卧', '主卧', '单间'],
          apartment: [
            {
              values: createColumnsData(9)
            }, {
              values: createColumnsData(9, {start: 0})
            }, {
              values: createColumnsData(9, {start: 0})
            }
          ],
          deposit: [
            {
              values: createColumnsData(5)
            }, {
              values: createColumnsData(5)
            }
          ],
          renovation: ['毛坯', '简单装修', '中等装修', '精装修', '豪华装修'],
          orientation: ['东', '南', '西', '北', '南北', '东西', '东南', '西南', '东北', '西北'],
          floor: [
            {values: createColumnsData(99)},
            {values: createColumnsData(99)}
          ]
        },
        address: '', //用户输入的时候的详细地址
        params: {},
        fillData: {},
      }
    },
    methods: {
      ...mapActions("houingDeal", ['housingDealRelease', "housingDealClssInfo", 'housingDealConfig']),
      inputForm(item, key) {
        console.log(item, key, this.fillData)
        item.desc && item.desc.trim() ? this.fillData[item.field] = item.desc : this.fillData[item.field] = null;
      },
      changeImgOne(e) {
        this.pictures.upImg = e
      },
      choiceAddress(v) {
        this.fillData.address = v.poiaddress;
        if (v.poiaddress.indexOf("区") > 0) {
          v.poiaddress = v.poiaddress.split('区')[0] + "区";
        } else if (v.poiaddress.indexOf("县") > 0) {
          v.poiaddress = v.poiaddress.split('县')[0] + "县";
        }
        this.fillData.area = v.cityname + (v.poiaddress.split('市')[1] && "-" + v.poiaddress.split('市')[1]);
        this.fillData.lat = v.latlng.lat;
        this.fillData.lng = v.latlng.lng;
      },
      async releaseBefore() {
        const result = this.judgeData()
        if (result.status) {
          if (this.releaseType == 'lease' && this.pictures.upImg.length) {
            showLoading("图片上传中...")
            this.fillData.imgs = await this.uploadFile({files: this.pictures.upImg});
            // if (this.pictures.length != this.fillData.imgs.length) {
            // this.uploadPic(this.pictures[this.fillData.imgs.length], this.pictures.length != 1)
            // }
            this.beginRelease();
          } else {
            this.beginRelease();
          }
        } else {
          Toast.fail({
            message: result.msg,
            duration: 1000
          })
        }
      },
      choiceRadio(index) {
        console.log(index);
        this.fillData.wholeCountry = (index || 0) + 1;
        this.releasePrice = this.fillData.wholeCountry == 2 ? +this.price.country.release || 0 : +this.price.local.release || 0;
        this.releaseName = this.releasePrice && !this.fillData.id ? '需要支付￥' + (+this.releasePrice).toFixed(2) + "THB" : '立即发布';
      },
      async beginRelease() {
        showLoading();
        const result = await this.housingDealRelease(this.fillData);
        hideLoading()
        if (!isNaN(Number(result))) {
          if (!this.fillData.id && this.releasePrice > 0) {
            try {
              await showDialog("需要支付" + this.releasePrice.toFixed(2) + "THB");
              this.$router.push({
                name: 'cashier',
                params: {
                  type: 22,
                  param: {
                    rentingId: result,
                  },
                  info: {
                    money: this.releasePrice,
                    type: "发布租房信息",
                    callLink: '/auxiliary/housingDeal',
                    callBack() {
                      this.fillData = getParmasField('housingDeal');
                    }
                  }
                }
              });
            } catch (e) {
              console.log("老板，我是要生存的，连" + this.releasePrice.toFixed(2) + "THB都不给我，我不好办事啊")
            }
          } else {
            Toast.success({
              message: '发布成功',
              duration: 1500
            });
            setTimeout(() => {
              this.fillData = getParmasField('housingDeal');
              this.goPointPage('/auxiliary/housingDeal')
            }, 1500);
          }
        } else {
          Toast.fail({
            message: '发布失败',
            duration: 1500
          })
        }
      },
      judgeData() {
        this.fillData.typeId = this.$route.query.id;
        const data = this.fillData;
        const bool = this.releaseType == 'lease';
        console.log("data", data);
        let res = {};
        if (!data.typeId) res.msg = "缺少TypeId";
        else if (bool && !this.pictures.upImg.length) res.msg = '上传房屋照片';
        else if (!data.title.trim().length) res.msg = '请输入发布标题';
        else if (!data.faceToFace && !data.rent) res.msg = '请输入租金';
        else if (!data.rentType) res.msg = '请选择租房类型';
        else if (bool && !data.apartment) res.msg = '请选择户型';
        else if (!data.deposit) res.msg = '请选择押金类型';
        else if (bool && !data.communityName) res.msg = '请输入小区名称';
        else if (!data.area) res.msg = '请完善区域信息';
        else if (bool && !data.address) res.msg = '请输入详细地址';
        else if (bool && !data.renovation) res.msg = '请选择装修情况';
        else if (bool && !data.measure) res.msg = '请输入房源面积';
        else if (bool && !data.floor) res.msg = '请选择楼层';
        else if (bool && !data.orientation) res.msg = '请选择朝向';
        else if (!data.linkMan) res.msg = '请输入联系人姓名';
        else if (!data.linkTel) res.msg = '请输入联系人电话';
        else if (!isTellPhone(data.linkTel)) res.msg = "请输入正确的联系电话"
        else if (!this.agreeAgreement) res.msg = '请同意并遵守用户协议条款';
        if (!res.msg) {
          res.status = true
          this.params = this.fillData;
          this.fillData.rent = (data.faceToFace) ? 0 : this.fillData.rent;
        }
        return res;

      },
      choiceDataLabel(arr) {
        let j = {}
        arr.map(v => {
          j[v.id] = v.name
        })
        this.fillData.data = j;
      },
      choiceLabel(arr) {
        let j = {}
        arr.map(v => {
          j[v.id] = v.name
        })
        this.fillData.label = j;
      },
      uploadPic(item, isOver) {
        let file = null;
        if (item.file) {
          const form = new FormData();
          form.append('file', item.file);
          form.forEach(v => {
            file = v;
          })
        }
        const that = this;
        picCompress({
          file: file,
          quality: 5,
          callBack(ret) {
            console.log("图片压缩成功");
            requestByUpload(ret, null, isOver).then(result => {
              let index = that.pictures.indexOf(item);
              that.fillData.imgs.push({
                url: result.src,
                type: "img"
              })
              that.pictures[index + 1]
                ? that.uploadPic(that.pictures[index + 1], index + 2 != that.pictures.length)
                : that.beginRelease();
            });
          }
        })


      },
      pickerChoice(item, index) {
        //console.log(item,index)
        if (item.field === 'area') {
          if (this.platform.mode == 1) {
            return
          }
          this.showChoiceAddress = !this.showChoiceAddress;
        } else {
          this.columns = this.columnsData[item.field];
          this.pickerShow = !this.pickerShow;
          this.pickertitle = item.name;
          this.pickerIndex = index || index == 0 ? index : item.field;
        }
      },
      pickerConfirm(picker, values) {
        //console.log('picker',picker,'value',values,this.pickerIndex)
        this.pickerShow = !this.pickerShow;
        const data = typeof picker == 'string' ? picker : picker.join('-') || '请选择';
        if (typeof this.pickerIndex == 'number') {
          let obj = this.pickerData[this.releaseType][this.pickerIndex];
          obj.desc = data;
          let res = data.split('-');
          switch (obj.param) {
            case 'apartment':
              obj.desc = res[0] + "室" + res[1] + "厅" + res[2] + "卫";
              this.fillData[obj.param] = data;
              break;
            case 'deposit':
              obj.desc = "押" + this.chnNumChar[res[0]] + "付" + this.chnNumChar[res[1]];
              this.fillData[obj.param] = obj.desc;
              break;
            default:
              this.fillData[obj.param] = data;
          }

        } else {
          this.fillData[this.pickerIndex] = data;
        }
      },
      // 删除图片
      deletePic(key) {
        this.pictures.splice(key, 1)
        if (this.fillData.id) {
          this.fillData.imgs.splice(key, 1);
          console.log(this.fillData.imgs);
        }
      },
      onRead(file) {
        //console.log(file)
        file.length ? file.forEach(item => {
          this.pictures.length < 9 && this.pictures.push(item);
        }) : this.pictures.length < 9 && this.pictures.push(file);
      },
      // 获取省级联动信息
      selectClick(result) {
        let address = "";
        if (this.releaseType == 'rentSeeking') {
          this.pickerData[this.releaseType][2].desc = result[result.length - 1].name;
        }
        result.forEach((item, index) => {
          index && (address += item.name + (index < result.length - 1 ? "-" : ""));
        });
        this.fillData.area = address;
        this.showChoiceAddress = !this.showChoiceAddress;
      },
      // 编辑的时候数据填充
      dataFill(data) {
        if (!data) {
          getLocation().then(result => {
            console.log('getLocation', result)
          })
          // 初始化数据
          // this.fillData = this.fieldDataInit(getParmasField('housingDeal'));
          // this.fillData = getParmasField('housingDeal');
          // this.fillData=Object.assign({},getParmasField('housingDeal'))
          this.fillData = JSON.parse(JSON.stringify(getParmasField('housingDeal')))

          this.fillData.id = this.$route.query.rentingId;
          this.fillData.wholeCountry == +this.fillData.city ? 2 : 1;

        } else {
          showLoading('填充数据中...')
          this.fillData = data;
          this.radioConfig.value = +this.fillData.city ? 0 : 1;
          console.log("this.radioConfig.value", this.radioConfig.value);
          if (data.imgs.length) {
            this.pictures.upImg = this.pictures.imgUrlList = this.getImgArr(data.imgs)
          }
          this.pickerData[this.releaseType].forEach(v => {
            let res = [];
            switch (v.field) {
              case 'rentType':
                v.desc = this.fillData.rentType;
                break;
              case 'apartment':
                res = this.fillData.apartment.split("-");
                v.desc = res[0] + "室" + res[1] + "厅" + res[2] + "卫"
                break;
              case 'deposit':
                if (this.fillData.deposit.indexOf("押") >= 0) {
                  res = this.fillData.deposit
                  v.desc = this.fillData.deposit
                } else {
                  res = this.fillData.deposit.split("-");
                  v.desc = "押" + res[0] + "付" + res[1];
                }

                break;
              case 'area':
                v.desc = this.fillData.area.split("-")[1] || this.fillData.area.split("-")[0];
                break;
            }
          })

          for (let label in data.label) {
            this.feature.labelsDefault.push(data.label[label]);
          }
          for (let label in data.data) {
            this.attribute.labelsDefault.push(data.data[label]);
          }

          console.log(this.attributeLabelsDefault, this.labelsDefault);

          hideLoading();
        }

        this.housingDealClssInfo(this.params).then(result => {
          this.attribute.labels = result.data.attribute
          this.feature.labels = result.data.label
          this.price = {
            local: result.data.local,
            country: result.data.country
          }
          this.choiceRadio();
        });
      },
    },
    async created() {
      const bool = await this.checkBindTel({callBack: true});
      if (!bool) return this.goPointPage('/auxiliary/housingDeal');
      if (this.$route.query.type) {
        this.releaseType = this.$route.query.type;
        this.params.typeId = this.$route.query.id;

        this.housingDealConfig().then(result => {
          this.config = result;
          if (this.platform.mode == 1) {
            this.$set(this.pickerData.rentSeeking, 2, {
              name: '地区',
              type: 'text',
              desc: '',
              placeholder: '请输入地区',
              field: 'area',
              param: 'area'
            })
          }
        })
        let result = null;
        if (this.$route.query.rentingId) {
          result = await this.housingDealRelease({
            rentingId: this.$route.query.rentingId
          })
        }
        this.dataFill(result);
      } else {
        Toast.fail({
          message: '缺少type',
          duration: 1500
        })
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";


  .housing-deal-release {
    padding-bottom: 120px;

    &_choice_pic {
      background: #fff;

      .choice-pic-back {
        background: $themeColor;
        height: 148px;
      }

      .choice-pic-btn {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        box-shadow: 0px 0px 4px 0px $themeColor;
        background: #fff;
        margin: -80px auto 0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 0;

        .van-uploader {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        i {
          color: $themeColor;
          font-size: 68px;
          height: 56px;
        }
      }

      .choice-pic-list-box {
        padding: 30px 8px;

        p {
          font-size: 30px;
          color: #868686;
          text-align: center;
          margin-bottom: 30px;
        }

        .choice-pic-list {
          display: flex;
          flex-wrap: wrap;
          padding: 0 8px;

          li {
            position: relative;
            z-index: 0;
            width: 162px;
            height: 122px;
            margin: 0 8px 44px;

            i {
              color: #FF3838;
              font-size: 42px;
              position: absolute;
              z-index: 0;
              width: 42px;
              height: 36px;
              right: -10px;
              top: -10px;
            }

            div {
              overflow: hidden;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    &_from {
      .from-area {
        margin-bottom: 16px;

        &_title {
          height: 74px;
          display: flex;
          align-items: center;
          padding: 0 30px;
          color: #868686;
          font-size: 30px;
        }

        span {
          color: #333;
        }

        .from-input_after {
          display: flex;
          justify-content: space-between;

          em {
            color: #333;
          }


          div {
            display: flex;
            align-items: center;
            margin-left: 50px;
            font-size: 28px;

            i {
              height: 40px;
              margin-right: 10px;
              font-size: 40px;
            }
          }

        }

        &_content {
          padding: 30px;
          background: #fff;

          &_input {
            padding: 24px;
            background: #F4F5F7;

            textarea {
              background: rgba(0, 0, 0, 0);
              width: 100%;
              height: 200px;
              border: none;
              outline: none;
              line-height: 36px;
              font-size: 26px;
              resize: none;
            }

            p {
              text-align: right;
              font-size: 26px;
              color: #666;
            }
          }
        }
      }
    }

    .active {
      color: $themeColor;
    }

    .error {
      color: red;
    }
  }

</style>
