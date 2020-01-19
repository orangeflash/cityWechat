<template>

  <div class="dd-order-footer">
    <div class="begin-down-order success" @click.stop="$emit('click')"><span>立即支付</span></div>
    <div class="buy-info">
      <div>
        <!--共<em>{{number}}</em>件商品，-->
        <div>（含运费:<em v-if="!isNaN(Number(+freight))">{{(+freight).toFixed(2)}}</em>）</div>
        实付：<span>￥{{price.toFixed(2)}}</span>
      </div>
    </div>
  </div>

</template>

<script>

  export default {
    props: ['price', 'number', 'freight']
  }


</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-order-footer {
    position: fixed;
    height: 90px;
    width: 100%;
    background: #fff;
    bottom: 0;
    left: 0;
    border-top: 1.1px solid #f4f4f4;

    .buy-info {
      height: 100%;
      margin-right: 254+26px;

      > div {
        height: 100%;
        line-height: 90px;
        text-align: right;
        display: flex;
        justify-content: flex-end;

        em {
          color: $themeColor;
        }

        span {
          color: $themeColor;
          font-size: 28px;
        }
      }
    }

    .begin-down-order {
      width: 254px;
      height: 100%;
      font-size: 34px;
      display: flex;
      align-items: center;
      float: right;

      span {
        display: block;
        margin: 0 auto;
      }
    }

    .success {
      background: $themeColor;
      color: #fff;
    }

    .fail {
      background: #ddd;
      color: #666;
    }
  }
</style>
