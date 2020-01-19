<template>
  <div id="MyVip">
    <Header></Header>
    <van-tabs :line-width="25" @click="changeTab" :color="$themeColor" v-model="active">
      <van-tab class="br-t-e" :title="label" v-for="(label,key) in tabList" :key="key">
        <scroller
          v-if="dataList.length"
          :on-refresh="onRefresh"
          :on-infinite="onInfinite">
          <div v-if="key==3" class="">
            <layout-one class="fon-b" v-for="(item,index) in dataList" :key="index" @click="item.state!='2'&&goPointPage({path:'/auxiliary/vip/giftDetails',query:{id:item.packId}})" :body="layoutBody" :body-src="getSingleImg(item.logo)">
              <template slot="body-bd-f">
                <span class="t-o">{{item.title}}</span>
                <span class="flex-g-0" :class="item.state=='0'?'col-t':'col-9'">{{item.state=='0'?'未使用':item.state=='1'?'已使用':'已过期'}}</span>
              </template>
              <span slot="body-bd-s" class="col-9">{{item.storeName}}</span>
              <template slot="body-bd-t">
                <span slot="body-bd-t" :class="item.state=='0'?'col-t':'col-9'">到期时间:{{formatDateByTimeStamp(item.endTime,"YYYY-MM-DD HH:mm")}}</span>
                <!--<span v-if="item.state=='2'" class="flex-g-0 box-btn-f br-r-30">删除</span>-->
              </template>
            </layout-one>
          </div>
          <div v-else>
            <vip-privilege type="my" v-for="(item,index) in dataList" :key="index" :data-info="item"></vip-privilege>
          </div>
        </scroller>
        <not-data v-else></not-data>
      </van-tab>
    </van-tabs>
    <Operation
      :show="showOperation"
      @close="showOperation=!showOperation"
      @choice="actionsOperation"
      :actions="actions"
    ></Operation>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import LayoutOne from "../../../components/template/dd-article/layout-one";
  import VipPrivilege from "../../../components/template/vip/vip-privilege";
  import MallCoupon from "../../../components/template/mall/mall-coupon";
  import {utilMixins} from "../../../plugins/util-mixins";
  import Operation from '../../../components/template/operation'
  import {updateShareConfig} from "../../../util/wechat-util";
  import {
    hideLoading,
    showDialog,
    showLoading,
    getUrlParams,
    parseObjToParams,
    showText,
    showHandleStatusByFlag
  } from "../../../util";
  import {Toast} from 'vant';
  import {PlaceholderAvatar} from "../../../project-config/base";
  import PlaceholderImg from "../../../assets/img/personal/my_publication_placeholder.jpg";
  import {getOperation} from "../../../plugins/common/index";

  export default {
    name: "MyVip",
    components: {LayoutOne,Operation,VipPrivilege},
    data() {
      return {
        params:{
          page:1,
          size:10,
          state:1,
        },
        active: 0,
        dataList: [],
        PlaceholderImg,
        PlaceholderAvatar,
        showOperation:false,
        actions:[],
        layoutBody: {
          hd: 1,
          bd: 1,
          img: {
            center: 1,
            wid: 1.7,
            hei: 1.7,
          },
        },
      }
    },
    methods: {
      ...mapActions("post", ["collectPost"]),
      ...mapActions('vip', ['getMyPackage','receivePackage','myReceivePrivilege']),
      ...mapActions("jobHunt", ["getJobConfig"]),
      ...mapActions("storeAuxiliary/storeCoupon", ["getCouponsList","postCouponModify","postDelCoupon"]),
      changeTab(active) {
        console.log(active)
        this.params.state =+active + 1;
        this.dataList=[]
        this.onRefresh();
      },
      async getData(refresh) {
        refresh&&( this.params.page = 1);
        let apiName=this.active=='3'?'getMyPackage':'myReceivePrivilege'
        const result = await this[apiName]({
          ...this.params,
        });
        this.dataList = refresh ? result : this.dataList.concat(result);
        return result.length < this.params.size;
      },
      // 刷新的函数
      async onRefresh(done) {
        await this.getData(true);
        done && done(true)
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        done && done(bool)
      },
      editMethod(item){
        console.log(item)
        this.info=item
        let arr=[];
        if(item.display==1){
          arr=getOperation(['share','top','refresh','over'])
        }
        else if(item.display==2){
          arr=getOperation(['share','top','refresh','over'])
          arr.forEach(item => {
            (item.name=='下架')&&(item.name='上架')
          })
          console.log(arr)
        }
        this.actions = [{title: '优惠券ID：' + item.id}].concat(arr);
        this.showOperation=true
      },
      // 操作选项
      async actionsOperation(item) {
        switch (item.field) {
          case 'edit':  //编辑
            setTimeout(()=>{ this.goPointPage({path:'/storeAuxiliary/storeCoupon/storeReleaseCoupon',query:{id:this.info.id}})},10)
            // console.log(123,this.showOperation)
            break;
          case 'upOrDown':    //上下架
            this.upDownInfo();
            break;
          case 'delete'://删除
            this.deleteInfo()
            break;
        }
      },
      //上下架
      async upDownInfo(){
        try {
          const tips = "您确定要对该优惠券进行" + (this.info.display == 2 ? "上架" : "下架") + "吗？",
            isUp = +this.info.display == 1;
          await showDialog(tips);

          const res = await this.postCouponModify({
            couponId: this.info.id,
          });
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&this.onRefresh();
        } catch (e) {
          console.log("原来是误操作")
        }
      },
      //删除
      async deleteInfo(){
        try {
          await showDialog("确定要删除该优惠券吗？");
          showLoading();
          const res = await this.postDelCoupon({
            couponId: this.info.id,
          })
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&this.onRefresh();
        } catch (e) {
          console.log("还好没有删除该信息")
        }
      },
    },
    mixins: [utilMixins],
    computed: {
      tabList(){
        return  ['未使用','已使用','已过期','开卡礼包']
      },
    },

    async created() {
      console.log(this.user)
      // 获取列表
      this.changeTab(0);
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  #MyVip {
    /*min-height: calc(100vh - 80px);*/
    width: 100%;
    height: calc(100vh - 120px);
    .van-tab__pane {
      min-height: calc(100vh - 120px);
      position: relative;
    }
  }
</style>
