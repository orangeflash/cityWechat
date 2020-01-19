<template>
  <div id="notice"   :style="{marginTop:`${topMargin}px`}">
    <aside class="symbol">
      <!--<img :src="icon" v-if="icon" class="symbol__img"/>-->
      <em v-if="notice.title || label"  class="symbol__label">{{notice.title || label}}</em>
      <!--<i v-else class="iconfont icon-xiaolaba symbol__icon"></i>-->
    </aside>
    <van-swipe class="seamless-warp" v-if="dataList.length" :autoplay="3000" :show-indicators="false" vertical>
      <van-swipe-item v-for="(i,key) in dataList" :key="key">
        <h1 class="notice-title" @click="goPage({name:'Announcement',params:{list:announceList,index:key}})">{{i||'暂无信息'}}</h1>
      </van-swipe-item>
    </van-swipe>
    <div v-else class="seamless-warp">
      <h1 class="notice-title">暂无信息</h1>
    </div>
    <button v-if="featureLabel" class="feature-btn" @click="$emit('featureClick')">
      {{featureLabel}}
    </button>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import _ from 'lodash'
  export default {
    name: "notice",
    props: ["data", "notice", "icon", "color", "label", "featureLabel", "direction", "entry", "pagePath","topMargin"],
    data() {
      return {
        announceList: []
      }
    },
    components: {},
    methods: {
      ...mapActions("home/components", ["getBasicStatistics", 'getAnnounceList', 'getBusinessList']),
      goPage(param){
        return this.goPointPage({
          obj : this,
          ...param
        });
      }
    },
    computed: {
      dataList() {
        //console.log('获取的数据为',_.map(this.announceList, ({content, title}) => title))
        return _.map(this.announceList, ({content, title}) => title) || []
      },
      getParams() {
        switch (this.pagePath) {
          case "home":
            return {
              type: 1,
              adType: 0
            };
          case "classification":
            return {
              type: 2,
              adType: 0
            }
        }
      }

    },
    watch: {},
    created() {
      this.getAnnounceList(this.getParams).then(val => this.announceList = val);
    }
  }
</script>
<style lang="scss">
  @import "../../assets/common";

  #notice .van-swipe-item {
    @include alignCenter;
  }
</style>
<style scoped lang="scss">
  @import "../../assets/common";

  #notice {
    height: 76px;
    line-height: 60px;
    border-radius: 60px;
    margin: 10px 8px;
    @include alignCenter;
    display: flex;
    align-content: center;
    align-items: center;
    padding: 0 20px;
    background-color: #fff;
    .seamless-warp {
      height: 100%;
      flex: 1;
    }
    .symbol {
      font-size: 0;
      @include alignCenter;
      position: relative;
      &:after {
        content: "";
        display: inline-block;
        height: 50%;
        @include positionAbsolute(50%, -23px, 0, null);
        transform: translateY(-50%);
        width: 1PX;
        background-color: #F4F4F4;
      }
      &__img {
        height: 100%;
      }
      &__label {
        color: $themeColor;
        font-size: 30px;
        font-weight: 900;
      }
      &__icon {
        color: #EB6262;
      }
    }
    .notice-title {
      font-size: 28px;
      color: #767676;
      width: 100%;
      height: 100%;
      padding-left: 52px;
      box-sizing: border-box;
      @include alignCenter;
      @include t-overflow;
    }
    .feature-btn {
      height: 50px;
      line-height: 50px;
      padding: 0 10px;
      color: white;
      font-size: 24px;
      background-color: $themeColor;
      border-radius: 12px;
    }
  }

</style>
