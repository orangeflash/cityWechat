<template>
  <!--抢购首页-->
  <div id="RushBuy">
    <component
      v-for="(com,key) in pageConfig"
      v-if="com.show"
      :key="key"
      :class="{'br-b-e':key==0,'mar-b-20':key==3}"
      :is="com.name"
      v-bind="com.value"
      @search="goPointPage({path: '/search', query: {searchType: 12}})"
      @click="(e)=>{handleMethods(e,key)}"
    />
    <div class="bg-f">
      <ul class="pad-30  flex flex-bt flex-y-center">
        <li class="fon-lg mar-lr-20" v-for="(item,key) in tabConfig" :key="key"
            @click="changeTab(item)"
            :class="[params.type == item.type&&'fon-xxl fon-wb']">{{item.name}}
        </li>
      </ul>
    </div>
    <div v-if="dataList.length">
      <!--<dd-coupon-->
      <!--class="br-r-10 mar-b"-->
      <!--v-for="(item,key) in coupons"-->
      <!--:info="item"-->
      <!--:key="key"-->
      <!--@click="goPointPage('/auxiliary/coupon/details?couponId='+item.id)"-->
      <!--&gt;</dd-coupon>-->
      <rush-buy v-for="(item,index) in dataList" :key="index" count-down="1" :data-info="item"></rush-buy>
      <More :status="hasMore"/>
    </div>
    <not-data v-else></not-data>
  </div>

</template>

<script>

  import Banner from '@/components/home/banner';
  import ButtonGroup from '../../../components/template/button-group'  // 按钮组
  import DdTab from '../../../components/template/other/tab'
  import RushBuy from '../../../components/template/rush-buy/rush-buy'

  import {mapActions, mapState} from 'vuex'
  import {hideLoading, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {updateShareConfig} from "../../../util/wechat-util";

  export default {
    mixins: [utilMixins],
    components: {Banner, ButtonGroup, DdTab, RushBuy},
    data() {
      return {
        tabConfig: [
          {name: '最热', type: 3},
          {name: '最新', type: 1},
          {name: '精选', type: 2},

        ],
        pageConfig: [
          {
            show: true,
            name: 'dd-tab',
            value: {
              tabs: [
                {title: '全部', id: ''},
              ],
              extra: true,
            }
          },
          {
            show: true,
            name: 'banner',    //组件名
            value: {          //参数值
              height: 240,
              swiper: {
                children: []
              }
            }
          }, {
            show: false,
            name: 'button-group',
            value: {
              className: 'flex-bt bg-f',
              parentClass: 'mar-b-20 pad-l pad-r',
              btns: [
                {
                  class: 'flex-center br-r-c bg-f',
                  icon: 'icon-swticonyouhuiquanwenzi fon-40 mar-t-10 col-f',
                  name: '优惠劵',
                  style: 'background:linear-gradient(0deg,rgba(25,194,243,1) 0%,rgba(29,233,242,1) 100%);',
                  parentClass: 'flex-g-1',
                  type: 3,
                }, {
                  class: 'flex-center br-r-c bg-f mar-l',
                  icon: 'icon-youhui- fon-40 mar-t-10 col-f',
                  name: '折扣劵',
                  style: 'background:linear-gradient(0deg,rgba(49,105,228,1) 0%,rgba(80,154,251,1) 100%)',
                  parentClass: 'flex-g-1',
                  type: 2,
                }, {
                  class: 'flex-center br-r-c bg-f',
                  icon: 'icon-wodeyouhuijuan fon-40 mar-t-10 col-f',
                  name: '代金劵',
                  style: 'background:linear-gradient(0deg,rgba(242,8,95,1) 0%,rgba(250,62,147,1) 100%)',
                  parentClass: 'flex-g-1',
                  type: 1,
                }
              ],
              deliver: true
            }
          }
        ],
        dataList: [],
        hasMore: true,
        params: {
          size: 10,
          page: 1,
          type: 3,
          typeId: '',
        },
      }
    },
    methods: {
      ...mapActions('storeAuxiliary/storeRushbuy', ['getRushGoodsCategory']),
      ...mapActions(['getInformationAdList']),
      ...mapActions('rushBuy', ['getRushConfig', 'getRushGoodsList']),
      changeTab(item) {
        this.params.type = item.type;
        this.onRefresh();
      },
      /** 处理组件事件 */
      handleMethods(result, key) {
        console.log(result, key)
        switch (key) {
          case 3:
            this.params.type = this.pageConfig[3].value.tabs[result.value].sort
            this.onRefresh();
            break;
          case 0:
            this.params.typeId = this.pageConfig[0].value.tabs[result.value].id
            this.onRefresh()
            break;
          case 2:
            this.goPointPage({path: '/auxiliary/coupon', query: {pageFrom: 'rush', data: JSON.stringify(result)}})
            break;
        }
      },
      onRefresh() {
        this.params.page = 1;
        this.dataList = [];
        this.getData(true);
      },
      onInfinite() {
        if (!this.hasMore) return
        this.params.page++;
        this.getData();
      },
      async getData(refresh) {
        showLoading();


        const result = await this.getRushGoodsList(this.params);
        hideLoading();
        this.dataList = refresh ? result : this.dataList.concat(result);
        this.hasMore = result.length >= this.params.size
        return this.hasMore;
      }
    },
    computed: {
      ...mapState({
        platform: s => s.platform
      })
    },
    created() {
      // 获取广告信息
      this.getInformationAdList({
        type: 15,
        adType: 1
      }).then(result => {
        if (result.code == 1) {
          result.data.forEach(v => v.notHost = true)
          this.pageConfig[1].value.swiper.children = result.data || [];
          this.pageConfig[1].value.height = this.platform.slideNum;
        }
      })
      //获取分类
      this.getRushGoodsCategory({term: 16}).then(res => {
        this.pageConfig[0].value.tabs = this.pageConfig[0].value.tabs.concat(res.map(item => ({
          title: item.name,
          id: item.id
        })))
      })
      this.onRefresh();
      //localStorage.couponStoreId && (this.params.storeId = localStorage.couponStoreId)
      this.getRushConfig().then(result => {
        this.pageConfig[2].show = result.coupon || false;
        document.title = this.$parent.footerConfig.footerInfo[1].name = result.field || '限时抢购';
        updateShareConfig({
          title: result.title,
          imgUrl: result.shareImg,
          desc: result.shareDescription,
        })
      });
      this.onscroll(this.onInfinite, this.$route.path);
    },
    destroyed() {
      // 用离开当前页面就会执行
      delete localStorage.couponStoreId;
    }
  }
</script>
