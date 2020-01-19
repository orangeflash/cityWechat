<template>


  <mall-scroll-goods
    v-if="list.length > 0"
    class="bg-f pad-lr pad-t-15"
    name="GOOD QUALITY"
    more-color="#D36005"
    :title="config.infoTitle||'品质好货'"
    path="/auxiliary/mall"
    :style="{marginTop:config.topMargin+'px',marginBottom:config.isBottom+'px'}"
  >
    <dd-layout-div class="flex-wrap flex mar-t-10">
      <div class="w-454 h-277 bg-f9 mar-b-20 mar-r-10 flex-center over-h">
        <dd-layout-img
          @click="goPage(config.pictureList[0])"
          :width="4.54" :height="2.77" :fillet="0.16" :src="config.pictureList[0].url"
          v-if="config.pictureList[0].url"/>
        <i v-else class="iconfont icon-tupian" style="font-size: 80px"></i>
      </div>

      <div class="w-220 br-r-8 over-h"
           v-for="(item,key) in list"
           @click="goPointPage({path:'/auxiliary/mall/details',query:{goodsId:item.id}})"
           :class="key > 1 && 'mar-l-10 '"
           v-if="key < 4"
           :key="key">
        <div class="w-220 dh-163 fon-68 flex-center bg-f9 over-h">
          <dd-layout-img

            :src="item.cover" v-if="item.cover" :width="2.2" :height="1.63" :fillet="0.16"/>
          <i class="iconfont icon-tupian" v-else></i>
        </div>
        <div>
          <div class="fon-b fon-wb">{{item.storeName}}</div>
          <div class="dh-34 lineH-34 hide-e w100 fon-wb mar-t-10 mar-b-10">{{item.info}}</div>
          <div class="flex-wrap flex"><span class="col-price mar-r-10 fon-wb ">{{item.money}}元</span><span
            class="col-9 t-d-l fon-xss">{{item.price}}元</span></div>

        </div>
      </div>
    </dd-layout-div>
  </mall-scroll-goods>


</template>


<script>

  import {mapActions} from 'vuex'
  import {utilMixins} from "../../plugins/util-mixins";
  import DdLayoutImg from "./dd-layout-img";
  import MallScrollGoods from "../template/item/mall-scroll-goods";
  import {getEntryPath} from "../../plugins/get-entry-path";

  export default {
    components: {MallScrollGoods, DdLayoutImg},
    mixins: [utilMixins],
    props: {
      config: {
        type: Object,
        default: Object
      }
    },
    data() {
      return {
        list: []
      }
    },
    methods: {
      ...mapActions("mall", [
        'getMallGoodsList',
      ]),
      goPage(item) {
        //    this.$router.push("/yellowPage")
        if (item.entry) {
          try {
            if (!item.entry.query) {
              item.entry.query = {
                title: item.label,
                pid: item.entry.param.indexOf(',') >= 0 ? item.entry.param.split(",")[0] : item.entry.param,
                id: item.entry.param.indexOf(',') >= 0 ? item.entry.param.split(",")[1] : 0
              };
            }
          } catch (e) {

          }

          if (!item.entry.path)
            item.entry.path = getEntryPath(item.entry);
          if (!item.entry.path) return false;
          //this.$router.push(item.entry);
          return this.goPointPage({
            ...item.entry
          });
        }
      },
      getList() {
        this.getMallGoodsList(this.params).then(result => {
          this.list = result.map(item => {
            return {
              cover: item.showImgs.length && this.getSingleImg(item.showImgs[0].url),
              info: item.title,
              price: (+item.originalPrice).toFixed(2),
              money: (+item.currentPrice).toFixed(2),
              id: item.id,
            }
          })
        })
      }
    },
    created() {
      this.getList()
    }
  }

</script>
