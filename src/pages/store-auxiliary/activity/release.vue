<template>

  <div class="activity-release">
    <Header></Header>
    <photo-header :max="3" @change-img="changeImgOne" :photo-list="pictures.imgUrlList"
                  title="上传活动海报，最多可上传3张"></photo-header>
    <dd-form-input
      v-model="params.name"
      label="活动主题"
      placeholder="请输入活动主题"
      :brb="true"
    ></dd-form-input>
    <dd-form-input
      :value="params.type || tips.choice"
      field="type"
      label="活动类型"
      type="select"
      @select="selectType"
    ></dd-form-input>

    <div class="flex flex-wrap pad-l pad-r bg-f mar-t">
      <dd-form-input
        :value="params.startTime || tips.choice"
        field="startTime"
        label="活动开始时间"
        type="select"
        @select="selectType"
        :brb="true"
        :brr="true"
        style="width: 50%;padding: 0.3rem 0 0;"
      ></dd-form-input>
      <dd-form-input
        v-model="params.endTime || tips.choice"
        label="活动结束时间"
        field="endTime"
        type="select"
        @select="selectType"
        :brb="true"

        style="width: 50%;padding: 0.3rem 0 0;"
      ></dd-form-input>
      <dd-form-input
        :value="params.enrollStartTime || tips.choice"
        field="enrollStartTime"
        label="报名开始时间"
        type="select"
        @select="selectType"
        :brr="true"
        style="width: 50%;padding: 0.3rem 0 0"
      ></dd-form-input>
      <dd-form-input
        :value="params.enrollEndTime || tips.choice"
        field="enrollEndTime"
        label="报名截止时间"
        type="select"
        @select="selectType"
        style="width: 50%;padding: 0.3rem 0 0;"
      ></dd-form-input>
    </div>

    <div class="bg-f pad-l">
      <chunk
        title="活动地址"
        :desc="params.poiaddress||tips.choice"
        @iconRight="selectType"
      >
        <van-field slot="content" v-model="params.address" placeholder="请输入详细地址"/>
      </chunk>
    </div>
    <dd-form-chunk title="活动详情" class="mar-b-20">
      <div slot="content">
        <dd-form-textarea class="pad-30 fon-b" v-model="params.detail" height="150"
                          placeholder="填写活动详情"></dd-form-textarea>

        <photo-body v-for="(item,index) in photoBody" :key="index" @change-img="changeImgTwo" :mark="index"
                    title="最多上传6张图片" :max="6" :photo-list="item.imgUrlList||[]"></photo-body>
      </div>
    </dd-form-chunk>

    <dd-form-chunk title="活动须知" class="mar-b-20">
      <div slot="content">
        <dd-form-textarea class="pad-30 fon-b" v-model="params.notice" height="150"
                          placeholder="填写活动须知"/>
      </div>
    </dd-form-chunk>

    <dd-form-cell
      label="活动费用"
    >
      <dd-form-radio
        slot="right"
        :radios="radios"
        v-model="active"
      ></dd-form-radio>
    </dd-form-cell>


    <van-field label="报名原价" v-if="active" type="number" v-model="params.originalPrice" placeholder="请填写报名原价"/>
    <van-field label="报名费用" v-if="active" type="number" v-model="params.currentPrice" placeholder="请填写报名费用"/>
    <van-field label="人数限制" type="number" v-model="params.num" placeholder="请填写人数限制"/>
    <van-field label="每人限购" type="number" v-model="params.limitNum" placeholder="请填写每人每天购买票数限制"/>
    <dd-form-chunk title="报名表单">
      <div slot="content" class="pad-30 mar-b">
        <choice-label
          :labels="labels"
          :labelsDefault="labelsDefault"
          @choice="choiceLabels"
        ></choice-label>
      </div>
    </dd-form-chunk>
    <van-field label="活动音乐" v-model="params.music" placeholder="请填写活动音乐链接">
      <ddMusic slot="right-icon" v-model="params.music"/>
    </van-field>
    <van-field label="活动视频" v-model="params.video" placeholder="请填写活动视频链接">
      <dd-video slot="right-icon" v-model="params.video"/>
    </van-field>

    <van-field label="联系方式" type="number" v-model="params.linkTel" placeholder="请填写主办方联系方式"/>


    <AgreeAgreement
      :status="agreeAgreement"
      @choice="agreeAgreement = !agreeAgreement"
      :con="config.notice"
      name="用户协议条款"
    ></AgreeAgreement>
    <dd-button
      class="mar-30"
      type="release"
      @click="releaseActivity"
    ></dd-button>
    <operation
      :show="showOperation"
      @close="showOperation = !showOperation"
      @choice="actionsOperation"
      :actions="actions"
    ></operation>

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
  import DdFormInput from "@/components/template/dd-form/input"
  import DdFormRadio from "@/components/template/dd-form/radio"
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import DdFormTextarea from "@/components/template/dd-form/textarea"
  import DdFormCell from "@/components/template/dd-form/cell"
  import Chunk from '@/components/template/dd-store/chunk';
  import PhotoBody from '@/components/template/mall/release-photo/photo-body'
  import ChoiceLabel from '@/components/template/choice-label';
  import AgreeAgreement from '@/components/template/agree-agreement'
  import DdButton from "@/components/template/button"
  import Operation from "@/components/template/operation"
  import DdMap from "../../../components/template/dd-map"
  import DdMusic from "../../../components/template/other/music"
  import DdVideo from "../../../components/template/other/video"
  import {Toast} from 'vant';

  import {mapActions, mapState} from 'vuex';
  import {utilMixins} from "../../../plugins/util-mixins";
  import {hideLoading, showDialog, showLoading, format, isTellPhone} from "../../../util";

  export default {
    mixins: [utilMixins],
    components: {
      PhotoHeader,
      DdFormInput,
      Chunk,
      DdFormRadio,
      DdFormChunk,
      PhotoBody,
      DdFormTextarea,
      DdFormCell,
      ChoiceLabel,
      AgreeAgreement,
      DdButton,
      Operation,
      DdMap,
      DdMusic,
      DdVideo
    },
    data() {
      return {
        config: {},  //活动配置信息
        tips: {
          choice: '请选择',
          input: '请输入',
        },
        labels: [],
        labelsDefault: [],
        showmap: false,
        showDatetime: false,
        dateTime: {
          type: "datetime",
          currentDate: new Date(),
          minDate: new Date(),
        },
        showOperation: false,
        agreeAgreement: true,
        pictures: {
          upImg: [],
          imgUrlList: [],
        },
        photoBody: [
          {
            upImg: [],
            imgUrlList: [],
          }
        ],
        radios: [
          {label: '免费', active: true},
          {label: '收费'},
        ],
        active: 0,
        actions: [],
        category: [],
        params: {
          showImgs: [],
          name: '',
          type: '',
          startTime: '',
          endTime: '',
          enrollStartTime: '',
          enrollEndTime: '',
          address: '',
          detail: '',
          detailImgs: [],
          notice: '',
          lat: '',
          lng: '',
          originalPrice: '',//原价
          currentPrice: '',//当前价格
          num: '', //总数量
          limitNum: '',  //限购数量
          info: [],   //
          linkTel: '',
          typeId: '',
          poiaddress: '',
          storeId: null, //发布者的商家id
          music: '',
        },
        field: '',
      }
    },
    methods: {
      ...mapActions("activity", ["getActivityBtns", 'getActivityConfig', 'getActivityEnrollForm', 'activityRelease']),
      ...mapActions("shop", ["getShopInfoByParams"]),
      /** 开始发布活动 */
      async releaseActivity() {
        if (this.judge()) {
          showLoading("图片上传中...");
          let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImg}), this.uploadFile({files: this.photoBody[0].upImg})]);
          this.params.showImgs = imgData[0];
          this.params.detailImgs = imgData[1];

          console.log("this.params.showImgs", this.params.showImgs);
          console.log("this.params.detailImgs", this.params.detailImgs);
          console.log("this.params", this.params);

          showLoading("发布中...");
          const res = await this.activityRelease(this.params);
          hideLoading();
          if (res.code == 1) {
            Toast.success({
              message: '发布成功',
              duration: 1500
            });
            setTimeout(() => {
              // this.goPointPage("/auxiliary/activity");
              this.$router.go(-1)
            }, 1500)
          } else {
            Toast.success({
              message: '发布失败',
              duration: 1500
            })
          }
        }
      },
      /** 详情图 */
      changeImgTwo(e, mark) {
        this.params.detailImgs = this.photoBody[mark].upImg = e;
      },
      //图片变化
      changeImgOne(e) {
        this.params.showImgs = this.pictures.upImg = e;

        console.log(this.params.showImgs);
      },
      choiceLabels(arr) {
        this.params.info = arr.map(item => {
          return item.name
        })
        console.log(this.params.info)
      },
      confirm(value) {
        this.params[this.field] = format(new Date(value).getTime());
        this.showDatetime = false;
      },
      selectType(field, label) {
        console.log("selectType", field);
        let actions = [];
        this.field = field || 'address';
        switch (field) {
          case 'type':
            actions = this.category;
            break;
          case 'startTime':
          case 'endTime':
          case 'enrollStartTime':
          case 'enrollEndTime':
            this.showDatetime = true;
            break;
          default :
            this.showmap = true;
        }

        if (!this.showDatetime && !this.showmap) {
          this.actions = [{
            title: label
          }].concat(actions);
          this.showOperation = !this.showOperation;
        }

      },
      /** 选择地址 */
      choiceAddress(res) {
        this.params.lat = res.latlng.lat;
        this.params.lng = res.latlng.lng;

        this.params.address = res.poiaddress;
        this.params.poiaddress = res.cityname + " " + res.poiname;
      },
      actionsOperation(item) {
        console.log(item);
        this.params[this.field] = item.name;
        console.log(item)
        if (this.field == 'type') this.params.typeId = item.id;
      },
      judge() {
        const p = this.params,
          t = {
            showImgs: "请上传活动海报",
            name: '请输入活动主题',
            type: '请选择活动类型',
            startTime: '请选择活动开始时间',
            endTime: '请选择活动结束时间',
            enrollStartTime: '请选择报名开始时间',
            enrollEndTime: '请选择活动结束时间',
            notice: '请填写活动须知',
            address: '请输入活动地址',
            ...this.active ? {
              originalPrice: '请输入报名原价',
              currentPrice: '请输入报名费用',
            } : (() => {
              this.params.originalPrice = ''
              this.params.currentPrice = ''
            })(),
            num: '请输入总人数',
            limitNum: '请输入限购数量',
            info: '请选择表单信息',
            linkTel: '请填写主办方联系方式',
          }
        for (let k in p) if (t[k] && !this.judgeData(p[k], t[k])) return false;

        const st = new Date(p.startTime).getTime(),
          et = new Date(p.endTime).getTime(),
          est = new Date(p.enrollStartTime).getTime(),
          eet = new Date(p.enrollEndTime).getTime();

        if ((st >= et) && showDialog("活动开始时间不能大于或等于活动结束时间")) return false;

        if ((est >= eet) && showDialog("报名开始时间不能大于或等于报名结束时间")) return false;

        if ((eet >= et) && showDialog("报名截止时间不能大于或等于活动结束时间")) return false;

        if ((!isTellPhone(p.linkTel)) && showDialog("请填写正确的手机号")) return false;

        if (!this.agreeAgreement && showDialog('同意并遵守《用户协议条款》')) return false;

        this.params.notice = this.params.notice.replace(/↵/g, '\r\n');
        return true;

      }

    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    async created() {

      /**  */
      this.params.storeId = this.storeId
      this.getActivityConfig().then(result => {
        console.log('getActivityConfig', result)
        this.config = result || {}
      })


      if (this.$route.query.activityId) {
        const res = await this.activityRelease(this.$route.query);
        this.params.id = this.$route.query.activityId
        console.log("res", res)

        const data = res.data;


        for (let p in this.params) {

          let value = data[p]


          if (['endTime', 'enrollEndTime', 'enrollStartTime', 'startTime'].indexOf(p) >= 0) {
            value = format(value * 1000)
          }

          if (p == 'detailImgs') {
            this.$set(this.photoBody[0], 'imgUrlList', value.map(item => {
              return this.getSingleImg(item.url)
            }))
            this.$set(this.photoBody[0], 'upImg', value.map(item => {
              return this.getSingleImg(item.url)
            }))

          } else if (p == 'showImgs') {
            this.pictures.upImg = this.pictures.imgUrlList = value.map(item => {
              return this.getSingleImg(item.url)
            })
          } else if (p == 'info') {
            this.labelsDefault = value
          } else if (p == 'originalPrice') {
            this.active = 1;
          }


          this.params[p] = value
        }

      }


      this.getActivityBtns().then(result => {
        this.category = result;
      });
      this.getActivityEnrollForm().then(result => {
        this.labels = result.map(item => {
          return {
            name: item
          }
        })
      })
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
</style>
