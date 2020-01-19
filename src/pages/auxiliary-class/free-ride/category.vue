<template>
  <div class="free-ride-category">
    <Header :childrenTitle="title"></Header>
    <ul class="free-ride-category__list" v-if="freeRideList.length">
      <scroller
        :on-refresh="onrefresh"
        :on-infinite="onInfinite"
      >
        <FreeRideCard v-for="(item,key) in freeRideList" :freeRide="item" :key="key"></FreeRideCard>
      </scroller>
    </ul>
    <not-data v-else></not-data>
  </div>


</template>

<script>
  import FreeRideCard from '@/components/template/free-ride-card'                      // 顺风车卡片
  import {Toast} from 'vant'
  import {hideLoading, showLoading} from "../../../util";
  import {mapState, mapActions} from "vuex"

  export default {
    components: {FreeRideCard},
    data() {
      return {
        title:'',
        freeRideList: [],      //顺风车数据
        params: {
          typeId: null,        // 搜索类型
          page: 1,             //页码 默认第一页
          size: 10,            //每页数量
        },
        hasMore: true,
      }
    },
    methods: {
      ...mapActions('freeRide', ['getInformationAdList', 'getCarCategory', 'getCarList', 'getFreeRideConfig']),
      // 刷新
      async onrefresh(done) {
        this.params.page = 1;
        const bool = await this.getCar(true);
        done && done(bool);
      },
      // 加载更多
      async onInfinite(done) {
        this.params.page++
        const bool = await this.getCar();
        done && done(bool);
      },
      async getCar(refresh) {
        showLoading();
        const res = await this.getCarList(this.params);
        if (res.code == 1) {
          this.freeRideList = refresh ?  res.data:this.freeRideList.concat(res.data);
        } else if (res.code) {
          Toast.fail({
            message: "code:" + res.code,
            duration: 1500
          })
        } else {
          Toast.fail({
            message: '请求失败',
            duration: 1500
          })
        }
        hideLoading();
        return res.data && res.data.length < this.params.size;
      }
    },
    created() {
      this.params.typeId = this.$route.query.typeId

      this.title = this.$route.query.title

      this.title?document.title = this.title:this.title = document.title;

      if (!this.params.typeId) {
        Toast.fail({
          message: 'typeId',
          duration: 1500
        })
      } else {
        this.getCar();
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .free-ride-category{
    &__list{
      position: fixed;
      width: 100%;
      height: calc(100% - 95px);
    }
  }

</style>
