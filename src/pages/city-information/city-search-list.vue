<template>
  <div id="post-cord">
    <div v-for="(listItem,index) in infoDataList.data" :key="index"  v-if="infoDataList.data">>
        <div class="cord-one" @click="goPage({name:'CityInformationDetail',query:{id:1}})">
            <p class="post-title">{{listItem.title ? listItem.title:''}}</p>
            <van-row  gutter="10">
                <!-- {{infoDataList}} -->

                <van-col span="8" v-for="(item,index) in infoDataList"   :key="index">
                <img :src=getPathByAssetPath(item.url)  alt="" srcset="" class="post-cord-img">
                </van-col>
            </van-row>
            <div class="card-hot">
                <a href="javascript:;" >
                <i class="iconfont icon-yanjing3"></i>
                <em>{{listItem.browseNum ? listItem.browseNum:0}}</em>
                </a>
                <a href="javascript:;">
                <i class="iconfont icon-like-b"></i>
                <em>{{listItem.loveNum?listItem.loveNum:0}}</em>
                </a>
                <a href="javascript:;">
                <i class="iconfont icon-pinglun2"></i>
                <em>{{listItem.commentNum?listItem.commentNum:0}}</em>
                </a>
                <a href="javascript:;">
                <i class="iconfont icon-fenxiang-tianchong"></i>
                <em>{{listItem.shareNum ? listItem.shareNum : 0}}</em>
                </a>
                <div class="cord-data">
                <em>{{listItem.created_at ? listItem.created_at.split('')[0]:''}}&nbsp;&nbsp;&nbsp;{{listItem.created_at ? listItem.created_at.split('')[1]:''}}</em>
                </div>
            </div>
        </div>
    </div>
    <div class="noNews" v-if="!(infoDataList.data&&infoDataList.data.length)">
      <img :src="myPublicationPlaceholder" alt="" srcset=""  class="myPublicationPlaceholder-img">
       <em class="time-no-result">暂无搜索结果</em>
    </div>
  </div>
</template>

<script>
  import myPublicationPlaceholder from "../../assets/img/personal/my_publication_placeholder.jpg"
  import {mapActions, mapState, mapGetters, mapMutations} from "vuex";
  export default {
    name: "PostCord",
    data() {
      return {
        myPublicationPlaceholder,
        infoDataList:'',
        page:1,
      }
    },
    methods: {
    ...mapActions("cityInformation/CitySrarch",["getSearchByKeyword"]),
      async getSearchList(){
        this.infoDataList = await this.getSearchByKeyword({
            keyword:this.$route.query.q,
            page:this.page,
        })
      },
      goPage(param){
        this.goPointPage({
          obj:this,
          ...param
        })
      }
    },

    mounted() {

    },
    created() {
      this.getSearchList();
    },
  }
</script>

<style scoped lang="scss">
  @import "../../assets/theme";
  #post-cord {
    padding: 0px 30px;
    border-bottom: 1PX solid #eee;
    background-color: #fff;
    padding-bottom: 15px;
    &.hide-border{
      border-bottom: 0;
    }
    .post-title {
      font-weight: 900;
      font-size: $font-size-xl;
      color: rgba(51, 51, 51,.7);
      padding: 24px 0px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .post-cord-img {
      width: 100%;
      padding: 0px 5px;

    }
    .van-row {
      text-align: center;
    }
    .van-col {
      margin-right: 9px;
    }
    .card-hot {
      height: 50px;
      line-height: 50px;
      .iconfont {
        font-size: 30px;
        color: #cdcdcd;
        margin-left: 30px;
        &:nth-of-type(0) {
          margin: 0px;
        }
      }
      em {
        color: #b8b8b8;
      }
      .cord-data {
        float: right;
      }
    }
  }
   #post-cord .noNews{
      width: 100%;
      height:99vh;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: transparent;
      overflow-Y: hidden;
  }
  .myPublicationPlaceholder-img{
    justify-content: center;
      height: 400px;
  }
  .time-no-result{
      font-size: 25px;
      color: #cdcdcd;
      margin-top: 15px;
  }
</style>
