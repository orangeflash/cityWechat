<template>
  <div id="List">
    <van-tabs :color="$themeColor" @click="changeTab" v-model="activeIndex" :line-width="55">
      <van-tab v-for="(item,index) in tabList" :key="index" :title="item.name">
        <list-item :store="storeList" :tab="index" :type="type" v-if="storeList&&storeList.length"/>
        <More :status="!finished"></More>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import ListItem from "./list-item";
  import EmptyView from "../basic/empty-view";
  import {getLocation} from "../../util/wechat-util";
  import {loadavg} from "os";
  import {setTimeout} from "timers";
  import More from '@/components/template/more';

  export default {
    name: "List",
    components: {EmptyView, ListItem,More},
    data() {
      return {
        activeIndex: 0,
        loading: false, //是否处于加载状态，加载过程中不触发load事件
        finished: false, //是否已加载完成，加载完成后不再触发load事件
        offset: 50, //滚动条与底部距离小于 offset 时触发load事件
        type: 0,
        pageNum: 1,
        index: 0,
        tabList: [
          {
            name: "常用",
            value: "hot"
          },
          {
            name: "最新",
            value: "new"
          },
          {
            name: "附近",
            value: "nearest"
          }
        ],
        storeList: [],
        latLng: {} //用户当前的经纬度
      };
    },
    methods: {
      ...mapActions("YellowPage", ["getYellowList"]),
      ...mapActions("common", ["getStoreConfig"]),
      clickHandle() {
        this.$emit("tap");
      },
      // 上拉加载更多
      onInfinite() {
        this.pageNum++;
        if (this.finished) return false;
        this.loadMore();
      },
      // 加载黄页列表数据
      async loadMore(refresh) {
        const sort =
          this.tabList[this.index] && this.tabList[this.index].value;
        const store = await this.getYellowList({
          sort,
          page: this.pageNum,
          size: 10,
          ...this.latLng
        });
        for (let i in store) {
          store[i].tel =
            store[i].tel.substr(0, 3) + "****" + store[i].tel.substr(7);
        }

        this.storeList = refresh ? store : this.storeList.concat(store);


        this.finished = store.length == 0;
      },
      async changeTab(index) {
        this.index = index;
        this.pageNum = 1;
        this.finished = false;
        try {
          // 获取用户当前的坐标
          console.log("获取的位置信息");
          let latLng = await getLocation();
          this.latLng.lat = latLng.latitude;
          this.latLng.lng = latLng.longitude;
        } catch (e) {
          console.log(e);
        }
        this.loadMore('refresh');
      }
    },
    computed: {
      ...mapState("common", {
        storeConfig: state => state.storeConfig
      })
    },
    async created() {
      this.fullpath = this.$router.history.current.path;
      await this.getStoreConfig();
      // 等待数据加载完毕以后在进行添加scroll事件
      await this.changeTab(0);
      this.onscroll(this.onInfinite, this.$route.path)
    }
  };
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #List .van-tab--active .van-ellipsis {
    color: $themeColor;
  }
</style>
