<template>
  <dd-layout-div :pad="[40,30,20]" class="bg-f">
    <dd-layout-div class="flex flex-bt flex-y-center">
      <dd-layout-div class="fon-wb fon-xxl">我的服务</dd-layout-div>
    </dd-layout-div>
    <dd-layout-div :mar="[40,0,0]" class="flex flex-wrap">
      <dd-layout-div width="25%" :mar="[0,0,30,0]" v-for="(item,key) in myPowerList" :key="key"
                     @click="goPage(item)" v-if="item.show">
        <dd-layout-img :src="item.icon" class="mar-a bg-tran" :width="0.56" :height="0.56"/>
        <dd-layout-div class="col-6 t-c" :mar="[22,0,0]">{{item.label}}</dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
  </dd-layout-div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import message from '../../assets/img/personal/new/message.png'
  import release from '../../assets/img/personal/release.png'
  import wallet from '../../assets/img/personal/new/wallet.png'
  import integralMall from '../../assets/img/personal/new/integral-mall.png'
  import bmhy from '../../assets/img/personal/new/bmhy.png'
  import sfc from '../../assets/img/personal/new/sfc.png'
  import vip from '../../assets/img/personal/new/vip.png'
  import wdms from '../../assets/img/personal/new/wdms.png'
  import friend from '../../assets/img/personal/new/friend.png'
  import wdkj from '../../assets/img/personal/new/wdkj.png'
  import wdpt from '../../assets/img/personal/new/wdpt.png'
  import wdkq from '../../assets/img/personal/new/wdkq.png'
  import orderInfo from '../../assets/img/personal/new/order-info.png'
  import qzzp from '../../assets/img/personal/new/qzzp.png'
  import fwzs from '../../assets/img/personal/new/fwzs.png'
  import hhr from '../../assets/img/personal/new/hhr.png'
  import recharge from '../../assets/img/personal/new/recharge.png'
  import shang from '../../assets/img/personal/new/shang.png'
  import DdLayoutImg from "../layout/dd-layout-img";

  export default {
    name: "PersonalService",
    components: {DdLayoutImg},
    data() {
      return {
        testArr: [{
          icon: release,
          label: "我的发布",
          path: "/personal/myPublication",
          show: true
        }, {
          icon: wallet,
          label: "我的钱包",
          path: "/personal/myBalance",
          show: true
        }, {
          icon: shang,
          label: "悬赏中心",
          path: "/auxiliary/ys/yszx",
          show: false
        }, {
          icon: recharge,
          label: "充值中心",
          path: "/personal/rechargeCenter",
          show: false
        }, {
          icon: message,
          label: "我的私信",
          path: "/conversation/history",
          show: true
        }, {
          icon: integralMall,
          label: "积分商城",
          path: "/personal/integralMall", show: false
        }
        ]
      }
    },
    methods: {
      ...mapActions('personal', ['getPowerList']),
      async goPage(item) {
        const path = this.user.userTel ? item.path : '/login';
        console.log("item", item, path)
        if (item.type == "partner") {
          // const bool = await this.checkBindTel()
          // if (!bool) return
          if (+this.user.isPartner == 1) {
            this.goPointPage({name: 'PartnerHome'})
          } else {
            this.goPointPage({
              path: path,
            })
          }
        } else {
          this.goPointPage({
            path: path,
          })
        }
      }
    },
    computed: {
      ...mapState({
        user: state => state.user,
        configSwitch: state => state.configSwitch
      }),
      ...mapState('personal', {
        powerList: state => state.powerList
      }),
      myPowerList() {
        this.testArr[2].show = this.configSwitch.reward
        this.testArr[3].show = this.configSwitch.balanceRecharge
        this.testArr[5].show = this.configSwitch.integralOpen

        this.powerList.forEach(item => {
          item.label = item.name;
          item.show = true
          switch (item.type) {
            case 'partner':
              item.icon = hhr
              item.path = '/partner'
              break
            case 'car':
              item.icon = sfc
              item.path = '/auxiliary/freeRide/myRelease'
              break
            case 'job':
              item.icon = qzzp
              item.path = '/auxiliary/jobHunt/myJobHunt'
              break
            case 'renting':
              item.icon = fwzs
              item.path = '/auxiliary/housingDeal/myRelease'
              break
            case 'yellow':
              item.icon = bmhy
              item.path = '/yellowPage'
              break
            case 'superCard':
              item.icon = friend;
              item.path = '/auxiliary/card/myCard'
              break;
            case 'activity':
              item.icon = orderInfo
              item.path = '/auxiliary/activity/order'
              break
            case 'coupon':
              item.icon = wdkq
              item.path = '/auxiliary/coupon/myReceive'
              break
            case 'vip':
              item.icon = vip
              item.path = '/auxiliary/vip/myVip'
              break
            case 'group':
              item.icon = wdpt
              item.path = '/auxiliary/assemble/myOrder'
              break
            case 'rush':
              item.icon = wdms
              item.path = '/auxiliary/rushBuy/myReceive'
              break
            case 'bargain':
              item.icon = wdkj
              item.path = '/auxiliary/bargain/myJoin'
              break
            case 'friend':
              item.icon = friend;
              item.path = '/auxiliary/cityLove/myInfo'
              break;
            case 'cropsPost':
              // item.icon = vip;
              item.path = '/auxiliary/xx'
              break;
            case 'shop':
              item.show = false
              break;
          }
        })
        return this.testArr.concat(this.powerList)
      },
    },
    created() {
      this.getPowerList()
      //console.log('this.powerList',this.powerList)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #PersonalService {

    .personal-service {
      background: rgba(255, 255, 255, 1);
      border-radius: 27px;

      &__title {
        font-size: 30px;
        color: #333;
        padding: 32px 25px;
        border-bottom: 1PX solid #F4F4F4;
      }

      &__feature {
        display: flex;
        flex-wrap: wrap;
        padding: 34px 0;

        .feature-item {
          width: 25%;
          padding: 0 34px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 50px;
          /*第一行不使用外边距*/
          @for $i from 1 through 4 {
            &:nth-child(#{$i}) {
              margin-top: 0;
            }
          }

          &__icon {
            width: 60px;
            height: 64px;
          }

          &__label {
            margin-top: 12px;
            font-size: 26px;
            color: rgba(102, 102, 102, 1);
            @include t-overflow;
          }
        }
      }
    }

  }
</style>
