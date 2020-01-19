<template>
  <div id="city-category-list">
    <!--这个头部是组件来的 S-->
    <Header :childrenTitle="navs[active] && navs[active].name"></Header>
    <!--这个头部是组件来的 E-->
    <div class="city-category-top">
      <div class="city-category-nav-box">
        <div class="iconfont-box">
          <i class="iconfont icon-list_icon"></i>
        </div>
        <div class="city-category-nav" v-if="navs">
          <van-tabs @click="getInfo" v-model="active">
            <van-tab v-for="(item,index) in navs" :title="item.name" :key="index"></van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
    <div class="city-category-list__card">
      <scroller
        v-if="details.length"
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
      >
        <PostCord :info-data="item" v-for="item in details" :key="item.id"></PostCord>
      </scroller>
      <not-data v-else></not-data>
    </div>

  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import PostCord from '../../components/post/post-cord.vue'

  const loadImage = () => import('@/pages/common/image-load.vue')
  import {Toast} from "vant";
  import Header from "@/components/header";
  import {hideLoading, showLoading} from "../../util";

  export default {
    name: "cityCategoryList",
    props: ["id"],
    components: {PostCord, Header},
    data() {
      return {
        navs: [],
        page: 1,
        size: 10,
        details: [],
        index: null,
        active: 0,
        hasMore: true,
        typeId: null,
        linkImage: [
          {src: require('@/assets/img/video-placeholder.jpg')}
        ]
      }
    },
    methods: {
      ...mapActions("cityInformation", ['getCityCategory', 'getCityInfoList']),
      async getBottons(id) {
        this.navs = await this.getCityCategory({type: 3})
        if (this.navs.length < 5) {
          document.querySelector(".city-category-nav").style.width = this.navs.length * 100 + "px";
        }
        if (id) {
          this.typeId = id;
          this.cityInfoList();
        } else {
          Toast.fail({
            message: '缺少类型id',
            duration: 1500
          })
          setTimeout(() => {
            //this.$router.go(-1);
          }, 1500)
        }
        for (let i = 0; i < this.navs.length; i++) {
          if (+this.navs[i].id == +id) {
            this.active = i;
            return
          }
        }
      },
      async cityInfoList(bool) {
        if (this.hasMore) {
          showLoading();
          const result = await this.getCityInfoList({
            page: this.page,
            size: this.size,
            typeId: this.typeId
          })
          hideLoading();
          if (bool) {
            this.details = result || []
          } else if (result.length) {
            this.details = this.details.concat(result || []);
          } else {
            this.page--;
            this.hasMore = false;
          }
          return result.length == 0;
        }
      },
      getInfo(index) {
        this.page = 1;
        this.size = 10;
        this.index = index;
        this.hasMore = true;
        this.typeId = this.navs[index].id;
        this.cityInfoList(true);
      },
      async onRefresh(done) {
        this.page = 1;
        this.details = [];
        this.hasMore = true;
        await this.cityInfoList();
        done && done(true);
      },
      async onInfinite(done) {
        this.page++;
        const res = await this.cityInfoList();

        done && done(res);

      }
    },
    created() {

      this.getBottons(this.$route.query.id || this.$route.query.pid);
    }
  }
</script>
<style scoped lang="scss">
  @import '../../assets/common.scss';

  #city-category-list {
    .city-category-top {
      background-color: #fff;

      .city-category-nav-box {
        overflow: hidden;

        .iconfont-box {
          float: right;
          height: 80px;
          width: 80px;
          display: flex;
          align-items: center;
          background-color: #fff;

          i {
            display: block;
            margin: 0 auto;
            font-size: 30px;
          }
        }

        .city-category-nav {
          max-width: calc(100% - 80px);
          background-color: #fff;
        }
      }
    }

    .city-category-list__card {
      position: fixed;
      width: 100%;
      height: calc(100% - 200px);
    }
  }

</style>
