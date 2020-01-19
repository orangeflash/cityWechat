<template>
  <div>
    <div class="dd-details-footer">
      <ul class="dd-details-footer__menu">
        <li v-for="(item,key) in menu" :key="key">
          <div @click.stop="judge(item,key)">
            <i class="iconfont" :class="item.useActive?(item.iconActive + ' active'):item.icon"></i>
            <p :class="{'active':item.useActive}">{{item.name}}</p>
          </div>
        </li>
      </ul>
      <div class="dd-details-footer__main">
        <div v-if="main" @click.stop="judge(main,-1)">
          <p>{{main.name}}</p>
          <span v-if="main.childrenName">{{main.childrenName}}</span>
        </div>
      </div>
    </div>
    <div class="dh-100"></div>
  </div>

</template>

<script>
  /**
   * 组件函数
   *
   *  @method
   *  返回的是下标值
   *    mian返回的是 -1
   *
   * meun 菜单数组
   * [
   *  {
   *     icon:  iconfont图标class
   *     name:  描述
   *  }
   *  ]
   * main 主按钮
   * {
   *    name： 描述
   *    childrenName: 小描述
   * }
   *
   * */
  export default {
    props: ["menu", "main", "method"],
    methods: {
      judge(item, key) {
        item.judge
          ? (async () => {
            if (key != 0) {
              const bool = await this.checkBindTel({callBack: true})
              if (!bool) {
                // 无法继续
              } else {
                this.$emit('method', key)
              }
            } else {
              this.$emit('method', key)
            }
          })()
          : this.$emit('method', key)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-details-footer {
    position: fixed;
    width: 100%;
    height: 104px;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    box-shadow: 0px -1px 4px 0px rgba(221, 221, 221, 0.35);
    background: #fff;
    z-index: 99;

    &__menu {
      display: flex;
      width: calc(100% - 354px);

      li {
        flex: 1;
        text-align: center;
        display: flex;
        align-items: center;

        div {
          margin: 0 auto;

          i {
            font-size: 40px;
            margin-left: 6px;
            color: #818181;
          }

          p {
            margin-top: 12px;
          }

          .active {
            color: $themeColor !important;
          }
        }
      }
    }

    &__main {
      background: $themeColor;
      width: 354px;
      display: flex;
      align-items: center;
      text-align: center;

      div {
        width: 100%;

      }

      p {
        color: #fff;
        font-size: 34px;
        margin-bottom: 5px;
      }

      span {
        color: #fff;
        font-size: 28px;
      }
    }
  }
</style>
