<template>
  <!--优惠劵首页-->
  <div class="coupon">

    <dd-layout-search :config="searchConfig" search-type="13"/>
    <banner :height="platform.slideNum" :swiper="{children:banners}"/>

    <button-group class-name="flex-bt bg-f" @click="handleMethods" parent-class="pad-l pad-r" :btns="getRightBtns"
                  :deliver="true"/>

    <banner v-if="bannerTwo.length"
            height="140"
            :swiper="{children:bannerTwo}"/>

    <dd-tab :tabs="tabs" class="mar-t-20" @click="handleMethods"/>
    <!--<component-->
    <!--v-for="(com,key) in pageConfig"-->
    <!--:key="key"-->
    <!--:is="com.name"-->
    <!--v-bind="com.value"-->
    <!--@click="handleMethods"-->
    <!--/>-->

    <div v-if="coupons.length">
      <dd-coupon :list="coupons"/>
      <More :status="hasMore"/>
    </div>
    <not-data v-else-if="isRequest"/>
    <More v-else :status="hasMore"/>
  </div>

</template>

<script>

  import Banner from '@/components/home/banner';
  import ButtonGroup from '../../../components/template/button-group'  // 按钮组
  import DdTab from '@/components/template/other/tab'
  import DdContainer from '@/components/template/other/container'  //
  import DdCoupon from '../../../components/template/item/coupon'
  import SearchWithLocation from "../../../components/home/search-with-location";

  import {mapActions, mapState} from 'vuex'
  import {hideLoading, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {updateShareConfig} from "../../../util/wechat-util";

  export default {
    mixins: [utilMixins],
    components: {Banner, ButtonGroup, DdTab, DdContainer, DdCoupon, SearchWithLocation},
    data() {
      return {
        searchConfig: {
          keyWords: '想找的搜出来',
          shape: 3
        },
        banners: [],
        bannerTwo: [],
        tabs: [
          {title: '最新'},
          {title: '精选'},
          {title: '最热'},

        ],
        btns: [

          {
            class: 'flex-center br-r-c bg-f',
            icon: 'icon-swticonyouhuiquanwenzi fon-40 mar-t-5 col-f',
            name: '优惠劵',
            style: 'background:linear-gradient(0deg,rgba(25,194,243,1) 0%,rgba(29,233,242,1) 100%);',
            parentClass: 'flex-g-1',
            type: 3,
            show: true,
          }, {
            class: 'flex-center br-r-c bg-f mar-l',
            icon: 'icon-youhui- fon-40 mar-t-5 col-f',
            name: '折扣劵',
            style: 'background:linear-gradient(0deg,rgba(49,105,228,1) 0%,rgba(80,154,251,1) 100%)',
            parentClass: 'flex-g-1',
            type: 2,
            show: true,
          }, {
            class: 'flex-center br-r-c bg-f',
            icon: 'icon-wodeyouhuijuan fon-40 mar-t-5 col-f',
            name: '代金劵',
            style: 'background:linear-gradient(0deg,rgba(242,8,95,1) 0%,rgba(250,62,147,1) 100%)',
            parentClass: 'flex-g-1',
            type: 1,
            show: true,
          }
        ],
        coupons: [],
        hasMore: true,
        isRequest: false,
        hasRushBuy: false,
        params: {
          size: 10,
          page: 1,
          sort: 0,
        },
        sort: ['new', 'good', 'hot']
      }
    },
    methods: {
      ...mapActions('coupon', ['getCouponList', 'getCouponConfig', 'getMyReleaseCoupon']),
      ...mapActions(['getInformationAdList']),
      /** 处理组件事件 */
      handleMethods(result) {
        switch (result.name) {
          case 'tabs':

            this.params.sort = this.sort[result.value]
            this.onRefresh();
            break;
          case 'buttonGround':
            console.log('buttonGround', result.value);
            let parent = this.getRightBtns
            const obj = parent[result.value.key];

            if (result.value.type) {
              parent.forEach(item => this.$set(item, 'active', false))

              this.$set(obj, 'active', true);
              this.params.type = result.value.type;
              this.onRefresh()
            } else {
              this.goPointPage("/auxiliary/rushBuy")
            }


            break;
        }
      },
      onRefresh() {
        this.params.page = 1;
        this.getCoupons(true);
      },
      onInfinite() {
        if (!this.hasMore) return
        this.params.page++;
        this.getCoupons();
      },
      async getCoupons(refresh) {
        showLoading();

        const result = this.params.storeId ? await this.getMyReleaseCoupon(this.params) : await this.getCouponList(this.params);
        hideLoading();

        this.coupons = refresh ? result : this.coupons.concat(result);

        this.isRequest = true;
        this.hasMore = result.length >= this.params.size

        return this.hasMore;
      }
    },
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
      searchOptions() {
        return {
          "position": 0,
          "shape": 3,
          "height": 42,
          "borderStyle": 0,
          "fontStyle": "left",
          "recommendSearch": 1,
          "searchBoxList": [
            {
              "id": 1545381832,
              "icon": "http://static.shanjiezhifu.com/zhihui/cert.png",
              "typesetting": 0,
              "style": 0,
              "link": ""
            }
          ],
          "keyWords": ""
        }
      },
      getRightBtns() {

        let arr = [];
        if (this.hasRushBuy) {
          arr.push({
            class: 'flex-center br-r-c bg-f',
            icon: 'icon-pintuangou fon-40 mar-t-5 col-f',
            name: '秒杀抢购',
            style: 'background:linear-gradient(0deg,rgba(235,90,18,1) 0%,rgba(254,126,64,1) 100%)',
            parentClass: 'flex-g-1',
          })
        }


        return arr.concat(this.btns)

      }
    },
    created() {

      localStorage.couponStoreId && (this.params.storeId = localStorage.couponStoreId)

      this.getCouponConfig().then(result => {
        document.title = this.$parent.footerConfig.footerInfo[1].name = result.field || '优惠劵';
        this.hasRushBuy = result.rush || false;

        updateShareConfig({
          title: result.title,
          imgUrl: result.shareImg,
          desc: result.shareDescription,
        })
      });

      // 获取广告信息
      this.getInformationAdList({
        type: 16,
        adType: 1
      }).then(result => {
        if (result.code == 1) {
          result.data.forEach(v => v.notHost = true)
          this.banners = result.data || [];
        }
      })


      this.getInformationAdList({
        type: 16,
        adType: 2
      }).then(result => {
        if (result.code == 1) {
          result.data.forEach(v => v.notHost = true)
          this.bannerTwo = result.data || []
        }
      })

      this.onRefresh();
      this.onscroll(this.onInfinite, this.$route.path);
      //从抢购跳过来
      if (this.$route.query.pageFrom == 'rush') {
        //console.log('从抢购跳来',JSON.parse(this.$route.query.data))
        this.handleMethods(JSON.parse(this.$route.query.data))
      }
    },
    destroyed() {
      // 用离开当前页面就会执行
      delete localStorage.couponStoreId;
    }
  }

</script>
