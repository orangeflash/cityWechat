<template>
  <!--横向列表-->
  <div class="dd-card-two">
    <div class="dd-card-two_title" v-if="title">{{title}}</div>
    <div class="dd-card-two_list">
      <ul class="dd-card-two_list_box" ref="list">
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

|
<script>

  export default {
    props: ['title', 'size', 'width'],
    created() {
      setTimeout(() => {
        const list = this.$refs.list;
        list.style.width = (list.firstChild.clientWidth + 1) * this.size + 'px'
      })
    }
  }

</script>
<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-card-two {
    background: #fff;

    &_title {
      height: 88px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin-bottom: 10px;
      background: url("../../../assets/img/other/back.png") no-repeat 0 0;
      background-size: 100% 100%;
    }

    &_list {
      overflow-x: scroll;

      &_box {
        padding-left: 20px;
        overflow: hidden;
      }
    }

  }
</style>
