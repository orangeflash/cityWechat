<template>
  <div id="JobHuntCol">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh1">
      <van-tabs :line-width="25" @click="changeTab" :color="$themeColor" v-model="active" sticky>
        <van-tab :title="label" v-for="(label,key) in labelArr" :key="key">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="item in list"
              :key="item"
              :title="item"
            />
          </van-list>
          <!--<scroller-->
            <!--v-if="dataList.length"-->
            <!--:on-refresh="onRefresh"-->
            <!--:on-infinite="onInfinite">-->
            <!--<div class="srdlList" v-for="(item,index) in dataList" :key="index">-->
              <!--<van-cell-group>-->
                <!--<van-cell center class="srdlList_head">-->
                  <!--<template slot="icon">-->
                    <!--<img-wrapper :src="item.portrait||PlaceholderAvatar" not-load="true" class="hdimg"/>-->
                  <!--</template>-->
                  <!--<template slot="title" class="cellbd">-->
                    <!--<div class="cellbd_t">-->
                      <!--<span class="cellbd_t_span">{{item.userName||'神秘人'}}</span>-->
                    <!--</div>-->
                    <!--<div class="cellbd_f">-->
                      <!--&lt;!&ndash;<img-wrapper :src="getIcon(index)" not-load="true" v-if="index<3" class="cellbd_f_img"/>&ndash;&gt;-->
                      <!--<div class="cellbd_f_pm">-->
                        <!--<span>UID:{{item.userId}}</span>-->
                      <!--</div>-->
                      <!--&lt;!&ndash;<span class="cellbd_f_span">第{{index+1}}名</span>&ndash;&gt;-->
                    <!--</div>-->
                  <!--</template>-->
                  <!--<template>-->
                    <!--<div class="cellft">-->
                      <!--&lt;!&ndash;<div class="cellft_t">+100.00</div>&ndash;&gt;-->
                      <!--<div class="cellft_f" :style="2==1?'#FF5C23':''">-->
                        <!--{{formatDateByTimeStamp(item.createdAt,"YYYY-MM-DD HH:mm")}}-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</template>-->
                <!--</van-cell>-->
                <!--&lt;!&ndash;<van-cell class="srdlList_foot" title="订单号：20185266542233" value="09-01 10:33"/>&ndash;&gt;-->
              <!--</van-cell-group>-->
            <!--</div>-->
          <!--</scroller>-->
          <!--<section class="c-empty" v-else>-->
            <!--<div class="c-empty__wrap">-->
              <!--<img :src="PlaceholderImg" alt="" class="c-empty__img">-->
              <!--<h3 class="c-empty__title">暂无相关内容</h3>-->
            <!--</div>-->
          <!--</section>-->
        </van-tab>
      </van-tabs>
    </van-pull-refresh>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {hideLoading, showDialog, showLoading, getUrlParams, parseObjToParams, showText} from "../../../util";
  import {Toast} from 'vant';
  import {PlaceholderAvatar} from "../../../project-config/base";
  import PlaceholderImg from "../../../assets/img/personal/my_publication_placeholder.jpg";

  const defaultPage = () => ({pageSize: 10, pageNum: 1});
  export default {
    name: "JobHuntCol",
    components: {BasicNoteItem},
    data() {
      const pageOption = defaultPage();
      return {
        isLoading:true,
        count:0,
        list: [],
        error: false,
        loading: false,
        finished: false,
        ...pageOption,
        hasMore: true,
        active: 0,
        type: null,
        dataList: [],
        PlaceholderImg,
        PlaceholderAvatar,
        reabagData: [],
        hhrpz: '',
      }
    },
    method() {

    },
    methods: {
      ...mapActions("post", [
        "getPostListByParams",]),
      ...mapActions("partner", ["getBannerList", "getAnnounceList", "getPartnerconfig", "getPartnerstatus"]),
      ...mapActions("partner/partnerEnter", ["getpartnerStatistics", "getpartnerTeam"]),
      onRefresh1() {
        setTimeout(() => {
          showText('刷新成功',1000);
          this.isLoading = false;
          this.finished=false,
          this.list=[];
          this.onLoad()
        }, 500);
      },
      onLoad() {
        // 异步更新数据
        setTimeout(() => {
          for (let i = 0; i < 10; i++) {
            this.list.push(this.list.length + 1);
          }
          // 加载状态结束
          this.loading = false;

          // 数据全部加载完成
          if (this.list.length >= 40) {
            this.finished = true;
          }
        }, 500);
      },
      changeTab(active) {
        console.log(active)
        this.pageNum = 1;
        this.type = active ? active + 1 : null;
        this.onRefresh();
      },
      // 刷新的函数
      async onRefresh(done) {
        console.log('222222222')
        Object.assign(this, defaultPage());
        this.dataList = [];
        this.dataList = await this.getpartnerTeam({
          page: this.pageNum,
          size: this.pageSize,
          type: this.type,
        });
        // this.pageNum++;
        done && done();
      },
      async onInfinite(done) {

        if (this.pageNum === 0) return done();
        this.pageNum++;
        const list = await this.getpartnerTeam({
          page: this.pageNum,
          size: this.pageSize,
          type: this.type,
        });
        if (list.length) {
          this.dataList = this.dataList.concat(list);
        } else {
          this.pageNum--;
        }
        done(!list.length)
      },
      async gethhrpz() {
        this.hhrpz = await this.getPartnerconfig()
        console.log(this.hhrpz)
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        user: state => state.user
      }),
      labelArr() {
        return this.hhrpz ? this.hhrpz.class == '2' ? ["直推粉丝", "二级粉丝"] : ["直推粉丝"] : []
      },
    },

    async created() {
      // 获取红包帖子列表
      // this.onRefresh();
      //合伙人配置
      this.gethhrpz()
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../assets/common";
  @import "../../../assets/theme";

  #JobHuntCol {
    /*min-height: calc(100vh - 80px);*/
    /*position: fixed;*/
    width: 100%;
    /*height: calc(100vh - 0px);*/

    .van-tab__pane {
      min-height: calc(100vh - 80px);
      position: relative;
      /*.van-list{*/
        /*width: 100%;*/
        /*position: absolute;*/
      /*}*/
    }

    .srdlList {
      margin-top: 20px;

      &_foot {
        color: #969799;
      }

      &_head {
        .hdimg {
          @include widhei($width: 90px, $height: 90px, $brs: 50%);
          margin-right: 20px;
        }

        .cellbd {
          @include flex-between;

          &_t {
            @include flex-center($justify: flex-start, $align: flex-start);

            &_span {
              color: #333;
              margin-bottom: 15px;
              font-size: $font-size-base;
            }
          }

          &_f {
            @include flex-center($justify: flex-start);

            &_pm {
              @include flex-center;

              span {
                color: #666;
              }
            }

            &_span {
              margin-left: 25px;
              color: #999;
            }
          }
        }

        .cellft {
          &_t {
            font-size: $font-size-xl;
            color: $themeColor;
            margin-bottom: 15px;
          }

          &_f {
            color: #999999;
          }
        }
      }
    }

    .c-empty {
      overflow: hidden;

      &__wrap {
        margin-top: 180px;
        @include alignCenter;
        flex-direction: column;
      }

      &__img {
        width: 335px;
        height: 200px;
      }

      &__title {
        margin: 25px 0;
        font-size: 26px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
</style>
