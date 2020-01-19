<template>
  <div class="dd-mall-category-details">
    <Header/>
    <!--<div class="mall-category_top">-->
    <!--<Search-->
    <!--placeholder="搜索商品"-->
    <!--&gt;</Search>-->
    <!--</div>-->
    <div class="dd-mall-category-details_tabs">
      <dd-goods-nav
        :big-btn="bigBtn"
        @method="goodsNav"
        height="20"
        :highlight="true"
      />
    </div>
    <ul class="goods-list">
      <scroller
        :on-refresh="onrefresh"
        :on-infinite="onInfinite"
        v-if="goodsList.length>0"
      >
        <DdContainer>
          <div slot="container" class="bg-e">
            <dd-store-order
              v-for="(item,key) in goodsList"
              :key="key"
              :order="item"
              class="bg-f mar-b-20 mar-t-10"
              @click="goPointPage('/auxiliary/assemble/goodsDetails?assembleId='+item.id)"
            >
              <div slot="cover-mask"
                   class="posi-a t0 l0 col-f pad-8-10-4 br-br-r-15"
                   style="background: linear-gradient(90deg,rgba(255,56,56,1) 0%,rgba(255,102,102,1) 100%);
               box-shadow:0px 2px 4px 0px rgba(255,57,56,0.56);">{{item.groupNum}}人拼
              </div>
              <div slot="title" class="order-title-r2">{{item.name}}</div>
              <div slot="desc" class="flex mar-t-20 mar-b">
            <span class="bg-f8 col-9 br-r-10 pad-14-20-10 mar-r"
                  v-for="(name,key) in item.lables"
                  v-if="key<2"
                  :key="key">{{name}}</span>
              </div>
              <div slot="down" class="flex-y-center flex-bt">
                <div>
                  <div class="mar-b-10">
                    <span class="col-t fon-lg mar-r-10">￥{{item.money}}</span>
                    <em class="col-9 t-d-l"> ￥{{item.originalPrice}} </em>
                  </div>
                  <div class="col-9">已拼{{item.salesNum}}件</div>
                </div>
                <div class="br-r-30 col-f pad-14-20-10"
                     style="background:linear-gradient(90deg,rgba(255,56,56,1) 0%,rgba(255,102,102,1) 100%);
                  box-shadow:0px 2px 4px 0px rgba(255,57,56,0.56);">去购买
                </div>
              </div>
            </dd-store-order>
          </div>
        </DdContainer>
      </scroller>
      <not-data v-else></not-data>
    </ul>
  </div>
</template>

<script>
  import Search from '@/components/template/search';
  import DdGoodsNav from '@/components/template/mall/dd-goods-nav';
  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import {utilMixins} from "@/plugins/util-mixins";
  import {mapActions} from 'vuex';
  import DdContainer from '@/components/template/other/container'
  import {hideLoading, showLoading} from "../../../util";

  export default {
    mixins: [utilMixins],
    components: {DdGoodsNav, Search, DdStoreOrder,DdContainer},
    data() {
      return {
        bigBtn: [
          {
            name: '人气',
            active: true,
            sort: 'defualt'

          },
          {name: '销量', sort: 'salesNum'},
          {
            name: '价格',
            afterIcon: 'icon-zhankaishangxia',
            sort: 'price'
          },
        ],
        goodsList: [],
        params: {
          page: 1,
          size: 10,
          type: 'hot',
          sort: 'defualt',
          word: null,
          typeId: null,
          typePid: null,
        }
      }

    },
    methods: {
      ...mapActions("storeAuxiliary/storeAssemble", ["getAssembleList"]),
      goodsNav(item) {
        console.log(item);
        this.params.page = 1;
        this.params.word = null;
        this.params.sort = item.sort;
        this.getDataList(true);
      },
      async onrefresh(done) {
        this.params.page = 1;
        const bool = await this.getDataList(true);
        done && done(bool);
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getDataList();
        done && done(bool);
      },
      async getDataList(refresh) {
        showLoading();
        let result = await this.getAssembleList(this.params);
        result = result.map(item => {
          return {
            id: item.id,
            cover: {
              src: item.showImgs[0] && this.getSingleImg(item.showImgs[0].url),
              width: 2.4,
              height: 2.4,
              borderRadius: 0.16
            },
            name: item.title,
            lables: (() => {
              let arr = []
              for (let key in item.label) arr.push(item.label[key]);
              return arr
            })(),
            money: item.groupPrice,
            originalPrice: item.originalPrice,
            salesNum: item.salesNum,
            groupNum: item.groupNum
          }
        })
        console.log(result)
        this.goodsList = refresh ? result : this.goodsList.concat(result);
        hideLoading();
        return result.length < this.params.size;
      }
    },
    created() {
      const query = this.$route.query;
      this.params.word = query.word;
      this.params.typeId = query.id;
      this.params.typePid = query.pid;

      this.getDataList(true);

      /**
       *  有BUG
       *
       * */
      // setTimeout(()=>{
      //   console.log(this.$refs);
      //   console.log(this.$refs);
      //   this.scrollRefresh(this.$refs.goodsList,function(done){
      //     setTimeout(()=>{
      //       done&&done();
      //     },1500)
      //   });
      // },10)


      //
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-mall-category-details {
    .mall-category_top {
      padding: 10px 30px;
    }

    &_tabs {
      padding: 30px 0;
      background: #fff;
      border-bottom: 1.1px solid #ddd;
      position: relative;
      z-index: 1;
    }

    .goods-list {
      padding: 30px;
      background: #eee;
      position: fixed;
      width: calc(100% - 60px);
      height: calc(100% - 370px);

      li {
        background: #fff;
        border-radius: 20px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0px 4px 22px 0px rgba(221, 221, 221, 0.3);

        .goods-info {
          margin-top: 30px;
          position: relative;
          z-index: 0;

          .goods-price {
            display: flex;
            align-items: center;
            margin-bottom: 20px;

            .now {
              color: #FF0000;
              font-size: 30px;
              margin-right: 20px;
            }

            .old {
              color: #999;
              text-decoration: line-through;
            }
          }

          i {
            position: absolute;
            right: 20px;
            bottom: 0;
            width: 60px;
            height: 54px;
            border-radius: 50%;
            background: #F84930;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            padding-top: 6px;
          }

          .sale {
            color: #999;
          }
        }
      }
    }
  }
</style>
