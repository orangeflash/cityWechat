<template>
  <div id="NoticeWithInfo" :style="{marginTop:`${topMargin}px`}">
    <div class="notice-icon">
      <i   v-if="icon" class="iconfont icon-xiaolaba notice-icon__icon"></i>
      <img-wrapper v-else class="notice-icon__img" :src="dataMovement"/>
    </div>
    <ul class="info-list" @click="goPointPage({path:link})">
      <li class="info-list__item" v-for="(item,keys) in rearrange" :key="keys">
        <em>{{item.title?item.title:''}}:</em><em
        class="info-list__green">{{formatNumber(item.content?item.content:'0')}}</em></li>
    </ul>
    <div v-if="isRight" class="notice-right" @click="$emit('right-click')">
      <i class="iconfont notice-right__icon" :class="isRight.icon"></i>
      <span>{{isRight.text}}</span>
    </div>
    <router-link v-else to="/home/helpPage" class="feature-btn">帮助</router-link>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import _ from 'lodash'
  import dataMovement from "../../assets/img/home/data-movement.gif"
  export default {
    name: "NoticeWithInfo",
    props: ["notice", "icon", 'noticeInfo', "infoList","link","topMargin","source","isRight"],
    data() {
      return {
        statistics: [],
        dataMovement,
      }
    },
    methods: {
      ...mapActions("home/components", ["getBasicStatistics","getPostStatistics","getStoreStatistics", 'getAnnounceList', 'getBusinessList',"getJobStatistics"]),
      formatNumber(num) {
        if (!num) return '';
        if (num > 10000) {
          let formatNum = (num / 10000).toFixed(2);
          return formatNum + "万"
        }
        return num;
      },
      getTabLabelByKey(key) {
        console.log(this.$props.source)
        let label = null;
        switch (key) {
          case 'post':
            label = '发布';
            break;
          // case 'enter':
          //   label = '商家';
          //   break;
          case 'browse':
            label = '浏览';
            break;
          case 'store':
          case 'enter':
            label = '入驻';
            break;
          case 'share':
            label = '分享';
            break;
        }
        return label;
      },
      async getNoticeInfo() {
        let data=[]
        if(this.$props.source=='postIndex'){
          data = await this.getPostStatistics();
        }
        else if(this.$props.source=='storeIndex'){
          data = await this.getStoreStatistics();
        }
        else if(this.$props.source=='jobHuntIndex'){
          data = await this.getJobStatistics();
        }
        else {
          data = await this.getBasicStatistics();
        }
        //console.log("获取到的数据为",data)
        this.statistics = await _.map(data, (value, key) => ({
          title: this.getTabLabelByKey(key),
          content: value
        }))
      },
      goPage(link){
        return this.goPointPage({
          path : link,
        });
      }
    },
    computed: {
      rearrange() {
        //替换商家为入驻
        const infolist=this.infoList.toString().replace(/商家/g,'入驻').split(',')
        //只显示后台配置的统计数据
        const noticeInfo = this.statistics.filter(({title}) => infolist.indexOf(title) > -1);
        //console.log(this.statistics,noticeInfo,infolist,this.source)
        if (!noticeInfo.length) return [];
        // const itemOne = _.find(noticeInfo, ({title}) => title === "浏览")
        // const itemTwo = _.find(noticeInfo, ({title}) => title === "发布")
        // const itemThree = _.find(noticeInfo, ({title}) => title === "入驻")
        // return noticeInfo
        const Statistics = [];
        for(let i = 0; i<infolist.length;i++){
          _.find(noticeInfo, ({title}) => title === infolist[i])&&Statistics.push(_.find(noticeInfo, ({title}) => title === infolist[i]));
        }
        return Statistics

         //return [itemTwo, itemOne, itemThree];
      }
    },
    created() {
      this.getNoticeInfo();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  #NoticeWithInfo {
    font-size: 28px;
    color: #666;
    height: 96px;
    @include alignCenter;
    padding-left: 32px;
    background-color: #fff;
    margin-bottom: 1PX;
    .notice-icon {
      @include alignCenter;
      width: 45px;
      height: 45px;
      &__img{
        margin-top: -12px;
      }
      &__icon{
        color: $themeColor;
        font-size: 40px;
        margin-top: 5px;
      }
    }
    .notice-right{
      @include flex-center();
      padding: 0 20px;
      border-left: 1.1px solid #dddddd;
      &__icon{
        color: $themeColor;
        font-size: 40px;
        margin-top: 5px;
        margin-right: 10px;
      }
    }
    .info-list {
      flex: 1;
      @include alignCenter;
      @include t-overflow;
      &__item {
        font-size: 28px;
        margin-left: 15px;
      }
      &__green {
        color: $themeColor;
        margin-left: 12px;
      }
    }
    .feature-btn {
      padding: 0 32px;
      height: 100%;
      line-height: 96px;
      align-content: center;
      background-color: transparent;
      outline: none;
      border: 0;
      font-size: 28px;
      color: rgba(153, 153, 153, 1);
    }
  }
</style>
