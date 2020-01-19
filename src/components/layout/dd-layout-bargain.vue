<template>


  <mall-scroll-goods
    v-if="list.length > 0"
    class="bg-f"
    top-class="pad-lr pad-t-15"
    name="REDUCE THE PRICE"
    more-color="#4854CC"
    :title="config.infoTitle||'天天砍价'"
    path="/auxiliary/bargain"
    :style="{marginTop:config.topMargin+'px',marginBottom:config.isBottom+'px'}"
  >
    <dd-layout-div
      :width="251" :mar="[0,0,0,20]" :fillet="15"
      @click="goPointPage('/auxiliary/bargain/details?bargainId='+item.id)"
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

  import {utilMixins} from "../../plugins/util-mixins";
  import {mapActions} from 'vuex'
  import DdLayoutImg from "./dd-layout-img";
  import MallScrollGoods from "../template/item/mall-scroll-goods";

  export default {
    components: {MallScrollGoods, DdLayoutImg},
    mixins: [utilMixins],
    name: "bargain",
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
          size: 10
        },
        list: []
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeBargain", ["getBargainList"]),
      getList() {
        this.getBargainList(this.params).then(result => {
          this.list = result.map(item => {
            return {
              cover: this.getSingleImg(item.logo),
              money: item.floorPrice,
              price: item.price,
              info: item.title,
              joinNum: item.receiveNum || 0,
              browseNum: item.viewNum || 0,
              id: item.id
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
