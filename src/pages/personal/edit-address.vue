<template>
  <div class="edit-address">
    <van-cell-group>
      <van-field
        v-model="username"
        clearable
        label="姓名"
        placeholder="收货人姓名"
        class="minHeight"
      />
      <van-field
        v-model="phonetel"
        clearable
        type="number"
        label="电话"
        placeholder="收货人电话"
        class="minHeight"
      />
      <div v-show="platform.mode=='2'" class="minHeight address-area" @click="show=!show">
        <em class="label-title">地址</em>
        <em class="address">{{address}}</em>
        <i class="iconfont icon-jiantouarrow487"></i>
      </div>
      <van-field
        v-model="addressdetail"
        clearable
        type="text"
        label="详细地址"
        placeholder="请填写门牌号具体地址"
        class="minHeight"
      />
      <van-field
        v-model="postalCode"
        clearable
        type="number"
        label="邮编编码"
        placeholder="邮编编码"
        class="minHeight"
        v-if="false"
      />
      <div class="title-tag">
        <em class="tag-text">标签</em>
        <span class="tag" :class="{'tag-active' : tagIndex===index}" @click="selectTag(item,index)"
              v-for="(item,index) in tagList" :key="item.id">{{item.text}}</span>
      </div>
      <div class="default">
        <em>设为默认地址</em>
        <van-switch size="22px"
                    v-model="checked" :active-color="$themeColor"/>
      </div>
      <van-actionsheet
        v-model="show"
      >
        <van-area :area-list="areaList" :columns-num="3" title="请选择" @confirm="selectClick" @cancel="Oncancel"/>
      </van-actionsheet>
    </van-cell-group>
    <div class="saveClick">
      <van-button type="primary" size="large" @click="saveAddress" class="saveBtn">保存地址</van-button>
    </div>

  </div>
</template>

<script>
  import {Field, Switch, Area, Actionsheet, Button, Toast} from 'vant';
  import areaList from "../../../static/area.js"
  import {mapActions} from 'vuex';
  import {showLoading, hideLoading,isTellPhone} from "../../util"

  export default {
    name: "editAddress",
    data() {
      return {
        show: false,
        username: '',
        phonetel: '',
        address: '',
        addressdetail: '',
        postalCode: '',
        areaList,
        tagList: [
          {id: 1, text: "家"},
          {id: 2, text: "公司"},
          {id: 3, text: "学校"},
        ],
        tagIndex: 0,
        checked: false,
        tagselect: 1,
      }
    },
    methods: {
      ...mapActions("personal", ['getUserAddressDetail', 'saveAddressInfo']),
      /**获取地址详情 */
      async createdAddress() {
        if (this.$route.query.id) {
          const addressInfo = await this.getUserAddressDetail({
            id: parseInt(this.$route.query.id)
          })

          this.username = addressInfo.linkName;
          this.phonetel = addressInfo.linkTel;
          this.address = addressInfo.address;
          this.addressdetail = addressInfo.detailedAddress;
          this.checked = parseInt(addressInfo.isDefault) === 1 ? true : false;
        }
        // hideLoading();
      },
      /**选择地址 */
      selectClick(save) {
        this.show = !this.show
        const arr = [];
        save.map(item => {
          arr.push(item.name)
        })
        this.address = arr.toString()
      },
      /* 取消选择地址 */
      Oncancel() {
        this.show = !this.show
      },
      /**保存地址 */
      async saveAddress() {

        if(this.username.toString().length > 8){
          return Toast('姓名限制8个字以内')
        }

        if (!this.addressdetail.trim() || (this.platform.mode=='2'&&this.address.trim() == "") || !this.username.trim() || !this.phonetel) {
          return Toast("请填写正确的地址信息")
        }
        if(!isTellPhone(this.phonetel)){
          return Toast('请输入正确的手机号码')
        }
        showLoading("保存中，请稍后")
        const data = await this.saveAddressInfo({
          linkName: this.username,
          linkTel: this.phonetel,
          address: this.address,
          detailedAddress: this.addressdetail,
          isDefault: this.checked ? 1 : 2,
          label: this.tagselect,
          id: this.$route.query.id ? this.$route.query.id : ''
        })

        if (data.code == 0) {
          return Toast('修改失败，请检查填写的信息');
        } else if (data.code == 1) {
          Toast('成功');
          this.$router.go(-1)
        }
        hideLoading()
      },
      selectTag(item, index) {
        this.tagselect = item.id
        this.tagIndex = index
      }
    },
    created() {
      this.createdAddress()
    }
  }
</script>
<style lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  .van-switch--on {
    background-color: $themeColor;
  }

  .van-button--danger {
    background-color: $themeColor;
    border: 1PX solid $themeColor;
  }
</style>

<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  .title-tag {
    line-height: 90px;
    background-color: #fff;
    border-bottom: 1PX solid #eee;
    padding-left: 30px;

  }

  .tag {
    display: inline-block;
    padding: 10px 40px;
    border: 1PX solid #eee;
    line-height: normal;
    border-radius: 5px;
    transition: border .1s ease-in;
    &:not(:last-child) {
      margin-right: 5px;
    }
    &:active {
      border-color: $themeColor;
      color: $themeColor;
    }
  }

  /*标签选中*/
  .tag-active {
    border-color: $themeColor;
    color: $themeColor;
    transition: all .3s ease-in;
  }

  .tag-text {
    width: 180px;
    display: inline-block;
  }

  .default {
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .minHeight {
    line-height: 60px;
  }

  .address-area {
    display: flex;
    justify-content: space-between;
    margin: 30px 30px 0px 30px;
    padding-bottom: 30px;
    border-bottom: 1PX solid #eee;
  }

  .address {
    color: #666;
    font-size: 30px;
    flex: 1;
  }

  .label-title {
    width: 180px;
    display: inline-block;
    font-size: 30px;
  }

  .saveClick {
    padding: 30px;
  }

  .saveBtn {
    background-color: $themeColor;
    border: 1.1px solid $themeColor;
    border-radius: 18px;
  }
</style>
