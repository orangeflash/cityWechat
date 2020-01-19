<template>
  <!--顺风车-->
  <div id="FreeRide">
    <div class="banner-box" v-if="banners.length">
      <Banner
        :height="platform.slideNum"
        :swiper="{children:banners}"
      ></Banner>
    </div>
    <Count v-bind="countConfig" @click="showAgreement = !showAgreement" more="帮助"></Count>

    <ul class="choice-btns" v-if="choiceBtns.length">
      <li v-for="(item,key) in choiceBtns" :key="key"
          @click.stop="goPointPage({path:'/auxiliary/freeRide/category',query:{typeId:item.id,title:item.name}})">
        <div>
          <img :src="item.icon&&getMediaList(item.icon).img[0]"/>
        </div>
        <span>{{item.name}}</span>
      </li>
    </ul>
    <!--<Notice v-bind="noticeConfig"></Notice>-->

    <dd-layout-announce announceType="freeCar" class="mar-b-20"/>

    <div class="free-ride__query">
      <Query isInput="true" @onInput="inputAddress" @query="carList(true)"></Query>
    </div>
    <van-tabs :lineWidth="25" @click="tabsMethod" v-if="choiceBtns.length" :color="$themeColor">
      <van-tab title="最新发布"></van-tab>
      <van-tab :title="item.name" v-for="(item,key) in choiceBtns" :key="key"></van-tab>
    </van-tabs>
    <div class="free-ride__card__list" v-if="freeRideList.length>0">
      <FreeRideCard v-for="(item,key) in freeRideList" :freeRide="item" :key="key"></FreeRideCard>
      <More :status="hasMore"></More>
    </div>
    <not-data v-else></not-data>
    <agreement @hide="showAgreement = false" v-if="showAgreement" :con="freeRideConfig.disclaimer" ></agreement>
  </div>
</template>
<script>
  import Agreement from "@/components/publication/agreement";
  import Notice from '@/components/template/notice'                      // 公告
  import Count from '@/components/template/count'                      // 统计
  import Query from '@/components/template/query'                      // 查找
  import FreeRideCard from '@/components/template/free-ride-card'                      // 顺风车卡片
  import Footer from '@/components/template/footer'                 //页脚
  import Banner from '@/components/home/banner';
  import More from '../../../components/template/more';
  import {mapState, mapActions} from "vuex"
  import {utilMixins} from "@/plugins/util-mixins";
  import {hideLoading, showLoading} from "../../../util";
  import {getLocation, updateShareConfig} from "../../../util/wechat-util";
  import DdLayoutAnnounce from "../../../components/layout/dd-layout-announce";

  export default {
    name: 'FreeRide',
    components: {DdLayoutAnnounce, Notice, Count, Query, FreeRideCard, Footer, Banner, More,Agreement},
    data() {
      return {
        freeRideConfig:{},
        showAgreement:false,
        typeId: null,
        hasMore: true,
        size: 10,
        page: 1,
        banners: [],
        notice: {
          infoList: ["浏览", "发布", "商家"]
        },
        choiceBtns: [],
        freeRideList: [],
        countConfig: {
          browse: '192.3万',
          enter: '12.4万',
          share: '75.8万',
        },
        noticeConfig: {
          title: '顺风车公告',
          contents: []
        },
        queryParams: {
          typeId: null,        // 搜索类型
          startPlace: '',      //出发地
          endPlace: '',         //目的地
          page: 1,             //页码 默认第一页
          size: 10,            //每页数量
        }
      }
    },
    mixins: [utilMixins],
    methods: {
      ...mapActions('freeRide', ['getInformationAdList', 'getCarCategory', 'getCarList', 'getFreeRideConfig','getFreeRideCount']),
      ...mapActions(['getInformationAdList']),
      getCategoryDetails(item) {
        console.log(item)
      },
      // 输入搜索地址
      inputAddress(v, i) {
        i ? this.queryParams.endPlace = v : this.queryParams.startPlace = v;
      },
      async load() {
        this.getFreeRideCount().then(result=>{
          this.countConfig = result.data?{
            browse: result.data.viewNum,
            release: result.data.joinNum,
            share: result.data.shareNum,
          }:{
            browse: '0',
            enter: '0',
            share: '0',
          }
        })
        // 获取广告信息
        this.getInformationAdList({
          type: 6,
          adType:1
        }).then(result => {
          if (result.code == 1) {
            result.data.forEach(v => v.notHost = true)
            this.banners = result.data || []
          }
        })
        this.getCarCategory().then(result => {
          if (result.code == 1) {
            console.log("result",result)
            this.choiceBtns = result.data || [];
            this.$parent.actions = [
              {
                title: '请选择发布类型',
                disabled: true
              }
            ].concat(this.choiceBtns)
          }
        })
        const res = await this.carList();
        res.forEach(v => {
          this.noticeConfig.contents.push({
            title:v.linkMan + '在' + this.computedDate(v.createdAt) + "发布了" + (v.name || '信息')
          })
        })
      },
      // 切换tab的时候触发
      async tabsMethod(index) {
        index ? this.queryParams.typeId = +this.choiceBtns[index - 1].id : this.queryParams.typeId = null;
        this.hasMore = true;
        this.queryParams.page = 1;
        this.carList(true);
      },
      async carList(refresh) {
        showLoading();
        if(refresh)this.queryParams.page = 1;
        const res = await this.getCarList(this.queryParams);
        hideLoading();
        if (res.code == 1) refresh ? this.freeRideList = res.data : this.freeRideList = this.freeRideList.concat(res.data);
        this.hasMore = res.data.length > 0;

        return res.data;
      },

      // 加载更多
      onInfinite() {
        if (this.hasMore) {
          this.queryParams.page++;
          this.carList();
        }
      }
    },
    computed: {
      ...mapState({
        platform:s=>s.platform
      })
    },
    async created() {

      // 获取用户当前的坐标
      try {


        window.wxReady(async () => {
          showLoading("定位中");
          let latLng = await getLocation();
          this.queryParams.lat = latLng.latitude;
          this.queryParams.lng = latLng.longitude;;
          this.load();
        })
        // let latLng = await getLocation();
        // this.queryParams.lat = latLng.latitude;
        // this.queryParams.lng = latLng.longitude;
      } catch (e) {
        console.log(e)
      }
      // this.load();

      this.onscroll(this.onInfinite, this.$route.path);

      this.getFreeRideConfig().then(result => {
        // 配置转发信息
        console.log("this.result",result)
        if (result) {

          this.freeRideConfig = result;
          document.title = this.$parent.footerConfig.footerInfo[1].name = this.freeRideConfig.field || '顺风车';
          updateShareConfig({
            title: result.title,
            imgUrl: result.shareImg,
            desc: result.shareDescription,
            link: window.location.href,
          })
        }
      })

    }
  }
</script>


<style scoped lang="scss">
  @import "../../../assets/common";

  #FreeRide {
    padding-bottom: 120px;

    .banner-box {
      background: $themeColor;
      text-align: center;
      font-size: 40px;
    }

    .choice-btns {
      display: flex;
      flex-wrap: wrap;
      padding-top: 30px;
      background: #fff;
      margin-top: 1.1px;

      li {
        margin-left: 45px;
        width: 132px;
        text-align: center;
        padding-bottom: 30px;

        div {
          width: 100%;
          height: 84px;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 28px;

          img {
            width: 100%;;
            height: 100%;
          }
        }
      }
    }

    .free-ride__query {
      background: #fff;
      padding: 32px 0;
    }

    .free-ride__card__list {
      padding: 20px 32px;
    }
  }
</style>
