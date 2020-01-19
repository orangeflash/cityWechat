<template>
  <div class="cardContainer">
    <!--<van-search placeholder="海量人脉，触手可及"-->
    <!--v-model="keyword"-->
    <!--input-align="center"-->
    <!--class="cardSearch"-->
    <!--background="#F4F4F4"-->
    <!--/>-->
    <div style="position: fixed;width: 100%;height: calc(100% - 1rem);margin-top: 10px">
      <scroller
        v-if="cardList.length"
        :onRefresh="onRefresh"
        :onInfinite="onInfinite"
      >
        <card :list="cardList"/>
      </scroller>
      <not-data v-else-if="isReqeust"/>
    </div>


  </div>
</template>

<script>
  import Card from '@/components/template/card/two';
  import {mapActions, mapState, mapGetters} from 'vuex';

  export default {
    components: {Card},
    data() {
      return {
        keyword: "",
        show: true,
        isReqeust: false,
        params: {
          page: 1,
          size: 10,
          type: 10,
        },
        cardList: [],
      }
    },
    methods: {
      ...mapActions(["getMyCollection"]),
      call(tel) {
        location.href = `tel://${tel}`;
      },
      /** 刷新 */
      async onRefresh(done) {
        this.params.page = 1;
        const bool = await this.getData(true);
        done && done(!bool);
      },
      /** 加载更多 */
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        done && done(!bool);
      },
      async getData(refresh) {
        const result = await this.getMyCollection(this.params);
        this.isReqeust = !this.isReqeust;
        this.cardList = refresh ? result : this.cardList.concat(result);

        return result.length >= this.params.size;

        console.log(this.cardList);
      }
    },
    created() {
      this.onRefresh()
    }

  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";


  .cardContainer {

    .cardSearch {
      height: 96px;

      .van-cell {
        font-size: 14px;
        background: rgba(255, 255, 255, 1);
      }
    }
  }

</style>
