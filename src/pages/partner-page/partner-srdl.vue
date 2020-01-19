<template>
  <div id="Partnersrdl">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <scroller
      v-if="dataList.length"
      :on-refresh="onRefresh"
      :on-infinite="onInfinite" class="scrollermt">
      <div class="srdlList"  v-for="(item,index) in dataList" :key="index">
        <van-cell-group>
          <van-cell class="srdlList_head">
            <template slot="icon">
              <img-wrapper :src="item.portrait||PlaceholderAvatar" not-load="true" class="hdimg"/>
            </template>
            <template slot="title" class="cellbd">
              <div class="cellbd_t">
                <span class="cellbd_t_span">{{item.incomeType||''}}</span>
              </div>
              <div class="cellbd_f">
                <!--<img-wrapper :src="getIcon(index)" not-load="true" v-if="index<3" class="cellbd_f_img"/>-->
                <div class="cellbd_f_pm">
                  <span>{{item.userName}}</span>
                </div>
                <span class="cellbd_f_span">UID:{{item.distributionId}} ({{item.grade=='1'?'一级':'二级'}})</span>
              </div>
            </template>
            <template>
              <div class="cellft">
                <div class="cellft_t">+{{(+item.income).toFixed(2)}}</div>
                <div class="cellft_f" :style="{color:item.state==1?'':'#FF5C23'}">{{item.state==1?'已入账':item.state==2?'已退款':'待入账'}}</div>
              </div>
            </template>
          </van-cell>
          <van-cell class="srdlList_foot" :title="`订单号:${item.outTradeNo}`" :value="formatDateByTimeStamp(item.createdAt,'YYYY-MM-DD HH:mm')" />
        </van-cell-group>
      </div>
    </scroller>
    <section class="c-empty" v-else>
      <div class="c-empty__wrap">
        <img :src="PlaceholderImg" alt="" class="c-empty__img">
        <h3 class="c-empty__title">暂无相关内容</h3>
      </div>
    </section>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import {utilMixins} from "../../plugins/util-mixins";
  import {updateShareConfig} from "../../util/wechat-util";
  import {hideLoading, showDialog, showLoading,getUrlParams,parseObjToParams} from "../../util";
  import {Toast} from 'vant';
  import {PlaceholderAvatar} from "../../project-config/base";
  import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";
  const defaultPage = () => ({pageSize: 10, pageNum: 1});
  export default {
    name: "PartnerSrdl",
    components: { BasicNoteItem },
    data() {
      const pageOption = defaultPage();
      return {
        ...pageOption,
        hasMore: true,
        dataList: [],
        PlaceholderImg,
        PlaceholderAvatar,
        reabagData:[]
      }
    },
    method(){

    },
    methods: {
      ...mapActions("partner", ["getBannerList", "getAnnounceList"]),
      ...mapActions("partner/partnerEnter", ["getpartnerStatistics", "getpartnerCommission"]),
      // 刷新的函数
      async onRefresh(done) {
        Object.assign(this, defaultPage());
        this.dataList = [];
        this.dataList = await this.getpartnerCommission({
          page: this.pageNum,
          size: this.pageSize,
        });
        // this.pageNum++;
        done && done();
      },
      async onInfinite(done) {

        if (this.pageNum === 0) return done();
        this.pageNum++;
        const list = await this.getpartnerCommission({
          page: this.pageNum,
          size: this.pageSize,
        });
        if (list.length) {
          this.dataList = this.dataList.concat(list);
        } else {
          this.pageNum--;
        }
        done(!list.length)
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        user: state => state.user
      }),
    },

    async created() {
      // 获取列表
      this.onRefresh();
    }
  }
</script>
<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";
  #Partnersrdl {
    /*min-height: calc(100vh - 80px);*/
    position: fixed;
    width: 100%;
    height: calc(100vh - 0px);
    .scrollermt{
      margin-top: 92px;
    }
    .srdlList{
      margin-top: 20px;
      &_foot{
        color: #969799;
      }
      &_head{
        .hdimg {
          @include widhei($width: 90px, $height: 90px, $brs: 50%);
          margin-right: 20px;
        }

        .cellbd {
          @include flex-between;
          &_t {
            @include flex-center($justify: flex-start,$align:flex-start);
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
          &_t{
            font-size: $font-size-xl;
            color: $themeColor;
            margin-bottom: 15px;
          }
          &_f{
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
