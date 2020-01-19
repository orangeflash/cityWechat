<template>

  <dd-layout-div height="100vh" class="flex bg-f flex-col">
    <Header/>
    <dd-layout-div class="posi-r flex-g-1">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="list.length > 0"
      >
        <dd-comment
          v-for="(item,key) in list"
          :key="key"
          :comment="item"
        />
      </scroller>
      <not-data v-else/>
    </dd-layout-div>


  </dd-layout-div>


</template>


<script>

  import {mapActions} from 'vuex'
  import DdComment from '@/components/template/dd-comment';

  export default {
    components: {DdComment},
    data() {
      return {
        params: {
          goodsId: null,
          page: 1,
          size: 10
        },
        isRequest: false,
        list: []
      }
    },
    methods: {
      ...mapActions("mall", ['mallGetGoodsComments']),
      async getDatas(refresh) {
        let result = await this.mallGetGoodsComments(this.params);
        this.list = refresh ? result : this.list.concat(result);
        this.isRequest = true;
        return result.length >= this.params.size
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getDatas(true);
        return done && done(true)
      },
      async onInfinite(done) {
        console.log('开始加载更多')
        this.params.page++;
        const bool = await this.getDatas();
        return done && done(!bool)
      },
    },
    created() {
      const query = this.$route.query;

      if (query.goodsId) {
        this.params.goodsId = query.goodsId;
        this.getDatas(true)
      }
    }
  }


</script>
