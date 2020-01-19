<template>
  <div id="releasexx">
    <Header></Header>
    <van-cell-group class="">
      <van-field
        clearable
        v-model="params.realName"
        label="姓名"
        placeholder="请填写姓名"
      >
      </van-field>
      <van-field
        clearable
        v-model="params.typeName"
        label="经营范围"
        placeholder="请填写经营范围"
      >
      </van-field>
      <van-field
        clearable
        v-model="params.identity"
        label="身份"
        placeholder="请填写身份"
      >
      </van-field>
      <van-field
        clearable
        v-model="params.deliveryMode"
        label="发货方式"
        placeholder="请填写发货方式"
      >
      </van-field>
      <van-field
        clearable
        v-model="params.sign"
        label="诚信签名"
        placeholder="对客户想表达的一句话"
      >
      </van-field>
    </van-cell-group>
    <van-popup
      position="bottom"
      v-model="pickerShow">
      <van-picker
        show-toolbar
        value-key="name"
        :title="pickerTitle"
        :columns="columns"
        @confirm="pickerConfirm"
        @cancel="pickerShow = !pickerShow"
      />
    </van-popup>
    <ul class="info-form">
      <li class="info-form__item">
        <InputCell
          label="经营地址"
          v-model="params.address"
          :readonly="false"
          icon="icon-youjiantou1"
          :show-arrow="true"
          @click-row="showMap"
        />
      </li>
    </ul>
    <photo-body
      title="实力图片"
      @change-img="changeImgTwo"
      :max="3"
      :photo-list="pictures.imgUrlListTwo"
    ></photo-body>
    <footer class="submit__container">
      <button
        class="feature-btn"
        @click="release"
      >立即修改
      </button>
    </footer>
    <DdMap @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress"></DdMap>
  </div>
</template>

<script>
  import Header from "@/components/header";
  import InputCell from "../../../components/publication/input-cell";
  import DdMap from "@/components/template/dd-map"
  import PhotoBody from '../../../components/template/mall/release-photo/photo-body'
  import AgreeAgreement from '@/components/template/agree-agreement'
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  import {mapActions,mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {Toast} from 'vant'
  import {chooseWXPay, getLocation, registerByRequestConfig, waitWxReady} from "../../../util/wechat-util";
  export default {
    name: "releasexx",
    mixins: [utilMixins],
    components: {
      Header,
      InputCell,
      DdMap,
      PhotoBody,
      AgreeAgreement,
    },
    data() {
      return {
        pickerShow: false,
        pickerTitle: '标题',
        columns: [],
        // columnsData: {
        //   productName: [],
        // },
        params: {
          realName:'',
          identity:'',
          deliveryMode:'',
          typeName:'',
          sign:'',
          media:'',
          address:'',
        },
        // productName:'',
        showmap: false,
        showMapDialog: false,
        agreeAgreement: true,
        pictures: {
          // imgUrlList: [],
          // upImg: [],
          imgUrlListTwo: [],
          upImgTwo: [],
        },
        postId: null,     // 发布成功后，会返回一个信息id
      };
    },
    methods: {
      ...mapActions('Xx',['getXxtype','editXx','seeXx',]),
      ...mapActions("common", ["getLocationByLatLng"]),
      pickerChoice(item, index) {
        console.log(item,index)
        this.pickerField=item.field
        this.pickerIndex=index
        switch (item.field) {
          case 'typeName':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
          case 'realName':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
          case 'identity':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
          case 'deliveryMode':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
          case 'sign':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
        }
      },
      pickerConfirm(value) {
        this.showDatetime = false;
        this.pickerShow = false;
        // let desc='',format = 'YYYY-MM-DD HH:mm';
        console.log(this.pickerField,this.pickerIndex)
        switch (this.pickerField) {
          case 'realName':
            this.params[this.pickerField] = value;
            break;
          case 'typeName':
            this.params[this.pickerField] = value;
            break;
          case 'identity':
            this.params[this.pickerField] = value;
            break;
          case 'deliveryMode':
            this.params[this.pickerField] = value;
            break;
          case 'sign':
            this.params[this.pickerField] = value;
            break;
        }
        console.log(value,this.params)
      },
      showMap() {
        this.showmap = true;
      },
      choiceAddress(v) {
        console.log(v,v.poiaddress + '-' + v.poiname,v.poiaddress)
        this.latLng = {latitude: v.latlng.lat, longitude: v.latlng.lng}
        this.params.address = v.poiaddress + '-' + v.poiname
        this.params.lat = this.latLng.latitude
        this.params.lng = this.latLng.longitude
        this.params.area = v.poiaddress
      },
      changeImgTwo(e) {
        this.pictures.upImgTwo = e
      },
      judge() {
        if (!this.pictures.upImgTwo.length) {
          showHandleStatusByFlag([false,'上传实力图片'])
          return false;
        }
        return this.isFailParams({
          field: this.params,
          filter: ['id','typeId', 'media'],
          tips: {
            realName: "请输入姓名",
            typeName: "请输入经营范围",
            identity: "请输入身份",
            deliveryMode: "请输入发货方式",
            address:'请选择交货地',
            sign:'请输入诚信签名',
          },
          noBack: true
        })
      },
      async release() {
        if (!this.judge()) return;
        showLoading('图片上传中');
        let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImgTwo})])
        this.params.media = imgData[0];
        console.log('params',this.params,this.params.media,imgData[0])
        showLoading('发布中')
        let result = await this.editXx({
          ...this.params,
        })
        //return
        console.log(+result.code)
        if (+result.code == '1') {
          Toast.success({
            message: '保存成功',
            duration: 1500
          })
          setTimeout(() => {
            this.goPointPage('/auxiliary/xx/wd');
          }, 1500)
        } else {
          Toast.fail({
            message: '保存失败',
            duration: 1500
          })
        }
      },
      async initLocation() {
        try {
          showLoading("定位中", "提示", false);
          const {latitude, longitude} = await getLocation();
          this.latLng = {
            latitude,
            longitude
          };
          this.params.lat = this.latLng.latitude
          this.params.lng = this.latLng.longitude
          this.params.address = (await this.getLocationByLatLng({
            latitude,
            longitude
          })).address;
          this.params.area = (await this.getLocationByLatLng({
            latitude,
            longitude
          })).address
          hideLoading();
        } catch (e) {
          console.log(
            "%c 是不是没有配置白名单的原因啊？？？",
            "color:blue;font-size:18px"
          );
          Toast("定位失败");
        }
      },
    }
    ,
    computed: {

    },
    async created() {
      window.wxReady(() => {
        this.initLocation();
      });
      //console.log('编辑的时候渲染',this.$route.query,this.$route.query.postId)
        console.log('用户需要编辑')
        showLoading()
        const res = await this.seeXx()
        for (let k in this.params) this.params[k] = res[k]
        console.log('params',res)
       this.pictures.upImgTwo = this.pictures.imgUrlListTwo = this.params.media.map(item => this.getSingleImg(item.url));
       //  this.productName=_.find(this.columnsData.productName,['id',res.typeId])
        this.params.address = res.address
        hideLoading()
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/common";
  .van-cell__title {
    max-width: 180px;
  }

  .dd-radio__body {
    width: calc(100% - 180px);
    justify-content: space-around;
  }
  .info-form {
    background: #fff;
    padding: 0 31px;

    >>>#InputCell .input-bar__label{ color: #323233;}

    &__item:not(:last-child) {
      border-bottom: 1.1px solid #eee;
    }
    >>> #InputCell .input-bar__input{
      margin-left: 0;
    }
    >>> #InputCell .arrow{
      font-size: 0.3rem;
      color: #A69799;
      margin-left: 0;
      padding: 0;
    }
    .input-bar__label{
      color: #323233;
      font-size: 16px;
    }
  }
  .submit__container {
    @include flex-center;
    background-color: #fff;
    padding: 37px 30px;

    .feature-btn {
      flex: 1;
      height: 90px;
      background-color: $themeColor;
      border-radius: 8px;
      @include flex-center;
      font-size: 34px;
      color: rgba(255, 255, 255, 1);

      &:disabled {
        background-color: #ccc;
      }
    }
  }

</style>
