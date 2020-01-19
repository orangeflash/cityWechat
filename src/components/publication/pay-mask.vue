<template>
  <div id="PayMask">
    <van-popup  v-model="visibility" position="bottom">
      <div class="pay-mask">
        <div class="pay-mask-wrap">
          <div class="mask-wrap__header">
            <em class="header-title">20180922194832709</em>
          </div>
          <div class="mask-wrap__content">
            <div class="pay-info">
              <em class="pay-info__num">￥{{money}}</em>
            </div>
            <div class="pay-way">
              <div class="pay-way__wechat">
                <RadioRow :showBorder="true">
                  <div class="content">
                    <em class="iconfont icon-iconweixin content__icon"/>
                    <em class="content__label">微信支付</em>
                  </div>
                </RadioRow>
              </div>
              <!--<div class="pay-way__balance">-->
                <!--<RadioRow :showBorder="true">-->
                  <!--<div class="content">-->
                    <!--<em class="iconfont icon-qianbao content__icon"/>-->
                    <!--<div class="content__desc">-->
                      <!--<em class="content__label">余额支付</em>-->
                      <!--<div class="tips">-->
                        <!--<em class="tips__text">可用余额￥0（余额不足）</em>-->
                        <!--<div class="tips__feature__btn">充值</div>-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</RadioRow>-->
              <!--</div>-->
            </div>
          </div>
          <div class="mask-wrap__footer">
            <div class="footer-btn" @click="clickHandle">立即支付</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import RadioRow from "./radio-row";

  export default {
    name: "PayMask",
    components: {RadioRow},
    props: ["showMask","money"],
    data() {
      return {}
    },
    methods: {
      clickHandle(){
       this.$emit("pay")
      }
    },
    computed: {
      visibility: {
        get() {
          return this.showMask
        },
        set(val) {
          this.$emit("update:showMask", val)
        }
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  #PayMask {
    @import "../../assets/common";
    @import "../../assets/theme";


    .pay-mask {

      &-wrap {
        background: #F4F4F4;
        .mask-wrap__header {
          background: #fff;
          padding: 30px 0;
          text-align: center;
          .header-title {
            font-size: $font-size-xxl;
            font-weight: 500;
            color: rgba(51, 51, 51, 1);
          }
        }
        .mask-wrap__content {
          background: #fff;
          margin-top: 1PX;
          .pay-info {
            text-align: center;
            padding: 33px 0 10px 0;
            &__num{
              font-size:51px;
              font-weight:bold;
              color:rgba(51,51,51,1);
            }
            &__text {
              font-size: 51px;
              font-weight: bold;
              color: rgba(51, 51, 51, 1);
            }
          }
          .pay-way {
            padding: 10px 40px;
            background: #fff;
            .content {
              padding: 21px 0;
              @include flex-center($justify: null);
              &__icon {
                font-size: 42px;
                margin-right: 24px;
              }
              &__label {
                font-size: 28px;
                font-weight: 500;
                color: rgba(51, 51, 51, 1);
              }
            }
            &__wechat {
              /*border-bottom: 1PX solid #DDDDDD;*/
              .content__icon {
                color: #35B30A;
              }
            }
            &__balance {
              .content__icon {
                color: #FC9E17;
              }
              .content__desc {
                display: flex;
                flex-direction: column;
                .tips {
                  @include flex-center;
                  &__text {
                    font-size: 22px;
                    color: rgba(153, 153, 153, 1);
                  }
                  &__feature__btn {
                    padding: 6px 14px;
                    font-size: 22px;
                    color: #fff;
                    background: $themeColor;
                    border-radius: 8px;
                    margin-left: 20px;
                  }
                }
              }
            }

          }
        }
        .mask-wrap__footer {
          margin-top: 16px;
          padding-top: 85px;
          background: #fff;
          .footer-btn {
            font-size: 34px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            width: 100%;
            height: 88px;
            background: $themeColor;
            @include flex-center;
          }
        }
      }
    }

  }
</style>
