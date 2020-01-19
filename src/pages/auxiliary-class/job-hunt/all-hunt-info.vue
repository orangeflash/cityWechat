<template>

  <dd-layout-div class="bg-f flex-col" height="100vh">

    <Header/>
    <dd-layout-div class="flex-g-1 posi-r bg-f4">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="list.length > 0"
      >
        <job-find :list="list"/>
        <more :status="hasMore"/>
      </scroller>
      <not-data v-else-if="isRequest"/>
    </dd-layout-div>

  </dd-layout-div>

</template>


<script>

  import {mapActions} from 'vuex'
  import {Toast} from 'vant'
  import {hideLoading, showLoading} from "../../../util";
  import HuntFind from "../../../components/template/item/hunt-find";
  import JobFind from "../../../components/template/item/job-find";

  export default {
    components: {JobFind, HuntFind},
    data() {
      return {
        params: {
          page: 1,
          size: 10,
          userId: null
        },
        list: [],
        hasMore: true,
        isRequest: false,
      }
    },
    methods: {
      ...mapActions("jobHunt/jobHuntEnter", ["getMyRecruit"]),
      async getData() {
        showLoading();
        let result = await this.getMyRecruit(this.params);
        hideLoading();
        this.isRequest = true;
        this.hasMore = result.length >= this.params.size;
        this.list = this.params.page == 1 ? result : this.list.concat(result);
        return this.hasMore
      },
      async onInfinite(done) {
        if (!this.hasMore) return done && done(false)
        this.params.page++;
        await this.getData();
      },
      async onRefresh(done) {
        this.params.page = 1;
        const bool = await this.getData(true)
        return done && done(!bool)
      },
    },
    created() {
      const query = this.$route.query;

      if (query.userId) {
        this.params.userId = query.userId;
        this.getData()
      } else {
        Toast.fail({
          message: '缺少id',
          duration: 1500
        })
      }
    }
  }

</script>
