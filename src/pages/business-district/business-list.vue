<template>
  <div id="ManagePrivilege">
    <div class="posi-f w100 zIndex99">
      <Header/>
      <!--<dd-tab :tabs="tabs" class="posi-r br-b-e" @click="tabsMethod"/>-->
    </div>

    <div class="posi-f w100 b-box base-pad" style="height: calc(100% - 51px);margin-top: 51px">
      <div v-if="dataList.length">
        <CellList @click="shopClick(v)" class="mar-b br-r-8 box-sha" v-for="(v,i) in dataList" :key="i" v-if="v.status!=2" :is-last="true" :src="getMediaList(v.storeLogo).img[0]" width="1.1" height="1.1" style-class="padding:0.4rem 0.3rem;">
          <div slot="content" class="flex-col mar-l">
            <div class="flex-g-1 t-o1">{{v.storeName}}</div>
            <span class="col-6 mar-t-10 fon-sm">{{v.enterEndTime.substring(0,10)}}<span v-if="expire(v.enterEndTime)" class="col-r mar-l">已到期</span></span>
          </div>
          <div slot="footer" class="flex-g-0 flex-y-center">
            <div v-if="v.status==0" class="pad-5-15 bg-e col-9 br-r-8 fon-sm">待审核</div>
            <div v-else-if="v.status==1" class="pad-5-15 bg-t-5 col-t br-r-8 fon-sm">已通过</div>
            <div v-else-if="v.status==2" class="pad-5-15 col-r br-r-8 fon-sm" style="background: #fbd5df">已拒绝</div>
            <span class="iconfont icon-youjiantou1 col-3 mar-l-10"></span>
          </div>
        </CellList>
      </div>
      <!--<scroller-->
      <!--v-if="dataList.length"-->
      <!--:on-refresh="onRefresh"-->
      <!--:on-infinite="onInfinite"-->
      <!--&gt;-->
      <!--<rush-buy @operation="editMethod(item)"-->
      <!--@go-detail="goPointPage('/storeAuxiliary/storeRushbuy/rushbuyReceiveDetails?goodsId=' + item.id)"-->
      <!--type="manage-rushbuy"-->
      <!--:count-down="active"-->
      <!--v-for="(item,index) in dataList"-->
      <!--:key="index"-->
      <!--:data-info="item"-->
      <!--&gt;</rush-buy>-->
      <!--</scroller>-->
      <not-data v-else></not-data>
    </div>

  </div>

</template>

<script>
  import Operation from "@/components/template/operation"
  import LayoutOne from "../../components/template/dd-article/layout-one";
  import CellList from "../../components/template/dd-store/cell-list";
  import DdTab from '@/components/template/other/tab'
  import RushBuy from '../../components/template/rush-buy/rush-buy'
  import {format, hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../util";  // 按钮组
  import {getOperation} from "../../plugins/common/index";
  import {mapActions, mapState} from 'vuex'
  import {utilMixins} from "../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {LayoutOne, CellList, DdTab, RushBuy, Operation},
    data() {
      return {
        layoutBodyOne: {
          hd: 1,
          bd: 1,
          img: {
            wid: 1.7,
            hei: 1.7,
          },
        },
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
      ...mapActions(["refreshUserInfo"]),
      ...mapActions('storeAuxiliary/storeRushbuy', ['getRushMyList', 'postDelGoods']),
      ...mapActions("businessDistrict", ["getStoreByAdminId", "getUserStoreList","getSetStore"]),
      async shopClick(v){
        if(v.status==0){
          showText('此店铺正在审核中')
        }else if(v.status==1){
          if(Math.round(new Date().getTime() / 1000)>=this.formatDateByString(v.enterEndTime)){
            return this.goPointPage({path:'/businessDistrict/storeManagement',query:{storeId:v.id}},1)
          }
          try {
            await showDialog("确认设置此店铺为默认店铺吗？");
            showLoading()
            let res= await this.getSetStore({storeId:v.id})
            await this.refreshUserInfo()
            showHandleStatusByFlag(res.code, "设置成功", res.msg);
            res.code&&setTimeout(()=>{
              this.goPointPage({path:'/businessDistrict/storeManagement'},1)
            },1000)
          }catch (e) {

          }

        }else if(v.status==2){
          try {
            await showDialog("确认修改后重新提交吗？");
            this.goPointPage({path:'/publication/businessEditForm',query:{storeId:v.id}})
          }catch (e) {}
        }
        //console.log(v,Math.round(new Date().getTime() / 1000),this.formatDateByString(v.enterEndTime))
      },
      expire(e) {
        return Math.round(new Date().getTime() / 1000) >= this.formatDateByString(e)
      },
      tabsMethod(v) {
        // console.log(v)
        this.params.type = (() => {
          this.active = v.value + 1
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
        this.dataList = [];
        await this.getData(true);
        done && done()
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        //console.log(bool)
        done && done(bool)
      }
    },
    mixins: [utilMixins],
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    async created() {
      this.dataList = await this.getUserStoreList();
      // this.params.storeId=this.storeId
      // this.tabsMethod({value:0})
    }
  }

</script>
<style scoped lang="scss">
  .pad-5-15{
    padding: 5px 15px;
  }
  #ManagePrivilege {
    height: calc(100vh - 120px);
  }
</style>
