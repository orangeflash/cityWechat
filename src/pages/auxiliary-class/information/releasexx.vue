<template>
  <div id="releasexx">
    <Header></Header>
    <div class="dd-radio van-cell">
      <label class="van-cell__title"><span>发布类型</span></label>
      <van-radio-group v-model="params.buyType" style="display:flex" class="dd-radio__body">
        <van-radio name="1" :checked-color="$themeColor"  @click="params.buyType = '1'">买</van-radio>
        <van-radio name="2" :checked-color="$themeColor" @click="params.buyType = '2'">卖</van-radio>
      </van-radio-group>
    </div>
    <van-cell-group class="">
      <van-field
        clearable
        label="品名"
        placeholder="请选择"
        v-model="productName&&productName.name"
        :readonly=true
        :disabled=disabledfl
        @click="pickerChoice({field:'productName',name:'品名'})">
        <i slot="button" class="iconfont icon-youjiantou1"></i>
      </van-field>
      <van-field
        clearable
        v-model="params.brand"
        label="品牌"
        placeholder="请填写品牌"
      >
      </van-field>
      <van-field
        clearable
        v-model="params.spec"
        label="规格"
        placeholder="请填写规格"
      >
      </van-field>
      <van-field
        clearable
        label="单位"
        placeholder="请选择"
        v-model="unit&&unit.name"
        :readonly=true
        @click="pickerChoice({field:'unit',name:'单价'})">
        <i slot="button" class="iconfont icon-youjiantou1"></i>
      </van-field>
      <van-field
        clearable
        v-model="params.number"
        label="数量"
        type="number"
        placeholder="请填写数量"
      >
        <div slot="button" >{{unit.name}}</div>
      </van-field>
      <van-field
        clearable
        v-model="params.price"
        label="单价"
        type="number"
        placeholder="请填写单价"
      >
        <div slot="button" >元/{{unit.name}}</div>
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
          label="交货地"
          v-model="params.address"
          :readonly="false"
          icon="icon-youjiantou1"
          :show-arrow="true"
          @click-row="showMap"
        />
      </li>
    </ul>
    <photo-body
      title="上传图片"
      @change-img="changeImgTwo"
      :max="3"
      :photo-list="pictures.imgUrlListTwo"
    ></photo-body>
    <!--<AgreeAgreement-->
      <!--:status="agreeAgreement"-->
      <!--@choice="agreeAgreement = !agreeAgreement"-->
      <!--:con="config.goodsBody"-->
      <!--name="用户协议条款"-->
    <!--&gt;</AgreeAgreement>-->
    <footer class="submit__container">
      <button
        class="feature-btn"
        @click="release"
      >{{releaseMoney>0?'需支付'+(+releaseMoney).toFixed(2)+"元":'立即发布'}}
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
        columnsData: {
          productName: [],
          unit: [{name:'吨',type:'1'}, {name:'公斤',type:'2'}, {name:'斤',type:'3'}, {name:'升',type:'4'},{name:'台',type:'5'},],
        },
        params: {
          id:'',
          brand:'',
          spec:'',
          number:'',
          price:'',
          media:'',
          buyType:'', //发布类型
          address:'',
        },
        unit:'',
        productName:'',
        showmap: false,
        showMapDialog: false,
        agreeAgreement: true,
        pictures: {
          // imgUrlList: [],
          // upImg: [],
          imgUrlListTwo: [],
          upImgTwo: [],
        },
        releaseMoney: 0,   //发布金额  默认0
        postId: null,     // 发布成功后，会返回一个信息id
        disabledfl:false,
      };
    },
    methods: {
      ...mapActions('Xx',['getXxtype','saveXx',]),
      ...mapActions("common", ["getLocationByLatLng"]),
      pickerChoice(item, index) {
        console.log(item,index)
        this.pickerField=item.field
        this.pickerIndex=index
        switch (item.field) {
          case 'productName':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
          case 'brand':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
          case 'spec':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
          case 'number':
            this.columns = this.columnsData[item.field];
            this.pickerShow = !this.pickerShow;
            this.pickerTitle = item.name;
            break
          case 'unit':
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
          case 'productName':
            this[this.pickerField] = value;
            console.log('111',value.data,this.pickerField)
             this.releaseMoney = value.data.publishMoney
            break;
          case 'brand':
            this.params[this.pickerField] = value;
            break;
          case 'spec':
            this.params[this.pickerField] = value;
            break;
          case 'number':
            this.params[this.pickerField] = value;
            break;
          case 'unit':
            this[this.pickerField] = value;
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
        if (!this.productName.name) {
          showHandleStatusByFlag([false,'请选择品名'])
          return false;
        }
        else if (!this.unit.name) {
          showHandleStatusByFlag([false, '请选择单位'])
          return false;
        }
        else if (!this.pictures.upImgTwo.length) {
          showHandleStatusByFlag([false,'上传详情图片'])
          return false;
        }
        return this.isFailParams({
          field: this.params,
          filter: ['id','typeId', 'media'],
          tips: {
            buyType:'请选择发布类型',
            brand: "请输入品牌",
            spec: "请输入规格",
            number: "请输入数量",
            price: "请输入单价",
             address:'请选择交货地',
          },
          noBack: true
        })
      },
      async release() {
        if (!this.judge()) return;
        if(this.productName.name){
          this.params.typeId = this.productName.id
        }
        if(this.unit.name){
          this.params.unit = this.unit.name
        }
        // if (!this.agreeAgreement) return Toast({
        //   message: '请同意并遵守用户协议条款',
        //   duration: 1000
        // });
        showLoading('图片上传中');
        let imgData = await Promise.all([this.uploadFile({files: this.pictures.upImgTwo})])
        // this.params.showImgs = imgData[0];
         this.params.media = imgData[0];
        // this.params.delivery=this.params.delivery.type;
         console.log('params',this.params,this.params.media,imgData[0])
        //return
        showLoading('发布中')
        let result = await this.saveXx({
          ...this.params,
           id: this.$route.query.postId?this.$route.query.postId:''
        })
        //return
        if (typeof +result.data == 'number') {
          this.postId = +result.data;
          if (this.releaseMoney > 0 && !this.$route.query.postId) {
            this.releaseMoney = (+this.releaseMoney).toFixed(2);
            try {
              await showDialog("需要支付：" + this.releaseMoney + " 元");
              this.$router.push({
                name: 'cashier',
                params: {
                  type: 44,
                  param: {
                    postId: this.postId,
                  },
                  info: {
                    money: this.releaseMoney,
                    type: "发布信息",
                    callLink: "/auxiliary/xx/wd"
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
              this.goPointPage('/auxiliary/xx/wd');
            }, 1500)
          }
        } else {
          Toast.fail({
            message: '发布失败',
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
      await this.getXxtype().then(res => {
        console.log('分类',res)
        this.columnsData.productName = res
      })
      console.log('编辑的时候渲染',this.$route.query,this.$route.query.postId)
      let query = this.$route.query;
      if (query.postId) {
        this.disabledfl = true
        console.log('用户需要编辑')
        showLoading()
        const result = await this.saveXx({
          postId: query.postId
        });
        for (let k in this.params) this.params[k] = result.data[k]
        console.log('params',result.data)
        this.pictures.upImgTwo = this.pictures.imgUrlListTwo = this.params.media.map(item => this.getSingleImg(item.url));
        this.productName=_.find(this.columnsData.productName,['id',result.data.typeId])
        this.unit=_.find(this.columnsData.unit,['name',result.data.unit])
        this.params.address = result.data.address
        // this.params.id = result.data.id
        hideLoading()
        console.log(this.params)
      }
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
