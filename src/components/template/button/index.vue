<template>
  <span class="operation"
        @click.stop="deliver?$emit('click',{name:'button',value:{name:name||'取消收藏'}}):$emit('click')"
        v-if="type=='operation'"
  >
    {{name||'取消收藏'}}
  </span>
  <span
    class="release bg-f52c2c"
    :class="{fixedDown:bottom}"
    @click.stop="deliver?$emit('click',{name:'button',value:{name:name||'立即发布'}}):$emit('click')"
    :style="{borderRadius:radius&&'30px'}"
    v-else-if="type=='release'">
    {{name||'立即发布'}}
  </span>
  <span
    class="confirm"
    @click.stop="deliver?$emit('click',{name:'button',value:{name:name||'完 成'}}):$emit('click')"
    v-else-if="type=='confirm'">
    {{name||'完 成'}}
  </span>
  <div v-else>{{type}}</div>
</template>

<script>

  export default {
    props: ['name', 'type', 'bottom', 'radius', 'deliver']
  }


</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  span {
  }

  span.operation {
    color: $themeColor;
    border-radius: 30px;
    padding: 15px 26px 10px;
    border: 1.1px solid $themeColor;
    font-size: 26px;
  }

  span.release {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88px;
    font-size: 34px;
    color: #fff;
    border-radius: 8px;
  }

  span.fixedDown {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 88px;
    z-index: 9;
  }

  span.confirm {
    background: $themeColor;
    text-align: center;
    font-size: 34px;
    color: #fff;
    justify-content: center;
    border-radius: 40px;
    display: flex;
    height: 80px;
    align-items: center;
    margin: 30px;
  }
</style>
