<template>
    <div id="editFormExtends">
      <ul class="topping-switch">
        <li class="topping-switch__form__item">
          <em>我要置顶</em>
          <van-switch v-model="checked" size="20px"/>
        </li>
        <li class="topping-switch__tip">置顶一周 需付费用：￥2.00</li>
      </ul>
      <ul class="attach-form">
        <li class="attach-form__item">
          <label class="attach-form__item__wrap">
            <em class="attach-form__item__bold">塞福利（可提高阅读量和转发量）</em>
            <van-switch v-model="checked" size="20px"/>
          </label>
        </li>
        <li class="attach-form__item">
          <label class="attach-form__item__wrap">
            <em>福利金额：</em>
            <input placeholder="红包金额应大于50的整数" class="item__input" type="text">
          </label>
        </li>
        <li class="attach-form__item">
          <label class="attach-form__item__wrap">
            <em>分成几份：</em>
            <input placeholder="至少1份" class="item__input" type="text">
          </label>
        </li>
        <li class="attach-form__item">
          <label class="attach-form__item__wrap">
            <em class="attach-form__item__bold">是否分享后领取</em>
            <van-switch v-model="checked" size="20px"/>
          </label>
        </li>
        <li class="attach-form__item">
          <label class="attach-form__item__wrap">
            <em class="attach-form__item__bold">是否平均分配福利</em>
            <van-switch v-model="checked" size="20px"/>
          </label>
        </li>
        <li class="attach-form__item">
          <label class="attach-form__item__wrap">
            <em class="attach-form__item__bold">是否开启口令模式</em>
            <van-switch v-model="checked" size="20px"/>
          </label>
        </li>
      </ul>
      <aside class="desc-tip">
        福利服务费（3%）：￥0.03
      </aside>
    </div>

</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'

    export default {
        name: "editFormExtends",
        data() {
            return {}
        },
        methods: {},
        computed: {},
        created() {
        }
    }
</script>

<style scoped lang="scss">
    #editFormExtends {
      .topping-switch {
        margin-top: 16px;
        background: #fff;
        padding: 30px;
        &__form__item {
          @include flex-center($justify: space-between);
          font-size: 30px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
        &__tip {
          font-size: 24px;
          font-weight: 500;
          color: rgba(255, 0, 0, 1);
          margin-top: 20px;
        }
      }
      .attach-form {
        background: #fff;
        padding: 0 31px;
        margin-top: 16px;
        &__item {
          height: 90px;
          font-size: 26px;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          @include flex-center($justify: null);
          &:not(:last-child) {
            border-bottom: 1PX solid #DDDDDD;
          }
          &__wrap {
            flex: 1;
            @include flex-center($justify: space-between);
            .item__input {
              flex: 1;
              margin-left: 30px;
              outline: none;
              border: 0;
              font-size: 26px;
              color: #333333;
            }
            .item__input::-webkit-input-placeholder {
              font-size: 24px;
              line-height: 1.5;
              color: #999999;
            }
          }
          &__bold {
            font-size: 28px;
          }
        }

      }
      .desc-tip {
        text-align: right;
        padding: 16px 33px;
        color: #999999;
      }
    }
</style>
