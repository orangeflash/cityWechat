<template>
  <div id="Mine">
    <scroller
      :on-refresh="onRefresh"
      :on-infinite="onInfinite"
      class="scrollermt">
      <div>
        <article class="personal-body">
          <van-tabs :color="$themeColor" @click="changeTab">
            <van-tab title="拨打记录">
              <list-item
                :store="storeList"
                :type="type"
                v-if="storeList&&storeList.length"
              />

              <!-- <section class="c-empty" v-if="storeList.length==0">
                  <div class="c-empty__wrap">
                      <img :src="PlaceholderImg" alt class="c-empty__img">
                      <h3 class="c-empty__title">暂无相关内容</h3>
                  </div>
              </section>-->
            </van-tab>
            <van-tab title="我的收藏">
              <list-item
                :store="storeList"
                :type="type"
                @cancelCollection="cancelCollection"
                v-if="storeList&&storeList.length"
              />
            </van-tab>
            <van-tab title="我的发布">
              <list-item
                :store="storeList"
                :type="type"
                @editYellowPage="editYellowPage"
                @lowerYellowPage="lowerYellowPage"
                @upperYellowPage="upperYellowPage"
                @payYellowPage="payYellowPage"
                @removePage="removePage"
                v-if="storeList&&storeList.length"
                showState="true"
              />
            </van-tab>
          </van-tabs>
        </article>
      </div>
    </scroller>
    <!--<Footer :fullpath="fullpath"/>-->
    <!-- 底部弹出框 -->
    <van-popup v-model="popupShow" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title="请选择续费套餐"
        :columns="renewList"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
  import {mapActions, mapGetters, mapState} from "vuex";
  import ListItem from "../../components/yellow-page/list-item";
  import PlaceholderImg from "../../assets/img/personal/my_publication_placeholder.jpg";
  import Footer from "../../components/yellow-page/footer";
  import {hideLoading, showLoading, showDialog} from "../../util";
  import {Toast, Dialog} from "vant";

  export default {
    name: "Mine",
    components: {
      Footer,
      ListItem
    },
    data() {
      return {
        refresh:false,      //是否有刷新
        show: false,
        popupShow: false,
        PlaceholderImg: "",
        fullpath: "",
        type: 1,
        pageNum: 1,
        storeList: [],
        renewList: [],
        hintShow: false
      };
    },
    computed: {
      ...mapState({
        user: s => s.user
      })
    },
    methods: {
      ...mapActions("personal", ["getCollection"]),
      ...mapActions("YellowPage", [
        "getMineYellowPage",
        "getYellowPageHistory",
        "upperLowerYellowPage",
        "collectStore",
        "removeYellowPage",
        "renewYellowPage",
        "renewPayYellowPage",
        "placeYellowPage"
      ]),
      // 下拉刷新
      async onRefresh(done) {
        done(true);
        // this.getList(0);
      },
      // 上拉加载
      async onInfinite(done) {
        console.log("上拉加载下一组数据");
        if (this.pageNum === 0) return done();
        if (this.storeList.length > 9) {
          this.getList(this.type - 1);
        }

        done(true);
      },
      // 改变顶部tab事件
      async changeTab(e) {
        this.storeList = [];
        this.pageNum = 1;
        this.type = e + 1;
        switch (e) {
          case 0:
            this.getList(0);
            break;
          case 1:
            this.getList(1);
            break;
          case 2:
            this.getList(2);
            break;
        }
      },
      // 时间戳转换日期  Why not write a common method? It's puzzling. What should I say?
      formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        var h = date.getHours();
        h = h < 10 ? "0" + h : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        return (
          y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second
        );
      },
      // 统一请求的数据来源
      async getList(e) {
        if (e == 0) {
          const yellowList = await this.getYellowPageHistory({
            page: this.pageNum,
            size: 10
          });
          this.mergeData(yellowList);
        } else if (e == 1) {
          const yellowList = await this.getCollection({
            userId: this.user.id ? this.user.id : "",
            type: 6,
            page: this.pageNum,
            size: 10
          });
          for (let i in yellowList) {
            yellowList[i].logo = JSON.parse(yellowList[i].logo);
            yellowList[i].tel = yellowList[i].tel.substr(0, 3) +
              "****" + yellowList[i].tel.substr(7)
          }
          this.mergeData(yellowList);
        } else {
          const yellowList = await this.getMineYellowPage();
          for (let i in yellowList) {
            yellowList[i].endTime = this.formatDateTime(
              Number(yellowList[i].endTime) * 1000
            );
          }
          this.storeList = yellowList;
        }
      },
      // 合并数据
      mergeData(yellowList) {
        console.log(yellowList);
        if (yellowList.length) {
          this.pageNum++;
        }
        this.storeList = this.refresh?this.storeList =yellowList: this.storeList.concat(yellowList);
      },
      // 取消收藏
      cancelCollection(e) {
        this.showDilogTitle(3, e);
      },
      // 编辑
      editYellowPage(e) {
        console.log("编辑", e);

        this.$router.push({
          path: "/yellowPage/yellowPageSettled",
          query: {id: e}
        });
      },
      // 下架
      async lowerYellowPage(e) {
        console.log("下架", e);

        this.showDilogTitle(2, e);
      },
      // 上架
      upperYellowPage(e) {
        console.log("上架", e);
        this.showDilogTitle(1, e);
      },
      // 删除
      async removePage(e) {
        console.log("删除");
        this.showDilogTitle(5, e);
      },
      // 续费
      async payYellowPage(e) {
        console.log("续费", e);
        const renew = await this.renewYellowPage({
          cityId: e.cityId
        });
        // this.changeTab(1);
        this.renewList = renew.map(item => item.setName);
        this.renewArray = renew;
        this.popupShow = true;
        this.yellowId = e.id;
        // this.showDilogTitle(4, e);
      },
      // 上架 下架 取消收藏 续费 删除 调用统一的方法  为了方便区分  续费支付另外调用方法
      async showDilogTitle(type, id) {
        if (!this.show) {
          try {
            await showDialog(
              "是否要" +
              (type == 1
                ? "上架"
                : type == 2
                  ? "下架"
                  : type == 3
                    ? "取消收藏"
                    : type == 4
                      ? "续费"
                      : type == 5
                        ? "删除"
                        : "") +
              "本条黄页"
            );
            if (type == 1 || type == 2) {
              await this.upperLowerYellowPage({
                id: id,
                show: type
              });
              this.changeTab(2);
            } else if (type == 3) {
              const status = await this.collectStore({
                postId: id,
                userId: this.user.id,
                type: 6
              });
              let message = "取消成功";
              Toast.success({
                duration: 800,
                message
              });
              this.changeTab(1);
            } else if (type == 4) {
              const renew = await this.renewYellowPage();
              // this.changeTab(1);
              this.renewList = renew.map(item => item.setName);
              this.renewArray = renew;
              this.popupShow = true;
              this.yellowId = id;
            } else if (type == 5) {
              await this.removeYellowPage({
                id: id
              });
              let message = "删除成功";
              Toast.success({
                duration: 800,
                message
              });
              this.changeTab(2);
            }
          } catch (e) {
          }
        }
      },
      // 续费——确认选择套餐
      onConfirm(e) {
        console.log("确认选择", e, this.renewArray);
        this.popupShow = false;
        // 查找已选择的单条套餐数据
        const selectRenew = this.renewArray.find(i => i.setName === e);
        this.systemHint(selectRenew);
      },
      // 续费——取消选择支付  ——貌似没卵用没什么需要调用的
      onCancel(e) {
        console.log("取消选择", e);
        this.popupShow = false;
      },
      async systemHint(e) {
        if (!this.hintShow) {
          try {
            await showDialog(`本次续费需要支付${e.money}元`);
            // 判断该套餐是否需要调用支付
            switch (e.money) {
              case "0.00":
                console.log("不需要调用支付");
                this.generateOrder(0, 1, e.id);

                break;
              default:
                console.log("需要调用支付");
                this.generateOrder(e.money, 2, e.id);
            }
          } catch (e) {
          }
        }
      },
      // 生成续费套餐订单  参数依次为(需要支付的金额,是否需要支付的状态 1为不需要支付 2需要支付,需要续费的黄页ID)
      async generateOrder(money, type, id) {
        const orderId = await this.placeYellowPage({
          yellowId: this.yellowId,
          mealId: id
        });
        console.log(orderId);
        if (money > 0) {
          // 套餐需要支付的金额大于0 需要调用支付
          this.$router.push({
            name: "cashier",
            params: {
              type: 13, //支付的类型
              param: {
                renewId: this.yellowId
              },
              info: {
                money: money,
                type: "黄页续费",
                callLink: "/yellowPage"
              }
            }
          });
        } else {
          // 套餐需要支付的金额等于0 不需要调用支付
          // await this.renewPayYellowPage({
          //     renewId:orderId
          // })
        }
      }
    },
    computed: {
      ...mapState({
        user: s => s.user
      })
    },
    created() {
      this.fullpath = this.$router.history.current.path;
      this.changeTab(0);
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/common";

  .Mine {
    padding-bottom: 130px;
  }

  .popupChild {
    text-align: center;
    padding: 20px 0;
  }

  .van-popup--bottom {
    // bottom: 60px;
    z-index: 5000000;
  }

  .scrollermt {
    height: 100%;
  }

  .personal-body {
    margin-top: 0;
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
</style>
