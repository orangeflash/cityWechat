<template>
  <div id="StoreTab" v-if="tabList.length">
    <van-tabs :color="$themeColor" @click="changeTab" v-model="activeIndex" :line-width="15">
      <van-tab v-for="(item,index) in tabList" :key="index" :title="item.name">
      </van-tab>
    </van-tabs>
    <div v-if="storeList&&storeList.length">
      <job-tab-item :jobType="tabList[activeIndex].value=='newRecruit'?2:1" page-type="list" :store-list="storeList"/>
      <More :status="hasMore"></More>
    </div>
    <not-data v-else></not-data>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import JobTabItem from "./job-tab-item";
  import {getLocation} from "../../../util/wechat-util";
  import {hideLoading, showDialog, showLoading} from "../../../util";
  import More from '@/components/template/more';

  export default {
    name: "JobTab",
    components: {JobTabItem, More},
    data() {
      return {
        activeIndex: 0,
        storeList: [],
        latLng: {},      //用户当前的经纬度
        queryParams: {
          // typeId: null,        // 搜索类型
          page: 1,             //页码 默认第一页
          size: 10,            //每页数量
        },
        hasMore: true
      }
    },
    methods: {
      ...mapActions("shop", ["getShopListByParams"]),
      ...mapActions("jobHunt", ["getJobConfig","getJobCategory","getJobList","getHuntList"]),
      async changeTab(index,type) {
        // console.log(index,type)
        this.activeIndex = index;
        this.hasMore = true;
        if(type!='isSearch'){
          this.queryParams.word = '';
        }
        this.queryParams.page = 1;
        // this.queryParams.sort = this.tabList[index] && this.tabList[index].value;
        this.getStoreList(true)
        console.log(index)
      },
      onInfinite() {
        if (this.hasMore) {
          this.queryParams.page++;
          this.getStoreList();
        }
      },
      async getStoreList(refresh) {
        // console.log(this.index)
        showLoading();
        if (refresh) this.queryParams.page = 1;
        const arr = this.tabList[this.activeIndex].value=='newRecruit'?await this.getHuntList({...this.queryParams,}):await this.getJobList({...this.queryParams,});
        refresh?this.storeList=arr:this.storeList = this.storeList.concat(arr)
        if (arr.length<this.queryParams.size) {
          this.hasMore = false;
        }
        hideLoading();
      },
    },
    computed: {
      ...mapState("jobHunt", {
        jobConfig: state => state.jobConfig
      }),
      tabList() {
        return this.jobConfig.sort&&this.jobConfig.sort.length>0?this.jobConfig.sort:[{name:'最新招聘',value:'newRecruit'},{name:'最新求职',value:'newJob'}]
      }
    },
    async created() {
      await this.getJobConfig();
      // try {
      //   // 获取用户当前的坐标
      //   let latLng = await getLocation();
      //   this.latLng.lat = latLng.latitude;
      //   this.latLng.lng = latLng.longitude;
      //   // showDialog(latLng)
      // } catch (e) {
      //   console.log(e)
      // }
      this.changeTab(0);
      // showDialog(this.jobConfig.sort)
      console.log(this.jobConfig.sort)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #StoreTab .van-tab--active .van-ellipsis {
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
