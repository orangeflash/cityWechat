<template>
  <div id="ManagePrivilege">
    <div class="posi-f w100 zIndex99">
      <Header/>
      <dd-tab :tabs="tabs" class="posi-r br-b-e" @click="tabsMethod"/>
    </div>

    <div class="posi-f w100" style="height: calc(100% - 96px);margin-top: 96px">
      <scroller
        v-if="dataList.length"
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
      >
        <rush-buy @operation="editMethod(item)"
                  @go-detail="goPointPage('/storeAuxiliary/storeRushbuy/rushbuyReceiveDetails?goodsId=' + item.id)"
                  type="manage-rushbuy"
                  :count-down="active"
                  v-for="(item,index) in dataList"
                  :key="index"
                  :data-info="item"
        ></rush-buy>
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
  import RushBuy from '../../../components/template/rush-buy/rush-buy'
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";  // 按钮组
  import {getOperation} from "../../../plugins/common/index";
  import {mapActions,mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {Toast} from 'vant'
  import {changeWeek} from "../../../plugins/auxiliary/auxiliary-config";

  export default {
    mixins: [utilMixins],
    components: {CellList, DdTab,RushBuy, Operation},
    data() {
      return {
        itemCounponId: null,
        hasMore: true,
        showOperation: false,
        actions: [],
        active: 1,
        tabs: [
          {title: '进行中'},
          {title: '已结束'},
          {title: '待审核'},
        ],
        dataList: [],
        sort: ['new', 'hot', 'good'],
        params: {
          page: 1,
          size: 10,
          type: null,
          storeId: null,
        }
      }
    },
    methods: {
      ...mapActions('storeAuxiliary/storeRushbuy', ['getRushMyList','postDelGoods']),
      tabsMethod(v) {
        // console.log(v)
        this.params.type = (() => {
          this.active=v.value+1
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
        showLoading()
        const result = await this.getRushMyList({
          ...this.params,
        });
        this.dataList = refresh ? result : this.dataList.concat(result);
        hideLoading();
        // console.log(this.dataList)
        return result.length < this.params.size;
      },
      // 刷新的函数
      async onRefresh(done) {
        this.params.page = 1;
        this.dataList=[];
        await this.getData(true);
        done && done()
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        //console.log(bool)
        done && done(bool)
      },
      editMethod(item){
        console.log(item)
        this.info=item
        let arr=[];
        if(this.active==1){
          arr=getOperation(['share','top','refresh','over','upOrDown','delete'])
        }
        else{
          arr=getOperation(['share','top','refresh','over','upOrDown'])
        }
        this.actions = [{title: '抢购商品ID：' + item.id}].concat(arr);
        this.showOperation=true
      },
      // 操作选项
      async actionsOperation(item) {
        switch (item.field) {
          case 'edit':  //编辑
            setTimeout(()=>{ this.goPointPage({path:'/storeAuxiliary/storeRushbuy/storeReleaseRushbuy',query:{goodsId:this.info.id}})},10)
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
          await showDialog("确定要删除该抢购商品吗？");
          showLoading();
          const res = await this.postDelGoods({
            goodsId: this.info.id,
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
  }
</style>
