<template>
  <div id="freeRideDetails">
    <Header></Header>
    <div class="auxiliary-box"></div>
    <div class="free-ride-details" v-if="freeRide.linkMan">
      <div class="free-ride-details__form">
        <div class="free-ride-details__form__user">
          <div class="free-ride-details__form__user__info">
            <Face :src="freeRide.portrait || PlaceholderAvatar"></Face>
            <div class="free-ride-details__form__user__info__other">
              <h4>{{freeRide.linkMan}}</h4>
              <Labels v-bind="labelsConfig"></Labels>
            </div>
          </div>
          <div class="free-ride-details__form__user__status">
            <div class="status-icon" v-if="+freeRide.isGo == 1">
              <img :src="end">
            </div>
            <p class="free-ride-details__time">{{computedDate(freeRide.createdAt)}} 发布</p>
          </div>
        </div>
        <div class="free-ride-details__form__remarks" v-if="remarksConfig.labels.length">
          <Labels v-bind="remarksConfig"></Labels>
        </div>
        <FormList v-bind="formListConfig"></FormList>
      </div>
    </div>
    <div class="dh-96 bg-F2F3F5 flex-bt mar-t flex-y-center pad-lr col-9" @click="openReport(freeRide.id,14)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>
    <ul class="free-ride-details__status">
      <li>
        <span>{{freeRide.viewNum||0}}</span>
        <div>
          <i class="iconfont icon-huo hot"></i><em>浏览</em>
        </div>
      </li>
      <li>
        <span>{{freeRide.followNum||0}}</span>
        <div>
          <i class="iconfont icon-shoucang"></i><em>收藏</em>
        </div>
      </li>
      <li @click="showMask = !showMask">
        <span>{{freeRide.shareNum||0 }}</span>
        <div>
          <i class="iconfont icon-fenxiang1"></i><em>分享</em>
        </div>
      </li>
    </ul>
    <DetailsFooter v-bind="footerConfig" @method="footerChoice"></DetailsFooter>
    <share-mask :show-mask.sync="showMask"/>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import Labels from '@/components/template/labels'
  import FormList from '@/components/template/form-list'
  import DetailsFooter from '@/components/template/details-footer'
  import Face from '@/components/template/face'
  import end from '@/assets/img/auxiliary/free-ride/end.png';
  import {Toast} from 'vant'
  import {utilMixins, computedDate} from "@/plugins/util-mixins";
  import {PlaceholderAvatar, PlaceholderImg, backendPath} from "@/project-config/base";
  import {hideLoading, showDialog, showLoading} from "../../../util";
  import {updateShareConfig} from "../../../util/wechat-util";
  import ShareMask from "@/components/publication/share-mask";
  import {getAuxiliaryConfigColor} from '@/plugins/auxiliary/auxiliary-config'

  export default {
    components: {Labels, Face, DetailsFooter, FormList, ShareMask},
    data() {
      return {
        showMask: false,
        end,
        PlaceholderAvatar,
        freeRideConfig: {},
        freeRide: {
          moneyData: {}
        },
        labelsConfig: {
          labels: [],
          back: true
        },
        remarksConfig: {
          labels: [],
        },
        footerConfig: {
          menu: [
            {
              icon: 'icon-shouyexian',
              name: '首页',
              color: '#818181',
            }, {
              icon: 'icon-fabudianjizhuangtai-',
              name: '发布',
              color: '#818181',
            }, {
              icon: 'icon-collection',
              iconActive: 'icon-collection-b',
              name: '收藏',
              color: '#818181',
              colorActive: this.$themeColor,
              useActive: false,
            },
          ],
          main: {
            name: '联系电话',
            childrenName: '',
          }
        },
        formListConfig: {
          labelColor: '#666',
          listInfo: [
            {
              symbol: 'start',
              symbolName: '起',
              desc: '',
              field: 'startPlace',
            }, {
              symbol: 'end',
              symbolName: '终',
              desc: '',
              field: 'endPlace'
            }, {
              symbol: 'center',
              symbolName: '经',
              desc: '',
              field: 'wayAddress'
            }, {
              icon: 'icon-jinggao',
              label: '车辆信息：',
              desc: '',
              after: '辆',
              field: 'weight',
            }, {
              icon: 'icon-jinggao',
              label: '货物信息：',
              desc: '',
              field: 'weight',
              after: '吨'
            }, {
              icon: 'icon-ren3',
              label: '乘车人数：',
              desc: '',
              after: '人',
              field: 'num'
            }, {
              icon: 'icon-Group-',
              label: '出发时间：',
              desc: '',
              date: 'time',
              field: 'rideTime'
            }, {
              icon: 'icon-Group-',
              label: '开始时间：',
              desc: '',
              field: 'startTime'
            }, {
              icon: 'icon-Group-',
              label: '结束时间：',
              desc: '',
              field: 'endTime',
            }, {
              icon: 'icon-bianji',
              label: '备注信息：',
              remarks: true,
              desc: '',
              field: 'other'
            }
          ]
        }
      }
    },
    methods: {
      ...mapActions('freeRide', ['getCarInfo', 'getFreeRideConfig', 'recordShare', 'getCategoryInfo']),
      ...mapActions("post", ["collectPost"]),
      ...mapActions("wxPay", ["isCanCallAction"]),
      async load(id) {
        showLoading();
        this.freeRideConfig = await this.getFreeRideConfig();
        this.labelsConfig.labels = [];
        const res = await this.getCarInfo({id});
        if (res.code == 1) {
          this.freeRide = res.data;
          +this.freeRide.type == 2 && this.labelsConfig.labels.push({
            name: '长期',
            color: getAuxiliaryConfigColor('长期')
          });
          this.labelsConfig.labels.push({
            name: this.freeRide.name,
            color: getAuxiliaryConfigColor(this.freeRide.name)
          });

          this.freeRide.linkTel && this.$set(this.footerConfig.main, 'childrenName',

            this.canCallTel() ?
              this.freeRide.linkTel :
              this.hideTelNumber(this.freeRide.linkTel));
          const labels = res.data.data, len = res.data.data.length;
          let arr = [];
          for (let i = 0; i < len; i++) {
            arr.push({
              name: labels[i]
            })
          }

          this.$set(this.footerConfig.menu[2], 'colorActive', this.$themeColor);
          this.$set(this.footerConfig.menu[2], 'useActive', this.freeRide.follow);
          this.remarksConfig.labels = arr;

          // 配置转发信息
          updateShareConfig({
            title: `【${this.freeRide.name}】`,
            imgUrl: this.platform.shareImg,
            desc: this.freeRide.startPlace + ' -> ' + this.freeRide.endPlace,
            link: window.location.href,
          })

          this.dataMerging();
        } else {
          Toast.fail({
            message: '获取信息失败',
            duration: 1500,
          })
        }


        hideLoading();
      },
      // 字段与数据进行合并 重新渲染表单的数据
      dataMerging() {
        for (let d in this.freeRide) {
          this.formListConfig.listInfo.map((v, index) => {

            if (v.field == d && this.freeRide[d]) {

              if (+this.freeRide.type == 1 && (v.field == 'startTime' || v.field == 'endTime')) return false;

              let desc = this.freeRide[d];
              // 数据并不是智能匹配的，只好通过switch进行指定转换
              switch (v.field) {
                case 'startTime':
                case 'endTime':
                  desc = this.formatDateByTimeStamp(this.freeRide[d], "YYYY-MM-DD HH:mm");
                  break;
                case 'rideTime':
                  desc = +this.freeRide.type == 2 ?
                    this.freeRide.rideTime + '(每日)' : this.freeRide.rideTime;
                  break;
                case 'weight':

                  if(this.freeRide.name == '货找车'){
                    this.$set(this.formListConfig.listInfo[3], 'notShow', true)
                  }else if(this.freeRide.name == '车找货'){
                    this.$set(this.formListConfig.listInfo[4], 'notShow', true)
                  }


                  // this.freeRide.name != '货找车' && this.$set(this.formListConfig.listInfo[index], 'notShow', true)
                  break;
              }
              this.$set(this.formListConfig.listInfo[index], 'desc', desc);

              (!this.formListConfig.listInfo[index].notShow) && this.$set(this.formListConfig.listInfo[index], 'isShow', true)
              return false;
            }
          })

        }
      },
      // 收藏开关
      async offOnCollection() {
        showLoading();
        let res = await this.collectPost({
          postId: this.id,
          type: 5,
        });
        this.load(this.id)
        if (res.code == 1) {
          res = res.data;
          if (res.status == 2) {
            Toast({
              message: '已取消',
              duration: 1000
            })

          } else {
            Toast({
              message: '已收藏',
              duration: 1000
            })
          }
        } else {
          hideLoading();
        }
        return res.status == 1
      },

      async footerChoice(index) {
        if (index != 0) {
          const bool = await this.checkBindTel({callBack: true})
          if (!bool) return
        }
        switch (index) {
          case -1:      //按钮
            this.callTel();
            return;
          case 0:       //首页
            return this.goPointPage({
              path: '/auxiliary/freeRide'
            })
          case 1:       //发布
            return this.goPointPage({
              path: '/auxiliary/freeRide/release',
            });
          case 2:       //收藏
            this.collection();
            return;
        }
      },
      // 打电话
      async callTel(tel) {

        if (this.canCallTel()) {
          location.href = `tel://${this.freeRide.linkTel}`
        } else {
          try {
            const money = (+this.freeRide.moneyData.seeMoney || 0).toFixed(2)
            await showDialog("需要支付 " + money + " 元");

            this.$router.push({
              name: 'cashier',
              params: {
                type: 17,
                param: {
                  carId: this.id,
                  type: 3
                },
                info: {
                  money: money,
                  type: "顺风车拨打电话",
                  isCall: true,
                }
              }
            });
          } catch (e) {
            console.log('老板，我是需要生存的啊！')
          }
        }
      },
      // 可以打电话，返回的是bool
      canCallTel() {
        if (this.isCanCall) return true;
        //没有价格就是免费拨打
        if (!this.freeRide.moneyData.seeMoney || +this.freeRide.moneyData.seeMoney <= 0) return true;

        if (!this.freeRideConfig.see) return true;

        return +this.freeRideConfig.see == 1 ? (+this.freeRide.isLook == 1 ? true : false) : false;
      },
      // 收藏
      async collection() {
        const bool = await this.offOnCollection();
        this.$set(this.footerConfig.menu[2], 'useActive', bool);
      }
    },
    computed: {
      ...mapState({
        user: state => state.user,
        platform: state => state.platform,
      }),
      ...mapState("wxPay", {
        // 是否允许拨打电话，该变量值是在wxPay里面设置的 记得在页面退出的时候把这个值去掉
        isCanCall: state => state.isCanCall
      }),
    },
    mixins: [utilMixins],
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
      } else {
        Toast.fail({
          message: '缺少Id',
          duration: 1500
        })
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500)
      }
      //用户是通过分享进来的
      if (this.$route.query.isShare) {
        this.recordShare({
          id: this.id
        })
      }
      this.load(this.id);
    },
    destroyed() {
      // 用离开当前页面就会执行
      if (this.isCanCall) {
        this.isCanCallAction();
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  #freeRideDetails {
    min-height: 100vh;
    background: #fff;
    padding-bottom: 120px;

    .auxiliary-box {
      height: 150px;
      background: $themeColor;
    }

    .free-ride-details {
      margin: -150px 30px 0;
      box-shadow: 0px 0px 9px 0px rgba(153, 153, 153, 0.5);

      &__form {
        background: #fff;
        border-radius: 20px;
        padding: 30px 0 0;

        &__user {
          display: flex;
          justify-content: space-between;
          padding: 0 24px 24px;

          &__info {
            display: flex;
            justify-content: space-between;

            &__other {
              margin-left: 34px;

              h4 {
                margin: 10px 0;
                font-size: 30px;
              }
            }
          }

          &__status {
            width: 312px;
            text-align: right;
            position: relative;
            z-index: 0;

            .status-icon {
              width: 168px;
              height: 136px;
              right: 0;
              position: absolute;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .free-ride-details__time {
              position: absolute;
              bottom: 0;
              right: 0;
              color: #999;
            }
          }
        }

        &__remarks {
          padding: 30px 24px;
          border-bottom: 1.1px solid #eee;
        }

      }
    }

    .free-ride-details__status {
      display: flex;
      justify-content: space-between;
      padding: 50px 100px;

      li {
        text-align: center;

        span {
          font-size: 34px;
          margin-bottom: 16px;
          display: block;
        }

        i {
          margin-right: 10px;
          font-size: 26px;
        }

        .hot {
          color: #FF3838;
        }
      }
    }
  }


</style>
