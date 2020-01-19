<template>
  <!--发布-->
  <div>
    <!--<Header/>-->
    <component
      v-for="(com,key) in pageConfig"
      :key="key"
      v-model="params[com.field]"
      :is="com.name"
      class="bg-f"
      :deliver="true"
      :class="com.class"
      v-bind="com.value"
      @click="({name,value})=>handleMethods({name,value,field:com.field},key)"
    />
    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-bind="dateTime"
        @confirm="confirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>
    <!--<picker-radio-->
    <!--title="选择主题色"-->
    <!--v-model="showChoiceColor"-->
    <!--:list="colors"-->
    <!--@confirm="confirmColor"-->
    <!--/>-->
  </div>
</template>

<script>
  import AgreeAgreement from '@/components/template/agree-agreement'
  import PhotoHeader from '@/components/template/mall/release-photo/photo-header'
  import DdFormInput from "@/components/template/dd-form/input"
  import DdFormInputTwo from "@/components/template/dd-form/input-two"
  import DdFormSwitch from "@/components/template/dd-form/switch"
  import DdFormTitle from "@/components/template/dd-form/title"
  import DdFormDetailBody from "@/components/template/dd-form/details-body"
  import DdFormPicker from "@/components/template/dd-form/picker"
  import DdFormCellRadio from "@/components/template/dd-form/cell-radio"
  import PickerColumn from "@/components/template/picker/column"
  import PickerRadio from "@/components/template/picker/radio-picker"
  import DdButton from "@/components/template/button"
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";

  import {mapActions, mapState} from 'vuex'
  import {Toast} from 'vant'
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {
      DdFormPicker,
      DdButton,
      PhotoHeader,
      DdFormInput,
      PickerColumn,
      DdFormInputTwo,
      DdFormSwitch,
      DdFormTitle,
      DdFormDetailBody,
      AgreeAgreement,
      PickerRadio,
      DdFormCellRadio
    },
    data() {
      return {
        showChoiceColor: false,
        showDatetime: false,
        dateTime: {
          type: "datetime",
          currentDate: new Date(),
          minDate: new Date(),
        },
        choiceItem: {},
        pageConfig: [
          {
            name: 'Header',
            value: {},
          },
          {
            name: 'photo-header',
            value: {
              max: 3,
              photoList: [],
              title: "上传商品主图，最多上传3张，建议尺寸：750*750px"
            }
          },
          {
            name: 'dd-form-input',
            field: 'title',
            value: {
              label: "砍价标题",
              placeholder: "请输入砍价标题",
              brb: true
            }
          }, {
            name: 'dd-form-input',
            'class': 'mar-b',
            field: 'type',
            value: {
              label: "商品分类",
              type: "select",
              'class': "mar-b",
              text: '请选择'
            }
          }, {
            name: 'picker-column',
            value: {
              list: [
                {
                  name: '砍价开始时间',
                  desc: '请选择',
                  field: 'startTime',
                },
                {
                  name: '砍价结束时间',
                  desc: '请选择',
                  field: 'endTime',
                }
              ]
            }
          }, {
            name: 'picker-column',
            'class': 'mar-b',
            value: {
              list: [
                {
                  name: '消费截止时间',
                  desc: '请选择',
                  field: 'useTime',
                }
              ]
            }
          }, {
            name: 'dd-form-input-two',
            field: 'price',
            value: {
              before: "商品原价：",
              placeholder: "请填写商品原价",
              type: 'number',
              after: "元",
              br: true
            }
          }, {
            name: 'dd-form-input-two',
            field: 'floorPrice',
            value: {
              before: "商品底价：",
              type: 'number',
              placeholder: "请填写商品底价",
              after: "元",
              br: true
            }
          }, {
            name: 'dd-form-input-two',
            field: 'stock',
            value: {
              before: "商品库存：",
              type: 'number',
              placeholder: "请填写商品库存",
              after: "份",
              br: true
            }
          }, {
            name: 'dd-form-switch',
            field: "isFloorBoolean",
            'class': 'br-b-d',
            value: {
              lable: "未到底价购买",
            }
          },
          {
            name: 'dd-form-cell-radio',
            field: "delivery",
            value: {
              label: "配送方式：",
              radios: [
                '快递配送',
                '门店自取'
              ]
            }
          },
          {
            name: 'dd-form-title',
            'class': 'bg-f4-i',
            value: {
              title: "高级设置",
            }
          }, {
            name: 'dd-form-input-two',
            field: 'reduceNum',
            value: {
              before: "减价次数：",
              placeholder: "请填写减价次数",
              type: 'number',
              after: "次",
              br: true
            }
          }, {
            name: 'dd-form-input-two',
            field: 'top',
            value: {
              before: "减价上限：",
              placeholder: "请填写每次减价上限",
              type: 'number',
              after: "元",
              br: true
            }
          }, {
            name: 'dd-form-input-two',
            field: 'down',
            value: {
              before: "减价下限：",
              placeholder: "请填写每次减价最小值",
              type: 'number',
              after: "元",
            }
          }, {
            name: 'dd-form-detail-body',
            'class': 'bg-f4-i',
            field: 'body',
            value: {
              title: "减价详情",
              placeholder: '填写减价详情'
            }
          }, {
            name: 'dd-form-title',
            'class': 'bg-f4-i',
            value: {
              title: "其他设置",
            }
          }, {
            name: 'dd-form-input-two',
            field: 'music',
            value: {
              before: "背景音乐：",
              placeholder: "请输入音乐地址",
              br: true,
              com: {
                is: 'dd-music',
              }
            }
          },
          // {
          //   name: 'dd-form-input-two',
          //   field: 'video',
          //   value: {
          //     before: "添加视频：",
          //     placeholder: "请输入视频地址",
          //     br: true,
          //     com: {
          //       is: 'dd-video',
          //     }
          //   }
          // },
          {
            name: 'dd-form-input-two',
            field: 'color',
            value: {
              before: "主题颜色：",
              placeholder: "请选择主题颜色",
              rightIcon: true,

            }
          }, {
            name: 'agree-agreement',
            field: 'agreeAgreement',
            'class': 'bg-f4-i',
            value: {
              con: "发布协议",
              name: "用户协议条款"
            }
          }, {
            name: 'dd-button',
            'class': "mar-30",
            value: {
              type: "release"
            }
          }, {
            name: 'dd-form-picker',
            field: 'showPicker',
            value: {
              columns: [],
              title: '请开始选择'
            }
          }, {
            name: 'picker-radio',
            field: 'showChoiceColor',
            value: {
              title: '请选择颜色',
              list: [
                {name: '绿色', style: {color: '#01c07b'}},
                {name: '香槟', style: {color: '#ad5062'}},
                {name: '荔枝红', style: {color: '#e94158'}},
                {name: '经典蓝', style: {color: '#4f7bb8'}},
                {name: '青涩', style: {color: '#397470'}},
                {name: '涩青', style: {color: '#1e606c'}},
                {name: '青灰', style: {color: '#00c2c4'}},
                {name: '古铜', style: {color: '#786715'}},
                {name: '红酒', style: {color: '#711b1a'}},
                {name: '葡萄紫', style: {color: '#501e7d'}},
              ]
            }
          }
        ],
        tips: {
          choice: '请选择',
          input: '请输入',
        },
        pictures: {
          imgUrlList: [],
          upImg: [],
          imgUrlListTwo: [],
          upImgTwo: [],
        },
        params: {
          title: '',//标题
          logo: [],//图标
          startTime: '',//开始时间
          endTime: '',//结束时间
          useTime: '',//核销截止时间
          price: '',//原价
          floorPrice: '',//底价
          stock: '',//库存
          isFloorBoolean: false,//是否底价购买 1是2否
          isFloor: 2,
          reduceNum: '',//可减次数
          top: '',//砍价上限
          down: '',//砍价下限
          storeId: '',//商家id
          body: '',//详情
          title: '',//标题
          media: [],//详情图片
          typePid: '',   //商品分类一级
          id: '',    //商品分类二级
          delivery: 0,
          agreeAgreement: true,
          showPicker: false,
          music: '',
          video: '',
          color: '',
          showChoiceColor: false,
        },
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/releaseGood", ['getDeliverSet']),
      ...mapActions("shop", ["getShopInfoByParams"]),
      ...mapActions("storeAuxiliary/storeAssemble", ["getGoodsCategory"]),
      ...mapActions("storeAuxiliary/storeBargain", ["releaseBargain", "getBargainCategory", "bargainConfig"]),
      confirm(value) {
        try {
          this.choiceItem.field && (this.params[this.choiceItem.field] = new Date(value).getTime() / 1000);

          this.pageConfig[this.choiceItem.index].value[this.choiceItem.point][this.choiceItem.key].desc = format(this.params[this.choiceItem.field] * 1000);

        } catch (e) {
          console.log(e);
        }
        this.showDatetime = false;
      },
      changeImgOne(e) {
        this.pictures.upImg = e
      },
      pickerChoice(e) {
        console.log(e)
      },
      selectType(e) {
        console.log(e)
      },
      async release() {
        console.log('开始发布')
        if (!this.judge()) return;
        showLoading("图片上传中....")
        let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImg}), this.uploadFile({files: this.pictures.upImgTwo})]);
        showLoading("正在发布中...")
        this.params.logo = imgData[0];
        this.params.media = imgData[1];
        this.params.isFloor = this.params.isFloorBoolean ? 1 : 2;
        const res = await this.releaseBargain(this.params);
        hideLoading();
        console.log("releaseBargain", res)
        showHandleStatusByFlag(res.code, '发布成功', res.msg);
        if (res.code) setTimeout(() => {
          return this.$router.go(-1);
        }, 1500)
      },
      judge() {
        return this.isFailParams({
          field: this.params,
          filter: ['showPicker', 'id', 'music', 'video', 'isFloor', 'isFloorBoolean', 'showChoiceColor', 'delivery', 'floorPrice'],
          number: ['price', 'stock', 'reduceNum', 'top', 'down'],
          math: [
            {
              fields: ['startTime', 'endTime'],
              tips: '结束时间不能小于等于开始时间'
            }, {
              fields: ['endTime', 'useTime'],
              tips: '核销时间不能小于等于结束时间'
            }, {
              fields: ['down', 'top', true],
              tips: '砍价上限不能低于砍价下限'
            }
          ],
          tips: {
            title: '请输入标题',
            logo: '请添加主图',
            startTime: '请选择开始时间',
            endTime: '请选择结束时间',
            useTime: '请选择核销截止时间',
            price: '请输入原价',//
            floorPrice: '请输入底价',//
            stock: '请输入库存',//
            isFloor: false,//是否底价购买 1是2否
            reduceNum: '请输入可减次数',//
            top: '请输入砍价上限',//
            down: '请输入砍价下限',//
            storeId: '您还不是商家',//商家id
            body: '请输入详情',//
            media: '请添加详情图片',//详情图片
            typePid: '请选择商品分类',   //商品分类一级
            id: '',    //商品分类二级
            agreeAgreement: '请同意并遵守发布协议条款',
            showPicker: false,
            color: '请选择背景颜色'
          },
          noBack: true
        })
      },
      async handleMethods(e, k) {
        console.log(e);
        switch (e.name) {
          case 'input':
            if (e.field == 'music') {
              console.log('选择背景音乐');
            } else if (e.field == 'color') {
              console.log('选择主题色');
              this.params.showChoiceColor = !this.params.showChoiceColor;

            } else {
              console.log('商品分类');
              const columns = await this.getCategoty();
              console.log(columns)
              this.pageConfig.forEach(async item => {
                if (item.name == 'dd-form-picker') {
                  item.value.columns = columns;
                  this.choiceItem = {
                    ...e,
                    index: k,
                  }
                }
              })
              this.params.showPicker = true;
              console.log("this.params.showPicker", this.params.showPicker)
            }
            break;
          case 'select':
            if (e.value.key == 0) {
              console.log('开始选择开始时间')
            } else if (e.value.key == 1) {
              console.log('开始选择结束时间')
            }
            this.choiceItem = {
              field: e.value.item.field,
              item: e.value.item,
              point: 'list',
              key: e.value.key,
              index: k,
            }
            this.showDatetime = true;
            break;
          case 'switch':
            console.log('是否开始未到底价购买')
            break;
          case "photoHeader":
            console.log('主图的选择结果', e.value.photos);
            this.params.logo = this.pictures.upImg = e.value.photos;
            break;
          case "photoBody":
            console.log('详情图的选择结果', e.value.photos);
            this.params.media = this.pictures.upImgTwo = e.value.photos;
            break;
          case 'button':
            console.log("this.params", this.params)
            this.release();
            break;
          case "picker":
            console.log("picker", e, this.choiceItem);
            this.pageConfig[this.choiceItem.index].value.text = e.value.name;
            this.params.typePid = e.value.id;
            break;
          case 'radio-picker':
            this.params.color = e.value.style.color;
            console.log(e, this.params.color);
            break;
          case "dd-form-radio":
            console.log("e.value.value", e.value.value)
            if (e.value.value == 1 && !this.selfMentionList) {
              const res = await this.getDeliverSet({
                storeId: this.params.storeId
              });
              this.selfMentionList = res;
              if (!res.length) {
                try {
                  await showDialog("您还没有添加自提点,无法发布，是否现在就去添加？");
                  this.goPointPage("/storeAuxiliary/storeGood/storeManageGood")
                } catch (e) {
                  this.params.delivery = 1;
                  return console.log(e);
                }
              }
            }
            this.params.delivery = e.value.value + 1;

            break;
        }
      },
      async getCategoty() {
        const result = await this.getBargainCategory()

        return result;
      },
    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    async created() {
      this.params.storeId = this.storeId
      const query = this.$route.query;

      this.bargainConfig().then(result => {
        console.log("bargainConfig", result);
        let obj = _.find(this.pageConfig, {
          name: 'agree-agreement'
        })

        obj.value.con = result.agreement

      });

      if (query.bargainId) {

        // 防止链接有id
        delete query.id;
        const {code, data, msg} = await this.releaseBargain(query);
        if (code) {
          for (let k in this.params) {

            if (k == 'delivery') {
              this.params[k] = data[k] - 1;
            } else if (k == 'isFloor') {
              this.params.isFloorBoolean = this.params[k] == 1;
            } else {
              data[k] && (this.params[k] = data[k]);
            }
          }
          this.pageConfig.forEach((item, key) => {
            console.log(item.name)

            switch (item.name) {
              case 'picker-column':
                item.value.list.forEach(item => {
                  item.desc = format(this.params[item.field] * 1000)
                })
                break;
              case 'dd-form-input':
                item.value.type == 'select' && this.getCategoty().then(result => {
                  console.log(result, _.find(result, {
                    id: this.params.typePid
                  }).name)
                  item.value.text = _.find(result, {
                    id: this.params.typePid
                  }).name
                });
                break;
              case 'dd-form-detail-body':

                this.pictures.upImgTwo = item.value.pictures = this.params.media.map(item => {
                  return this.getSingleImg(item.url);
                })

                break;
              case 'photo-header':
                this.pictures.upImg = item.value.photoList = this.params.logo.map(item => {
                  return this.getSingleImg(item.url);
                })
                break;
            }
          })
          this.params.agreeAgreement = true;
          this.params.id = query.bargainId;
          console.log("this.params", this.params)
        } else {
          Toast.fail({
            message: msg,
            duration: 1500
          })
        }
      }

    }
  }

</script>
