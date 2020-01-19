<template>
  <div class="bg-f posi-r zIndex99">
    <div class="flex flex-bt  flex-y-center pad-lr pad-t-10 pad-b-10 bg-f-5"
         :class="{'posi-f t0 l0 r0 ':config.position}"
         :style="{marginTop:`${config.topMargin}px`,height:`${config.height}px`}">
      <div class="col-3 mar-r-10 fon-lg flex-y-center fon-wb mw-150 dh-66 hide-e lineH-66" @click="onLocation"
           v-if="config.city===1">
        <!--<i class="iconfont icon-dingwei1"></i>-->
        <div class="dingwei-bg dh-32 w-25 mar-r-10 mar-t-010"></div>
        {{address}}
      </div>
      <div class="dh-66 flex-g-1 fon-b bg_search_bg pad-lr fon-lg col-6 lineH-66" @click="onSearch"
           :style="computedStyle">
        <!--<i class="iconfont icon-sousuo"></i>-->
        {{config.keyWords||'想找的搜出来'}}
      </div>
      <div class=" fon-wb fon-68 mw-150 mar-l flex-center plus-bg w-30 dh-30" @click="showMore = !showMore"
           v-if="config.showMore == 1"></div>
      <div class="posi-a r0 mar-r-10 mar-t" v-show="showMore" :style="{top:`${config.height}px`}">
        <dd class="triangle posi-a r0 t0 mar-t-040 mar-r"></dd>
        <ul>
          <li class="bg-0-5 col-f dh-66 fon-b flex-y-center pad-lr"
              v-for="(item,key) in getEntry"
              :key="key"
              @click="goPointPage(item.path)">
            {{item.name}}
          </li>
        </ul>
      </div>
    </div>
    <!--<div class="pad-t-10 pad-b-10 dh-66 "-->
    <!--:style="{marginTop:`${config.topMargin}px`,height:`${config.height}px`}"-->
    <!--v-if="config.position"></div>-->
  </div>


</template>
<script>
  import _ from 'lodash'
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {getGlobalData, hideLoading, showDialog} from "../../util";
  import {getLocation} from "../../util/wechat-util";

  export default {
    name: "DdSearch",
    props: {
      config: {
        type: Object,
        default: Object
      },
      searchType: {
        type: String,
        default: "0"
      }
    },
    data() {
      return {
        showMore: false
      }
    },
    methods: {
      ...mapActions("common", ["getLocationByLatLng"]),
      ...mapActions("home", ["getZoneByAddress", "judgeCityExis", 'updateCityInfo', 'getTabDragLayout']),
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
      async onLocation() {
        this.goPointPage("/home/choiceLocation")
      },
      onSearch() {
        this.goPointPage({path: "/search", query: {searchType: this.searchType}})
      },
      async initDefaultLocation() {
        if (this.hasLocation) return this.$emit("initializedLocation");
        const data = await this.getDefaultLatLng();
        data.defaultZooe = true;
        await this.getZoneByInfo(data);
        this.$emit("initializedLocation");
        // 底部导航的数据是靠定位来进行获取的，必须先有定位的信息，
        await this.getTabDragLayout("nav");
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
          console.log("localStorage", localStorage)
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
              this.$parent.$parent.initPage(true);
              await this.getTabDragLayout("nav");
              // 判断当前的城市是不是默认城市
            } else if (this.address !== data.zoneName) {
              try {
                // 提示是否切换城市
                await showDialog("已定位到您的真实位置为:" + data.zoneName + ",是否切换城市", "提示");
                // 确定切换后，更新城市数据
                this.updateCityInfo(data);
                console.log(localStorage)
                // 将当前城市的数据进行缓存
                localStorage.cityInfoCityId = data.cityId;
                localStorage.cityInfoCityName = data.cityName;
                localStorage.cityInfoZoneId = data.zoneId;
                localStorage.cityInfoZoneName = data.zoneName;
                console.log(localStorage)
                // 重新加载页面数据
                this.$parent.$parent.initPage(true);
                await this.getTabDragLayout("nav");
              } catch (e) {
                // alert("切换城市的时候出BUG啦")
              }
            } else {
              // 当前的真是位置就是默认位置
              console.log("this.address:" + this.address, "data.zoneName:" + data.zoneName)
            }
          } else if (this.address !== data.zoneName) {
            console.log(this.address, data.zoneName)
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
              console.log(localStorage.cityInfoZoneNam, data.zoneName)
              // 重新加载页面数据
              this.$parent.$parent.initPage(true);
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
    },
    computed: {
      ...mapState("home", {
        locationAddress: state => state.locationAddress,
        isChangeLocation: state => state.isChangeLocation
      }),
      address() {
        return this.locationAddress.zoneName || this.locationAddress.cityName || '定位中'
      },
      hasLocation() {
        return this.locationAddress.zoneName || this.locationAddress.cityName
      },
      computedStyle() {
        const {
          shape, borderStyle, fontStyle, height
        } = this.config;
        return {
          borderRadius: this.getStyleByShape(shape),
          borderColor: borderStyle ? '#ccc' : 'transparent',
          textAlign: fontStyle
        };
      },
      getEntry() {


        return this.config.searchMore ? this.config.searchMore.map(item => {

          let path = '/',
            name = '';

          switch (item) {
            case 'personal':
              path = '/personal'
              name = '个人中心'
              break;
            case 'sign':
              path = '/sign'
              name = '签到中心'
              break;
            case 'help':
              path = '/home/helpPage'
              name = '帮助中心'
              break;
            case 'link':
              path = '/personal/CustomerService'
              name = '联系客服'
              break;
          }

          return {
            name,
            path
          }
        }) : []
      }
    },
    async created() {
      if (this.$route.path == '/home') {
        await this.initDefaultLocation();
        this.initLocation();
      }
    }
  }
</script>
