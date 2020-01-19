<template>
  <div id="ManageGood">
    <div class="head-title">商城配送方式</div>
    <van-cell-group>
      <!--<van-field-->
      <!--type="number"-->
      <!--v-model="fillData.sort"-->
      <!--clearable-->
      <!--label="商品排序"-->
      <!--placeholder="请输入"-->
      <!--&gt;-->
      <!--<i slot="button" class="coupon-discount">（由大到小排序）</i>-->
      <!--</van-field>-->
      <!--<van-field-->
      <!--v-model="fillData.title"-->
      <!--clearable-->
      <!--label="商品标题"-->
      <!--placeholder="请输入"-->
      <!--&gt;-->
      <!--</van-field>-->

      <van-cell :title="item.title" v-for="(item,index) in deliverMode" :key="index">
        <van-switch
          slot="right-icon"
          size="24px"
          @input="changeDeliverMode(index)"
          :value="item.value"
          :active-color="$themeColor"
          inactive-color="#d5d5d5"
        />
      </van-cell>
    </van-cell-group>
    <div class="head-title">商家自提点设置</div>
    <div style="margin-bottom: 70px;">
      <div class="zt-address" v-for="(item,index) in dataList" :key="index">
        <div class="ad-lt">
          <div class="top"><span>{{item.linkName}}</span><span>{{item.linkTel}}</span></div>
          <div class="ft">{{`${item.address}(${item.detailedAddress})`}}</div>
        </div>
        <div class="ad-rt">
          <i class="iconfont icon-xiugaiziliao" @click="goPointPage({path:'/storeAuxiliary/storeGood/storeReleaseZtd',query:{id:item.id}})"></i>
          <i class="iconfont icon-iconset0212" @click="deleteAdd(item.id)"></i>
        </div>
      </div>
    </div>
    <div class="foot-mar-btn">
      <button @click="addZtd">添加自提地点</button>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";

  export default {
    name: "ManageGood",
    props: ["checked"],
    data() {
      return {
        deliverMode: [
          {title:"快递配送",value:false},
          {title:"到店自提",value:false},
        ],
        dataList:[],
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/releaseGood", ["postBusinessSet","postSaveAddress","postDelAddress","getDeliverSet"]),
      ...mapActions("shop", ["getShopInfoWithUserIdById"]),
      async changeDeliverMode(index){
        console.log(index)
        const tips=this.deliverMode[index].value?'关闭':'开启';
        let deliverMode;
        await showDialog(`是否${tips}${this.deliverMode[index].title}`,'提醒')
        this.deliverMode[index].value=!this.deliverMode[index].value
        if(this.deliverMode[0].value&&this.deliverMode[1].value){
          deliverMode=3
        }
        else if(!this.deliverMode[0].value&&this.deliverMode[1].value){
          deliverMode=2
        }
        else{
          deliverMode=1
        }
        console.log(deliverMode)
        let res=await this.postBusinessSet({
          storeId:this.storeId,
          deliverMode:deliverMode
        })
        showHandleStatusByFlag(res.code,res.msg,res.msg,)
        !res.code&&(this.deliverMode[index].value=!this.deliverMode[index].value)
      },
      addZtd(){
        console.log(112)
        this.goPointPage({path:'/storeAuxiliary/storeGood/storeReleaseZtd'})
      },
      async getData(refresh){
        showLoading()
        const result = await this.getDeliverSet({
          storeId:this.storeId,
        });
        hideLoading()
        this.dataList=refresh ? result : this.dataList.concat(result);
      },
      async deleteAdd(id){
        try {
          await showDialog("确定删除吗？");
          showLoading();
          const res = await this.postDelAddress({
            addressId: id,
          })
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&this.getData(true);
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
    },
    async created() {
      this.getData();
      this.getShopInfoWithUserIdById(this.storeId).then((res)=>{
        if(res.deliverMode==3){
          this.deliverMode[0].value=true;
          this.deliverMode[1].value=true;
        }
        else if(res.deliverMode==2){
          this.deliverMode[0].value=false;
          this.deliverMode[1].value=true;
        }
        else{
          this.deliverMode[0].value=true;
          this.deliverMode[1].value=false;
        }
        console.log(res)
      });
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #ManageGood {
    font-size: $font-size-base;

    .zt-address {
      background: #fff;
      padding: 30px;
      margin-bottom: 30px;
      display: flex;

      .ad-lt {
        flex: 1;

        .top {
          span:nth-child(1) {
            font-size: $font-size-xll;
            color: #333;
            margin-right: 20px;
          }

          span:nth-child(2) {
            color: $themeColor;
            margin-right: 20px;
          }
        }

        .ft {
          margin-top: 30px;
          color: #999;
          line-height: 35px;
          min-height: 70px;
        }
      }

      .ad-rt {
        width: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;

        .iconfont {
          color: #999;
          font-size: 35px;
        }
      }
    }

    .foot-mar-btn {
      bottom: 110px;
    }
  }
</style>
