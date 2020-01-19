<template>

  <!--二级分类-->
  <div class="dd-card">
    <dd-tree-select
      :fixedTop="true"
      @choice="choiceResult"
      :trees="trees"
      @closed="showChoice = false"
    ></dd-tree-select>
    <div class="mar-t-100">
    <div v-if="dataList.length>0">
      <vip-privilege v-for="(item,index) in dataList" :key="index" :data-info="item"></vip-privilege>
      <More :status="hasMore"></More>
    </div>
    <not-data v-else></not-data>
    </div>
  </div>

</template>

<script>
  import DdTreeSelect from '../../../components/template/dd-tree-select'
  import VipPrivilege from "../../../components/template/vip/vip-privilege";
  import More from '../../../components/template/more';
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {hideLoading, showLoading} from "../../../util";
  import {getLocation, updateShareConfig} from "../../../util/wechat-util";

  export default {
    components: {DdTreeSelect, VipPrivilege, More},
    data() {
      return {
        showChoice: false,
        banners: [],
        trees: [
          {
            title: '所有区域',
            items: [],
          },
          {
            title: '全部行业',
            items: [],
          },
          {
            title: '排序',
            items: [
              {text: '默认排序', sort: ''},
              {text: '距离最近', sort: 'nearest'},
              {text: '最热', sort: 'hot'},
              {text: '最新', sort: 'new'},
            ]
          },
        ],
        type: "",
        dataList: [],
        hasMore: true,
        params: {
          typeId: null,
          typePid: null,
          zoneId: null,
          sort: '',
          page: 1,
          size: 10
        },
        myCardLength: "",
      }
    },
    methods: {
      ...mapActions(['getInformationAdList', 'getAnnounce']),
      ...mapActions('vip', ['getPrivilegeList']),
      ...mapActions("businessDistrict", ["getLocationOption", "getCategoryOption"]),
      call(tel) {
        location.href = `tel://${tel}`;
      },
      choiceResult(item, index) {
        console.log('choiceResult', item, index);
        if (index == 0) {
          this.params.zoneId = item.id
        }
        else if (index == 1) {
          if(item.text=='全部'){
            this.params.typePid = item.id;
            this.params.typeId = '';
          }
          else {
            this.params.typePid = '';
            this.params.typeId = item.id;
          }
        }
        else {
          this.params.sort = item.sort;
        }
        this.onRefresh()
        console.log(this.params)
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
    computed: {
      ...mapState({
        platform: s => s.platform
      }),
      ...mapGetters("businessDistrict", ["formatLocationOption", "formatCategoryOption"]),
    },
    async created() {
      window.wxReady(async () => {
        showLoading("定位中");
        let latLng = await getLocation();
        hideLoading();
        this.params.lat = latLng.latitude;
        this.params.lng = latLng.longitude;
        this.onRefresh();
        //获取地区和分类数据
        await Promise.all([this.getLocationOption(), this.getCategoryOption({type: 2})]);
        this.$set(this.trees[0], 'items', this.formatLocationOption)
        this.$set(this.trees[1], 'items', this.formatCategoryOption);
      })
      // if (this.$route.query.sort) {
      //   this.params.sort = this.$route.query.sort;
      //   const res = await this.getCardList({...this.params});
      //   this.cardList = res.data;
      //   this.trees[0].title = "人气榜"
      // }
      this.onscroll(this.onInfinite, this.$route.path);
    }
  }


</script>
