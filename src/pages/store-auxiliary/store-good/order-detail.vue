<template>
  <div id="OrderDetail" v-if="orderInfo">
    <Header></Header>
    <van-cell v-if="orderInfo.delivery=='1'" center>
      <div class="address-lt" slot="icon">
        <i class="iconfont icon-dizhi2"></i>
      </div>
      <div class="address-rt" slot="title">
        <div class="address-top">
          <div>收货人：{{orderInfo.receivedName}}</div>
          <div>{{orderInfo.receivedTel}}</div>
        </div>
        <div class="address-ft">收货地址：{{orderInfo.receivedAddress}}</div>
      </div>
    </van-cell>
    <van-cell v-if="orderInfo.delivery=='2'&&ztAddress" center>
      <div class="address-lt" slot="icon">
        <i class="iconfont icon-dizhi2"></i>
      </div>
      <div class="address-rt" slot="title">
        <div class="address-top">
          <div>{{ztAddress.linkName}}</div>
          <div>{{ztAddress.linkTel}}</div>
        </div>
        <div class="address-ft">门店地址：{{`${ztAddress.address},${ztAddress.detailedAddress}`}}</div>
      </div>
    </van-cell>
    <div class="goodsList">
      <div class="good-cell">
      <div class="top">
        <div class="top-img">
          <img-wrapper :src="orderInfo.portrait"></img-wrapper>
        </div>
        <div class="top-title">{{orderInfo.userName}}</div>
      </div>
      <div class="good" v-for="(item,index) in orderInfo.goods">
        <div class="lt">
          <img-wrapper :src="item.img"></img-wrapper>
        </div>
        <div class="rt">
          <div class="span-div">
            <span>{{item.name}}</span>
          </div>
          <div class="span-div" v-if="item.data">
            <span class="spec">{{item.data}}</span>
          </div>
          <div class="span-div">
            <span class="money">￥{{item.money}}</span>
            <span class="num">x{{item.num}}</span>
          </div>
        </div>
      </div>
      </div>
    </div>
    <van-cell class="">
      <div class="cells" slot="title">
        <div class="cell-hd">商品总计</div>
        <div class="cell-bd">{{orderInfo.goodsMoney}}元</div>
      </div>
    </van-cell>
    <van-cell class="">
      <div class="cells" slot="title">
        <div class="cell-hd">运费</div>
        <div class="cell-bd">{{(+orderInfo.freight).toFixed(2)}}元</div>
      </div>
    </van-cell>
    <van-cell v-if="+orderInfo.discountMoney>0" title="优惠券：  已使用优惠券">
      <div><span class="red-color">-{{(+orderInfo.discountMoney).toFixed(2)}}</span></div>
    </van-cell>
    <!--<van-cell>-->
      <!--<div class="cells" slot="title">-->
        <!--<div class="cell-hd">总优惠</div>-->
        <!--<div class="cell-bd">{{orderInfo.discountMoney}}元</div>-->
      <!--</div>-->
    <!--</van-cell>-->
    <div class="right-text">
      <div>共{{orderInfo.num}}件商品，合计：<span class="red-color" style="font-size: 20px">￥{{orderInfo.totalMoney}}</span></div>
    </div>
    <div class="mar-t"></div>
    <van-cell-group>
      <van-cell>
        <div class="cells" slot="title">
          <div class="cell-hd">订单号</div>
          <div class="cell-bd">{{orderInfo.outTradeNo}}</div>
        </div>
      </van-cell>
      <van-cell>
        <div class="cells" slot="title">
          <div class="cell-hd">下单时间</div>
          <div class="cell-bd">{{formatDateByTimeStamp(orderInfo.createdAt,"YYYY-MM-DD HH:mm:ss")}}</div>
        </div>
      </van-cell>
      <van-cell>
        <div class="cells" slot="title">
          <div class="cell-hd">配送方式</div>
          <div class="cell-bd">{{orderInfo.delivery=='1'?'快递配送':'到店自提'}}</div>
        </div>
      </van-cell>
      <van-cell v-if="orderInfo.note">
        <div class="cells" slot="title">
          <div class="cell-hd">订单备注</div>
          <div class="cell-bd">{{orderInfo.note}}</div>
        </div>
      </van-cell>
      <div  v-if="+orderInfo.state==2&&orderInfo.delivery=='1'">
        <van-cell>
          <div class="cells" slot="title">
            <div class="cell-hd">快递公司</div>
            <div class="cell-bd">{{orderInfo.logisticsName}}</div>
          </div>
        </van-cell>
        <van-cell>
          <div class="cells" slot="title">
            <div class="cell-hd">快递单号</div>
            <div class="cell-bd">{{orderInfo.logisticsCode}}</div>
          </div>
        </van-cell>
      </div>
      <div v-if="+orderInfo.state==1&&orderInfo.delivery=='1'">
      <van-field
        v-model="logisticsName"
        clearable
        label="快递公司"
        placeholder="请输入快递公司"
      >
      </van-field>
      <van-field
        v-model="logisticsCode"
        clearable
        label="快递单号"
        placeholder="请填写快递单号"
      >
      </van-field>
      </div>
    </van-cell-group>
    <div class="mar-t">
      <div class="concat-buyer" @click.stop="makeTel">
        <i class="iconfont icon-dianhua3"></i>联系买家
      </div>
    </div>
    <div v-if="+orderInfo.state==5" class="btn-arr">
      <button class="button" @click="jjTk">拒绝退款</button>
      <button class="button background" @click="tyTk">同意退款</button>
    </div>
    <div v-if="+orderInfo.state==1&&orderInfo.delivery=='1'" class="foot-mar-btn">
      <button @click="confirm">立即发货</button>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  export default {
    name: "OrderDetail",
    data() {
      return {
        orderInfo:null,
        logisticsName:'',
        logisticsCode:'',
        ztAddress:null,
      }
    },
    methods: {
      ...mapActions('storeAuxiliary/releaseGood', ['getShopOrderList','postShopDelivery','postShopRefund','postCancelOrder','getShopOrderDetails',"getAddressInfo"]),
      makeTel(){
        location.href = `tel://${this.orderInfo.receivedTel}`
      },
      async jjTk(info) {
        console.log(info)
        try {
          await showDialog("确定拒绝退款吗？");
          showLoading();
          const res = await this.postCancelOrder({
            orderId:orderInfo.id,
            state: 7,
          })
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&setTimeout(()=>{
            this.$router.go(-1)
          },800)
        } catch (e) {
          console.log("还好没有取消该订单")
        }
      },
      async tyTk(info) {
        console.log(info)
        try {
          await showDialog("确定同意退款吗？");
          showLoading();
          const res = await this.postShopRefund({
            orderId:orderInfo.id,
          })
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&setTimeout(()=>{
            this.$router.go(-1)
          },800)
        } catch (e) {
          console.log("还好没有取消该订单")
        }
      },
      async confirm(){
          if(!this.logisticsName||!this.logisticsCode){
            showText('请完善物流信息')
            return
          }
        try {
          await showDialog("确定要立即发货吗？");
          showLoading();
          const res = await this.postShopDelivery({
            orderId:this.orderInfo.id,
            logisticsName:this.logisticsName,
            logisticsCode:this.logisticsCode,
          })
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&setTimeout(()=>{
            this.$router.go(-1)
          },800)
        } catch (e) {
          console.log("还好没有取消该订单")
        }
      },
    },
    mixins: [utilMixins],
    computed: {

    },
    async created() {
      let query=this.$route.query
      this.$route.query.title=query.tips
      showLoading();
      this.orderInfo=await this.getShopOrderDetails({orderId:query.orderId})
      hideLoading()
      if(this.orderInfo.selfId){
        this.ztAddress = await this.getAddressInfo({
          addressId: this.orderInfo.selfId
        })
      }
      console.log(query,this.orderInfo)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #OrderDetail {
    font-size: $font-size-base;
    padding-bottom: 130px;
    .van-cell__value{
      color: #999;
    }
    .red-color{
      color: #f44444;
    }
    .right-text{
      background: #fff;
      padding: 20px 30px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
    .address-lt{
      .iconfont{
        font-size: 40px;
      }
    }
    .address-rt{
      margin-left: 20px;
      .address-top{
        @include flex-between;
      }
      .address-ft{
        margin-top: 15px;
        font-size: $font-size-sm;
      }
    }
    .concat-buyer{
      padding: 20px 30px;
      text-align: center;
      background: #fff;
      color: $themeColor;
      .iconfont{
        font-size: 40px;
        margin-top: -10px;
        margin-right: 20px;
      }
    }
    .btn-arr{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 40px 30px;
      .button{
        color: #999;
        width: 40%;
        font-size: $font-size-lg;
        border-radius: 12px;
        padding: 25px 20px;
        background: #fff;
      }
      .background{
        color: #fff;
        background: $themeColor;
      }
    }
    .cells{
      display: flex;
      .cell-hd{
        flex: 1;
        min-width: 150px;
      }
      .cell-bd{
        color: #999;
      }
    }
    .goodsList{
      padding: 30px;
      .good-cell{
        background: #fff;
        border-radius: 20px;
        padding: 20px 30px;
        .top{
          display: flex;
          align-items: center;
          .top-img{
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 20px;
          }
        }
        .good{
          padding: 30px 0;
          border-bottom: 1PX solid #eee;
          display: flex;
          .lt{
            width: 150px;
            height: 150px;
            border-radius: 20px;
            overflow: hidden;
            margin-right: 20px;
          }
          .rt{
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .span-div{
              color: #333;
              .spec{
                padding: 10px 20px;
                color: #999;
                border-radius: 5px;
                font-size: $font-size-sm;
                background: #f5f5f5;
              }
              @include flex-between;
              .money{
                font-size: $font-size-lg;
                color: #f44444;
              }
              .num{
                color: #999;
              }
            }
          }
        }
        :last-child{
          border-bottom: none;
        }
      }
    }
  }
</style>
