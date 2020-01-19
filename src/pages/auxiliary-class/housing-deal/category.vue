<template>
  <div class="dd-category-list">
    <Header :children-title="title"></Header>
    <ul class="free-ride-category__list" v-if="categoryList.length">
      <scroller
        :on-refresh="onrefresh"
        :on-infinite="onInfinite"
      >
        <HousingDealCard
          v-for="(item,key) in categoryList"
          :key="key"
          :item="item"
        ></HousingDealCard>
      </scroller>
    </ul>
    <not-data v-else></not-data>
  </div>
</template>
<script>

  import {Toast} from 'vant';
  import {mapState, mapActions} from "vuex"
  import HousingDealCard from '@/components/template/housing-deal-card';

  export default {
    components: {HousingDealCard},
    data() {
      return {
        title:'',
        categoryList: [],
        // 请求参数
        params: {
          page: 1,
          size: 10,
          typeId: null,
        }
      }
    },
    methods: {
      ...mapActions("houingDeal", [
        "housingDealList"
      ]),
      // 刷新
      async onrefresh(done) {
        this.params.page = 1;
        await this.getDataList(true);
        done && done(true);
      },
      // 加载更多
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getDataList();
        done && done(bool);
      },
      // 获取数据
      async getDataList(refresh) {
        const list = await this.housingDealList(this.params);
        this.categoryList = refresh ? list : this.categoryList.concat(list);
        return list.length < this.params.size;
      }
    },
    created() {
      const query = this.$route.query;
      let that = this;
      // 如果有分类id就执行第一个函数，没有就执行后面的函数
      query.id ? (() => {
        this.params.typeId = query.id;
        this.title = (query.name||document.title);
        this.getDataList(true);
      })() : (() => {
        Toast.fail({
          message: '缺少Id',
          duration: 1500
        });
        setTimeout(() => {
          that.$router.go(-1)
        }, 1500)
      })()
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-category-list {
    ul {
      position: fixed;
      margin: 15px 30px;
      width: calc(100% - 60px);
      height: calc(100% - 110px);
    }
  }

</style>

