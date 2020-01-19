<template>

  <div class="myRelease">
    <div class="posi-f w100">
      <Header/>
      <dd-tab :tabs="tabs" @click="tabsMethod"/>
    </div>
    <div class="posi-f w100" style="height: calc(100% - 95px);margin-top: 95px">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="dataList.length"
      >
        <div v-for="(v,i) in dataList" :key="i" class="base-pad bg-f mar-t" @click="goPointPage({path:'/auxiliary/xx/details',query:{id:v.id}})">
          <div class="flex-x-bt br-b-e fon-b pad-tb">
            <div class="">
              <span class="yuan cbred" v-if="v.buyType=='1'">{{stateName(v.buyType)}}</span>
              <span class="yuan cbblue" v-else>{{stateName(v.buyType)}}</span>
              <span class="fon-w6">{{v.typeName}}</span>
            </div>
            <div class="fon-sm" v-if="params.type!='1'">
              <div class="operation">
                <span  @click.stop="goPointPage({path:'/auxiliary/xx/releasexx',query:{postId:v.id}})">
              <em>编辑</em>
            </span>
              </div>
            </div>
          </div>
          <div class="col-6 flex w100 fon-sm pad-t-20 pad-b-10 listlh">
            <div class="flex-g-1 w60 hide-e">品牌：{{v.brand}}</div>
            <div class="flex-g-1 w40 hide-e">数量：{{v.number}}{{v.unit}}</div>
          </div>
          <div class="fon-sm col-6 flex w100 pad-tb pad-t-10 pad-b-10 listlh">
            <div class="flex-g-1 w60 hide-e">交货地：{{v.address}}</div>
            <div class="flex-g-1 w40 hide-e">规格：{{v.spec}}</div>
          </div>
          <div class="fon-sm col-9 flex-x-bt pad-t-10">
            <!--<div class="fon-xss">-->
              <!--<span class="textbox mar-r-5">保</span>-->
              <!--<span class="textbox mar-r-5">实</span>-->
              <!--<span class="textbox mar-r-5">V</span>-->
            <!--</div>-->
            <div class="fon-sm fon-w6 col-r">￥{{v.price}}元/{{v.unit}}</div>
            <div>
              <span class="col-9 fon-xs mar-l flex-y-center"><i class="iconfont icon-Group- fon-xxl mar-r-10"></i>{{formatDateByTimeStamp(v.createdAt,"YYYY-MM-DD HH:mm")}}</span>
            </div>
          </div>
        </div>
      </scroller>
      <not-data v-else/>
    </div>
  </div>


</template>

<script>
  import DdTab from '@/components/template/other/tab'
  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import {mapActions, mapState} from 'vuex'
  import {format, showDialog, timeStampToHMS} from "../../../util";
  import {getOperation} from "@/plugins/common/index";
  import Operation from "@/components/template/operation";
  import {utilMixins} from "../../../plugins/util-mixins";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";

  export default {
    mixins: [utilMixins],
    components: {DdLayoutImg, DdTab, DdStoreOrder, Operation},
    data() {
      return {
        tabs: [{title: '我的收藏'},
          {title: '我的发布'},
          {title: '我的资料'},
        ],
        active: 1,
        dataList: [],
        params: {
          page: 1,
          size: 10,
          type: 1,
        }
      }
    },
    methods: {
      ...mapActions("Xx", ["XxWdfs"]),
      stateName(buyType) {
        let s
        switch (buyType) {
          case '1':
            s = '买'
            break
          case '2':
            s = '卖'
            break
        }
        return s
      },
      tabsMethod(v) {
        if(v.value=='2'){
          this.goPointPage({
            path: '/auxiliary/xx/wdzl'
          });
        }else {
          this.params.type = (() => {
            this.active = v.value + 1
            return v.value + 1
          })();
          this.onRefresh();
        }
        console.log(v)
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getData(true)
        done && done();
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        done && done(!bool);
      },
      async getData(refresh) {
        let result = await this.XxWdfs(this.params);
        this.dataList = refresh ? result : this.dataList.concat(result);
        return result.length >= this.params.size;
      }
    },
    computed: {
    },
    created() {
      this.onRefresh();
    }
  }


</script>
<style scoped lang="scss">
  @import "../../../assets/theme";
  .operation {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      height: 46px;
      border: 1.1px solid $themeColor;
      display: flex;
      align-items: center;
      border-radius: 22px;
      width: 154px;
      margin-left: -35px;

      em {
        margin: 0 auto;
        color: $themeColor;
        font-size: $font-size-sm;

      }
    }
  }
  .yuan{
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
  }
  .cbred{
    color: #f00;
    border:1.1px solid #f00;
  }
  .cbblue{
    color: #1C9BFC;
    border:1.1px solid #1C9BFC;
  }
  .textbox{
    border-radius: 5px;
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border:1.1px solid #999;
  }
  .w60{width:50%}
  .w40{width:50%}
  .listlh{
    height: 28px;
    line-height: 28px;
  }
</style>
