<template>
  <div id="VerificationVip">
    <Header></Header>
    <div v-if="pageType=='giftDetails'" class="bg-f">
      <layout-one :body="layoutBody" :body-src="getSingleImg(giftDetails.logo)">
        <span  slot="body-bd-f" class="t-o fon-lg">{{giftDetails.title}}</span>
        <span slot="body-bd-s" class="card-name col-r mar-t"><span class="iconfont icon-huo mar-r-10"></span>{{giftDetails.view}}</span>
        <span slot="body-bd-t" class="col-9">营业时间:{{giftDetails.businessStartTime}}-{{giftDetails.businessEndTime}}</span>
        <div slot="body-ft" class="flex-col flex-x-end hei100">
          <div class="sylb br-t flex-col t-c br-r-10"><span class="bg-t col-f pad-10">剩余礼包</span><span
            class="pad-20 fon-lg col-t">{{giftDetails.num}}份</span></div>
        </div>
      </layout-one>
    </div>
    <div v-else-if="pageType=='privilegeDetails'" class="bg-f">
      <vip-privilege type="verification" :data-info="privilegeDetails"></vip-privilege>
    </div>
    <div v-else-if="pageType=='rushBuyDetails'&&rushBuyDetails" class="bg-f">
      <rush-buy count-down="1" :data-info="rushBuyDetails"></rush-buy>
    </div>
    <div v-if="orderInfo">
      <CellList v-for="(item,index) in orderInfo" :key="index"  :title="item.title" :content="item.content"></CellList>
    </div>
    <div class="foot-mar-btn rel mar-t">
      <button @click="confirm">确 认 核 销</button>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import LayoutOne from "../../../components/template/dd-article/layout-one";
  import CellList from "../../../components/template/dd-store/cell-list";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {hideLoading, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  import VipPrivilege from "../../../components/template/vip/vip-privilege";
  import RushBuy from '../../../components/template/rush-buy/rush-buy'
  export default {
    name: "VerificationVip",
    components: {LayoutOne,VipPrivilege,RushBuy,CellList},
    data() {
      return {
        pageType:'',
        giftDetails:{},
        privilegeDetails:{},
        rushBuyDetails:null,
        orderInfo:null,
        layoutBody: {
          hd: 1,
          bd: 1,
          ft: 1,
          img: {
            center: 1,
            wid: 1.5,
            hei: 1.5,
          },
        },
      }
    },
    methods: {
      ...mapActions('vip', ['getPackageInfo','writeOffPackage','getPrivilegeInfo','writeOffPrivilege']),
      ...mapActions('rushBuy',['getRushGoodsInfo','postRushVerify','getRushOrderInfo']),
      async load(pageType) {
        showLoading();
        let apiName
        switch (pageType) {
          case 'giftDetails':
            apiName='getPackageInfo'
            break;
          case 'privilegeDetails':
            apiName='getPrivilegeInfo'
            break;
          case 'rushBuyDetails':
            apiName='getRushGoodsInfo'
            break;
        }
        const res = await this[apiName]({id:this.id});
        if (res.code == 1) {
          if(pageType=='privilegeDetails'){
            res.data.logo=res.data.logo[0].url
          }
          this[pageType] = res.data
        } else {
          showText('数据获取失败')
          return
        }
        hideLoading();
      },
      async getInfo(pageType) {
        let apiName
        switch (pageType) {
          case 'rushBuyDetails':
            apiName='getRushOrderInfo'
            break;
        }
        const data = await this[apiName]({id:this.hxId});
        this.orderInfo = [
          {
            title:'购买数量',content:data.orderNum
          },
          {
            title:'支付金额',content:(+data.totalMoney).toFixed(2)
          },
          {
            title:'姓名',content:data.receivedName
          },
          {
            title:'电话',content:data.receivedTel
          },
          {
            title:'订单编号',content:data.outTradeNo
          },
          {
            title:'领取时间',content:this.formatDateByTimeStamp(data.createdAt,"YYYY-MM-DD HH:mm:ss")
          },
        ]
      },
      async confirm(){
        showLoading();
        let apiName
        switch (this.pageType) {
          case 'giftDetails':
            apiName='writeOffPackage'
            break;
          case 'privilegeDetails':
            apiName='writeOffPrivilege'
            break;
          case 'rushBuyDetails':
            apiName='postRushVerify'
            break;
        }
        const res = await this[apiName]({id:this.hxId});
        showHandleStatusByFlag(res.code,res.msg,res.msg,)
        res.code&&setTimeout(()=>{
          this.goPointPage({path:'/home'});
        },800)
      },
    },
    mixins: [utilMixins],
    computed: {

    },
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
        this.hxId=this.$route.query.hxId;
        this.pageType = this.$route.query.pageType
        this.load(this.pageType);
        this.getInfo(this.pageType)
        console.log(this.id,this.pageType)
      } else {
        showHandleStatusByFlag([false, '缺少参数'])
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #VerificationVip {
    font-size: $font-size-base;
    padding-bottom: 120px;
  }
</style>
