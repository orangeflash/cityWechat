<template>
  <div id="StoreTab" v-if="tabList.length">
    <van-tabs :color="$themeColor" @click="changeTab" v-model="activeIndex" :line-width="15">
      <van-tab v-for="(item,index) in tabList" :key="index" :title="item.name">
        <store-tab-item :sort="tabList[index]&&tabList[index].value" :store-list="storeList" v-if="storeList&&storeList.length"/>
        <not-data v-else notShowTips="true"></not-data>
      </van-tab>
    </van-tabs>
    <!--<footer class="c-more-btn" @click="hasMore&&onInfinite()">-->
      <!--{{hasMore?'加载更多':'没有更多了'}}-->
    <!--</footer>-->

    <More :status="hasMore"></More>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import StoreTabItem from "./store-tab-item";
  import EmptyView from "../basic/empty-view";
  import {getLocation} from "../../util/wechat-util";
  import {hideLoading, showLoading} from "../../util";

  export default {
    name: "StoreTab",
    components: {EmptyView, StoreTabItem},
    data() {
      return {
        activeIndex: 0,
        storeList: [],
        latLng:{},      //用户当前的经纬度
        page:1,
        size:10,
        index:0,
        hasMore:true
      }
    },
    methods: {
      ...mapActions("shop", ["getShopListByParams"]),
      ...mapActions("common", ["getStoreConfig"]),
      clickHandle() {
        this.$emit("tap");
      },
      async changeTab(index) {
        this.index = index;
        this.page = 1;
        this.storeList = [];
        this.hasMore = true;
        try {
          // 获取用户当前的坐标
          let latLng = await getLocation();
          this.latLng.lat = latLng.latitude;
          this.latLng.lng = latLng.longitude;
        } catch (e) {
          console.log(e)
        }
        this.getStoreList()
      },
      onInfinite(){
        this.page++;
        this.getStoreList()
      },
      async getStoreList(){
        if(this.hasMore){
          const sort = this.tabList[this.index] && this.tabList[this.index].value;
          showLoading();
          const arr = await this.getShopListByParams({
            sort,
            size:this.size,
            page:this.page,
            ...this.latLng
          });
          if(arr.length){
            this.storeList = this.storeList.concat(arr)
          }else{
            this.page--;
            this.hasMore = false;
          }
          hideLoading();
        }
      }
    },
    computed: {
      ...mapState("common", {
     //   latLng: state => state.latLng,
        storeConfig: state => state.storeConfig
      }),
      tabList() {
        return this.storeConfig.sort
      }
    },
    async created() {
      await this.getStoreConfig();
      this.changeTab(0);
    }
  }
</script>

<style scoped lang="scss">
@import "../../assets/common";
 #StoreTab .van-tab--active .van-ellipsis{
 color: $themeColor;
}
.c-more-btn {
  background-color: #fff;
  padding: 0.3rem;
  text-align: center;
  font-size: 0.28rem;
  color: #2d2d2d;
}
</style>
