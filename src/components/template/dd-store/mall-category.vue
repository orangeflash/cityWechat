<template>

  <div class="pad-b mar-b-100">
    <div class="dh flex flex-center goods-title-bg fon-b">猜你喜欢</div>
    <DdTabs
      v-model="active"
      :tabs="tabs"
      back="true"
      @change="tabsChange"
    ></DdTabs>
    <DdContainer v-if="methodName == 'getAssembleList'">
      <div slot="container">
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
    <GoodsCard :list="goodsList"/>
    <not-data v-if="isRequest"></not-data>
    <More v-if="goodsList.length > 0" :status="hasMore"></More>
  </div>
</template>


<script>

  import DdTabs from '@/components/template/dd-tabs';
  import GoodsCard from '@/components/template/goods-card';
  import DdStoreOrder from '@/components/template/dd-store/order-two'
  import DdContainer from '@/components/template/other/container'
  import {hideLoading, showLoading} from "../../../util";
  import {mapActions} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdTabs, GoodsCard, DdStoreOrder, DdContainer},
    props: {
      methodName: {
        type: String,
        default: 'getMallGoodsList'
      },
      methodCategory: {
        type: Object,
        default() {
          return {
            name: 'getMallCategory',
            params: {
              term: 15
            }
          }
        }
      },
    },
    data() {
      return {
        active: 0,
        hasMore: true,
        isRequest: false,
        goodsList: [],
        tabs: [],
        params: {
          page: 1,
          size: 10,
        },
      }
    },
    methods: {
      ...mapActions("mall", [
        'getMallGoodsList',
        'getMallCategory'
      ]),
      ...mapActions("storeAuxiliary/storeAssemble", ["getAssembleList", "getGoodsCategory"]),
      /** 获取商品列表 */
      async getGoods(refresh) {
        showLoading();
        let result = await this[this.methodName](this.params);

        if (this.methodName == "getAssembleList") {
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
        } else {
          result.forEach(item => {
            item.vipMoney = this.platform.openVip ? +item.vipMoney : null;
          })
        }
        //console.log(result)
        this.goodsList = refresh ? result : this.goodsList.concat(result);
        this.hasMore = result.length >= this.params.size;
        this.isRequest = true;
        hideLoading();
        return this.hasMore;
      },
      /**上拉加载 */
      async onInfinite(done) {
        if (this.hasMore) {
          this.params.page++;
          await this.getGoods();
        }
      },
      /** tabs事件 */
      tabsChange(item, key) {
        this.params.page = 1;
        this.params.typePid = item.id;
        this.getGoods(true);
      }
    },
    created() {
      this[this.methodCategory.name](this.methodCategory.params).then(result => {
        this.tabs = [{name: '全部', active: true}].concat(result);
      })
      this.getGoods();
    }
  }

</script>
