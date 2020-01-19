<template>
  <div id="RedBag">
    <Header moreName="塞福利" @onMore="goPointPage({path: '/personal/myPublication',})"></Header>
    <!--<scroller-->
      <!--v-if="dataList.length"-->
      <!--:on-refresh="onRefresh"-->
      <!--:on-infinite="onInfinite" class="scrollermt">-->
    <div class="redrank">
      <div class="redrankhd_cells">
        <div v-for="(item,index) in nav" :key="index" class="redrankhd_cell" @click="tabclik(index)">
          {{item.name}}
        </div>
      </div>
      <div class="redrankbd" :class="{redrankbd2:activeIndex}">
          <div class="redrankbd_div">
            <CellList :ranklist="activeIndex?rankList.receiveList:rankList.giveList"></CellList>
          </div>
      </div>
    </div>
  <!--</scroller>-->
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import {utilMixins} from "../../plugins/util-mixins";
  import {updateShareConfig} from "../../util/wechat-util";
  import {hideLoading, showDialog, showLoading,getUrlParams,parseObjToParams} from "../../util";
  import {Toast} from 'vant';
  import bgimg from "../../assets/img/redbag/rankbg.png";
  import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";
  import CellList from "../../components/basic/celllist";
  const defaultPage = () => ({pageSize: 10, pageNum: 1});
  export default {
    name: "RedBag",
    components: { BasicNoteItem,CellList },
    data() {
      const pageOption = defaultPage();
      return {
        ...pageOption,
        nav:[{name:'土豪排行榜'},{name:'领取排行榜'}],
        rankList: {},
        bgimg,
        PlaceholderImg,
        activeIndex:0,
      }
    },
    methods: {
      ...mapActions("post", [
        "getRedRank",]),
      tabclik(e){
        console.log(e)
        this.activeIndex=e;
      },
      //红包数据
      async rankData(){
        let {data}=await this.getRedRank()
        console.log(data)
        this.rankList=data
      },
    },
    mixins: [utilMixins],
    computed: {
      // ...mapState("common", {
      //   latLng: state => state.latLng
      // }),
      // ...mapState({
      //   user: state => state.user
      // }),
    },
    async created() {
      // 获取列表
      this.rankData();
    }
  }
</script>
<style scoped lang="scss">
  @import "../../assets/common";
#RedBag {
  position: fixed;
  width: 100%;
  height: calc(100vh - 88px);
  .scrollermt{
    /*margin-top: 88px;*/
  }
  .redrank{
    background-image: url("../../assets/img/redbag/rankbg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -webkit-background-size: 100% 100%;
    -o-background-size: 100% 100%;
    background-position: center 0;
    @include flex-center($direction:column,$align:stretch);
    @include widhei;
    /*height: auto;*/
    padding: 200px 30px 50px;
    box-sizing: border-box;
    /*&>div{*/
      /*width: 100%;*/
    /*}*/
    &hd_cells{
      color: #C57000;
      height: 80px;
      min-height: 80px;
      font-size: 28px;
      font-weight: bold;
      background:linear-gradient(5deg,rgba(254,238,176,1) 0%,rgba(255,194,76,1) 100%);
      border-radius: 20px;
      @include flex-center;
/*      &:nth-child(1){
        border-right: 10PX solid #C57000;
      }*/
    }
    &hd_cell{
      height: 80px;
      flex: 1;
      @include flex-center;
      &:nth-child(1){
        border-right: 1PX solid #FCB64D;
      }
    }
    &bd{
      margin-top: 50px;
      flex: 1;
      height: 1px;
      background: #ffffff;
      border-radius: 20px;
      position: relative;
      &:before{
        @include triangle($width:20px,$direction:top,$color:#f9f9f9);
        transform: translate(20vw, -100%);
      }
    }
    &bd2{
      &:before{
        @include triangle($width:20px,$direction:top,$color:#f9f9f9);
        transform: translate(66vw, -100%);
      }
    }
    &bd_div{
      border-radius: 20px;
      height: 100%;
      overflow-y: scroll;
    }
  }
}
</style>
