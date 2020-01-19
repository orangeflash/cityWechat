<template>
  <div class="dd-goods-nav"
       :style="{'height':(height || 50) + 'px','position':type?'fixed':''}"
  >
    <div
      v-for="(item,key) in bigBtn"
      :key="key"
      class="hairline"
      :class="{'active':item.active}"
      @click.stop="change(item,key)"
    >
      <div>
        <i
          class="iconfont"
          :class="item.icon"
          v-if="item.icon"
        ></i>
        <span>{{item.name}}</span>
        <i
          v-if="item.afterIcon"
          class="iconfont"
          :class="item.afterIcon"></i>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    props: ['bigBtn', 'height', 'type', 'highlight'],
    methods: {
      change(item, key) {
        if (this.highlight) {
          this.bigBtn.forEach((item) => {
            this.$set(item, 'active', false);
          })
          this.$set(this.bigBtn[key], 'active', true);
        }
        this.$emit('method', item)
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-goods-nav {
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;

    > div {
      flex: 1;
      color: #666;
      display: flex;
      height: 100%;
      font-size: 30px;
      min-width: 15%;
      line-height: 1;
      text-align: center;
      background-color: #fff;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }
    .active{
      color: $themeColor;
    }

    > div:not(:first-child)::after {
      border-left-width: 1.1px;
    }

    .hairline::after {
      content: ' ';
      position: absolute;
      pointer-events: none;
      box-sizing: border-box;
      top: -50%;
      left: -50%;
      right: -50%;
      bottom: -50%;
      -webkit-transform: scale(.5);
      transform: scale(.5);
      border: 0 solid #ddd;
    }
  }

</style>
