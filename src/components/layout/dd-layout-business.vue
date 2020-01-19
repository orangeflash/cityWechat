<template>


  <mall-scroll-goods
    v-if="list.length > 0"
    class="bg-f"
    name="POPULAR BUSINESS"
    more-color="#d3052c"
    :title="config.infoTitle||'商家推荐'"
    top-class="pad-lr pad-t-15"
    path="/businessDistrict"
    :style="{marginTop:config.topMargin+'px',marginBottom:config.isBottom+'px'}"
  >
    <div class="mar-l w-150 pad-30 bg-f br-r-16 box-sha"
         v-for="(item,key) in list"
         @click="goPointPage({path:'/shopDetail',query:{storeId:item.id}})"
         :key="key">
      <div class="w-150 dh-150 over-h flex-center bg-f9">
        <dd-layout-img :src="item.cover"
                       v-if="item.constructor" :width="1.5" :height="1.5" :fillet="0.16"/>
        <i class="iconfont icon-tupian fon-68" v-else></i>
      </div>
      <div>
        <div class="dh-34 lineH-34 hide-e w100 mar-t mar-b-10 fon-wb">{{item.info}}</div>
      </div>
    </div>

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
    name: "business",
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

        },
        list: []
      }
    },
    methods: {
      ...mapActions("home/components", ["getBusinessList"]),
      getList() {
        this.getBusinessList(this.params).then(result => {
          this.list = result.map(item => {
            item.storeLogo = JSON.parse(item.storeLogo)

            return {
              cover: item.storeLogo.length && this.getSingleImg(item.storeLogo[0].url),
              info: item.storeName,
              id: item.id,
            }
          })
        })
      }
    },
    watch: {
      config: {
        handler(newVal) {
          this.getList();
        },
        immediate: true,
      }
    },
    created() {
      // alert(8151313)
      if (this.config.businessType == 0) this.params.sort = 'new'
      else this.params.isRecommend = 1
    }
  }

</script>
