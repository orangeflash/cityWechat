<template>
  <div id="ManageGood">
    <div class="head-title"></div>
    <van-cell-group>
      <van-field
        v-model="fillData.linkName"
        clearable
        label="联系人"
        placeholder="请输入联系人"
      >
      </van-field>
      <van-field
        type="number"
        v-model="fillData.linkTel"
        clearable
        label="电话号码"
        placeholder="请输入电话号码"
      >
      </van-field>
      <van-field
        clearable
        label="选择位置"
        placeholder="请选择"
        v-model="fillData.address"
        @click="showmap=true"
        :readonly=true
      >
        <i slot="button" class="iconfont icon-youjiantou1"></i>
      </van-field>
      <van-field
        v-model="fillData.detailedAddress"
        clearable
        label="详细地址"
        placeholder="请输入详细地址"
      >
      </van-field>
      <!--<van-cell title="设为默认">-->
      <!--<van-switch-->
      <!--slot="right-icon"-->
      <!--size="24px"-->
      <!--v-model="fillData.default"-->
      <!--:active-color="$themeColor"-->
      <!--inactive-color="#d5d5d5"-->
      <!--/>-->
      <!--</van-cell>-->
    </van-cell-group>
    <div class="foot-mar-btn">
      <button @click="confirm">保 存</button>
    </div>
    <dd-map @hide="showmap = !showmap" :show-map="showmap" @confirm="choiceAddress"></dd-map>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import DdMap from "../../../components/template/dd-map"
  import {hideLoading, isTellPhone, showHandleStatusByFlag, showLoading, showText} from "../../../util";

  export default {
    name: "ManageGood",
    props: ["checked"],
    components: {
      DdMap
    },
    data() {
      return {
        showmap: false,
        fillData: {
          linkName: '',
          linkTel: '',
          address: '',
          detailedAddress: '',
          lat: '',
          lng: '',
        },
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/releaseGood", ["postBusinessSet", "postSaveAddress", "getAddressInfo"]),
      choiceAddress(v) {
        console.log(v)
        this.fillData.address = v.poiaddress
        this.fillData.detailedAddress = v.poiname
        this.fillData = Object.assign(this.fillData, v.latlng)
      },
      judgeData() {
        this.fillData.storeId = this.storeId;
        const data = this.fillData;
        let res = {}, msg = '';
        if (!data.storeId) msg = "缺少商家id";
        else if (!data.linkName) msg = '请输入联系人';
        else if (data.linkTel.length < 8) msg = '请输入正确的联系电话';
        else if (!data.address) msg = '请选择地址';
        else if (!data.detailedAddress) msg = '请输入详细地址';
        if (!msg) {
          res.status = true
        }
        res.msg = msg;
        return res;
      },
      async confirm() {
        const result = this.judgeData()
        if (result.status) {
          let result = await this.postSaveAddress({
            ...this.fillData,
          });
          if (result.code) {
            // hideLoading();
            showHandleStatusByFlag([true, '提交成功'])
            setTimeout(() => {
              this.$router.go(-1)
            }, 1000)
          } else {
            showText(result.msg, 2000, true);
          }
          console.log('data', this.fillData)
        } else {
          showHandleStatusByFlag([false, result.msg])
        }
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    async created() {
      if (this.$route.query.id) {
        showLoading('填充数据中...')
        this.isEdit = true
        const result = await this.getAddressInfo({
          addressId: this.$route.query.id
        })
        this.fillData = result
        hideLoading()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #ManageGood {
    font-size: $font-size-base;

    .zt-address {
      background: #fff;
      padding: 30px;
      margin-bottom: 30px;
      display: flex;

      .ad-lt {
        flex: 1;

        .top {
          span:nth-child(1) {
            font-size: $font-size-xll;
            color: #333;
            margin-right: 20px;
          }

          span:nth-child(2) {
            color: $themeColor;
            margin-right: 20px;
          }
        }

        .ft {
          margin-top: 30px;
          color: #999;
        }
      }

      .ad-rt {
        width: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .iconfont {
          color: #999;
          font-size: 35px;
        }
      }
    }

    .foot-mar-btn {
      position: relative;
      margin-top: 50px;
    }
  }
</style>
