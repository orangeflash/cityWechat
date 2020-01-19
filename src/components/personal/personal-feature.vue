<template>

  <dd-layout-div>

    <dd-layout-div class="mar-b-20 bg-f" :pad="[0,30]" v-for="(list,key) in featureArr" :key="key">
      <dd-layout-div class="flex flex-bt flex-y-center" :br="{top:index >0?'1px solid #f0f0f0':''}"
                     @click="goPointPage(item.path)"
                     v-if="item.show"
                     v-for="(item,index) in list" :key="index" :height="110">
        <dd-layout-div :class="item.class" class="flex flex-y-center">
          <dd-layout-img class="bg-tran mar-r" :src="item.icon" :width="0.40" :height="0.40"/>
          {{item.label}}
        </dd-layout-div>
        <i class="iconfont icon-right col-9 fon-xss"></i>
      </dd-layout-div>
    </dd-layout-div>
  </dd-layout-div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'


  import gift2 from '../../assets/img/personal/new/gift2.png'
  import help from '../../assets/img/personal/new/help.png'
  import service from '../../assets/img/personal/new/service.png'
  import manger from '../../assets/img/personal/new/manger.png'


  import DdLayoutImg from "../layout/dd-layout-img";
  import {getType} from "../../util";

  export default {
    name: "PersonalFeature",
    components: {DdLayoutImg},
    data() {
      return {
      }
    },
    methods: {
      ...mapActions("businessDistrict", ["getStoreByAdminId","getUserStoreList"]),
      async checkStore() {
        await this.getUserStoreList();
        // await this.getStoreByAdminId({
        //   adminId: this.user.id
        // });
        // 商家入口显示与否
        //this.$set(this.featureArr[0][0],'show', storeInfo.length > 0)
        // 城市代理显示与否
        //this.$set(this.featureArr[1][0],'show', this.user.bindCity)
        // this.featureArr[0][0].show = storeInfo.length > 0;
        // this.user.bindCity&&(this.featureArr[1][0].show = true)

        // this.$forceUpdate();
      },
      goPage(param) {

        this.goPointPage({
          ...param
        })

        // !this.user.userTel ? this.$pushRoute('/login') : this.$pushRoute(param);
      },

    },
    computed: {
      ...mapState({
        user: s => s.user
      }),
      ...mapState("businessDistrict", {
        storeList: s => s.storeList
      }),
      featureArr() {
        return [
          [{
            show: this.storeList.length,
            class: 'fon-lg fon-w5',
            icon: gift2, label: "商家管理中心",
            path: getType(this.user.storeInfo)!='array'?"/businessDistrict/storeManagement":"/businessDistrict/businessList"
          }, {
            show: this.user.bindCity,
            class: 'fon-lg fon-w5',
            icon: manger, label: "城市代理中心",
            path: "/agentIndex/cityAgent/cityLogin"
          }],
          [{
            show: true,
            icon: help,
            class: 'fon-lg fon-w5',
            label: "帮助中心",
            path: "/home/helpPage"
          }, {
            show: true,
            icon: service,
            class: 'fon-lg fon-w5',
            tip: "有问题请找我",
            label: "联系客服",
            path: "/personal/CustomerService"
          }]
        ]
      },
    },
    watch: {
      user(newVal) {
        if (newVal) {
          this.checkStore();
        }
        //console.log('usernewVal',newVal)
      },
    },
    created() {
      // if (this.user.id) {
      //   this.checkStore();
      // }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #PersonalFeature {
    .personal-feature {
      &__container {
        background: rgba(255, 255, 255, 1);
        border-radius: 27px;
        padding: 0 30px;
        margin-bottom: 24px;

        .feature-item {
          padding: 33px 0;

          @include flex-center($justify: space-between);

          &:not(:last-child) {
            border-bottom: 1PX solid #E8E8E8;
          }

          .item-left {
            display: flex;
            align-items: center;

            &__icon {
              width: 38px;
              height: 36px;
            }

            &__label {
              margin-left: 24px;
              font-size: 30px;
              color: #333;
            }
          }

          .item-right {
            display: flex;
            align-items: center;

            &__tip {
              margin-right: 21px;
              font-size: 24px;
              color: rgba(132, 132, 132, 1);
            }
          }

          &__arrow {
            font-size: 20px;
            color: #BEBEBE;
          }
        }
      }

      &__container:first-child {
        margin-bottom: 24px;
      }
    }

  }
</style>
