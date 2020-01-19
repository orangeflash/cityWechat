<template>
  <div id="VipIndex">
    <vip-card></vip-card>
    <div class="base-pad rel">
      <div class="bg-f br-r-20">
        <div class="vip-head flex-center">
          <img-wrapper not-load="true" :src="tImg" class="t-img"></img-wrapper>
          <em>会员特权</em>
          <img-wrapper not-load="true" :src="tImg" style="transform:rotate(180deg);" class="t-img"></img-wrapper>
        </div>
        <section class="entry-button-group">
          <entry-button-group v-bind="entryBtnConfig"/>
        </section>
        <div class="vip-notice">
          <Notice icon=" " color="#F4F4F4" :notice="noticeList" pad="0" fontColor="#EFB161" textAlign="center"/>
        </div>
      </div>
      <div class="bg-f br-r-20 mar-t">
        <div class="vip-head flex-center">
          <img-wrapper not-load="true" :src="tImg" class="t-img"></img-wrapper>
          <em>开卡礼包</em>
          <img-wrapper not-load="true" :src="tImg" style="transform:rotate(180deg);" class="t-img"></img-wrapper>
        </div>
        <div>
          <vip-package v-for="(item,index) in lbList" :key="index" :package-info="item"></vip-package>
        </div>
      </div>
    </div>
    <dd-tab :tabs="tabs" @click="tabClick"></dd-tab>
    <div class="tq-list br-t-e bor-b">
      <div class="tq-con" v-for="(item,index) in  privilegeDay" :key="index">
        <div class="week">{{item.weekName}}</div>
        <div class="day-con flex-center" :class="{'today':index==activeDay}" @click="clickDay(index)">
          <div class="day">{{item.dayName}}</div>
          <span class="num flex-center" v-if="index">{{item.count}}</span>
        </div>
      </div>
    </div>
    <template v-if="dataList.length">
      <div>
        <vip-privilege v-for="(item,index) in dataList" :key="index" :data-info="item"></vip-privilege>
      </div>
      <More :status="hasMore"></More>
    </template>
    <not-data v-else></not-data>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import VipCard from "../../../components/template/vip/vip-card";
  import VipPrivilege from "../../../components/template/vip/vip-privilege";
  import VipPackage from "../../../components/template/vip/vip-package";
  import EntryButtonGroup from "../../../components/basic/entry-button-group";
  import Notice from "../../../components/business-district/notice";
  import DdTab from '@/components/template/other/tab'
  import {PlaceholderAvatar, PlaceholderImg, backendPath, publishUrl} from "../../../project-config/base";
  import tImg from "../../../assets/img/partner/timg.png";
  import zgbs from "../../../assets/img/auxiliary/vip/zgbs.png";
  import sjf from "../../../assets/img/auxiliary/vip/sjf.png";
  import sbsjf from "../../../assets/img/auxiliary/vip/sbsjf.png";
  import yhzk from "../../../assets/img/auxiliary/vip/yhzk.png";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {hideLoading, showLoading, showText} from "../../../util";
  import {changeWeek} from "../../../plugins/auxiliary/auxiliary-config";
  export default {
    name: "VipIndex",
    components: {
      VipCard,
      VipPackage,
      VipPrivilege,
      EntryButtonGroup,
      Notice,
      DdTab,
    },
    data() {
      return {
        PlaceholderAvatar,
        tImg, zgbs, sjf, sbsjf, yhzk,
        entryCategories: [
          {name: '尊贵标识', img: zgbs},
          {name: '开卡送积分', img: sjf},
          {name: '签到双倍积分', img: sbsjf},
          {name: '享优惠折扣', img: yhzk}
        ],
        noticeList: [],
        lbList: [],
        userInfo: null,
        setUp: null,
        layoutBody: {
          hd: 1,
          bd: 1,
          img: {
            wid: 1.5,
            hei: 1.5,
          },
        },
        tabs: [
          {title: '今日特权'},
          {title: '全部特权'},
        ],
        privilegeDay: [],
        params: {
          page: 1,
          size: 10,
          week:'',
          day:'',
        },
        hasMore: true,
        dataList: [],
        activeDay:1,
      }
    },
    methods: {
      ...mapActions("partner/partnerEnter", ["getpartnerStatistics", "getpartnerNewlist"]),
      ...mapActions('vip', ['getPackageList', 'getVipConfig', 'getOpenList', 'getPrivilegeDay','getPrivilegeList']),
      getCategory() {
        let a = this.entryCategories.map(item => {
          return this.jsonChangeField({
            json: item,
            fields: {
              "name": 'label',
              "img": 'url',
            }
          })
        })
      },
      async getNewInfo() {
        const vipData = await this.getOpenList();
        this.noticeList = _.map(vipData.list, (item) => {
          return {title: `${item.userName}${this.computedDate(item.createdAt)} 开通会员`, 'content': ''}
        }) || []
      },
      tabClick(e) {
        if(e.value==0){
          this.activeDay=1;
          this.params.page = 1;
          this.params.week=this.privilegeDay[1].week
          this.params.day=this.privilegeDay[1].day
          this.getList(true);
        }
        else {
          this.goPointPage({path:'/auxiliary/vip/PrivilegeCategory'})
        }
      },
      clickDay(e){
        this.activeDay=e
        let day=this.privilegeDay[e]
        this.params.page = 1;
        this.params.week=day.week
        this.params.day=day.day
        this.getList(true);
        //console.log(e,day)
      },
      onRefresh() {
        this.params.page = 1;
        this.getList(true);
      },
      onInfinite() {
        if (!this.hasMore) return
        this.params.page++;
        this.getList();
      },
      async getList(refresh) {
        showLoading();
        const result = await this.getPrivilegeList(this.params);
        this.dataList = refresh ? result : this.dataList.concat(result);
        this.hasMore = result.length >= this.params.size
        hideLoading();
        return this.hasMore;
      },
      },
      mixins: [utilMixins],
      computed: {
        ...mapState({
          user: s => s.user
        }),
        entryBtnConfig() {
          const config = {
            "color": "#333",
            "shape": 2,
            "buttonNumberOfCol": 4,
            "buttonNumberOfRow": 1,
          };
          return {...config, entryButtonList: this.entryCategories};
        },
      },
      // watch:{
      //   user(newval){
      //     console.log('this.user newval',newval)
      //   },
      // },
      created() {
        //会员设置
        this.getVipConfig().then(data => {
          document.title = this.$parent.footerConfig.footerInfo[1].name = data.field || '会员卡';
          updateShareConfig({
            title: data.title,
            imgUrl: data.shareImg,
            desc: data.shareDescription,
            link: window.location.href
          });
        })
        this.getCategory()
        this.getPackageList().then(res => {
          this.lbList = res
        })
        //最新收益
        this.getNewInfo()
        //
        this.getPrivilegeDay().then(res => {
          this.params.week=res[0].week
          this.params.day=res[0].day
          this.onRefresh();
          res.forEach(item => {
            item.weekName = changeWeek(item.week)
            item.dayName=item.day
            //item.dayName=item.day.split('-')[2]
          })
          res[0].dayName='今天'
          this.privilegeDay = [{week:'',day:'',weekName: `${new Date().getMonth() + 1}月`, dayName: '全部', count: 0}].concat(res)
          // console.log('this.privilegeDay', this.privilegeDay)
        })
        this.onscroll(this.onInfinite, this.$route.path);
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #VipIndex {
    font-size: $font-size-base;

    .vip-head {
      padding: 40px 30px;

      em {
        margin: 0 30px;
        font-size: $font-size-lg;
      }

      .t-img {
        width: 130px;
      }
    }

    .vip-notice {
      margin: auto;
      padding: 20px 0 40px;
      width: 60%;
    }

    .tq-list {
      color: #333;
      display: flex;
      flex-wrap: nowrap;
      overflow-x: scroll;
      background: #fff;

      .tq-con {
        padding: 30px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .day-con {
          font-size: 22px;
          width: 70px;
          height: 70px;
          border: 1.1px solid #999;
          border-radius: 50%;
          position: relative;
          margin-top: 30px;

          .num {
            position: absolute;
            background: $themeColor;
            color: #fff;
            font-size: 20px;
            right: -15px;
            top: -10px;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            vertical-align: middle;
          }
        }
        .today{
          background: $themeColor;
          color: #fff;
          border-color: #fff;
        }
      }
    }
  }
</style>
