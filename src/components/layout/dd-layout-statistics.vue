<template>
  <div id="NoticeWithInfo"
       :style="{marginTop:`${topMargin}px`}">

    <div class="mar-30 flex-bt flex-y-center box-sha br-r-20">
      <div class="flex-g-1 flex flex-y-center  pad-30">
        <div class="fon-68 mar-r-10" :class="!weatherInfo.temperature&&'col-f'">{{weatherInfo.temperature || 0}}</div>
        <div>
          <div>
            <span class="fon-sm" v-if="weatherInfo.temperature">°C</span>
            <span class="fon-sm col-6 mar-r-10">{{weatherInfo.weather}}</span>
            <span class="fon-sm col-t mar-r">{{weatherInfo.city}}</span>
          </div>
          <p class="col-6 fon-sm mar-t-10">{{weatherInfo.reporttime}} {{weatherInfo.weekday}}</p>
        </div>
      </div>
      <div class="flex-g-1 flex-center">
        <div v-if="isRequest">
          <div class="col-6 fon-b"
               v-for="(item,key) in statistics"
               :class="key&&' mar-t-5'"
               v-if="item.show"
               :key="key">
            {{item.title}}
            <span class="col-t">{{formatNumber(item.value) || 0}}{{item.unit}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import _ from 'lodash'
  import dataMovement from "../../assets/img/home/data-movement.gif"
  import {getLocation} from "../../util/wechat-util";

  export default {
    name: "NoticeWithInfo",
    props: ["notice", "icon", 'noticeInfo', "infoList", "link", "topMargin", "source", "isRight"],
    data() {
      return {
        statistics: {
          browse: {
            title: '总浏览量：',
            value: 0,
            unit: '次',
            show: false,
          },
          post: {
            title: '总信息量：',
            value: 0,
            unit: '条',
            show: false,
          },
          enter: {
            title: '商家数量：',
            value: 0,
            unit: '位',
            show: false,
          },
        },
        isRequest: false,
        dataMovement,
        weatherInfo: {}
      }
    },
    methods: {
      ...mapActions("common", ["getLocationByLatLng", "getDefaultLatLng", 'getWether']),
      ...mapActions("home/components", ["getPostStatistics"]),
      formatNumber(num) {
        if (!num) return '';
        if (num > 10000) {
          let formatNum = (num / 10000).toFixed(2);
          return formatNum + "万"
        }
        return num;
      },
      async getNoticeInfo() {
        let data = await this.getPostStatistics();
        let keys = [];
        for (let k in this.infoList) {
          let key = ''

          switch (this.infoList[k]) {
            case '浏览':
              key = 'browse'
              break;
            case '发布':
              key = 'post'
              break;
            case '商家':
              key = 'enter'
              break;
          }
          keys.push(key);
        }
        // let newKeys = keys.splice(0, 2)
        // for (let s in  this.statistics) {
        //   if (newKeys.indexOf(s) < 0) delete this.statistics[s]
        // }

        console.log("keys===================>", keys)
        for (let k in keys) {
          switch (keys[k]) {
            case 'post':
              this.$set(this.statistics.post, 'value', data[keys[k]])
              this.$set(this.statistics.post, 'show', true)
              break
            case 'browse':
              this.$set(this.statistics.browse, 'value', data[keys[k]])
              this.$set(this.statistics.browse, 'show', true)
              break
            case 'enter':
              this.$set(this.statistics.enter, 'value', data[keys[k]])
              this.$set(this.statistics.enter, 'show', true)
              break
          }
        }
        // let key = 0;
        // for (let s in this.statistics) {
        //   key++;
        //   if (key > 2) delete this.statistics[s]
        // }

        this.isRequest = true;
      },
      async getWeather() {
        if (!this.adInfo.ad_info) {
          const {latitude, longitude} = await getLocation();
          await this.getLocationByLatLng({latitude, longitude})
        }

        this.weatherInfo = await this.getWether(this.adInfo.ad_info.adcode)

        this.weatherInfo.reporttime = this.weatherInfo.reporttime.split(" ")[0]

        let date = new Date(),
          ddy = date.getDay(),//获取存储当前日期
          weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        // new Date(this.weatherInfo.reporttime)
        this.weatherInfo.weekday = weekday[ddy]
        console.log(this.weatherInfo)
      },
    },
    computed: {
      ...mapState("common", {
        isGetLocationByLatLng: state => state.isGetLocationByLatLng,
        adInfo: state => state.adInfo
      }),
    },
    created() {
      this.getNoticeInfo();
      this.getWeather()
    }
  }
</script>
