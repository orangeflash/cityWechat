<template>

  <div class="my-card">
    <div class="card-mess" v-for="item in dataList" :key="item.id">
      <dd-card-three
        :if-card="haveCard"
        :card-info="item"
        v-if="haveCard"
      ></dd-card-three>
      <user-set
        :config="item.config"
        @click="operationUsre"></user-set>
    </div>


    <dd-card-three :if-card="haveCard" :i-card="haveCard" :disabled="checked"></dd-card-three>


    <ul class="flex pad-30 mar-30">
      <li @click="judge('/publication')">
        <i class="iconfont icon-fabu release"></i>
        <p>发布动态</p>
      </li>
      <li @click="judge('/shopDetail?storeId='+userId)">
        <i class="iconfont icon-shouye store"></i>
        <p>我的店铺</p>
      </li>
      <li @click="judge('/auxiliary/card?sort=hot')">
        <i class="iconfont icon-paixingbang ranking"></i>
        <p>名片排行</p>
      </li>
    </ul>
    <Operation
      :show="showOperation"
      @close="showOperation = !showOperation"
      @choice="actionsOperation"
      :actions="actions"
    ></Operation>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import DdCardThree from '../../../components/template/card/three'
  import UserSet from '../../../components/template/card/four'
  import Operation from '../../../components/template/operation'
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import {Toast} from "vant"

  export default {
    components: {DdCardThree, UserSet, Operation},
    data() {
      return {
        type: "",      //选择花钱的类型
        showOperation: false,
        queryParams: {
          page: 1,
          size: 20,
        },
        dataList: [],
        haveCard: true,
        lengths: "",
        checked: false,
        userId: "",
        actions: []
      }
    },
    methods: {
      ...mapActions("card", ["getMyList", "getTopList", "downOrder", "getCardMeal", "downOrderRenew","deleteCard"]),
      ...mapActions("shop", ["getShopInfoByParams"]),
      async getData(refresh) {
        const result = await this.getMyList({
          ...this.queryParams,
        });
        result.data.forEach(item => {
          item.config = [
            {name: '续期', icon: 'icon-xuqi', id: item.id, cityId: item.cityId},
            {name: '编辑', icon: 'icon-bianjianxia', id: item.id},
            {name: '置顶', icon: 'icon-zhiding', id: item.id},
            {name: '删除', icon: 'icon-shanchu', id: item.id},
          ]
        })

        this.dataList = result.data;

        this.lengths = this.dataList.length;
        this.checked = this.lengths > 8 ? true : false;

        console.log(1111111, this.dataList)
      },
      judgeCard() {
        if (this.lengths < 1) {
          this.haveCard = false
        }
      },
      /** 套餐的选择 */
      async actionsOperation(item) {
        console.log(item);
        const money = (+item.money).toFixed(2);
        if (this.type == "top") {


          if (money > 0) {
            try {
              await showDialog("需要支付：" + money + "元");
              const topId = await this.downOrder(item);

              if (topId > 0) {
                this.$router.push({
                  name: 'cashier',
                  params: {
                    type: 32,
                    param: {
                      topId
                    },
                    info: {
                      money: money,
                      type: "名片置顶",
                    }
                  }
                });
              } else {
                Toast.fail({
                  message: '下单失败',
                  duration: 1500
                })
              }
            } catch (e) {
              console.log("老板，" + money + "元都不愿给我，置顶这件事，我很难帮你办啊！");
            }
          } else {
            const topId = await this.downOrder(item);
            console.log("置顶订单号", topId)
            topId > 0 && Toast.success({
              message: '置顶成功',
              duration: 1500
            })
          }
        } else if (this.type == "renew") {
          if (money > 0) {
            try {
              await showDialog("需要支付：" + money + "元");

              const renewId = await this.downOrderRenew(item);
              if (renewId > 0) {
                this.$router.push({
                  name: 'cashier',
                  params: {
                    type: 33,
                    param: {
                      renewId
                    },
                    info: {
                      money: money,
                      type: "名片续费",
                    }
                  }
                });
              } else {
                Toast.fail({
                  message: '下单失败',
                  duration: 1500
                })
              }
            } catch (e) {
              console.log(e);
              console.log("老板，" + money + "元都不愿给我，名片续费这件事，我很难帮你办啊！");
            }

          } else {
            const renewId = await this.downOrderRenew(item);
            renewId > 0 && Toast.success({
              message: '续费成功',
              duration: 1500
            })
          }
          console.log("选择了续费套餐", item)
        }

      },
      /** 获取续费套餐 */
      async getRenewSetMeal(wholeCountry, cardId) {
        showLoading();
        const result = await this.getCardMeal({
          wholeCountry
        })
        hideLoading();
        result.forEach(item => {
          item.name = item.setName;
          item.cardId = cardId;
          item.mealId = item.id;
        })

        return [{
          title: (wholeCountry == 1 ? '本地' : '全国') + ' - 名片Id：' + cardId
        }].concat(result);

      },
      /** 获取置顶套装的数据 */
      async getTopActions(cardId) {
        /** 获取置顶套餐 */
        const result = await this.getTopList({
          cardId
        });
        result.forEach(item => {
          item.name = item.body;
          item.cardId = cardId;
          item.topId = item.id;
        })
        console.log("getTopList", result);

        return [{
          title: '名片Id：' + cardId
        }].concat(result);
      },
      async operationUsre(key, item) {
        switch (key) {
          case 0:
            this.actions = await this.getRenewSetMeal(+item.cityId > 0 ? 1 : 2, item.id);
            this.type = "renew";
            this.showOperation = !this.showOperation;
            break;
          case 1:
            this.goPointPage({path: '/auxiliary/card/createCard', query: {cardId: item.id}})
            break;
          case 2:
            this.actions = await await this.getTopActions(item.id);
            this.type = "top";
            this.showOperation = !this.showOperation;
            break;
          case 3:
            try {
              await showDialog("确定要删除此名片吗？");
              showLoading();
              const res = await this.deleteCard({
                cardId: item.id,
              })
              showHandleStatusByFlag(res.code, res.msg, res.msg,)
              res.code && this.getData();
            } catch (e) {
            }
            break;
        }
      },
      async getUser() {

        this.userId=this.user.storeInfo.storeId

      },
      async judge(path) {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return;
        this.goPointPage(path)
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
    async created() {
      // 获取列表

      const bool = await this.checkBindTel({callBack: true})
      if (!bool) return

      await this.getData();
      this.judgeCard();
      this.getUser();

    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .my-card {

    ul {

      li {
        flex: 1;
        text-align: center;

        i {
          font-size: 52px;

        }

        .release {
          color: #5DB271;
        }

        .store {
          color: #FF5D0D;
        }

        .ranking {
          color: #FF1E1E;
        }

        p {
          margin-top: 10px;
          font-size: 28px;
        }
      }
    }


  }


</style>
