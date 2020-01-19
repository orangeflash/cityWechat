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
            <!--<mall-coupon page-type="coupon-list" :data-list="dataList"/>-->
            <div @click="goPointPage({path:'/auxiliary/mall/details',query:{goodsId:item.id}})" class="goods-card" v-for="(item,index) in dataList" :key="index">
              <div class="good-top">
                <div class="good-top-lt">
                  <img-wrapper :src="item.showImgs[0]&&item.showImgs[0].url&&getPathByAssetPath(item.showImgs[0].url)||PlaceholderImg"></img-wrapper>
                </div>
                <div class="good-top-rt">
                  <div class="rt-ftitle">
                    {{item.title}}
                  </div>
                  <div class="rt-stitle">
                    <div class="original-price"><span>￥</span>{{item.originalPrice}}</div>
                    <div class="money"><span>￥</span>{{item.currentPrice}}</div>
                  </div>
                  <div class="rt-stitle">
                    <!--<div>已售{{item.num}}</div>-->
                    <div>库存{{item.num}}</div>
                  </div>
                </div>
              </div>
              <div class="goods-foot">
                <div class="goods-foot-lt">
                  <div v-if="item.pName" class="label">{{item.pName}}</div>
                  <div v-if="item.typeName" class="label">{{item.typeName}}</div>
                </div>
                <div class="goods-foot-rt" @click.stop="editMethod(item)">操作/编辑</div>
              </div>
            </div>
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
  import {PlaceholderAvatar, PlaceholderImg, backendPath,publishUrl} from "../../../project-config/base";
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
  import {getOperation} from "../../../plugins/common/index";

  export default {
    name: "GoodList",
    components: {Operation},
    data() {
      return {
        queryParams: {
          page: 1,
          size: 10,
          type: null,
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
      ...mapActions("storeAuxiliary/releaseGood", ["getGoodsList","postModify","postDelGoods"]),
      changeTab(active) {
        console.log(active)
        // this.hasMore=true;
        this.queryParams.storeId = this.storeId;
        this.queryParams.page = 1;
        this.queryParams.type = +active + 1;
        this.onRefresh();
      },
      async getData(refresh) {
        refresh && (this.queryParams.page = 1);
        const result = await this.getGoodsList({
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
      async cancleCol(id, type) {
        // console.log(id,type)
        // return
        showLoading();
        let res = await this.collectPost({
          postId: id,
          type: type == 1 ? 7 : 8,
        });
        if (res.code) {
          showHandleStatusByFlag(true, '取消成功')
          setTimeout(() => {
            this.onRefresh();
          }, 800)
        } else {
          showText(res.msg, 2000, true);
        }
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
        this.actions = [{title: '商品ID：' + item.id}].concat(arr);
        this.showOperation=true
      },
      // 操作选项
      async actionsOperation(item) {
        switch (item.field) {
          case 'edit':  //编辑
            setTimeout(()=>{ this.goPointPage({path:'/storeAuxiliary/storeGood/storeReleaseGood',query:{goodsId:this.info.id}})},10)
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
          const tips = "您确定要对该商品进行" + (this.info.display == 2 ? "上架" : "下架") + "吗？",
            isUp = +this.info.display == 1;
          await showDialog(tips);

          const res = await this.postModify({
            goodsId: this.info.id,
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
          await showDialog("确定要删除该条信息吗？");
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
    mixins: [utilMixins],
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
      tabList() {
        return ['在售中', '已下架',]
      },
    },

    async created() {
      console.log(this.storeId)
      // 获取列表
      this.changeTab(0);
    }
  }
</script>
<style lang="scss">
  #CouponList {
    .coupon-list {
      .van-ellipsis {
        font-size: 12px !important;
      }
    }
  }
</style>
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

    .coupon-list {
      /*padding: 20px 30px;*/
      .van-card {
        background: #fff;
      }

      .van-ellipsis {
        font-size: 14px !important;
      }
    }

    .goods-card {
      background: #fff;
      padding: 20px 30px;
      margin-bottom: 20px;
      .good-top {
        background: #fff;
        display: flex;
        &-lt {
          width: 120px;
          height: 120px;
          border-radius: 10px;
          overflow: hidden;
        }

        &-rt {
          padding-left: 20px;
          flex: 1;

          .rt-ftitle {
            line-height: 35px;
            @include t-overflow(2);
            margin-bottom: 20px;
          }

          .rt-stitle {
            color: #999;
            @include flex-between;
            margin-bottom: 20px;
            .original-price{
              text-decoration: line-through;
              span {
                font-size: $font-size-xss;
              }
            }
            .money {
              color: #f44444;
              font-size: $font-size-xl;
              span {
                font-size: $font-size-xss;
              }
            }
          }
        }
      }

      .goods-foot {
        margin-top: 20px;
        @include flex-between;
        &-lt{
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          .label{
            margin-right: 20px;
            padding:10px 30px;
            border-radius: 10px;
            color: #666;
            background: #f5f5f5;
          }
        }
        &-rt{
          margin-left: 20px;
          padding:10px 20px;
          border-radius: 25px;
          color: #f44444;
          border: 1PX solid #f44444;
        }
      }
    }
  }
</style>
