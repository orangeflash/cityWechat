<template>
  <div id="SearchWithLocationContent">
    <template v-if="leftIcon&&!noShowAddress">
      <span class="c-location" @click="onLocation" v-if="leftIcon.style===0"><em>{{address}}</em><i
        class="iconfont icon-xiangxiajiantou search-icon"></i></span>
      <aside @click="goPointPage(leftIcon.link)" class="c-location-icon" v-else>
        <img-wrapper class="c-location-icon__img" :src="leftIcon.icon" alt=""/>
      </aside>
    </template>

    <div class="search-btn" :style="computedStyle" @click="onSearch">{{keyWords || '请输入搜索内容'}}</div>
    <template v-if="rightIcon">
        <span class="c-location" v-if="rightIcon.style===0"><em>{{address}}</em><i
          class="iconfont icon-iconfontjiantou search-icon"></i></span>
      <aside @click="goPointPage(rightIcon.link)" class="c-location-icon" v-else>
        <img-wrapper class="c-location-icon__img" :src="rightIcon.icon" alt=""/>
      </aside>
    </template>
    <div class="search-weather" v-if="+weather==1">
      {{getWeather&&weatherInfo.temperature&&weatherInfo.temperature+"°"}} {{weatherInfo.weather}}
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {getGlobalData, hideLoading, showDialog} from "../../util";
  import {getLocation} from "../../util/wechat-util";

  export default {
    name: "SearchWithLocationContent",
    props: ["searchType",
      "position",
      "searchBoxList",
      "shape",
      "fontStyle",
      "borderStyle",
      'noShowAddress',
      'keyWords',
      'weather'],
    data() {
      return {
        value: '',
        hasDefaultLocation: false,
        weatherInfo: {}
      }
    },
    methods: {
      ...mapActions("common", ["getLocationByLatLng", "getDefaultLatLng", 'getWether']),
      ...mapActions("home", ["getZoneByAddress", "getZoneByInfo", "getTabDragLayout", "updateCityInfo", "judgeCityExis"]),
      onSearch() {
        this.goPointPage({path: "/search", query: {searchType: this.searchType}})
      },
      async onLocation() {
        this.goPointPage("/home/choiceLocation")
      },
      getStyleByShape(shape) {
        switch (shape) {
          case 1:
            return "6px";
          case 2:
            return "0";
          case 3:
            return "25px"
        }
      },
      async initLocation() {
        //如果没有初始化 并且是不是切换城市的情况 才进行初始化
        if ((this.hasLocation && this.isGetLocationByLatLng) || this.isChangeLocation) return;
        try {
          const defaultZooe = getGlobalData("defaultZooe");
          const cityId = getGlobalData("cityId");
          if (!defaultZooe && +cityId <= 0) return;

          // 获取用户当前的坐标
          const {latitude, longitude} = await getLocation();

          // 从后换取城市名和区名
          const {address_component: {city, district}} = await this.getLocationByLatLng({
            latitude, longitude
          });
          console.log('当前用户的真实经纬度latitude：' + latitude + " longitude：" + longitude)
          /**
           *
           *  noChangeCityName: 不改变当前城市的名字
           *  在这里请求一次ZoneByAddress 是因为先获平台有没有开通在该城市，
           *  若没有开通就直接返回了，不往下执行。
           *   没有开通，将会返回cityId 为 0
           *  根据城市名区名请求zone接口
           * */
          const data = await this.getZoneByAddress({

            city,
            zone: district,
            notChangeCityName: true
          });

          // 判断zooe请求的返回值
          if (data.cityId <= 0) return false;
          const cityExis = await this.judgeCityExis(localStorage.cityInfoCityId);
          // 如果上次访问的城市还在服务区类，就直接拿取缓存的地址信息
          if (cityExis) {
            // 如果当前的城市与上次的访问城市一致就执行
            if (localStorage.cityInfoZoneName === data.zoneName) {
              // 拿取缓存值更新城市信息
              this.updateCityInfo(data);
              // 重新加载页面数据
              this.initPage()
              await this.getTabDragLayout("nav");
              // 判断当前的城市是不是默认城市
            } else if (this.address !== data.zoneName) {
              try {
                // 提示是否切换城市
                await showDialog("已定位到您的真实位置为:" + data.zoneName + ",是否切换城市", "提示");
                // 确定切换后，更新城市数据
                this.updateCityInfo(data);
                // 将当前城市的数据进行缓存
                localStorage.cityInfoCityId = data.cityId;
                localStorage.cityInfoCityName = data.cityName;
                localStorage.cityInfoZoneId = data.zoneId;
                localStorage.cityInfoZoneName = data.zoneName;
                // 重新加载页面数据
                this.$parent.secondInit();
                await this.getTabDragLayout("nav");
              } catch (e) {
                // alert("切换城市的时候出BUG啦")
              }
            } else {
              // 当前的真是位置就是默认位置
              console.log("this.address:" + this.address, "data.zoneName:" + data.zoneName)
            }
          } else if (this.address !== data.zoneName) {
            try {
              // 提示是否切换城市
              await showDialog("已定位到您的真实位置为:" + data.zoneName + ",是否切换城市", "提示");
              // 确定切换后，更新城市数据
              this.updateCityInfo(data);
              // 将当前城市的数据进行缓存
              localStorage.cityInfoCityId = data.cityId;
              localStorage.cityInfoCityName = data.cityName;
              localStorage.cityInfoZoneId = data.zoneId;
              localStorage.cityInfoZoneName = data.zoneName;
              // 重新加载页面数据
              this.$parent.secondInit();
              await this.getTabDragLayout("nav");
            } catch (e) {
              // alert("切换城市的时候出BUG啦")
            }
          } else {
            // 当前的真是位置就是默认位置
            console.log("this.address:" + this.address, "data.zoneName:" + data.zoneName)
          }
        } catch (e) {
          console.log(e);
          /** 关闭loading */
          hideLoading();
          // showDialog(e);
          //showDialog("定位失败,请重新定位", "提示", false);
          console.log("%c 获取位置：失败，权限值离线验证", "color:red;font-weight:blod;font-size:20px;")
        }
      },
      async initDefaultLocation() {
        // console.log("%c initDefaultLocation hasLocation", "color:red;font-weight:blod;font-size:20px;")
        if (this.hasLocation) return this.$emit("initializedLocation");
        // console.log("%c initDefaultLocation nothasLocation", "color:red;font-weight:blod;font-size:20px;")
        const data = await this.getDefaultLatLng();
        data.defaultZooe = true;
        await this.getZoneByInfo(data);
        this.$emit("initializedLocation");
        // 底部导航的数据是靠定位来进行获取的，必须先有定位的信息，
        await this.getTabDragLayout("nav");
      },

    },
    computed: {
      ...mapState("home", {
        locationAddress: state => state.locationAddress,
        isChangeLocation: state => state.isChangeLocation
      }),
      ...mapState("common", {
        isGetLocationByLatLng: state => state.isGetLocationByLatLng,
        adInfo: state => state.adInfo
      }),
      address() {
        return this.locationAddress.zoneName || this.locationAddress.cityName || '定位中'
      },
      hasLocation() {
        return this.locationAddress.zoneName || this.locationAddress.cityName
      },
      leftIcon() {
        return _.find(this.searchBoxList, {typesetting: 0});
      },
      rightIcon() {
        return _.find(this.searchBoxList, {typesetting: 1});
      },
      async getWeather() {
        if (+this.weather && this.weather == 1) {
          //console.log('this.adInfo',this.adInfo)
          this.adInfo.ad_info&&(this.weatherInfo = await this.getWether(this.adInfo.ad_info.adcode));
        }
        return this.weatherInfo;
      },
      computedStyle() {

        return {
          borderRadius: this.getStyleByShape(this.shape),
          borderColor: this.borderStyle ? '#ccc' : 'transparent',
          textAlign: this.fontStyle
        };

      }
    },
    watch: {},
    async created() {
      // console.log(this.$route.path)
      if (this.$route.path == '/home') {
        await this.initDefaultLocation();
        window.wxReady(() => {

          this.initLocation();
        });
      }
      // this.getWeather()
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #SearchWithLocationContent {
    @include alignCenter;
    width: 100%;

    .search-btn {
      color: #666;
    }

    .search-action {
      color: $themeColor;
    }

    .c-location {
      @include alignCenter;
      color: white;
      font-size: 28px;

      .search-icon {
        margin-left: 12px;
        font-size: 24px;
      }
    }

    $height: 60px;

    .c-location-icon {
      $size: $height*.8;
      width: $size;
      height: $size;

      &__img {
        width: 100%;
        height: 100%;
      }
    }

    .search-btn {
      flex: 1;
      margin: 0 12px;
      padding: 0 30px;
      height: $height;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.64);
      color: #969799;
      font-size: 24px;
      line-height: 60px;
      border-radius: 32px;
      overflow: hidden;
    }

    .search-weather {
      color: #fff;
      font-size: 28px;
    }
  }
</style>
