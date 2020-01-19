<template>
  <div id="MallCoupon">
    <div class="coupon" v-for="(item,index) in dataList">
      <div class="coupon-lt">
        <div v-if="item.type==1" class="coupon-lt-top"><span>￥</span><span class="coupon-lt-top-span">{{item.discount}}</span></div>
        <div v-if="item.type==2" class="coupon-lt-top"><span class="coupon-lt-top-span" style=" margin-right: 5px;">{{item.discount}}</span><span>折</span></div>
        <div class="coupon-lt-ft">{{+item.reach>0?`满${item.reach}可用`:'无门槛'}}</div>
      </div>
      <div class="coupon-rt">
        <div class="coupon-rt-lt">
          <div class="name">{{item.name}}</div>
          <div class="condition"><i class="iconfont icon-dengluyemianbangzhu">{{item.introduce}}</i></div>
          <div class="date">有效期：{{formatDateByTimeStamp(item.startTime,"YYYY-MM-DD")}}—{{formatDateByTimeStamp(item.endTime,"YYYY-MM-DD")}}</div>
        </div>
        <div v-if="pageType=='coupon-list'" class="coupon-rt-rt">
          <div class="coupon-rt-rtbtn" :class="{'coupon-rt-rtbtndis':state!=1}" @click="$emit('edit-method',item,index)">操 作</div>
          <!--<div class="coupon-rt-rtbtndis">操作</div>-->
        </div>
        <div v-else-if="pageType=='choice'" class="coupon-rt-rt">
          <div class="coupon-rt-rtbtn"
               v-if="item.condition == 1"
               @click.stop="$emit('click',{state:'choice',data:item})"
          >立即使用</div>
          <div class="coupon-rt-rtbtn coupon-rt-rtbtndis"
               v-else-if="+item.condition == 2"
          >已使用</div>
          <div v-else
               class="coupon-rt-rtbtn coupon-rt-rtbtndis">
            条件不足
          </div>
        </div>
        <div v-else class="coupon-rt-rt">
          <div class="coupon-rt-rtbtn"
               v-if="+item.receive == 2"
               @click.stop="$emit('click',{state:'receive',data:item})"
          >立即领取</div>
          <div
            v-else
            class="coupon-rt-rtbtn coupon-rt-rtbtndis">已领取</div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    name: "ReleaseCoupon",
    props: ["pageType", "dataList","state"],
    data() {
      return {}
    },
    methods: {},
    mixins: [utilMixins],
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #MallCoupon {
    font-size: $font-size-base;

    .coupon {
      width: 100%;
      overflow: hidden;
      border-radius: 20px;
      display: flex;
      margin-bottom: 39px;
      box-shadow: 3px 3px 20px $themeColor;

      &-lt {
        width: 175px;
        min-height: 175px;
        background: $themeColor;
        color: #fff;
        @include flex-center($direction: column);
        position: relative;
        z-index: 0;

        :after {
          content: ' ';
          width: 0;
          height: 100%;
          /* 绝对定位进行偏移 */
          position: absolute;
          top: 0;
          /* 圆点型的border */
          border-left: 10px dotted white;
          /* 偏移一个半径，让圆点的一半覆盖div */
          right: -5px;
        }

        &-top {
          &-span {
            font-size: 50px;
          }
        }

        &-ft {
          margin-top: 20px;
          margin-bottom: -20px;
          font-size: $font-size-xs;
        }
      }

      &-rt {
        border-radius: 20px;
        flex: 1;
        background: #fff;
        display: flex;
        position: relative;
        z-index: 0;

        &-lt {
          flex: 1;
          @include flex-center($direction: column, $justify: center, $align: null)
          padding: 20px 10px 20px 30px;
          color: #999;

          .name {
            color: #333;
          }

          .condition {
            font-size: $font-size-xss;
            margin-right: 160px;
            margin-top: 30px;
            line-height: 35px;
            @include t-overflow(2);
            i {
              font-size: $font-size-xss;
              color: #999;
              margin-top: 5px;
              margin-right: 10px;
            }
          }

          .date {
            font-size: $font-size-xss;
            margin-top: 30px;
          }
        }

        &-rt {
          position: absolute;
          width: 160px;
          height: 100%;
          right: 0;
          @include flex-center();
          min-width: 170px;

          &btn {
            font-size: $font-size-xss;
            padding: 15px 25px;
            border-radius: 25px;
            background: $themeColor;
            color: #fff;
          }

          &btndis {
            background: #ddd;
            color: #fff;
          }
        }
      }
    }
  }
</style>
