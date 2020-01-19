<template>
  <div class="dd-operation" @click.stop="!must&&$emit('close')" v-if="actions">
    <van-popup v-model="show" :close-on-click-overlay="false" position="bottom">
      <ul class="dd-operation__list">
        <li :class="item.title&&'dd-operation__list__title'"
            @click.stop="!item.disabled&&!item.title&&implementMethod(item,key)"
            v-for="(item,key) in actions" :key="key"><span>{{item.name || item.title}}</span></li>
        <li class="dd-operation__list__cancel" @click.stop="$emit('close')" v-if="!must"><span>取消</span></li>
      </ul>
    </van-popup>
  </div>
</template>

<script>

  export default {

    props: ['show', 'actions', 'must'],

    data() {
      return {
        configTest: [
          {
            title: '信息ID：35563',
          }, {
            name: '分享扩散',
          }, {
            name: '置顶信息',
          }, {
            name: '刷新信息',
          }, {
            name: '编辑',
          }, {
            name: '结束',
          }, {
            name: '删除'
          }
        ]
      }
    },
    methods: {
      implementMethod(item, key) {
        this.$emit('close');
        this.$emit('choice', item, key);
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-operation {
    &__list {
      li {
        height: 86px;
        display: flex;
        align-items: center;
        border-bottom: 1.1px solid #F4F4F4;

        span {
          margin: 0 auto;
          font-size: 34px;
        }
      }

      &__title {
        background: $themeColor;
        border: none;

        span {
          color: #fff;
          font-size: $font-size-xll !important;
        }
      }

      &__cancel {
        border-top: 16px solid #F4F4F4;

        span {
          font-size: $font-size-xll !important;
        }
      }
    }
  }

</style>
