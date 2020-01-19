<template>

  <mall-scroll-goods
    v-if="list.length > 0"
    class="bg-f"
    top-class=" pad-lr pad-t-15"
    name="FLASH SALE"
    :title="config.infoTitle||'限时抢购'"
    path="/auxiliary/rushBuy"
    :style="{marginTop:config.topMargin+'px',marginBottom:config.isBottom+'px'}"
  >

    <dd-layout-div
      :width="251" :mar="[0,0,0,20]" :fillet="15"
      @click="goPointPage({path:'/auxiliary/rushBuy/rushBuyDetails',query:{id:item.id}})"
      class="over-h box-sha-4-20 flex-g-0"
      v-for="(item,key) in list" :key="key">
      <dd-layout-img
        :width="2.51"
        :height="2.49"
        :src="item.cover"
      />
      <dd-layout-div :pad="[20,10,25]">
        <dd-layout-div class="fon-wb pad-t-5 hide-e" :font-size="24">{{item.info}}</dd-layout-div>
        <dd-layout-div class="mar-t-15">
          <span class="col-price mar-r-5 fon-wb">￥{{item.money}}</span>
          <span class="col-9 t-d-l fon-xss fon-w5">￥{{item.price}}</span>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>

  </mall-scroll-goods>
</template>


<script>

  import {mapActions} from 'vuex'
  import {format} from "../../util";
  import {utilMixins} from "../../plugins/util-mixins";
  import DdLayoutImg from "./dd-layout-img";
  import MallScrollGoods from "../template/item/mall-scroll-goods";

  export default {
    components: {MallScrollGoods, DdLayoutImg},
    mixins: [utilMixins],
    name: "activity",
    props: {
      config: {
        type: Object,
        default: Object
      }
    },
    data() {
      return {
        params: {
          page: 1,
          size: 10,
          type: 3,
        },
        list: []
      }
    },
    methods: {
      ...mapActions('rushBuy', ['getRushGoodsList']),
      getList() {
        this.getRushGoodsList(this.params).then(result => {
          this.list = result.map(item => {
            return {
              cover: item.showImgs.length && this.getSingleImg(item.showImgs[0].url),
              info: item.title,
              price: (+item.originalPrice).toFixed(2),
              money: (+item.rushPrice).toFixed(2),
              id: item.id,
            }
          })
        })
      }
    },
    created() {
      this.getList();
    }
  }

</script>
