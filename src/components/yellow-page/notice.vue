<template>
  <div id="NoticeWithInfo" :style="{marginTop:`${topMargin}px`}">
    <div class="notice-icon">
      <img-wrapper :src="dataMovement"/>
    </div>
    <ul class="info-list" @click="goPointPage({path:link})">
      <li class="info-list__item" v-for="(item,keys) in rearrange" :key="keys">
        <em>{{item.title?item.title:''}}:</em><em
        class="info-list__green">{{formatNumber(item.content?item.content:'0')}}</em></li>
    </ul>
    <router-link to="/home/helpPage" class="feature-btn">帮助</router-link>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import _ from 'lodash'
  import dataMovement from "../../assets/img/home/data-movement.gif"
  export default {
    name: "NoticeWithInfo",
    props: ["notice", "icon", 'noticeInfo', "infoList","link","topMargin"],
    data() {
      return {
        statistics: [],
        dataMovement,
      }
    },
    methods: {
      ...mapActions("YellowPage", ["staticYellowPage",]),
      formatNumber(num) {
        if (!num) return '';
        if (num > 10000) {
          let formatNum = (num / 10000).toFixed(2);
          return formatNum + "万"
        }
        return num;
      },
      getTabLabelByKey(key) {
        let label = null;
        switch (key) {
          case 'viewNum':
            label = '浏览';
            break;
          case 'joinNum':
            label = '入驻';
            break;
          case 'shareNum':
            label = '分享';
            break;
        }
        return label;
      },
      async getNoticeInfo() {
        const data = await this.staticYellowPage();
        console.log("获取到的数据为",data)
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
        //只显示后台配置的统计数据
        const noticeInfo = this.statistics;
        if (!noticeInfo.length) return [];
        // const itemOne = _.find(noticeInfo, ({title}) => title === "浏览")
        // const itemTwo = _.find(noticeInfo, ({title}) => title === "发布")
        // const itemThree = _.find(noticeInfo, ({title}) => title === "入驻")
        const Statistics = [];
        for(let i = 0; i<noticeInfo.length;i++){
          Statistics.push(_.find(noticeInfo, ({title}) => title === noticeInfo[i].title ));
        }
        console.log(Statistics)
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
    height: 96px;
    @include alignCenter;
    padding-left: 32px;
    background-color: #fff;
    margin-bottom: 1PX;
    .notice-icon {
      width: 45px;
      margin-top: -12px;
      height: 45px;
    }
    .info-list {
      flex: 1;
      @include alignCenter;
      @include t-overflow;
      &__item {
        font-size: 28px;
        color: #666;
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
