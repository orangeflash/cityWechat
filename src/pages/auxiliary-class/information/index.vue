<template>
  <div id="information">
    <div class="search-input">
      <dd-layout-search :config="searchConfig" search-type="17"/>
    </div>
    <div class="banner-box">
      <banner :height="platform.slideNum" :swiper="{children:banners}"/>
    </div>
    <!--<div class="">-->
      <!--<entry-button-group v-bind="entryGroupConfig"></entry-button-group>-->
    <!--</div>-->
    <button-group class="bg-f" :btns="buttonGroup" @click="choiceBtn"></button-group>
    <dd-layout-announce announce-type="dzInformation" class="mar-b-20"/>
    <div class="mar-lr">
      <Notice v-bind="noticeConfig"></Notice>
    </div>
    <div class="mar-b-20">
    <banner v-if="bannerTwo.length"
            height="140"
            :swiper="{children:bannerTwo}"/>
    </div>
    <dd-tab :tabs="tabs" @click="tabsMethod"/>
    <div v-if="dataList.length">
      <div class="base-pad bg-f mar-t" v-for="(v,i) in dataList" :key="i" @click="goPointPage({path:'/auxiliary/xx/details',query:{id:v.id}})">
        <div class="flex-x-bt br-b-e fon-b pad-tb">
          <div class="">
            <span class="yuan cbred" v-if="v.buyType=='1'">{{stateName(v.buyType)}}</span>
            <span class="yuan cbblue" v-else>{{stateName(v.buyType)}}</span>
            <span class="fon-w6">{{v.typeName}}</span>
          </div>
          <div class="fon-sm fon-w6 col-r">￥{{v.price}}元/{{v.unit}}</div>
        </div>
        <div class="col-6 flex w100 fon-sm pad-t-20 pad-b-10 listlh">
          <div class="flex-g-1 w60 hide-e">品牌：{{v.brand}}</div>
          <div class="flex-g-1 w40 hide-e">数量：{{v.number}}{{v.unit}}</div>
        </div>
        <div class="fon-sm col-6 flex w100 pad-tb pad-t-10 pad-b-10 listlh">
          <div class="flex-g-1 w60 hide-e">交货地：{{v.address}}</div>
          <div class="flex-g-1 w40 hide-e">规格：{{v.spec}}</div>
        </div>
        <div class="fon-sm col-9 flex-x-bt pad-t-10">
          <div class="fon-xss">
            <span class="textbox mar-r-5" :class="{'col-activeb':v.guarantee =='1'}">保</span>
            <span class="textbox mar-r-5" :class="{'col-activeg':v.isAuth=='1'}">实</span>
            <!--<span class="textbox mar-r-5">V</span>-->
          </div>
          <div>
            <span class="col-9 fon-xs mar-l flex-y-center"><i class="iconfont icon-Group- fon-xxl mar-r-10"></i>{{formatDateByTimeStamp(v.createdAt,"YYYY-MM-DD HH:mm")}}</span>
          </div>
        </div>
      </div>
      <More :status="hasMore"/>
    </div>
    <not-data v-else></not-data>
    <!--<not-data v-else-if="isRequest"/>-->
    <!--<More v-else :status="hasMore"/>-->
    <div class="settled" @click="goSettled">+</div>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import {utilMixins} from "../../../plugins/util-mixins";
  import SearchWithLocation from "../../../components/home/search-with-location";//搜索栏
  import Banner from "../../../components/home/banner";//轮播图
  import ButtonGroup from '@/components/template/button-group'  // 按钮组
  import DdTab from '@/components/template/other/tab'//导航栏
  import Notice from '@/components/template/notice';                      // 公告
  import DdLayoutAnnounce from "../../../components/layout/dd-layout-announce";
  import {hideLoading, showLoading} from "../../../util";
  import {updateShareConfig,getLocation} from "../../../util/wechat-util";
  import {Toast} from 'vant'
  export default {
    name: "information",
    components: {
      SearchWithLocation,
      Banner,
      ButtonGroup,
      Notice,
      DdTab,
      DdLayoutAnnounce,
    },
    data() {
      return {
        searchConfig: {
          keyWords: '想找的搜出来',
          shape: 3
        },
        noticeConfig: {
          title: '最新发布',
          contents: []
        },
        banners: [],
        bannerTwo: [],
        entryBtnConfig: {
          color: "#666",
          shape: 1,
          buttonNumberOfCol: 5,
          buttonNumberOfRow: 2,
          entryButtonList: []
        },
        buttonGroup: [],
        tabs: [
          {title: '最新'},
          {title: '最热'},
          {title: '附近'},
        ],
        active: 1,
        dataList: [],
        hasMore: true,
        isRequest: false,
        hasRushBuy: false,
        params: {
          page: 1,
          size: 10,
          order: 1,
        },
        lat:'',
        lng:'',
      };
    },
    methods: {
      ...mapActions(['getInformationAdList']),
      ...mapActions("common", [ "getLocationByLatLng"]),
      ...mapActions('Xx',['getXxConfig','getXxtype','XxList','XxNew']),
      /** 按钮组点击 */
      choiceBtn(item) {
        console.log(item);
        this.goPointPage({
          path: '/auxiliary/xx/category',
          query: {
            typeId: item.id
          }
        })
      },
      async getClassificationIndexInfo() {
        // 获取广告信息
        this.getInformationAdList({
          type: 19,
          adType: 1
        }).then(result => {
          if (result.code == 1) {
            result.data.forEach(v => v.notHost = true)
            this.banners = result.data || [];
          }
        })
        // 获取中部广告信息
        this.getInformationAdList({
          type: 19,
          adType: 2
        }).then(result => {
          if (result.code == 1) {
            result.data.forEach(v => v.notHost = true)
            this.bannerTwo = result.data || []
          }
        })
        // 获取分类信息
        this.getXxtype().then(reuslt => {
          this.buttonGroup = reuslt;
        })
        // 获取最新发布信息
        this.XxNew().then(result => {
          result.forEach(v => {
            this.noticeConfig.contents.push({
              title:v.userName + '在' + this.computedDate(v.createdAt) + "发布了" + (v.name || '信息')
            })
          })
        })
      },
      async getSlideAd() {
        let result = await this.getBannerListByType({
          type: 3,
          adType: 2,
        })
        result.forEach(v => v.notHost = true)
        this.bannerTwo = result
      },
      tabsMethod(v) {
        this.params.order = (() => {
          this.active = v.value + 1
          return v.value + 1
        })();
        if(v.value=='2'){
          this.params.order = 4
          this.params.lat=this.lat
          this.params.lng=this.lng
        }
        this.onRefresh();
        console.log(v)
      },
      stateName(buyType) {
        let s
        switch (buyType) {
          case '1':
            s = '买'
            break
          case '2':
            s = '卖'
            break
        }
        return s
      },
      async onRefresh() {
        this.params.page = 1;
        await this.getData(true)
      },
      async onInfinite() {
        if (!this.hasMore) return
        this.params.page++;
        this.getData();
      },
      async getData(refresh) {
        showLoading();
         let result = await this.XxList(this.params);
        hideLoading();
         this.dataList = refresh ? result : this.dataList.concat(result);
        this.isRequest = true;
        this.hasMore = result.length >= this.params.size
        return this.hasMore;
        // return result.length >= this.params.size;
      },
      async goSettled() {
        // const bool = await this.checkBindTel({callBack: true})
        // if (!bool) return
         this.goPointPage({path: '/auxiliary/xx/releasexx'})
      },
      async initLocation() {
        try {
          showLoading("定位中", "提示", false);
          const {latitude, longitude} = await getLocation();
          this.latLng = {
            latitude,
            longitude
          };
          this.address = (await this.getLocationByLatLng({
            latitude,
            longitude
          })).address;
          this.lat = this.latLng.latitude
          this.lng = this.latLng.longitude
          hideLoading();
        } catch (e) {
          console.log(
            "%c 是不是没有配置白名单的原因啊？？？",
            "color:blue;font-size:18px"
          );
          Toast("定位失败");
        }
      },
    },
    mixins: [utilMixins],
    computed: {
    },
    async created() {
      //信息设置
      this.getXxConfig().then(result => {
        // console.log("信息设置配置信息", result)
        document.title = this.$parent.footerConfig.footerInfo[1].name = result.field || '信息首页';
        //this.hasRushBuy = result.rush || false;
        updateShareConfig({
          title: result.title,
          imgUrl: result.shareImg,
          desc: result.shareDescription,
        })
      });
      this.getClassificationIndexInfo();
      this.onRefresh();
      this.onscroll(this.onInfinite, this.$route.path);
      // 获取用户当前的坐标
      window.wxReady(() => {
        this.initLocation();
      });
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/common";
  @import "../../../assets/theme";

  .banner-box {
    padding-top: 0;
  }

  .settled {
    width: 100px;
    height: 100px;
    position: fixed;
    right: 40px;
    bottom: 300px;
    border-radius: 50%;
    background: $themeColor;
    text-align: center;
    line-height: 100px;
    color: #fff;
    z-index: 500;
    font-size: 60px;
  }

  #information {
    padding-bottom: 150px;
    position: relative;
    min-height: 100%;

  }

  .box {
    margin: 16px 20px;
    border-radius: 8px;
  }
  .scroll-div{
    height: calc(100vh - 295px);
    position: relative;
    width: 100%;
  }
  .yuan{
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
  }
  .cbred{
    color: #f00;
    border:1.1px solid #f00;
  }
  .cbblue{
    color: #1C9BFC;
    border:1.1px solid #1C9BFC;
  }
  .textbox{
    border-radius: 5px;
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border:1.1px solid #999;
  }
  .col-activeg{
    color: #6EB7BE;
    border:1.1px solid #6EB7BE;
  }
  .col-activeb{
    color: #4DBFC6;
    border:1.1px solid #4DBFC6;
  }
  .w60{width:50%}
  .w40{width:50%}
  .listlh{
    height: 28px;
    line-height: 28px;
  }
</style>
