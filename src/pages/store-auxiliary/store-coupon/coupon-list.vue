<template>
  <div id="CouponList">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <van-tabs :line-width="25" @click="changeTab" :color="$themeColor" v-model="active">
      <van-tab :title="label" v-for="(label,key) in tabList" :key="key">
        <scroller
          v-if="dataList.length"
          :on-refresh="onRefresh"
          :on-infinite="onInfinite">
          <div class="coupon-list">
            <mall-coupon @edit-method="editMethod" :state="+active+1" page-type="coupon-list" :data-list="dataList"/>
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
    name: "CouponList",
    components: {MallCoupon,Operation},
    data() {
      return {
        queryParams:{
          page:1,
          size:10,
          type:null,
        },
        active: 0,
        dataList: [],
        PlaceholderImg,
        PlaceholderAvatar,
        showOperation:false,
        actions:[],
      }
    },
    methods: {
      ...mapActions("post", ["collectPost"]),
      ...mapActions("jobHunt", ["getJobConfig"]),
      ...mapActions("storeAuxiliary/storeCoupon", ["getCouponsList","postCouponModify","postDelCoupon"]),
      changeTab(active) {
        console.log(active)
        this.queryParams.storeId = this.storeId;
        this.queryParams.page = 1;
        this.queryParams.type = +active + 1;
        this.onRefresh();
      },
      async getData(refresh) {
        refresh&&( this.queryParams.page = 1);
        const result = await this.getCouponsList({
          ...this.queryParams,
        });
        this.dataList = refresh ? result : this.dataList.concat(result);
        return result.length < this.queryParams.size;
      },
      // 刷新的函数
      async onRefresh(done) {
        await this.getData(true);
        done && done(true)
      },
      async onInfinite(done) {
        this.queryParams.page++;
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
      ...mapState({
        user: state => state.user
      }),
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
      tabList(){
       return  ['展示中','已下架','已过期']
      },
    },

    async created() {
      console.log(this.storeId)
      // 获取列表
      this.changeTab(0);
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  #CouponList {
    /*min-height: calc(100vh - 80px);*/
    width: 100%;
    height: calc(100vh - 120px);
    .van-tab__pane {
      min-height: calc(100vh - 120px);
      position: relative;
    }
    .coupon-list{
      padding: 20px 30px;
    }
  }
</style>
