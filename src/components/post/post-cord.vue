<template>
  <div id="post-cord" :class="hideBorder&&'hide-border'">
    <!-- <router-link  :to="{name:'CityInformationDetail',query:{id:infoData.id}}"> -->
    <div class="cord-one" @click="goPage({path:'/cityInformation/detail',query:{id:infoData.id}})">

      <p class="post-title">{{infoData.title?infoData.title:''}}</p>

      <van-row gutter="10">
        <van-col span="8" v-for="(item,index) in JSON.parse(infoData.media)" v-if="item.url" :key="index">
          <!--<img :src=getPathByAssetPath(item.url) alt="" srcset="" >-->
          <div class="post-cord-img">
            <img-wrapper :src=getPathByAssetPath(item.url)></img-wrapper>
          </div>
        </van-col>
      </van-row>
      <div class="card-hot">
        <span class="min-label zd" v-if="infoData.attribute&&+infoData.attribute == 1"  ><em>置顶</em></span>
        <span class="min-label jh" v-if="infoData.attribute&&+infoData.attribute == 2"  ><em>精华</em></span>
        <a href="javascript:;" class="hot-data">
          <em>{{infoData.loveNum?infoData.loveNum:0}}人点赞</em>
        </a>
        <div class="cord-data">
          <em>{{getTime(infoData.createdAt)}}</em>
        </div>
      </div>
    </div>
    <!-- </router-link> -->
  </div>
</template>

<script>
  import {computedDate} from "../../util/index"
  import Labels from '@/components/template/labels'

  export default {
    name: "PostCord",
    props: ["hideBorder", 'infoData'],
    data() {
      return {
        labels: [
          {
            name: '人找车',
            color: '#20D4D0'
          },
        ],
        back: true
      }
    },
    methods: {
      getTime(time) {
        return computedDate(time)
      },
      goPage(param) {
        this.goPointPage({
          ...param
        })
      }
    },
    mounted() {

    },
    computed: {
      formationData() {
        return {}
      }
    },
    created() {
    },
  }
</script>

<style>

</style>


<style scoped lang="scss">
  @import "../../assets/theme";

  #post-cord {
    padding: 0px 30px;
    border-bottom: 1PX solid #eee;
    background-color: #fff;
    padding-bottom: 15px;

    &.hide-border {
      border-bottom: 0;
    }



    .post-title {
      font-size: 30px;
      color: #333;
      padding: 24px 0px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .post-cord-img {
      height: 180px;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
    }

    .van-row {
      text-align: center;
    }

    .card-hot {
      padding: 10px 0;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 30px;
        color: #cdcdcd;
        margin-left: 30px;
        &:nth-of-type(0) {
          margin: 0px;
        }
      }
      .min-label {
        font-size: $font-size-xsss;
        padding: 2px 10px 0;
        text-align: center;
        margin-right: 10px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        height: 28px;
      }
      .min-label.zd{
        border: 1.1px solid #FD6441;
        em{
          color: #FD6441;
        }
      }
      .min-label.jh{
        border: 1.1px solid #ff8040;
        em{
          color:#ff8040
        }
      }
      em {
        color: #b8b8b8;
      }

      .cord-data {
        display: inline-block;
      }
    }
  }

  .hot-data {
    margin-right: 20px;
  }
</style>
