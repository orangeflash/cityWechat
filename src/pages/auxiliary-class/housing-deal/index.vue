<template>

  <div id="housing-deal">
    <div class="housing-deal_search fixed"
         :class="{'back':isScroll}"
    >
      <Search
        @search="search"
        @select="showOperation = !showOperation"
        :selectName="action[choiceIndex].name"
      ></Search>
    </div>
    <div class="banner-box" v-if="banners.length">
      <Banner
        :height="platform.slideNum"
        :swiper="{children:banners}"

      ></Banner>
    </div>
    <div v-else class="space"></div>
    <Count v-bind="countConfig" @click="showAgreement = !showAgreement" more="帮助"></Count>


    <button-group
      class="bg-f mar-b-20"
      className="flex-ad"
      :btns="category"
      @click="choiceBtn"
    ></button-group>
    <chunk
      title="热门楼盘"
      v-if="hot.length"
      icon="icon-remen"
    >
      <dd-marquee slot="content" :height="132" class="pad-b-20">
        <div slot="content">
          <div
            class="marquee-children posi-a"
            v-for="(item,key) in hot"
            @click="goPointPage({path:'/auxiliary/housingDeal/details',query:{id:item.id,isLease:true}})"
            :key="key" style="padding-left: 15px;width:120px">
            <div class="box-sd pad-b-20" style="width: 120px;border-radius: 4px;overflow: hidden">
              <div class="cover posi-r" style="height: 71px;">
                <span class="bg-f posi-a" style="left:0;top: 0;"
                      :style="{'background':getAuxiliaryConfigColor(item.rentType),'color':'#fff','padding':'4px 5px 2px'}">{{item.rentType}}</span>
                <img-wrapper :src="getSingleImg(item.imgs[0].url)"/>
                <!--<img-wrapper src="http://s11.sinaimg.cn/mw690/006hikKrzy7slvzPwSKba&690"/>-->
              </div>
              <div class="info" style="padding: 0 5px;">
                <h3 class="fon-b hide-e dh-34 lineH-34" style="margin: 10px 0;">
                  {{item.communityName}}</h3>
                <p class="hide-e dh-34"><i class="iconfont icon-dizhi2"></i>{{item.area}}</p>
              </div>
            </div>

          </div>
        </div>
      </dd-marquee>
    </chunk>
    <Banner v-if="banners2.length"
            height="140"
            :swiper="{children:banners2}"/>

    <!--<div class="housing-deal_btns" v-if="category.length">-->
    <!--<div-->
    <!--v-for="(item,key) in category"-->
    <!--:key="key"-->
    <!--@click="goCategoryMethod(item)"-->
    <!--&gt;-->
    <!--<img :src="getSingleImg(JSON.parse(item.icon)[0].url)"/>{{item.name}}-->
    <!--</div>-->
    <!--</div>-->

    <div class="mar-lr">
      <Notice v-bind="noticeConfig"></Notice>
    </div>
    <van-tabs :lineWidth="25" @click="tabsMethod" :color="$themeColor">
      <van-tab title="最新"></van-tab>
      <van-tab title="最热"></van-tab>
    </van-tabs>
    <div class="housing-deal_card_list" v-if="dataList.length">
      <HousingDealCard
        v-for="(item,key) in dataList"
        :key="item.id"
        :item="item"
        :type="item.name"
      ></HousingDealCard>
      <More :status="hasMore"></More>
    </div>
    <not-data v-else></not-data>
    <Agreement
      @hide="showAgreement = false"
      v-if="showAgreement"
      :con="config.disclaimer"
    ></Agreement>
    <Operation :show="showOperation"
               @close="showOperation = !showOperation"
               @choice="actionsOperation"
               :actions="action"
    ></Operation>
  </div>

</template>

<script>

  import Agreement from "@/components/publication/agreement";
  import Notice from '@/components/template/notice';                      // 公告
  import Count from '@/components/template/count';                        // 统计
  import ButtonGroup from '@/components/template/button-group'  // 按钮组
  import Banner from '@/components/home/banner';
  import HousingDealCard from '@/components/template/housing-deal-card';
  import Operation from '@/components/template/operation';
  import Search from '../../../components/template/search';
  import key from "../../../assets/img/other/key.png"
  import conversation from "../../../assets/img/other/conversation.png"
  import {mapState, mapActions} from "vuex"
  import {utilMixins} from "@/plugins/util-mixins";
  import {getLocation, updateShareConfig} from "@/util/wechat-util";
  import {hideLoading, showLoading} from "../../../util";
  import HorizontalTable from '@/components/template/horizontal-table';                      // 横向列表
  import Chunk from '@/components/template/dd-store/chunk';
  import DdMarquee from '@/components/template/other/marquee'
  import {getAuxiliaryConfigColor} from "@/plugins/auxiliary/auxiliary-config";


  import {Toast} from "vant";

  export default {
    components: {
      Notice,
      Count,
      Banner,
      Agreement,
      HousingDealCard,
      Search,
      Operation,
      ButtonGroup,
      HorizontalTable,
      DdMarquee,
      Chunk
    },
    data() {
      return {
        hot: [],
        config: {},
        showOperation: false,
        isScroll: false,
        key,
        conversation,
        banners: [],
        banners2: [],
        choiceIndex: 1,
        action: [
          {title: '分类'},
          {name: '求租'},
          {name: '出租'},

        ],
        showAgreement: false,
        countConfig: {
          browse: '',
          release: '',
          share: '',
        },
        noticeConfig: {
          title: '最新发布',
          contents: []
        },
        category: [],
        dataList: [],
        hasMore: true,
        params: {
          page: 1,
          size: 10,
          word: '',
          typeId: '',
          order: 1,  //1:最新,2:最热
        }
      }
    },
    mixins: [utilMixins],
    methods: {
      getAuxiliaryConfigColor,
      ...mapActions('houingDeal', [
        "housingDealConfig",
        "housingDealRentConfig",
        "housingDealTopInfo",
        "housingDealRentCategory",
        "housingDealRentCount",
        "housingDealList",
        'housingDealNew',
        "housingDealGetHot"
      ]),
      ...mapActions(['getInformationAdList']),

      choiceBtn(item) {
        console.log(item);
        this.params.typeId = '';
        this.params.page = 1;
        this.hasMore = true;
        this.params.word = '';
        this.params.type = item.identifying
        let parent = this.category
        const obj = parent[item.key];
        console.log("parent", parent, "obj", obj)
        parent.forEach(item => this.$set(item, 'active', false))

        this.$set(obj, 'active', true);
        this.getDataList(true);

        // this.goPointPage({path: '/auxiliary/housingDeal/category', query: {...item}})
      },
      tabsMethod(index) {
        this.params.typeId = '';
        this.params.page = 1;
        this.hasMore = true;
        this.params.order = index + 1;
        this.params.word = '';
        this.getDataList(true);
      },
      // 搜索
      async search(val) {
        if (!val.trim()) return Toast.fail({
          message: '请输入关键词',
          duration: 1500
        })
        showLoading()
        this.params.word = val;
        this.params.page = 1;
        this.hasMore = true;
        this.params.order = 3;
        await this.getDataList(true);
        hideLoading()
      },
      // 搜索框的更多选项
      actionsOperation(val, key) {
        this.choiceIndex = key;
        console.log(this.category, val, key);
        this.params.typeId = this.category[key - 1].id
      },
      // 获取统计信息
      getCountInfo() {
        this.housingDealRentCount().then(result => {
          if (result) {
            this.countConfig.release = result.joinNum
            this.countConfig.share = result.shareNum
            this.countConfig.browse = result.viewNum
          }
        });
      },
      async getDataList(refresh) {
        const list = await this.housingDealList(this.params);
        this.dataList = refresh ? list : this.dataList.concat(list);
        if (list.length < this.params.size) this.hasMore = false;
      },
      // 获取分类
      getCategory() {
        this.housingDealRentCategory().then(result => {
          if (result) {
            result.forEach(item => {
              item.icon = JSON.parse(item.icon);
            });
            this.category = result;
            this.choiceBtn({...result[0], key: 0});
            this.$parent.actions = [{title: '选择发布类型'}].concat(result);
          }
        });
      },
      // 配置信息
      getConfig() {
        this.housingDealRentConfig().then(result => {
          console.log("HousingDealRentConfig", result);
          this.config = result;
          document.title = this.$parent.footerConfig.footerInfo[1].name = this.config.field || '房屋租售';
          if (result) {
            updateShareConfig({
              title: result.title,
              imgUrl: result.shareImg,
              desc: result.shareDescription,
            })
          }
        });
      },
      // 加载更多
      onInfinite() {
        this.params.page++;
        this.getDataList();
      },
    },
    computed: {
      ...mapState({
        platform: s => s.platform
      })
    },
    created() {
      this.getInformationAdList({
        type: 10, adType: 1,
      }).then(result => {
        if (result.code == 1) {
          result.data.forEach(v => v.notHost = true)
          this.banners = result.data || []
        }
      })
      this.getInformationAdList({
        type: 10, adType: 2,
      }).then(result => {
        if (result.code == 1) {
          result.data.forEach(v => v.notHost = true)
          this.banners2 = result.data || []
        }
      })

      this.housingDealGetHot().then(result => {
        console.log("housingDealGetHot", result);
        this.hot = result;
      })

      this.housingDealNew().then(result => {
        result.forEach(item => {
          this.noticeConfig.contents.push({
            title: item.title
          })
        })
      })


      this.onscroll(this.onInfinite, this.$route.path, (top) => {
        this.isScroll = top > 50
      });
      // this.housingDealConfig().then(result=>{
      //   console.log("HousingDealConfig",result)
      // });
      // this.housingDealTopInfo().then(result=>{
      //   console.log("HousingDealTopInfo",result)
      // });
      this.getConfig();
      this.getCategory();
      this.getCountInfo();
      this.getDataList();

      return undefined;
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  #housing-deal {
    .housing-deal_search {
      // position: absolute;
      width: calc(100% - 52px);
      padding: 15px 26px;
      top: 0;
      left: 0;
    }

    .fixed {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
    }

    .back {
      background: rgba(0, 0, 0, .1);
    }

    .space {
      height: 120px;
    }

    .housing-deal_card_list {
      margin: 16px 30px;
    }

    .housing-deal_btns {
      background: #fff;
      display: flex;
      padding: 32px 46px;
      justify-content: space-between;
      border-top: 1.1px solid #f4f4f4;

      div {
        height: 84px;
        width: 310px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        color: #fff;
        border-radius: 8px;

        img {
          height: 56px;
          width: 56px;
          margin-right: 18px;
        }
      }

      div:nth-child(1) {
        background: linear-gradient(180deg, rgba(254, 124, 96, 1) 0%, rgba(243, 64, 22, 1) 100%);
      }

      div:nth-child(2) {
        background: linear-gradient(0deg, rgba(12, 185, 244, 1) 0%, rgba(12, 185, 244, 1) 100%);
      }
    }
  }

</style>
