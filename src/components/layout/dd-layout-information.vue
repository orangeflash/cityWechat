<template>


  <mall-scroll-goods
    v-if="list.length > 0"
    class="bg-f pad-lr pad-t-15"
    name="LOCAL INFORMATION"
    more-color="#AA6522"
    :title="config.infoTitle||'同城资讯'"
    path="/cityInformation"
    :style="{marginTop:config.topMargin+'px',marginBottom:config.isBottom+'px'}"
  >
    <dd-layout-div width="100%">
      <div v-for="(item, index) in list"
           class="pad-b"
           :class="index < 2&&'br-b-e'"
           :key="index">
        <div class="pad-t flex-bt dh-145"
             @click="goPointPage({path:'/cityInformation/detail',query:{id:item.id}})">
          <div class="flex-g-1 mar-r dh">
            <div class="order-title-r2 fon-lg-i fon-wb dh-100">{{item.title}}</div>
            <div class="col-9 mar-t">{{item.name}} {{item.time}}
              <!--<span class="mar-l">-->
              <!--<i class="iconfont icon-yanjing3 mar-r-10"></i>{{item.view}}看过-->
              <!--</span>-->
            </div>
          </div>
          <div class="bg-e-i miw-215 w-215 dh-145 over-h br-r-16" v-if="item.cover">
            <img-wrapper :src="item.cover"/>
          </div>
        </div>
      </div>
    </dd-layout-div>
  </mall-scroll-goods>

</template>


<script>

  import {mapActions} from 'vuex'
  import {computedDate, format} from "../../util";
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
          size: 3
        },
        list: []
      }
    },
    methods: {
      ...mapActions("cityInformation", ['getCityInfoList']),
      getList() {
        this.getCityInfoList(this.params).then(result => {
          this.list = result.map(item => {
            let media = JSON.parse(item.media);
            return {
              title: item.title,
              name: item.customUser || '神秘人',
              view: item.browseNum,
              cover: media[0].url ? this.getSingleImg(media[0].url) : null,
              love: item.loveNum,
              id: item.id,
              time: computedDate(item.createdAt)
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
