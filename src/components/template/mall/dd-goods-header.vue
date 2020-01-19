<template>

  <!--商品详情的头部导航-->
  <div class="dd-goods-header">
    <div class="dd-goods-header_left" @click="$router.go(-1)">
      <i class="iconfont icon-zuojiantou1"></i>
    </div>
    <div class="dd-goods-header_center">
      <ul class="dd-goods-header_center_list">

        <li
          v-for="(item,key) in tabs"
          @click="tabNav(item.id,key)"
          :class="[item.active&&'active '+activeClass ,tabClass]"
        >
          {{item.name}}
        </li>
      </ul>
    </div>
    <div class="dd-goods-header_right">
      <i class="iconfont icon-caidan more"></i>
    </div>
  </div>
</template>

<script>

  export default {
    props: ['tabs', 'tabClass','activeClass'],
    methods: {
      tabNav(id, key) {
        this.tabs.forEach(v => {
          this.$set(v, 'active', false);
        })
        this.$set(this.tabs[key], 'active', true);

        const top = document.querySelector("#" + id).offsetTop - 50;

        document.body.scrollTop = window.scrollY = document.documentElement.scrollTop = top;

      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-goods-header {
    background: #fff;
    display: flex;
    align-items: center;
    height: 95px;
    justify-content: space-between;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    border-bottom: 1.1px solid #f4f4f4;

    &_left {

      display: flex;
      align-items: center;
      justify-content: center;
      width: 95px;

      i {
        font-size: 36px;
        color: #666;
        height: 30px;
      }
    }

    &_center {
      &_list {
        display: flex;
        align-items: center;

        a {
          color: #333;
        }

        li {
          margin: 0 30px;
          font-size: 30px;
        }

        li.active {
          color: $themeColor;
        }
      }

    }

    &_right {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 95px;

      i {
        color: #666;
      }

      i.more {
        font-size: 46px;
        height: 40px;
      }
    }
  }
</style>
