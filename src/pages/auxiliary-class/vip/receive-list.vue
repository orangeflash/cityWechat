<template>

  <div class="mar-t">
    <div v-if="dataList.length>0">
      <div>
        <CellList v-for="(item,index) in dataList" :key="index" :src="item.portrait" width="1.0" height="1.0">
          <div slot="content" class="flex-y-bt">
            <span class="fon-b">{{item.userName}}</span>
            <span class="mar-t col-9 fon-sm">{{formatDateByTimeStamp(item.creatTime,"YYYY-MM-DD HH:mm")}}</span>
          </div>
        </CellList>
      </div>
      <More :status="hasMore"></More>
    </div>
    <not-data v-else></not-data>
  </div>

</template>

<script>
  import CellList from "../../../components/template/dd-store/cell-list";
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {hideLoading, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {getLocation, updateShareConfig} from "../../../util/wechat-util";

  export default {
    components: {CellList},
    data() {
      return {
        dataList: [],
        hasMore: true,
        params: {
          id: null,
          page: 1,
          size: 10
        },
      }
    },
    methods: {
      ...mapActions('vip', ['getPackageReceive','getPrivilegeReceive']),
      ...mapActions('rushBuy',['getRushReceive']),
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
        let apiName
        switch (this.query.type) {
          case 'package':
            apiName='getPackageReceive'
            break;
          case 'privilege':
            apiName='getPrivilegeReceive'
            break;
          case 'rushBuy':
            apiName='getRushReceive'
            break;
        }
        const result = await this[apiName](this.params);
        this.dataList = refresh ? result : this.dataList.concat(result);
        this.hasMore = result.length >= this.params.size
        hideLoading();
        return this.hasMore;
      },
    },
    mixins: [utilMixins],
    computed: {
    },
    async created() {
      let query=this.$route.query
      console.log('query',query)
      this.query=query
      this.params.id=query.id
      this.onRefresh();
      this.onscroll(this.onInfinite, this.$route.path);
    }
  }


</script>
