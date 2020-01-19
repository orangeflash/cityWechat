<template>
  <div id="Partnerwdfs">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <van-tabs :line-width="25" @click="changeTab" :color="$themeColor" v-model="active">
      <van-tab :title="label.t" v-for="(label,key) in labelArr" :key="key">
        <scroller
          v-if="dataList.length"
          :on-refresh="onRefresh"
          :on-infinite="onInfinite">
          <div class="srdlList" v-for="(item,index) in dataList" :key="index">
            <van-cell-group>
              <van-cell center class="srdlList_head">
                <template slot="icon">
                  <img-wrapper :src="item.portrait||PlaceholderAvatar" not-load="true" class="hdimg"/>
                </template>
                <template slot="title" class="cellbd">
                  <div class="cellbd_t">
                    <span class="cellbd_t_span">{{item.userName||'神秘人'}}</span>
                  </div>
                  <div class="cellbd_f">
                    <!--<img-wrapper :src="getIcon(index)" not-load="true" v-if="index<3" class="cellbd_f_img"/>-->
                    <div class="cellbd_f_pm">
                      <span v-if="item.userId">UID:{{item.userId}}</span>
                      <em v-else class="col-t fon-b">待绑定</em>
                    </div>
                    <!--<span class="cellbd_f_span">第{{index+1}}名</span>-->
                  </div>
                </template>
                <template>
                  <div class="cellft">
                    <!--<div class="cellft_t">+100.00</div>-->
                    <div class="cellft_f" :style="2==1?'#FF5C23':''">{{formatDateByTimeStamp(item.createdAt,"YYYY-MM-DD HH:mm")}}
                    </div>
                  </div>
                </template>
              </van-cell>
              <!--<van-cell class="srdlList_foot" title="订单号：20185266542233" value="09-01 10:33"/>-->
            </van-cell-group>
          </div>
        </scroller>
        <section class="c-empty" v-else>
          <div class="c-empty__wrap">
            <img :src="PlaceholderImg" alt="" class="c-empty__img">
            <h3 class="c-empty__title">暂无相关内容</h3>
          </div>
        </section>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import BasicNoteItem from "@/components/post/note-item/basic-note-item";
  import {utilMixins} from "../../plugins/util-mixins";
  import {updateShareConfig} from "../../util/wechat-util";
  import {hideLoading, showDialog, showLoading, getUrlParams, parseObjToParams} from "../../util";
  import {Toast} from 'vant';
  import {PlaceholderAvatar} from "../../project-config/base";
  import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";

  const defaultPage = () => ({pageSize: 10, pageNum: 1});
  export default {
    name: "PartnerWdfs",
    components: {BasicNoteItem},
    data() {
      const pageOption = defaultPage();
      return {
        ...pageOption,
        hasMore: true,
        active: 0,
        type: 1,
        dataList: [],
        PlaceholderImg,
        PlaceholderAvatar,
        reabagData: [],
        hhrpz: '',
        params: {
          page: 1,
          size: 10,
          type:1,
        }
      }
    },
    method() {

    },
    methods: {
      ...mapActions("post", [
        "getPostListByParams",]),
      ...mapActions("partner", ["getBannerList", "getAnnounceList", "getPartnerconfig", "getPartnerstatus"]),
      ...mapActions("partner/partnerEnter", ["getpartnerStatistics", "getpartnerTeam", "getUnregistered"]),
      changeTab(active) {
        this.params.type = this.labelArr[active].type;
        this.onRefresh();
        console.log(active)
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getData(true)
        done && done();
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getData();
        done && done(!bool);
      },
      async getData(refresh){
        let result = await this.getpartnerTeam(this.params);
        this.dataList = refresh ? result : this.dataList.concat(result);
        return result.length >= this.params.size;
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
        return this.hhrpz ? this.hhrpz.class == '2' ? [{t:"直推粉丝",type:1},{t:"二级粉丝",type:2},{t:"待绑定",type:3}] : [{t:"直推粉丝",type:1},{t:"待绑定",type:3}] : []
      },
    },

    async created() {
      //合伙人配置
      await this.gethhrpz()
      // 获取红包帖子列表
      this.onRefresh();

    }
  }
</script>
<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";

  #Partnerwdfs {
    /*min-height: calc(100vh - 80px);*/
    position: fixed;
    width: 100%;
    height: calc(100vh - 0px);

    .van-tab__pane {
      min-height: calc(100vh - 80px);
      position: relative;
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
