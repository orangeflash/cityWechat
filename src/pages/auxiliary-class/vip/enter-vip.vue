<template>
  <div id="VipIndex">
    <vip-card hideBtn="true"></vip-card>
    <div class="rel z-i">
      <div class="flex-y-center bg-f pad-lr">
        <div class="br-r-e pad-r col-3 flex-g-0">已有<span class="col-v fon-w4">{{vipData&&vipData.number}}</span>人开通
        </div>
        <Notice icon=" " pad="0" class="flex-g-1" bor-r="0" textAlign="center" :notice="noticeList"/>
      </div>
      <van-tabs class="mar-t20" :line-width="65" @click="changeTab" :color="$themeColor" v-model="active">
        <van-tab class="br-t-e br-b-e" :title="label" v-for="(label,key) in tabList" :key="key">
          <template v-if="!active">
            <van-radio-group v-model="mealId">
              <van-cell-group>
                <van-cell center v-for="item in businessPackages" :key="item.id" @click="radioChange(item.id)">
                  <van-radio :checked-color="$themeColor" slot="icon" :name="item.id"/>
                  <van-cell>
                    <template slot="title">
                      <div class="flex-x-bt">
                        <div>{{item.name}}<span class="zq">账期：{{item.term}}天</span></div>
                        <div class="col-t fon-xl">{{+item.money?item.money+'元':'免费'}}</div>
                      </div>
                      <div class="flex-x-bt" style="margin-top: 5px;">
                        <div @click="gradeInfoshow=true" class="col-9 fon-sm">{{item.content}}</div>
                        <!--<div class="col-9 fon-sm t-d-l">￥300</div>-->
                      </div>
                    </template>
                  </van-cell>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
          </template>
          <template v-else>
            <div class="pad-30 bg-f">
              <van-field
                class="br-e"
                v-model="code"
                clearable
                placeholder="请输入激活码"
              />
            </div>
          </template>
        </van-tab>
      </van-tabs>
      <div class="bg-f">
        <AgreeAgreement
          :status="checked"
          @choice="checked = !checked"
          :con="setUp.agreement"
          name="相关协议">
        </AgreeAgreement>
        <div class="foot-mar-btn rel">
          <button :disabled="!checked" @click="confirm">{{user.isVip?'立即续费':'立即开通'}}</button>
        </div>
      </div>
      <div class="bg-f pad-lr mar-t">
        <div class="vip-head flex-center">
          <img-wrapper not-load="true" :src="tImg" class="t-img"></img-wrapper>
          <em>会员特权</em>
          <img-wrapper not-load="true" :src="tImg" style="transform:rotate(180deg);" class="t-img"></img-wrapper>
        </div>
        <div class="flex-x-bt flex-wrap">
          <div v-for="(item,index) in vipImgArr" :key="index" class="vip-img">
            <img :src="item.src"/>
            <div class="vip-text">
              <span>{{item.title}}</span>
              <span>{{item.content}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import VipCard from "../../../components/template/vip/vip-card";
  import LayoutOne from "../../../components/template/dd-article/layout-one";
  import AgreeAgreement from '../../../components/template/agree-agreement'
  import EntryButtonGroup from "../../../components/basic/entry-button-group";
  import Notice from "../../../components/business-district/notice";
  import {PlaceholderAvatar, PlaceholderImg, backendPath, publishUrl} from "../../../project-config/base";
  import tImg from "../../../assets/img/partner/timg.png";
  import qghyj from "../../../assets/img/auxiliary/vip/qghyj.png";
  import schyj from "../../../assets/img/auxiliary/vip/schyj.png";
  import shzk from "../../../assets/img/auxiliary/vip/shzk.png";
  import fbxx from "../../../assets/img/auxiliary/vip/fbxx.png";
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";

  export default {
    name: "VipIndex",
    components: {
      VipCard,
      Notice,
      AgreeAgreement
    },
    data() {
      return {
        PlaceholderAvatar,
        tImg, qghyj, schyj, shzk, fbxx,
        vipData: null,
        noticeList: [],
        active: 0,
        checked: true,
        setUp: "",
        code: '',
        gradeInfo: '',
        mealId: 0,
        mealInfo: {},
        businessPackages: [],
        vipImgArr: [
          {src: schyj, title: '商场会员价', content: '会员可以在商家指定特权日享受专属优惠'},
          {src: qghyj, title: '抢购会员价', content: '可以享受抢购商品VIP特价购买'},
          {src: fbxx, title: '免费发布信息', content: '会员可以免费发布信息，免费刷新分类信息'},
          {src: shzk, title: '商户折扣', content: '可以享受商城商品VIP特价购买'},
        ],
      }
    },
    methods: {
      ...mapActions("partner", ["getBannerList", "getPartnergrade", "getPartnerconfig"]),
      ...mapActions('vip', ['getSetMeal', 'getPackageList', 'postAddVip', 'postActivation', 'getVipConfig', 'getOpenList']),
      ...mapActions(["refreshUserInfo"]),
      changeTab(active) {
        console.log(active)
      },
      async getGrade() {
        // 默认选中第一个
        showLoading()
        this.businessPackages = await this.getSetMeal();
        hideLoading()
        this.mealId = this.businessPackages[0].id;
        this.radioChange(this.mealId)
      },
      async radioChange(id) {
        this.mealId = id;
        this.mealInfo = this.businessPackages.find((item) => item.id == id)
        //console.log(id, this.mealInfo)
      },
      async getNewInfo() {
        const vipData = await this.getOpenList();
        this.vipData = vipData
        this.noticeList = _.map(vipData.list, (item) => {
          return {title: `${item.userName}${this.computedDate(item.createdAt)} 开通会员`, 'content': ''}
        }) || []
      },
      async judgeData() {
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        //console.log(this.mealId, this.active, this.code.trim())
        let res = {}, msg = '';
        if (!this.active && !this.mealId) msg = "请选择套餐类型";
        else if (this.active && !this.code.trim()) msg = '请输入激活码';
        if (!msg) {
          res.status = true
        }
        res.msg = msg;
        return res;
      },
      async confirm() {
        const result = await this.judgeData()
        // console.log(result,this.active,this.mealId,this.code.trim(),this.mealInfo)
        // return
        if (result.status) {
          showLoading();
          let result = this.active ? await this.postActivation({
            code: this.code.trim(),
          }) : await this.postAddVip({
            mealId: this.mealId,
          });
          if (result.code) {
            this.refreshUserInfo()
            if (+this.mealInfo.money > 0 && !this.active) {
              try {
                hideLoading();
                await showDialog("需要支付" + this.mealInfo.money + "元", "提示");
                this.$router.push({
                  name: 'cashier',
                  params: {
                    type: 35,
                    param: {
                      orderId: result.data,
                    },
                    info: {
                      money: this.mealInfo.money,
                      type: "会员支付",
                      callLink: "/auxiliary/vip/enterVip"
                    }
                  }
                });
              } catch (e) {
              }
            } else {
              showHandleStatusByFlag([true, '提交成功'])
              setTimeout(() => {
                this.$router.go(-1)
              }, 1000)
            }
          } else {
            showText(result.msg, 2000, true);
          }
        } else {
          showText(result.msg);
          // showHandleStatusByFlag([false,result.msg])
        }
      },
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        user: s => s.user
      }),
      tabList() {
        return ['直接购买', '使用激活码',]
      },
      entryBtnConfig() {
        const config = {
          "color": "#333",
          "shape": 2,
          "buttonNumberOfCol": 4,
          "buttonNumberOfRow": 1,
        };
        return {...config, entryButtonList: this.entryCategories};
      }
    },
    created() {
      //套餐
      this.getGrade()
      //最新收益
      this.getNewInfo()
      //会员设置
      this.getVipConfig().then(res => {
        this.setUp = res
        document.title = res.field || '会员卡'
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #VipIndex {
    font-size: $font-size-base;

    .vip-head {
      padding: 40px 0px;

      em {
        margin: 0 30px;
        font-size: $font-size-lg;
      }

      .t-img {
        width: 130px;
      }
    }

    .foot-mar-btn {
      padding: 0 30px 40px;
    }

    .zq {
      font-size: $font-size-sm;
      background: #FF5669;
      padding: 2px 10px;
      margin-left: 10px;
      border-radius: 10px;
      color: #fff;
    }

    .vip-img {
      width: 333px;
      height: 190px;
      margin-bottom: 20px;
      position: relative;

      img {
        @include widhei()
      }

      .vip-text {
        position: absolute;
        top: 0;
        color: #fff;
        padding: 30px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        @include widhei();

        span:nth-child(1) {
          font-weight: 500;
          font-size: $font-size-lg;
          margin-bottom: 30px;
        }

        span:nth-child(2) {
          font-size: $font-size-xss;
          line-height: 35px;
        }
      }
    }
  }
</style>
