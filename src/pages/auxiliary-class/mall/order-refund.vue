<template>
  <!--订单退款-->
  <div class="order-refund">
    <Header></Header>
    <div>
      <div class="goods">
        <div class="goods_up">
          <user
            size="24"
            borderRadius="24"
            :src="getSingleImg(orderInfo.storeLogo&&orderInfo.storeLogo[0].url)"
            :name="orderInfo.storeName"
          >
          </user>
          <div class="goods_list" style="margin-top: 10px;">
            <div class="goods_list_single"
                 v-for="(item,key) in orderInfo.goods"
                 :key="key"
            >
              <div class="goods_cover">
                <img-wrapper :src="item.img"></img-wrapper>
              </div>
              <div class="goods_info">
                <div class="goods_info_title">{{item.name}}</div>
                <div class="goods_info_spec"><span>{{item.data}}</span></div>
                <div class="goods_info_attr">
                  <span>￥{{item.money}}</span>
                  <em>x{{item.num}}</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="textaera">
      <div>
        <textarea
          v-model="reason"
          placeholder="请输入退款理由"></textarea>
      </div>
    </div>
    <dd-button
      type="confirm"
      name="提 交"
      @click="beginRefund"
    >

    </dd-button>
  </div>


</template>

<script>
  import User from '@/components/template/user';
  import {Toast} from 'vant';
  import {utilMixins} from "@/plugins/util-mixins";
  import {mapActions} from 'vuex';
  import DdButton from "@/components/template/button"
  import {hideLoading, showLoading} from "../../../util";

  export default {
    mixins: [utilMixins],
    components: {User, DdButton},
    data() {
      return {
        orderInfo: {},
        orderId: null,
        reason:'',
      }
    },
    methods: {
      ...mapActions('mall', ['getMallOrderDetails','mallCancelOrder']),
      async getOrderInfo(orderId) {
        showLoading();
        this.orderInfo = await this.getMallOrderDetails({
          orderId
        })
        hideLoading();
      },
      async beginRefund(){

        if(!this.	reason.trim())return Toast({
          message:'请输入退款理由',
          duration:1500
        })

        const res = await this.mallCancelOrder({
          orderId: this.$route.query.orderId,
          state:5,
          reason:this.reason
        });
        if(res.code == 1){
          Toast({
            message:'已申请',
            duration:1500
          })
          setTimeout(()=>{
            this.$router.go(-1);
          },1500)
        }else{
          Toast.fail({
            message:res.msg,
            duration:1500
          })
        }
      }
    },
    created() {
      if (this.$route.query.orderId) {
        this.getOrderInfo(this.$route.query.orderId);
      } else {
        Toast.fail({
          message: '缺少订单id',
          duration: 1500
        });
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500)
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .goods {
    margin: 30px;
    background: #fff;
    border-radius: 20px;
    padding: 30px;

    &_list {
      &_single {
        display: flex;

        .goods_cover {
          width: 196px;
          height: 196px;
          overflow: hidden;
        }

        .goods_info {
          width: calc(100% - 226px);
          margin-left: 30px;

          &_title {
            font-size: 26px;
            line-height: 36px;
            height: 70px;
            overflow: hidden;
          }

          &_spec {

            margin: 20px 0;

            span {
              background: #eee;
              color: #999;
              padding: 8px 10px 4px;
              border-radius: 4px;
              display: inline-block;
            }
          }

          &_attr {
            display: flex;
            justify-content: space-between;
            font-size: 28px;

            span {
              color: $themeColor;
            }

            em {
              color: #999;
            }
          }
        }
      }

    }
  }

  .textaera {
    background: #fff;
    padding: 30px;

    > div {
      textarea {
        border: none;
        height: 140px;
        resize: none;
        width: 100%;
      }
    }
  }
</style>
