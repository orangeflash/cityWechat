<template>
  <mall-scroll-goods
    v-if="list.length > 0"
    class="bg-f"
    name="GOOD QUALITY"
    more-color="#D36005"
    :title="config.infoTitle||'精选活动'"
    top-class="pad-lr pad-t-15"
    path="/auxiliary/activity"
    :style="{marginTop:config.topMargin+'px',marginBottom:config.isBottom+'px'}"
  >
    <div class="w-330 flex-g-0 br-r-20 mar-l  posi-r over-h box-sha"
         @click="goPointPage('/auxiliary/activity/details?activityId='+item.id)"
         :class="key == list.length - 1&&'mar-r'" v-for="(item,key) in list " :key="key">
      <div class="w-330 dh-170 bg-f9 flex flex-center ba_f9 over-h">
        <dd-layout-div class="posi-a pad-lr10 t0 l0 pad-t-5 pad-b-5 br-br-r-20 fon-b col-f fon-wb" bg="linear-gradient(90deg, #f93245 0%, #ed4e6e 100%)">
          <i class="iconfont icon-date-2 mar-r-10 fon-xss mar-l-10 col-f"></i>进行中
        </dd-layout-div>
        <img-wrapper v-if="item.cover" :src="item.cover"/>
        <i v-else class="iconfont icon-tupian" style="font-size: 80px"></i>
      </div>
      <div class="pad-tb fon-wb hide-e dh-34 pad-lr">{{item.info}}</div>
    </div>
  </mall-scroll-goods>
</template>


<script>

  import {mapActions} from 'vuex'
  import {format} from "../../util";
  import {utilMixins} from "../../plugins/util-mixins";
  import MallScrollGoods from "../template/item/mall-scroll-goods";

  export default {
    components: {MallScrollGoods},
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
          type: 1,     //1进行中，2未开始，3已结束   默认1：以为UI上面没有全部这选项
          typeId: null,    //分类Id
          word: null       //关键字
        },
        list: []
      }
    },
    methods: {
      ...mapActions("activity", ["getActivityList"]),
      getList() {
        const now = new Date().getTime()
        this.getActivityList(this.params).then(result => {
          this.list = result.map(item => {
            return {
              cover: item.showImgs.length && this.getSingleImg(item.showImgs[0].url),
              info: item.name,
              time: this.computedDate(item.createdAt),
              tag: item.typeName,
              price: item.originalPrice,
              money: item.currentPrice,
              startTime: format(item.startTime * 1000),
              isOver: now >= item.endTime * 1000,
              id: item.id,
              count: item.count
            }
          })
          console.log("this.list", this.list)
        })
      }
    },
    created() {
      this.getList();
    }
  }

</script>
