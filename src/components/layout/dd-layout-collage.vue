<template>

  <mall-scroll-goods
    v-if="list.length > 0"
    class="bg-f"
    top-class="pad-lr pad-t-15"
    name="GROUP PURCHASE"
    more-color="#1CA7AE"
    :title="config.infoTitle||'全民拼团'"
    path="/auxiliary/assemble"
    :style="{marginTop:config.topMargin+'px',marginBottom:config.isBottom+'px'}"
  >
    <dd-layout-div
      :width="251" :mar="[0,0,0,20]" :fillet="15"
      @click="goPointPage('/auxiliary/assemble/goodsDetails?assembleId='+item.id)"
      class="over-h box-sha-4-20 flex-g-0 posi-r"
      v-for="(item,key) in list" :key="key">
      <dd-layout-img
        :width="2.51"
        :height="2.49"
        :src="item.cover"
      />
      <dd-layout-div class="col-f fon-wb posi-a t0 l0 fon-b" bg="linear-gradient(90deg, #f93245 0%, #ed4e6e 100%)" :mar="[10,0,0]" :pad="[9,17,7]"
                     :fillet="[0,30,0,30]">{{item.groupNum}}人拼团
      </dd-layout-div>
      <dd-layout-div :pad="[20,10,25]">
        <dd-layout-div class="fon-wb pad-t-5 hide-e" :font-size="24">{{item.info}}</dd-layout-div>
        <dd-layout-div class="mar-t-15">
          <span class="col-price fon-b mar-r-5 fon-wb">￥{{item.money}}</span>
          <span class="col-9 t-d-l fon-xss fon-w5">￥{{item.originalPrice}}</span>
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
          type: 2
        },
        list: []
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeAssemble", ["getAssembleList"]),
      getList() {
        this.getAssembleList(this.params).then(result => {
          this.list = result.map(item => {
            return {
              id: item.id,
              cover: item.showImgs[0] && this.getSingleImg(item.showImgs[0].url),
              info: item.title,
              money: item.groupPrice,
              originalPrice: item.originalPrice,
              groupNum: item.groupNum,
              alonePrice: item.alonePrice
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
