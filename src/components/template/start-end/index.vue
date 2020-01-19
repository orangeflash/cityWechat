<template>
  <div class="dd-start-end">
    <p class="dd-start-end__paragraph">

      <em class="dd-start-end__paragraph__label start" :class="over&&over != 'false'&&'is-over back'"><em>起</em></em>
      <span :class="over&&over != 'false'&&'is-over'">{{start || startTips}}</span>
    </p>
    <div class="dd-start-end__line"></div>
    <p class="dd-start-end__paragraph">
      <em class="dd-start-end__paragraph__label end" :class="over&&over != 'false'&&'is-over back'"><em>终</em></em>
      <span :class="over&&over != 'false'&&'is-over'">{{end || endTips}}</span>
    </p>
  </div>
</template>

<script>

  export default {
    props: ['over', 'start', 'end'],
    data() {
      return {
        startTips: '出发地点',
        endTips: '目标地点'
      }
    }
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-start-end {
    &__paragraph {
      overflow: hidden;
      margin-bottom: 20px;
      display: flex;
      align-items: center;

      &__label {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin-right: 22px;
        em{
          margin-top: 6px;
        }
      }

      .start {
        background: #12C8D3;
      }

      .end {
        background: #FF3838;
      }

      .fail {
        background: #bbb;
      }

      span {
        font-size: 30px;
        width: 290px;
        height: 36px;
        overflow: hidden;
        line-height: 36px;
      }
    }

    &__line {
      width: 4px;
      border: 1.1px solid #ddd;
      height: 20px;
      margin-top: -20px;
      margin-left: 14px;
      border-top: none;
      border-bottom: none;
    }
  }

  .is-over {
    color: #bbb;
  }

  .is-over.back {
    color: #fff !important;
    background: #bbb !important;
  }


</style>
