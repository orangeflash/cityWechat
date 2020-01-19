<template>
  <div class="choice-number">
    <span @click="choiceGoodsNumber()">-</span>
    <span class="number">{{num}}</span>
    <span @click="choiceGoodsNumber(1)">+</span>
  </div>
</template>

<script>
  export default {
    props:["goodsNumber"],
    data() {
      return {
        maxNumber : 99,
        num : this.goodsNumber
      }
    },
    methods: {
      choiceGoodsNumber(bool) {
        if(bool){
          this.num++
          if(this.num>=this.maxNumber){
            this.num = this.maxNumber;
          }
        }else{
          this.num--;
          if(this.num<=0){
            this.num=0;
          }
        }
        this.$parent.goodsNumber = this.num;
      }
    }
  }
</script>
<style scoped lang="scss">
  div{
    display: flex;
    float: right;
    width: 132px;
    span{
      flex: 1;
      height: 34px;
      width: 40px;
      background: #eee;
      color: #999;
      text-align: center;
      line-height: 34px;
      font-size: 26px;
    }
    .number{
      color: #333;
      margin: 0 6px;
    }
  }

</style>
