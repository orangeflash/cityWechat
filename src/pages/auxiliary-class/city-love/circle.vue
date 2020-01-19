<template>
  <!--圈子-->
  <div class="bg-f flex flex-col flex-g-1">

    <div class="dh-100 flex-y-center flex-bt">
      <div class="dh-100 w-100 flex-center" @click="goPointPage('/auxiliary/cityLove/releaseDynamic')">
        <i class="iconfont icon-ai-camera fon-40"></i>
      </div>
      <ul class="flex-g-1  flex flex-center">
        <li class="fon-lg mar-lr-20" v-for="(item,key) in tabConfig" :key="key"
            @click="changeTab(key)"
            :class="[params.type - 1 == key&&'fon-xxl fon-wb']">{{item.name}}
        </li>
      </ul>
      <div class="dh-100 w-100 flex-center" @click="goPointPage('/auxiliary/cityLove/myDynamic')">
        <i class="iconfont icon-mingpianjiaxiaochengxuicon_wode fon-40"></i>
      </div>
    </div>

    <dd-layout-search :config="searchConfig" search-type="-1"></dd-layout-search>

    <dd-layout-div class="flex-g-1 posi-r">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="list.length > 0"
      >
        <city-love-notice :list="list"/>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </dd-layout-div>
  </div>


</template>


<script>
  import DdLayoutSearch from '../../../components/layout/dd-layout-search'
  import CityLoveNotice from "../../../components/template/item/city-love-notice";

  import {mapActions} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {computedDate} from "../../../util";

  export default {
    mixins: [utilMixins],
    components: {CityLoveNotice, DdLayoutSearch},
    data() {
      return {
        searchConfig: {
          shape: 3,
        },
        tabConfig: [
          {name: '关注'},
          {name: '推荐'},
          {name: '最新'},
        ],
        list: [],
        params: {
          page: 1,
          size: 10,
          type: 1
        },
        hasMore: true,
        isRequest: false
      }
    },
    methods: {
      ...mapActions("cityLove", ['cityLoveGetDynamicList']),
      async getList(refresh) {

        let result = await this.cityLoveGetDynamicList(this.params);

        result = result.map(item => {
          return {
            ...item,
            face: this.getSingleImg(item.icon),
            nickname: item.name,
            age: item.birthday,
            city: item.address,
            love: item.love,
            loveNum: item.loveNum || 0,
            shareNum: item.shareNum || 0,
            browse: item.viewNum || 0,
            sex: +item.sex,
            photos: item.media ? item.media.map(item => {
              return this.getSingleImg(item.url);
            }) : [],
            time: computedDate(item.createdAt)
          }
        });
        this.list = refresh ? result : this.list.concat(result);
        this.hasMore = result.length >= this.params.size;
        this.isRequest = true;
        return this.hasMore
      },
      changeTab(index = 1) {
        this.params.type = index + 1;
        this.onRefresh();

      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getList(true);
        return done && done(false)
      },
      async onInfinite(done) {
        if (!this.hasMore) return  done(true);
        this.params.page++;
        const bool = await this.getList();
        return done && done(!bool)
      }
    },
    created() {
      this.changeTab()
    }
  }

</script>
