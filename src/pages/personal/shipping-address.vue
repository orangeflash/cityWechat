<template>
  <div class="shipping-address">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <template v-if="myAddress&&myAddress.length">
      <div class="address-box" v-for="item in myAddress" :key="item.id">
        <div @click="choice(item)">
          <div class="user-info">
            <em class="user">联系人：{{item.linkName}}</em>
            <em class="user">{{item.linkTel}}</em>
          </div>
          <div class="right">
            <em class="address mar-r-10">地址：{{item.address }}{{item.detailedAddress}}</em>
            <em class="label flex-g-0">{{getlabel(item.label)}}</em>
          </div>
        </div>
        <div class="edit-address">
          <van-radio-group v-model="radio" class="edit-default-address">
            <van-radio :checkedColor="$themeColor" :name="item.id" class="isDefault" @click="setDefault(item.id)">默认地址</van-radio>
          </van-radio-group>
          <p class="operating">
            <em class="edit" @click="goPointPage({path:'/personal/editAddress',query:{id:item.id}})">编辑</em>
            <em class="edit" @click="deleteAddress(item.id)">删除</em>
          </p>
        </div>
      </div>
    </template>
    <empty-view v-else style="margin-top: 60px"/>
    <div class="add-address">
      <van-button type="primary" square size="large" :style="{background:$themeColor,border:'none'}" @click="goPointPage({path:'/personal/editAddress'})">新增地址
      </van-button>
    </div>
  </div>
</template>

<script>
  import {RadioGroup, Radio, Button} from 'vant';
  import {mapActions} from 'vuex';
  import EmptyView from "../../components/basic/empty-view";
  import {get} from 'https';
  import {hideLoading, showDialog, showLoading} from "../../util";
  import Header from "@/components/header";

  export default {
    name: "shippingAddress",
    components: {EmptyView, Header},
    data() {
      return {
        radio: '1',
        myAddress: [],
      }
    },
    methods: {
      ...mapActions("personal", ["getUserAddressByGet", 'deleteAddressById', 'setDefaultAddress']),
      ...mapActions("integralMall", ["choiceAddress"]),
      getlabel(label) {
        switch (label) {
          case '1':
            return '家'
            break;
          case '2':
            return '公司'
            break;
          case '3':
            return '学校'
            break;
          default:
            return '其他'
            break;
        }
      },
      async getuserAddress() {
        this.myAddress = await this.getUserAddressByGet()


        this.myAddress.map(item => {
          if (parseInt(item.isDefault) === 1) {
            this.radio = item.id
          }
        })
      },
      async deleteAddress(id) {
        await showDialog("确定删除吗?");
        showLoading();
        await this.deleteAddressById({
          id: id
        });
        hideLoading();
        this.myAddress.map((item, index) => {
          if (item.id == id) {
            this.myAddress.splice(index, 1);
          }
        })
      },
      async setDefault(id) {
        const data = await this.setDefaultAddress({
          id,
        })
      },
      choice(item){
        if (this.$route.query.isChoice) {
          // 这里是选择地址：目前是用户积分商城里面下单的时候选择地址
          console.log(item);
          this.choiceAddress(item);

          this.$router.go(-1);

        }else{

        }

      }
    },
    created() {
      this.getuserAddress();

    }
  }
</script>


<style lang="scss">
  @import "../../assets/common";

  .van-radio .van-icon-checked {
    color: $themeColor;
  }

  .van-button--primary {
    background-color: $themeColor;
    border: 1PX solid $themeColor;
  }

  .van-button--round {
    border-radius: 5px;
  }

  .van-radio__label {
    color: #666;
  }
  .van-radio .van-icon-checked{
    color: $themeColor;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  .shipping-address {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    padding-bottom: 130px;
    box-sizing: border-box;
  }

  .address-box {
    background-color: #fff;
    padding-top: 30px;
  }

  .user-info {
    padding: 0px 30px;
    display: flex;
    justify-content: space-between;

    .user {
      font-size: $font-size-base;
      color: #666;
    }
  }

  .address {
    overflow: hidden;
    min-height: 35px;
    font-size: $font-size-lg;
    line-height: 50px;
    color: #666;
  }

  .edit-address {
    border-top: 1PX solid #f9f9f9;
    border-bottom: 1.1px solid #f4f4f4;
    padding: 30px 30px 30px 30px;
    line-height: 30px;

    .edit-default-address {
      display: inline-block;
    }

    .operating {
      float: right;
      line-height: 30px;
    }

    .edit {
      margin-left: 60px;
      color: #777777;
      font-size: $font-size-lg;
    }
  }

  .right {
    box-sizing: border-box;
    padding: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      padding: 10px;
      color: #fff;
      background-color: $themeColor;
      border: 1.1px solid $themeColor;
      font-size: 24px;
      border-radius: 5px;
    }
  }

  .add-address {
    padding: 20px 30px;
    @include absoluteFull();
    top: auto;
    position: fixed;
    background-color: #fff;
    button{
      border-radius: 8px;
    }
  }
</style>
