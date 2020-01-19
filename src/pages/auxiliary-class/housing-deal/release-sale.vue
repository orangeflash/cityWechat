<template>
  <div class="housing-deal-release mar-b-100">
    <Header/>
    <photo-header :max="6" @change-img="changeImgOne" :photo-list="pictures.imgUrlList||[]"
                  title="上传房屋照片，最多上传6张"></photo-header>
    <dd-form-chunk title="基本信息" class="mar-b-20">
      <div slot="content">
        <van-cell-group>
          <van-field
            v-model="params.title"
            label="发布标题"
            placeholder="请输入标题"
          />
        </van-cell-group>
      </div>
    </dd-form-chunk>
    <picker-column
      class="mar-b-20"
      @inputForm="inputForm"
      :list="picker"
      @click="pickerChoice"/>
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

    <van-cell-group>
      <van-field
        label="小区名称："
        v-model="params.communityName"
        :readonly=true
        placeholder="请选择小区"
      >
        <i slot="button" class="col-t" @click="showmap=true">定位</i>
      </van-field>
      <!--<van-field-->
      <!--v-model="params.communityName"-->
      <!--label="小区名称："-->
      <!--placeholder="请输入小区名称"-->
      <!--/>-->
      <van-field
        v-model="params.address"
        placeholder="请输入详细地址：区域，街道，楼宇，门牌号等"
      />
    </van-cell-group>
    <dd-form-chunk title="房源信息">
      <div slot="content">
        <van-cell-group>
          <van-cell v-for="(item,key) in pickerCell"
                    :key="key"
                    :title="item.label"
                    is-link
                    v-if="!item.hide"
                    @click="pickerChoice(item)"
                    :value="item.desc || tips.select"/>

          <van-field
            v-if="$route.query.type == 'unused'"
            v-model="params.developer"
            label="开发商："
            placeholder="请填写开发商名称"
          />

        </van-cell-group>
      </div>
    </dd-form-chunk>
    <dd-form-chunk title="联系人信息">
      <div slot="content">
        <van-cell-group>
          <van-field
            v-model="params.linkMan"
            label="联系人姓名"
            placeholder="请输入联系人姓名"
          />
          <van-field
            v-model="params.linkTel"
            label="联系人电话"
            placeholder="请输入联系人电话"
            type="number"
          />
        </van-cell-group>
      </div>
    </dd-form-chunk>
    <dd-form-chunk title="标签选择">
      <div slot="content" class="pad-30">
        <ChoiceLabel
          v-bind="feature"
          @choice="choiceLabel"
        ></ChoiceLabel>
      </div>
    </dd-form-chunk>
    <dd-form-chunk class="mar-b-20" title="需求描述">
      <div slot="content" class="pad-30">
        <dd-form-textarea class="pad-30 fon-b bg-f4" bg="#f4f4f4" v-model="params.body" height="150"
                          placeholder="请填写详细描述"></dd-form-textarea>
      </div>
    </dd-form-chunk>
    <Radio

      v-if="config.openCountry == 'open' && !$route.query.rentingId"
      v-bind="radioConfig"
      @change="choiceRadio"
    ></Radio>
    <AgreeAgreement
      :status="agreeAgreement"
      @choice="agreeAgreement = !agreeAgreement"
      :con="config.agreement"
      name="用户协议条款"
    ></AgreeAgreement>
    <DdButton type="release"
              :name="releaseName"
              :bottom="true"
              @click="releaseBefore"
              :style="{background:$themeColor,borderRadius: 0}"
    ></DdButton>

    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-bind="dateTime"
        @confirm="confirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>
    <dd-map @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress"></dd-map>
  </div>
</template>

<script>
  import PhotoHeader from '@/components/template/mall/release-photo/photo-header'
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import PickerColumn from "../../../components/template/picker/column"
  import ChoiceLabel from '@/components/template/choice-label'
  import DdFormTextarea from "@/components/template/dd-form/textarea"
  import AgreeAgreement from '@/components/template/agree-agreement'
  import DdButton from "../../../components/template/button"
  import {format, hideLoading, isTellPhone, showDialog, showLoading} from "../../../util";
  import {Toast} from 'vant'
  import {getLocation} from "../../../util/wechat-util";
  import Radio from "@/components/template/radio"
  import DdMap from "@/components/template/dd-map"

  import {mapActions} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";

  function createColumnsData(length = 9, {before, after, start = 1} = {}) {
    let values = [];
    for (let i = start; i < length + 1; i++) values.push((before || '') + i + (after || ''))
    return values
  }

  export default {
    mixins: [utilMixins],
    components: {
      PhotoHeader,
      DdFormChunk,
      PickerColumn,
      ChoiceLabel,
      DdFormTextarea,
      AgreeAgreement,
      DdButton,
      Radio,
      DdMap,

    },
    data() {
      return {
        showmap: false,
        showDatetime: false,
        agreeAgreement: true,
        currentItem: {},     //是调用select的时候，进行存储的当前选择的目标对象
        pickertitle: '',
        pickerShow: false,
        pictures: {
          upImg: [],
          imgUrlList: []
        },
        radioConfig: {
          value: 0,
          label: '选择区域',
          radios: [
            "本地",
            "全国"
          ]
        },
        dateTime: {
          type: "date",
          currentDate: new Date(),
          minDate: new Date(),
        },
        releaseName: "立即发布",
        feature: {     //特色标签
          labels: [],
          labelsDefault: [],
        },
        columns: [],
        picker: [],
        tips: {
          input: '请输入',
          select: '请选择'
        },
        pickerCell: [
          {label: '房源装修', desc: '', field: 'renovation'},
          {label: '房源朝向', desc: '', field: 'orientation', hide: this.$route.query.type == 'unused'},
          // {label: '房源类型', desc: '',field:''},
          // {label: '房源电梯', desc: '',field:''},
        ],
        pickerData: {
          shops: [
            {
              name: '性质',
              field: 'rent',
              desc: '请选择',
            },
            {
              name: '经营类型',
              desc: '请选择',
              field: 'openTime',
            },
            {
              name: '区域',
              desc: '请选择',
              field: 'rentType',
            }
          ],
          unused: [
            {
              name: '价格',
              field: 'rent',
              desc: '请选择',
            },
            {
              name: '开盘时间',
              desc: '请选择',
              field: 'openTime',
            },
            {
              name: '状态',
              desc: '请选择',
              field: 'rentType',
            }
          ],
          used: [
            {
              name: '价格(万THB起)',
              placeholder: '请输入价格',
              field: 'rent',
              desc: '',
              type: 'input'
            },
            {
              name: '户型',
              desc: '请选择',
              field: 'apartment',
            },
            {
              name: '面积(m²)',
              placeholder: '请输入面积',
              field: 'measure',
              desc: '',
              type: 'input'
            }
          ],
        },
        config: {
          agreement: '协议条款'
        },
        releasePrice: {
          local: 0,
          country: 0,
        },
        params: {
          imgs: [],  //图片
          title: null,    //标题
          rent: null,      //单价
          apartment: null,   //户型
          measure: null,   //面积
          communityName: null,   //小区名称
          area: null,   //地区
          address: null,  //详细地址
          renovation: null,   //房源装修
          floor: null,     //楼层
          orientation: null,     //朝向
          linkMan: null,     //联系人
          linkTel: null,     //联系人电话
          data: null,     //房屋配置
          label: null,     //标签
          body: null,     //描述
          typeId: null,     //分类id
          openTime: null,     //开盘时间
          developer: '',     //开发商
          rentingId: null,     //渲染数据用
          id: null,     //修改时
          lat: null,     //维度
          lng: null,     //经度
          rentType: null,  //状态
          wholeCountry: 1,   //发布区域
        }
      }
    },
    methods: {
      ...mapActions('houingDeal', ['housingDealRelease', "housingDealConfig", "housingDealClssInfo", "housingDealSale"]),
      pickerChoice(item, index) {
        this.currentItem = item;
        this.columns = [];
        switch (item.field) {
          case 'rent':
            this.$route.query.type == 'unused' && (this.columns = ["价格待定", "一房一价"])
            break;
          case 'rentType':
            this.$route.query.type == 'unused' && (this.columns = ["待售", "在售", "停售"])
            break;
          case 'renovation':
            this.columns = ['毛坯', '简单装修', '中等装修', '精装修', '豪华装修'];
            break;
          case 'orientation':
            this.columns = ['东', '南', '西', '北', '南北', '东西', '东南', '西南', '东北', '西北'];
            break;
          case 'apartment':
            this.columns = [
              {
                values: createColumnsData(9)
              }, {
                values: createColumnsData(9, {start: 0})
              }, {
                values: createColumnsData(9, {start: 0})
              }
            ]
            break;
          case 'openTime':
            this.showDatetime = !this.showDatetime;
            return;
        }
        this.columns.length && (this.pickerShow = !this.pickerShow)
        this.pickertitle = item.desc + (item.name || item.label)
      },
      changeImgOne(e) {
        console.log(e, this.pictures)
        this.pictures.upImg = e
      },
      inputForm(item, key) {
        console.log(item, key);
        this.params[item.field] = item.desc;
      },
      pickerConfirm(item) {
        if (this.getType(item) == 'array') {
          this.params[this.currentItem.field] = item.join('-');
          item = item[0] + "室" + item[1] + "厅" + item[2] + "卫";
        } else {
          this.params[this.currentItem.field] = item;
        }
        this.currentItem.desc = item;
        this.pickerShow = !this.pickerShow;

        console.log('item', item);

        // switch (obj.param) {
        //   case 'apartment':
        //     obj.desc = res[0] + "室" + res[1] + "厅" + res[2] + "卫";
        //     this.fillData[obj.param] = data;
        //     break;
        //   case 'deposit':
        //     obj.desc = "押" + this.chnNumChar[res[0]] + "付" + this.chnNumChar[res[1]];
        //     this.fillData[obj.param] = obj.desc;
        //     break;
        //   default:
        //     this.fillData[obj.param] = data;
        // }


      },
      choiceRadio(index) {
        console.log("choiceRadio", index, this.$route.query.rentingId);
        this.params.wholeCountry = (index || 0) + 1;
        let money = this.params.wholeCountry == 1 ? this.releasePrice.local : this.releasePrice.country;
        if (this.$route.query.rentingId) {
          this.releaseName = "重新发布"
        } else if (money > 0) {
          this.releaseName = "需支付￥" + (+money).toFixed(2) + 'THB';
        } else {
          this.releaseName = "立即发布"
        }
      },
      judge() {
        if (!this.agreeAgreement) {
          Toast({
            message: '请同意并遵守用户协议条款',
            duration: 1500
          });
          return false;
        }
        if (!this.pictures.upImg.length) {
          Toast({
            message: '请添加图片',
            duration: 1500
          });
          return false;
        }

        return this.isFailParams({
          field: this.params,
          filter: ['imgs', 'rentingId', 'lat', 'lng', 'id'],
          tips: {
            title: "请输入标题",    //标题
            rent: "房屋价格",      //单价
            apartment: "请选择户型",   //户型
            openTime: "请选择开盘时间",     //开盘时间
            measure: "请输入面积",   //面积
            communityName: "请输入小区名称",   //小区名称
            address: "请输入详细地址",  //详细地址
            renovation: "请选择房源装修情况",   //房源装修
            orientation: "请选择朝向",     //朝向
            linkMan: "请输入联系人",     //联系人
            linkTel: "请输入联系人电话",     //联系人电话
            label: "请选择标签",     //标签
            body: "请进行描述",     //描述
            developer: "请输入开发商",     //开发商
            rentType: "请选择状态",  //状态
          },
          noBack: true
        })
      },
      choiceLabel(arr) {
        let j = {}
        arr.map(v => {
          j[v.id] = v.name
        })
        this.params.label = j;
      },
      /** 开始发布 */
      async beginRelase() {
        let money = +(this.params.wholeCountry == 1 ? this.releasePrice.local : this.releasePrice.country),
          needPay = false;
        if (!this.$route.query.rentingId) {
          if (money > 0) {
            try {
              await showDialog("需要支付￥" + money.toFixed(2) + "THB");
              needPay = true;
            } catch (e) {
              return console.log("老板，我是要生存的，连" + money.toFixed(2) + "元都不给我，我不好办事啊")
            }
          }
        } else {
          this.params.id = this.$route.query.rentingId
        }

        showLoading();
        const res = await this.housingDealRelease(this.params);
        hideLoading();
        if (res) {
          if (needPay) {
            this.$router.push({
              name: 'cashier',
              params: {
                type: 22,
                param: {
                  rentingId: res
                },
                info: {
                  money: money,
                  type: "房屋出售发布",
                  callLink: "/auxiliary/housingDeal"
                }
              }
            });
          } else {
            Toast.success({
              message: '发布成功',
              duration: 1500
            });
            setTimeout(() => {
              this.goPointPage('/auxiliary/housingDeal')
            }, 1500)
          }
        } else {
          Toast.fail({
            message: res.msg,
            duration: 1500
          })
        }
      },
      async releaseBefore() {
        if (!this.judge()) return false;
        if (!isTellPhone(this.params.linkTel)) return Toast.fail({
          message: '请输入正确的手机号',
          duration: 1500
        })
        try {
          showLoading("图片上传中...")
          this.params.imgs = await this.uploadFile({files: this.pictures.upImg});
        } catch (e) {
          console.log('图片上传出现错误');
        }
        this.beginRelase();
        console.log(this.params);
      },
      confirm(value) {
        const desc = format(new Date(value).getTime()).split(" ")[0];
        this.currentItem.desc = desc;
        this.params[this.currentItem.field] = desc;
        this.showDatetime = false;
      },
      //选择地图触发的方法
      choiceAddress(v) {
        console.log('choiceAddress', v)
        this.params.address = `${v.poiaddress}+${v.poiname}`
        this.params.communityName = v.poiname;
        this.params.lat = v.latlng.lat;
        this.params.lng = v.latlng.lng;

        try {
          if (v.poiaddress.indexOf("区") > 0) {
            v.poiaddress = v.poiaddress.split('区')[0] + "区";
          } else if (v.poiaddress.indexOf("县") > 0) {
            v.poiaddress = v.poiaddress.split('县')[0] + "县";
          }
          this.params.area = v.cityname + (v.poiaddress.split('市')[1] && "-" + v.poiaddress.split('市')[1]);
        } catch (e) {
          console.log(e);
        }
      },
    },
    async created() {
      const bool = await this.checkBindTel({callBack: true})
      if (!bool) return this.goPointPage('/auxiliary/housingDeal');
      const query = this.$route.query;
      console.log("query", query)
      this.isFailParams({
        field: [query.type, query.id],
        tips: ['缺少发布类型', '缺少发布类型Id'],
      }, async () => {
        this.params.typeId = query.id;
        this.housingDealConfig(query).then(result => {
          this.config = result;
        });

        this.housingDealClssInfo({typeId: query.id}).then(result => {
          console.log("housingDealClssInfo", result);
          this.feature.labels = result.data.label;
          for (let l in this.params.label) this.feature.labelsDefault.push(this.params.label[l]);
          this.releasePrice.local = result.data.local.release || 0;
          this.releasePrice.country = result.data.country.release || 0;
          this.choiceRadio(0);
        })

        if (this.pickerData[query.type]) {
          this.picker = this.pickerData[query.type];
          let field = [];
          if (query.type == 'unused') {
            field = ["apartment", "measure", 'floor', 'data', 'id', 'rentingId', 'orientation']
          } else if (query.type == 'used') {
            field = ['developer', 'floor', 'openTime', 'data', 'rentingId', 'id', 'rentType']
          }
          this.params = this.delJsonField({
            obj: this.params,
            field
          })
          if (query.rentingId) {
            this.housingDealRelease(query).then(result => {
              console.log("housingDealSale", result);
              for (let p in this.params) this.params[p] = result[p];
              this.pictures.upImg = this.pictures.imgUrlList = (this.params.imgs || []).map(item => {
                return this.getSingleImg(item.url);
              });
              console.log("this.params", this.params);

              this.pickerData.unused.forEach(item => {
                if (item.field == 'openTime') {
                  item.desc = format(this.params[item.field] * 1000).split(" ")[0];
                } else {
                  item.desc = this.params[item.field];
                }
              });

              this.pickerData.used.forEach(item => {

                if (item.field == 'apartment') {
                  try {
                    let arr = this.params[item.field].split("-");
                    item.desc = arr[0] + "室" + arr[1] + "厅" + arr[2] + "卫";
                  } catch (e) {
                    console.log(e);
                  }

                } else {
                  item.desc = this.params[item.field];
                }
              });
              for (let l in this.params.label) this.feature.labelsDefault.push(this.params.label[l]);

              this.pickerCell.forEach(item => {
                item.desc = this.params[item.field];
              })
              this.params.wholeCountry = this.params.wholeCountry || 1
            })
          }

        } else {
          await showDialog("该功能暂未开放");
          this.$router.go(-1)

        }
      })

    }
  }

</script>
