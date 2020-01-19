<template>
  <div class="dd-mall-category-details">
    <Header link="/auxiliary/mall/category"/>
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
      >
      </dd-goods-nav>
    </div>
    <ul class="goods-list">
      <scroller
        :on-refresh="onrefresh"
        :on-infinite="onInfinite"
        v-if="goodsList.length>0"
      >


        <li class="goods-single"
            v-for="(item,key) in goodsList"
            :key="key"
            @click="goPointPage({path:'/auxiliary/mall/details',query:{goodsId:item.id}})"
        >
          <dd-frame
            :src="item.showImgs[0]&&getSingleImg(item.showImgs[0].url)"
            :size="104"
            :title="item.title"
            :titleSize="14"
            titleHeight="50"
          >
            <template slot="info">
              <div class="goods-info">
                <div class="goods-price">
                  <span class="now">￥{{item.currentPrice}}</span>
                  <span class="old">￥{{item.originalPrice}}</span>
                </div>
                <div class="sale">销量 {{item.salesNum}}</div>
                <i class="iconfont icon-gouwuche"></i>
              </div>
            </template>
          </dd-frame>
        </li>
      </scroller>
      <not-data v-else></not-data>
    </ul>
  </div>
</template>

<script>
  import Search from '@/components/template/search';
  import DdGoodsNav from '@/components/template/mall/dd-goods-nav';
  import DdFrame from '@/components/template/dd-frame';
  import {utilMixins} from "@/plugins/util-mixins";
  import {mapActions} from 'vuex';
  import {hideLoading, showLoading} from "../../../util";

  export default {
    mixins: [utilMixins],
    components: {DdGoodsNav, Search, DdFrame},
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
      ...mapActions('mall', [
        'getMallGoodsList'
      ]),
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
        const result = await this.getMallGoodsList(this.params);
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
      background: #fff;
      position: fixed;
      width: calc(100% - 60px);
      height: calc(100% - 440px);

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
