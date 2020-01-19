<template>
  <div class="dd-column-pricker">
    <ul class="dd-column-pricker_list">
      <li v-for="(item,key) in list"
          :key="key"
          :class="{borderR:key<=list.length-2}"
          @click="!item.type&&deliver?$emit('click',{name:'select',value:{item,key}}):$emit('click',item,key)"
      >
        <span>{{item.name}}</span>
        <van-field v-if="item.type" input-align="center" :type="item.type" v-model="item.desc"
                   @input="$emit('inputForm',item,key)"
                   :placeholder="item.placeholder"/>
        <p v-else>{{item.desc}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: []
      },
      deliver: {
        type: Boolean,
        default: false
      }
    },
  }
</script>
<style lang="scss">
  @import "../../../assets/theme";

  .dd-column-pricker {
    .van-cell {
      font-size: 15px;
    }
  }
</style>
<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-column-pricker {
    &_list {
      display: flex;
      justify-content: space-between;
      padding: 30px 0;
      background: #fff;

      li.borderR {
        border-right: 1.1px solid #ddd;
      }

      li {
        flex: 1;
        text-align: center;

        span {
          padding: 10px 15px;
          font-size: 26px;
          color: #999;

        }

        p {
          margin-top: 28px;
          font-size: $font-size-lg;
        }
      }
    }

    border-bottom: 1.1px solid #EEEEEE;
  }

</style>
