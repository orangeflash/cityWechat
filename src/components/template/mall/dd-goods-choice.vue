<template>

  <!--商品分类&规格选择-->
  <van-popup
    v-model="open"
    position="bottom"
    style="overflow: initial"
    @click-overlay="$emit('close')"
  >
    <div class="dd-goods-choice">
      <div class="dd-goods-choice_up">
        <div class="dd-goods-choice_up_cover">
          <img-wrapper v-if="choiceData.showImgs&&choiceData.showImgs.length"
                       :src="getSingleImg(choiceData.showImgs[0].url)"></img-wrapper>
        </div>
        <div class="dd-goods-choice_up_title">
          <div class="dd-goods-choice_up_title_price">{{(+choiceData.currentPrice).toFixed(2)}}
            <span v-if="result.specGroup.memberPrice"
                  class="fon-b">会员价：{{(+result.specGroup.memberPrice).toFixed(2)}} </span>
          </div>
          <div class="dd-goods-choice_up_title_res">{{choiceData.spec&&choiceData.spec.length > 0 ?
            '请选择规格、分类':'请选择商品数量'}}
          </div>
        </div>
        <div class="dd-goods-choice_up_icon" @click="close">
          <i class="iconfont icon-close"></i>
        </div>
      </div>
      <div class="dd-goods-choice_center">
        <ul class="dd-goods-choice_center_list">
          <li
            v-for="(item,key) in choiceData.spec"
            :key="key"
          >
            <h3>{{item.name}}</h3>
            <choice-label
              v-if="item.data&&item.data.length>0"
              :labels="item.data"
              :labelsDefault="[item.data[0].name]"
              :isSingle="true"
              @choice="choice"
            ></choice-label>
            <div class="not-choice" v-else>暂无选项</div>
          </li>
          <li class="">
            <h3>购买数量
              <van-stepper v-model="result.num"/>
            </h3>
          </li>
        </ul>
      </div>
      <div class="dd-goods-choice_down">
        <van-button size="large" :round="true" type="danger" @click="joinShoppingCar">确定</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
  import ChoiceLabel from '@/components/template/choice-label'
  import {utilMixins} from "@/plugins/util-mixins";
  import {mapState} from 'vuex'

  export default {
    mixins: [utilMixins],
    components: {ChoiceLabel},
    props: ['show', 'data'],
    data() {
      return {
        open: false,
        choicedData: [],      //已被选中的，
        choiceData: [],        // 源数据
        result: {          //需要返回的结果集
          num: 1,
          specGroup: {},     //规格组
        },
      }
    },
    ...mapState({
      platform: s => s.platform,
      user: s => s.user
    }),
    watch: {
      show(newV, oldV) {
        this.open = Boolean(newV);
        this.choiceData = new Object(this.data);
      },
    },
    methods: {
      /** 加入购物车 */
      joinShoppingCar() {
        console.log("this.platform.openVip && !this.user.isVip", this.platform.openVip && this.user.isVip)
        this.result.money = this.platform.openVip && this.user.isVip ? this.choiceData.vipMoney : this.choiceData.currentPrice;
        console.log(this.result);
        this.$emit('confrim', this.result);
      },
      close() {
        this.open = !this.open;
        this.$emit('close')
      },
      choice(val) {
        let bool = false;

        this.choicedData = this.choicedData.map((item, index) => {
          if (val.field == item.field) {
            bool = true
            return val
          } else {
            return item
          }
        })
        !bool && (this.choicedData.push(val));

        let str = '';
        this.choicedData.forEach((item, index) => {
          str += item.name + ","
        })
        this.choiceData.specGroup.forEach(item => {
          console.log(item.data + ",", str);
          if (item.data + "," == str) {
            console.log("查找到了");
            this.choiceData.currentPrice = item.money;
            console.log(item);
            this.result.specGroup = item;
            this.result.specGroup.vipMoney = item.memberPrice
          }
        });
      }
    },
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-goods-choice {
    background: #fff;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 0 30px 30px;

    &_up {
      display: flex;
      justify-content: space-between;
      padding: 30px 0;

      &_cover {
        width: 190px;
        height: 190px;
        overflow: hidden;
        background: #ddd;
        margin-top: -86px;
      }

      &_title {
        width: calc(100% - 300px);

        &_price:before {
          content: '￥';
          font-size: 30px;

        }

        &_price {
          color: #FF0000;
          font-size: 44px;
          margin-bottom: 32px;
        }
      }

      &_icon {
        i {
          color: #999;
        }
      }
    }

    &_center {
      &_list {
        max-height: 700px;
        overflow: auto;

        > li {
          padding: 30px 0;
          border-top: 1.1px solid #ddd;

          h3 {
            font-size: 30px;
            margin-bottom: 26px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
    }

    .not-choice {
      color: #999;
    }
  }
</style>
