<template>
  <div class="myRelease">
    <!--<Header></Header>-->
    <ul class="myRelease__list">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="myCarList.length"
      >
        <li class="myRelease__list__single" v-for="(item,key) in myCarList" :key="key">
          <Top :time="getTime(item)" v-bind="item.labelsConfig"
               :over="+item.isGo==1"></Top>
          <div class="myRelease__list__single__content">
            <StartEnd over="false" :start="item.startPlace" :end="item.endPlace" :over="+item.isGo==1"></StartEnd>
            <div class="myRelease__list__single__content__operation">
              <StatusStamp :data="item"></StatusStamp>
              <!--<div class="myRelease__list__single__content__operation__status" v-if="item.display || item.status">-->
              <!--<img :src="examine" v-if="+item.status == 0">-->
              <!--&lt;!&ndash; 已拒绝的可以进行编辑 &ndash;&gt;-->
              <!--<img :src="refuse" v-else-if="+item.status == 2">-->
              <!--<img :src="lowerShelf" v-else-if="+item.display == 2">-->
              <!--<img :src="top" v-else-if="+item.isTop == 1">-->
              <!--</div>-->
              <span @click.stop="operation(item,key)">
              <em>操作/编辑</em>
            </span>
            </div>
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

  import {mapActions} from 'vuex';
  import Top from "@/components/template/free-ride-card/top"
  import StartEnd from "@/components/template/start-end"
  import Operation from "@/components/template/operation"
  import top from '@/assets/img/auxiliary/free-ride/top.png';
  import lowerShelf from '@/assets/img/auxiliary/free-ride/lower-shelf.png';
  import {Toast} from 'vant';
  import {computedDate, utilMixins} from "@/plugins/util-mixins";
  import {getOperation} from "@/plugins/common/index";
  import {getAuxiliaryConfigColor} from "@/plugins/auxiliary/auxiliary-config";
  import {hideLoading, showDialog, showLoading} from "../../../util";
  import examine from "@/assets/status/examine.png"   //待审核
  import refuse from "@/assets/status/refuse.png"  //已拒绝

  import StatusStamp from "@/components/template/status-stamp";

  export default {
    components: {Top, StartEnd, Operation, StatusStamp},
    data() {
      return {
        top,
        lowerShelf,
        examine,
        refuse,
        hasMore: true,

        params: {    //请求的时候的参数
          page: 1,
          size: 10
        },
        itemCar: {},   //当前选中的数据
        itemCarKey: null,  // 这是用来删除本地的信息的，当用户删除数据的时候，避免http请求
        upOrdown: null,     //是否上下架
        myCarList: [],
        showOperation: false,
        actions: []
      }
    },
    computed: {},
    mixins: [utilMixins],
    methods: {
      ...mapActions('freeRide', [
        'getMyReleaseFreeRide',
        'deleteMyFreeRide',
        'displayMyFreeRide',
        'getCarTop',
        'FreeRideTopOrder',
        'getCategoryInfo',
      ]),
      ...mapActions("wxPay", ['payFreeRideRefresh']),
      getTime(item) {
        console.log('item', item);
        return +item.type == 2 ? item.rideTime + '(每日)' : item.rideTime.split('-').splice(1, 2).join('-');
      },
      operation(item, key) {
        if (+item.status == 0) return Toast({message: '审核中...', duration: 1000});
        this.itemCar = item;
        this.itemCarKey = key;
        console.log(item.status == '2' ? '可以编辑' : '不可以编辑')

        let actions = [
          {
            title: '信息ID：' + item.id,
          }
        ];

        this.actions = item.status == '2'
          ? actions.concat(getOperation(['over', 'share', 'top', 'refresh', 'upOrDown']))
          : actions.concat(getOperation(['edit', 'over']));

        this.actions.forEach((v, index) => {
          this.upOrdown = +item.display == 2;
          v.field == 'upOrDown' && this.$set(this.actions[index], 'name', +item.display == 2 ? '上架' : '下架');
        })
        this.showOperation = !this.showOperation;
      },
      // 刷新
      async onRefresh(done) {
        this.params.page = 1;
        this.hasMore = true;
        await this.getCarList(true);
        done && done(true);
      },
      // 加载更多
      async onInfinite(done) {

        this.params.page++;

        const bool = await this.getCarList();

        done && done(bool);
      },
      async actionsOperation(item) {
        if (!this.itemCar.id) return Toast.fail({
          message: '缺少信息Id',
          duration: 1000
        })

        switch (item.field) {
          case 'share':
            this.goPointPage({
              path: '/auxiliary/freeRide/details',
              query: {
                id: this.itemCar.id
              }
            })
            break;
          case 'refresh':
            this.refreshCarPost(item)
            break;
          case 'top':
            if (item.data) {
              console.log('用户开始要给钱了', item.data);

              try {
                await showDialog('需要支付：' + item.data.money + " 元");
                showLoading();
                const order = await this.FreeRideTopOrder({
                  topId: item.data.id,
                  carId: this.itemCar.id,
                })
                hideLoading();
                this.$router.push({
                  name: 'cashier',
                  params: {
                    type: 18,
                    param: {
                      topId: order.data,
                    },
                    info: {
                      money: item.data.money,
                      type: "顺风车信息置顶",
                    }
                  }
                });
              } catch (e) {
                console.log("老板，" + item.money + "元都不愿给我，置顶帖子这件事，我很难帮你办啊！");
              }


            } else {
              this.topCarPost(item)
            }

            break;
          case 'upOrDown':
            try {
              await showDialog("您确定要结束该信息吗？");
              showLoading();
              const res = await this.displayMyFreeRide({
                carId: this.itemCar.id,
                display: this.upOrdown ? 1 : 2
              });
              if (res.code == 1) {
                Toast.success({
                  message: this.upOrdown ? '已上架' : '已下架',
                  duration: 800
                })
                this.getCarList(true);
              } else {
                Toast.fail({
                  message: '下架失败',
                  duration: 800
                })
              }
            } catch (e) {
              console.log("还好没有结束该信息")
            }
            break;
          case 'edit':
            console.log('用户需要编辑帖子');
            this.goPointPage({
              path: '/auxiliary/freeRide/release',
              query: {
                carId: this.itemCar.id,
                name: this.itemCar.name
              }
            })
            break;
          case 'delete':
            try {
              await showDialog("您确定要删除该信息吗？");
              showLoading();
              const res = await this.deleteMyFreeRide({
                carId: this.itemCar.id
              })
              if (res.code == 1) {
                Toast.success({
                  message: '删除成功',
                  duration: 800
                })
                this.myCarList.splice(this.itemCarKey, 1);
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
      // 刷新
      async refreshCarPost() {
        console.log('用户要刷新')
        showLoading();
        const result = await this.getCategoryInfo({
          typeId: this.itemCar.typeId
        });
        let money = +this.itemCar.cityId > 0 ? result.data.local && result.data.local.refresh || 0 : result.data.country && result.data.country.refresh || 0;
        if (money > 0) {
          try {
            await showDialog('需要支付：' + money + " 元");
            this.$router.push({
              name: 'cashier',
              params: {
                type: 19,
                param: {
                  carId: this.itemCar.id
                },
                info: {
                  money: money,
                  type: "顺风车信息刷新",
                }
              }
            });
          } catch (e) {
            console.log()
          }
        } else {
          console.log('免费刷新');
          const order = await this.payFreeRideRefresh({
            carId: this.itemCar.id
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
      // 置顶
      async topCarPost(item) {
        console.log('用户要置顶');
        showLoading()
        const result = await this.getCarTop({
          carId: this.itemCar.id
        });
        console.log('result', result)
        this.showOperation = !this.showOperation;

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


        hideLoading();

      },
      // 获取我的发布
      async getCarList(refesh) {

        if (!this.hasMore) return

        const res = await this.getMyReleaseFreeRide(this.params);

        console.log('res', res)


        res.data.forEach(v => {
          let labels = [];

          v.type == 2 && labels.push({
            name: '长期',
            color: getAuxiliaryConfigColor('长期')
          })

          labels.push({
            name: v.name,
            color: getAuxiliaryConfigColor(v.name)
          })

          v.labelsConfig = {
            labels,
            fontSize: 15,
            back: true,
            maxLength: 2,
          }
        })

        this.myCarList = refesh ? res.data || [] : this.myCarList.concat(res.data);

        this.hasMore = !(res.data != this.params.size && res.data < this.params.size)

        return !this.hasMore;
      }

    },
    created() {
      this.getCarList(true);
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";
  @import "../../../assets/theme";

  .myRelease {
    &__list {
      padding: 30px;
      position: fixed;
      height: calc(100% - 120px);
      width: calc(100% - 120px);
      margin: 0 30px;

      &__single {
        background: #fff;
        border-radius: 12px;
        margin-top: 20px;
        position: relative;

        &__content {
          display: flex;
          justify-content: space-between;
          padding: 30px;

          &__operation {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;

            &__status {
              width: 168px;
              height: 136px;
              margin-top: -20px;

              img {
                width: 100%;
                height: 100%;
              }
            }

            span {
              height: 46px;
              border: 1.1px solid $themeColor;
              display: flex;
              align-items: center;
              border-radius: 22px;
              width: 154px;
              margin-left: -35px;

              em {
                margin: 0 auto;
                color: $themeColor;
                font-size: $font-size-sm;

              }
            }
          }
        }
      }
    }
  }

</style>
