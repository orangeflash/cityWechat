<template>
  <div id="ManagePrivilege">
    <div class="posi-f w100 zIndex99">
      <Header/>
      <dd-tab :tabs="tabs" class="posi-r" @click="tabsMethod"/>
    </div>

    <div class="posi-f w100" style="height: calc(100% - 2rem);margin-top: 2rem">
      <scroller
        v-if="dataList.length"
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
      >
        <div v-for="(item,index) in dataList" :key="index" class="bg-f base-pad flex-col mar-b">
          <div class="privilege br-r-20" @click="goPointPage({path:'/auxiliary/vip/privilegeDetails',query:{id:item.id}})">
            <div class="img">
              <img-wrapper :src="getSingleImg(item.logo)"></img-wrapper>
            </div>
            <div class="bg-f4 pad-tb">
              <CellList v-if="item.week" style-class="background:#f4f4f4;padding:0.1rem 0.3rem;" :is-last="true" :not-center="true">
                <div slot="icon" class="f-text40 bg-b">周</div>
                <div slot="content" class="mar-l t-o1">{{item.week}}<span class="col-3 mar-l">可用</span></div>
              </CellList>
              <CellList v-if="item.month" style-class="background:#f4f4f4;padding:0.1rem 0.3rem;" :is-last="true" :not-center="true">
                <div slot="icon" class="f-text40 bg-y">月</div>
                <div slot="content" class="mar-l t-o1">{{item.month}}<span class="col-3 mar-l">可用</span></div>
              </CellList>
              <CellList style-class="background:#f4f4f4;padding:0.1rem 0.3rem;" :is-last="true" :not-center="true">
                <div slot="content" class=""><span class="col-t fon-xll">{{item.discount}}折</span>（满{{item.condition}}可用）</div>
                <div slot="footer" class="mar-l">库存：<span class="col-t">{{item.stock}}</span>份</div>
              </CellList>
              <CellList style-class="background:#f4f4f4;padding:0.1rem 0.3rem;" :is-last="true" :not-center="true">
                <div slot="content" class="">限每人领取<span class="col-t">{{item.max}}</span>份</div>
                <div slot="footer" class="mar-l">已领：<span class="col-t">{{item.receiveNum}}</span>份</div>
              </CellList>
            </div>
          </div>
          <div class="flex-center pad-tb mar-t">
            <div class="box-btn" style="border-radius: 40px;padding: 0.18rem 0.35rem" @click="goPointPage({path:'/storeAuxiliary/storePrivilege/storeReleasePrivilege',query:{privilegeId:item.id}})">修改</div>
            <div class="box-btn" style="border-radius: 40px;padding: 0.18rem 0.35rem" @click="upDownInfo(item)">{{item.display == 2 ? "上架" : "下架"}}</div>
            <div class="box-btn" style="border-radius: 40px;padding: 0.18rem 0.35rem" @click="goPointPage({path:'/auxiliary/vip/receiveList',query:{id:item.id,type:'privilege'}})">领取记录</div>
          </div>
        </div>
      </scroller>
      <not-data v-else></not-data>
    </div>

    <Operation
      :show="showOperation"
      @close="showOperation=!showOperation"
      @choice="actionsOperation"
      :actions="actions"
    ></Operation>

  </div>

</template>

<script>
  import Operation from "@/components/template/operation"
  import CellList from "../../../components/template/dd-store/cell-list";
  import DdTab from '@/components/template/other/tab'
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";  // 按钮组
  import {getOperation} from "@/plugins/common/index";
  import {mapActions,mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {Toast} from 'vant'
  import {changeWeek} from "../../../plugins/auxiliary/auxiliary-config";

  export default {
    mixins: [utilMixins],
    components: {CellList, DdTab, Operation},
    data() {
      return {
        itemCounponId: null,
        hasMore: true,
        showOperation: false,
        actions: [],
        active: 0,
        tabs: [
          {title: '进行中'},
          {title: '待审核'},
          {title: '已拒绝'},
          {title: '已下架'},
        ],
        dataList: [],
        sort: ['new', 'hot', 'good'],
        params: {
          page: 1,
          size: 10,
          state: null,
          storeId: null,
        }
      }
    },
    methods: {
      ...mapActions('coupon', ['getMyReleaseCoupon', 'delCoupon']),
      ...mapActions('storeAuxiliary/storePrivilege', ['getMyPrivilege','postPrivilegeDisplay']),
      tabsMethod(v) {
        // console.log(v)
        this.params.state = (() => {
          switch (v.value) {
            case 0:
              return 1;
            case 1:
              return 2;
            case 2:
              return 3;
            case 3:
              return 4;
          }
        })();
        this.onRefresh();
      },
      async getData(refresh) {
        refresh&&( this.params.page = 1);
        const result = await this.getMyPrivilege({
          ...this.params,
        });
        for(let i=0;i<result.length;i++){
          result[i].week=result[i].week?result[i].week.split(',').map(item=>{return changeWeek(item)}).toString():''
          result[i].month=result[i].month?result[i].month.split(',').map(item=>{return item+'日'}).toString():''
        }
        this.dataList = refresh ? result : this.dataList.concat(result);
        console.log(this.dataList)
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
        console.log(bool)
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
      async upDownInfo(item){
        this.info=item
        try {
          const tips = "您确定要对此特权进行" + (this.info.display == 2 ? "上架" : "下架") + "吗？";
          await showDialog(tips);

          const res = await this.postPrivilegeDisplay({
            id: this.info.id,display:this.info.display == 2?1:2
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
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    created() {
      this.params.storeId=this.storeId
      this.tabsMethod({value:0})
    }
  }

</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  #ManagePrivilege {
    height: calc(100vh - 120px);
    color: #666;
    font-size: $font-size-base;
    line-height: 35px;
    .privilege{
      .img{
        height: 280px;
      }
    }
  }
</style>
