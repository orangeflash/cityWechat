<template>

  <dd-layout-div mi-h="100vh" class="bg-f">
    <dd-layout-search :config="searchConfig" search-type="16"></dd-layout-search>
    <Banner
      :height="platform.slideNum"
      :swiper="{children:banners}"
    />

    <dd-layout-announce announceType="friend" class="mar-b-20"/>
    <Banner v-if="banners2.length"
            height="140"
            :swiper="{children:banners2}"/>
    <!--<dd-layout-div bg="#EFF3F6" :height="96" :fillet="96" :mar="[30]" :pad="[0 ,30]" class="flex flex-y-center">-->
      <!--<dd-layout-div color="#FFBB17" :mar="[5,0,0]" class="iconfont icon-gonggao fon-40"></dd-layout-div>-->
      <!--<dd-layout-div class="flex-g-1 posi-r mar-l dh">-->
        <!--<van-swipe class="dh w100" v-if="notice.length > 0" :autoplay="3000" :show-indicators="false" vertical>-->
          <!--<van-swipe-item-->
            <!--class="dh-88 w100"-->
            <!--v-for="(item,key) in notice"-->
            <!--:key="key"-->
            <!--@click="goPointPage({name:'Announcement',params:{list:notice,index:key}})"-->
          <!--&gt;-->
            <!--<div class="w100 pad-t-20">-->
              <!--<div class="fon-wb fon-b w100 hide-e dh-40 lineH-40 pad-t-5">{{item.title}}</div>-->
            <!--</div>-->
          <!--</van-swipe-item>-->
        <!--</van-swipe>-->

      <!--</dd-layout-div>-->

    <!--</dd-layout-div>-->
    <div>
      <ul class="pad-30 flex flex-bt flex-y-center">
        <li class="fon-lg t-c flex-g-1 mar-lr-20" v-for="(item,key) in tabConfig" :key="key"
            :class="key == params.type - 1 &&'fon-xxl fon-wb'" @click="changeTab(key)">{{item.name}}
        </li>
      </ul>
    </div>

    <dd-layout-div v-if="list.length > 0">
      <city-love :list="list"/>
      <more :status="hasMore"/>
    </dd-layout-div>
    <not-data v-else-if="isRequest"/>


  </dd-layout-div>


</template>
<script>
  import Banner from "../../../components/home/banner";
  import {mapActions, mapState} from 'vuex'
  import Notice from "../../../components/home/notice";
  import CityLove from "../../../components/template/item/city-love";
  import DdLayoutSearch from '../../../components/layout/dd-layout-search'
  import {utilMixins} from "../../../plugins/util-mixins";
  import NotFound from "../../common/not-found";
  import {updateShareConfig} from "../../../util/wechat-util";
  import DdLayoutAnnounce from "../../../components/layout/dd-layout-announce";

  export default {
    mixins: [utilMixins],
    components: {DdLayoutAnnounce, NotFound, CityLove, Notice, Banner, DdLayoutSearch},
    data() {
      return {
        tabConfig: [
          {name: '关注'},
          {name: '推荐'},
          {name: '最新'},
        ],
        banners: [],
        banners2: [],
        searchConfig: {
          shape: 3,
        },
        notice: [],
        list: [],
        params: {
          page: 1,
          size: 10,
          type: 1
        },
        isRequest: false,
        hasMore: true
      }
    },
    methods: {
      ...mapActions(['getInformationAdList', 'getAnnounce']),
      ...mapActions("cityLove", ["cityLoveFriends", "cityLoveConfig"]),
      changeTab(index = 0) {
        this.params.type = index + 1;
        this.onRefresh();
      },
      async getFriendList(refresh) {
        let result = await this.cityLoveFriends(this.params);

        console.log("result", result)

        result = result.map(item => {
          let city = item.city.split("-")[1]||item.city.split("-")[0]||'';
          if (city.length > 3) city = city.substring(0, 4) + "..."

          return {
            cover: this.getSingleImg(item.icon),
            nickname: item.name,
            age: item.birthday,
            city,
            follow: item.follow,
            sex: item.sex,
            tel: item.tel,
            id: item.id,
            isTop: +item.isTop == 1
          }
        })


        this.list = refresh ? result : this.list.concat(result)


        this.hasMore = result.length >= this.params.size;

        this.isRequest = true

      },
      async onRefresh() {
        this.params.page = 1;
        await this.getFriendList(true)
      },
      async onInfinite() {
        if (!this.hasMore) return false;
        this.params.page++;
        await this.getFriendList()

      }

    },
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
    },
    created() {
      // 获取广告信息
      this.getInformationAdList({
        type: 18,
        adType: 1
      }).then(result => {
        if (result.code == 1) {
          result.data.forEach(v => v.notHost = true)
          this.banners = result.data || []
        }
      })
      this.getInformationAdList({
        type: 18,
        adType: 2
      }).then(result => {
        if (result.code == 1) {
          result.data.forEach(v => v.notHost = true)
          this.banners2 = result.data || []
        }
      })

      this.getAnnounce({
        type: 7
      }).then(result => {
        console.log("result getAnnounce", result)
        result.length > 0 ? (this.notice = result) : (this.notice = [{title: '暂无公告'}])

      })

      this.cityLoveConfig().then(result => {
        console.log("result config=>", result);

        document.title = this.$parent.$parent.footerConfig.footerInfo[1].name = result.field || '同城交友';
        updateShareConfig({
          title: result.title,
          imgUrl: result.shareImg,
          desc: result.shareDescription,
        });


      })


      this.changeTab(1)

      this.onscroll(this.onInfinite, this.$route.path)

    }
  }
</script>
