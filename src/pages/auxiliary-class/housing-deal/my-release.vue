<template>
  <div class="housing-deal-my-release">
    <van-tabs :color="$themeColor" @change="tabsMethod">
      <van-tab :title="item.name" v-for="(item,key) in category" :key="key"></van-tab>
    </van-tabs>

    <ul class="housing-deal-my-release_list">
      <scroller
        v-if="collections.length"
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
      >
        <li
          class="housing-deal-my-release_list_single"
          v-for="(item,key) in collections"
          :key="key"
          @click="goPointPage({path:'/auxiliary/housingDeal/details',query:{id:item.id,isLease:+item.identifying==3 || +item.identifying==5 || +item.identifying==6}})"
        >
          <div class="top">
            <Top
              :time="computedDate(item.createdAt)"
              :labelsConfig="labelsConfig(item)"
            ></Top>
          </div>
          <div class="content">
            <StatusStamp :data="item"></StatusStamp>

            <PictrueTextCard
              type="operation"
              buttonName="操作/编辑"
              v-if="+item.identifying==3 || +item.identifying==5 || +item.identifying==6"
              :data="item"
              @button="operationBtn(item,key)"
            ></PictrueTextCard>
            <ContentOne
              type="operation"
              buttonName="操作/编辑"
              @button="operationBtn(item,key)"
              :data="item"
              v-else
            ></ContentOne>
          </div>
        </li>
      </scroller>
      <not-data v-else></not-data>
    </ul>
    <Operation :show="showOperation"
               @close="showOperation = !showOperation"
               @choice="actionsOperation"
               :actions="actions"
    ></Operation>
  </div>

</template>

<script>
  import Top from '@/components/template/housing-deal-card/top';
  import PictrueTextCard from '@/components/template/pictrue-text-card/left-picture-right-text';
  import ContentOne from '@/components/template/housing-deal-card/content-one';
  import {mapState, mapActions} from "vuex"
  import {utilMixins, computedDate} from "@/plugins/util-mixins";
  import {getAuxiliaryConfigColor} from "@/plugins/auxiliary/auxiliary-config";
  import {getOperation} from "@/plugins/common/index";
  import Operation from "@/components/template/operation";
  import StatusStamp from "@/components/template/status-stamp";
  import {hideLoading, showDialog, showLoading} from "../../../util";  //下架
  import {Toast} from 'vant';


  export default {
    mixins: [utilMixins],
    components: {Top, PictrueTextCard, ContentOne, Operation, StatusStamp},
    data() {
      return {
        showOperation: false,
        collections: [],
        actions: [],
        category: [],
        itemInfo: {},      //当前需要操作的信息
        itemInfoKey: null,   //
        params: {
          page: 1,
          size: 10,
          typeId: null,
        }
      }
    },
    methods: {
      ...mapActions("houingDeal", ['housingDealMyRelease', 'housingDealRentCategory',
        'housingDealTopInfo', 'housingDealTop', 'housingDealClssInfo', 'housingDealUpOrDown', 'housingDealDel']),
      ...mapActions('wxPay', ['payHousingDealRefresh']),
      tabsMethod(index) {
        this.params.typeId = this.category[index].id;
        this.params.page = 1;
        this.getMyCollection(true);
      },
      async onRefresh(done) {
        this.params.page = 1;
        await this.getMyCollection(true);
        done && done();
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getMyCollection();
        done && done(bool);
      },
      async getMyCollection(refresh) {
        refresh && (this.params.page = 1);
        const result = await this.housingDealMyRelease(this.params);
        this.collections = refresh ? result : this.collections.concat(result);
        return result.length < this.params.size;
      },
      // 操作按钮
      operationBtn(item, key) {
        if (+item.status == 0) return Toast({message: '审核中...', duration: 1000});

        this.itemInfo = item;
        this.showOperation = !this.showOperation;
        this.itemInfoKey = key;
        this.actions = [];
        this.actions = [{title: '信息：' + item.id}].concat(item.status == '2'
          ? this.actions.concat(getOperation(['over', 'share', 'top', 'refresh', 'upOrDown']))
          : this.actions.concat(getOperation(['edit', 'over'])));
        this.actions.forEach((v, index) => {
          this.upOrdown = +item.display == 2;
          v.field == 'upOrDown' && this.$set(this.actions[index], 'name', +item.display == 2 ? '上架' : '下架');
        })
      },
      // 操作选项
      async actionsOperation(item) {
        switch (item.field) {
          case 'share': //分享
            console.log("用户要分享")
            this.goPointPage({
              path: '/auxiliary/housingDeal/details',
              query: {id: this.itemInfo.id, isLease: +this.itemInfo.identifying == 3}
            })
            break;
          case 'refresh':  //刷新
            this.refreshPost();
            break;
          case 'over':    //结束
            await showDialog("您确定要结束该信息吗？");
            break;
          case 'edit':  //编辑
            const path = +this.itemInfo.identifying <= 4 ? "/auxiliary/housingDeal/release" : "/auxiliary/housingDeal/releaseSale",
              type = +this.itemInfo.identifying == 3 ? 'lease' : +this.itemInfo.identifying == 4 ? 'rentSeeking' : +this.itemInfo.identifying == 5 ? 'unused' : 'used'
            this.goPointPage({
              path,
              query: {
                rentingId: this.itemInfo.id,
                type,
                id: this.itemInfo.typeId
              }
            })
            break;
          case 'top': //置顶
            item.data ? this.generateTopOrder(item) : this.getTopInfoList();
            break;
          case 'upOrDown':    //上下架
            const isUp = +this.itemInfo.display == 1;
            const res = await this.housingDealUpOrDown({
              rentingId: this.itemInfo.id,
              display: isUp ? 2 : 1
            });
            if (res.code == 1) {
              Toast.success({
                message: isUp ? '已下架' : '已上架',
                duration: 800
              })
              this.getMyCollection(true);
            } else {
              Toast.fail({
                message: (isUp ? '下架' : '上架') + '失败',
                duration: 800
              })
            }
            break;
          case 'delete'://删除
            try {
              await showDialog("确定要删除该条信息吗？");
              showLoading();
              const res = await this.housingDealDel({
                rentingId: this.itemInfo.id
              })
              if (res.code == 1) {
                Toast.success({
                  message: '删除成功',
                  duration: 800
                })
                this.collections.splice(this.itemInfoKey, 1);
              } else {
                Toast.fail({
                  message: '删除成功',
                  duration: 800
                })
              }
            } catch (e) {
              console.log("还好没有删除该信息")
            }

            break;
        }
      },
      async generateTopOrder(item) {
        try {
          await showDialog('需要支付：' + (+item.data.money).toFixed(2) + " THB");
          console.log(item);
          showLoading();
          const order = await this.housingDealTop({
            topId: item.data.id,
            rentingId: this.itemInfo.id,
          })
          hideLoading();
          this.$router.push({
            name: 'cashier',
            params: {
              type: 24,
              param: {
                topId: order.data,
              },
              info: {
                money: item.data.money,
                type: "租房信息置顶",
              }
            }
          });
        } catch (e) {
          console.log("老板，" + item.data.money + "THB都不愿给我，置顶帖子这件事，我很难帮你办啊！");
        }
      },
      async refreshPost() {

        const {data} = await this.housingDealClssInfo({
            typeId: this.itemInfo.typeId
          }),
          result = data;

        let money = +this.itemInfo.cityId > 0 ? result.local && result.local.refresh || 0 : result.country && result.country.refresh || 0;
        if (money > 0) {
          try {
            await showDialog('需要支付：' + (+money).toFixed(2) + " THB");
            console.log(this.itemInfo);
            this.$router.push({
              name: 'cashier',
              params: {
                type: 25,
                param: {
                  rentingId: this.itemInfo.id
                },
                info: {
                  money: money,
                  type: "租房信息刷新",
                }
              }
            });
          } catch (e) {
            console.log()
          }
        } else {
          console.log('免费刷新');
          const order = await this.payHousingDealRefresh({
            rentingId: this.itemInfo.id
          })
          console.log('order', order);
          if (order.code == 1) {
            Toast.success({
              message: order.msg,
              duration: 1500
            });
            this.onRefresh();
          } else {
            Toast.fail({
              message: order.msg,
              duration: 1500
            })
          }
        }
      },
      getTopInfoList() {
        showLoading();
        this.housingDealTopInfo({
          rentingId: this.itemInfo.id
        }).then(result => {
          hideLoading();
          console.log('housingDealTopInfo', result)
          this.actions = [{
            title: '置顶类型',
          }]
          const data = result.data;
          for (let i = 0; i < data.length; i++) {
            this.actions.push({
              name: data[i].body,
              field: 'top',
              data: data[i]
            })
          }
          this.showOperation = !this.showOperation;
        })
      },
      labelsConfig(item) {
        // let type = +item.identifying == 3 ? '房屋出租' : '房屋求租',
        let labels = [];
        labels.push({
          name: item.name,
          color: getAuxiliaryConfigColor(item.name)
        })
        labels.push({
          name: item.rentType,
          color: getAuxiliaryConfigColor(item.rentType)
        })
        return {
          back: true,
          labels
        }
      },
      getCategory() {
        this.housingDealRentCategory().then(result => {
          this.category = result;
          this.params.typeId = this.category[0].id;
          this.getMyCollection();
        })
      }

    },
    computed: {},
    async created() {
      await this.getCategory();

    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .housing-deal-my-release {
    &_list {
      padding: 16px 0px;
      margin: 0 30px;
      position: fixed;
      width: calc(100% - 60px);
      top: 100px;
      bottom: 100px;

      &_single {
        background: #fff;
        margin-bottom: 16px;
        border-radius: 12px;
        overflow: hidden;

        .top {
          border-bottom: 1.1px solid #eee;
          padding: 24px 24px 14px;
        }

        .content {
          padding: 24px;
          position: relative;
          z-index: 0;
        }
      }
    }
  }
</style>
