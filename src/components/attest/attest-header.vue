<template>
    <div class="attest-header">
      <header class="header" :style="{background:backgroundColor}">
        <strong class="title-line"><em class="title">{{title}}</em></strong>
        <span class="round"></span>
        <span class="roundOne"></span>
      </header>
    </div>
</template>

<script>
    export default {
      name: "AttestHeader",
      props:["title",'backgroundColor'],
      data(){
          return {

          }
      }

    }
</script>

<style scoped lang="scss">
  @import "../../assets/theme";
  .header {
    width: 750px;
    height: 174px;
    background: rgba(37, 112, 183, 1);
    overflow: hidden;
    position: relative;
    .round {
      width: 673px;
      height: 300px;
      background: white;
      opacity: 0.05;
      border-radius: 50%;
      transform: translate(180px, 70px) rotateZ(-190deg);
    }
    .roundOne {
      display: inline-block;
      width: 673px;
      height: 500px;
      background: white;
      opacity: 0.06;
      border-radius: 50%;
      transform: translate(0px, 60px) rotateZ(-100deg);
      z-index: 80;
    }
    .title-line:after, .title-line:before {
      display: inline-block;
      content: '';
      width: 100px;
      height: 1PX;
      background: #eee;
      opacity: .5;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .title-line:after {
      transform: translate(200%, 400%);
    }
    .title-line:before {
      transform: translate(-300%, 400%);
    }
    .title {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 59px;
      font-family: FZLTDHK--GBK1-0;
      color: rgba(254, 254, 254, 1);
      &:after {
        content: '□';
        display: inline-block;
        color: #eee;
        opacity: .5;
        transform: rotateZ(-45deg);
        font-size: $font-size-lg;
        vertical-align: middle;
        margin-left: 20px;
      }
      &:before {
        content: '□';
        display: inline-block;
        color: #eee;
        opacity: .5;
        transform: rotateZ(-45deg);
        font-size: $font-size-lg;
        vertical-align: middle;
        margin-right: 20px;
      }
    }
  }
</style>
