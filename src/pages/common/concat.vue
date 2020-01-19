<template>
  <div id="Concat">
    <header class="concat-header">
      <em class="shield-totat">屏蔽他的消息</em>
      <van-switch :value="checked" size="26px" @input="onInput"   class="isShield"/>
    </header>
    <article class="concat-body">
      <div class="concat-body-list" v-for="i in 14" :key="i">
        <img :src="headerImg" alt="" srcset="" class="headerImg">
        <div class="concat-body-container">
          <span class="triangle"></span>
          <p class="concat-text">内容内容内容内容内容内容内</p>
        </div>
      </div>
    </article>
    <footer class="concat-footer">
      <van-cell-group class="concat-group">
        <van-field v-model="value" placeholder="请输入用户名"  class="concat-field"/>
      </van-cell-group>
      <span class="concat-more"><i class="iconfont icon-jiahao"></i></span>
    </footer>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import { Switch,Field } from 'vant';
  import headerImg from '../../assets/img/city-information/小头像.png'
  export default {
    name: "Concat",
    data() {
      return {
        checked: true,
        headerImg,
        value:''
      }
    },
    methods: {
      onInput(checked) {
        this.checked = checked;
      }
    },
    computed: {
      ...mapState("home", {
        count: state => state.num
      })
    },
    components: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";
  #Concat {
    .seamless-warp2 {
      overflow: hidden;
      height: 25px;
      width: 380px;
      ul.item {
        width: 580px;
        li {
          float: left;
          margin-right: 10px;
        }
      }
    }
    .concat-header{
      background-color: #fff;
      height: 88px;
      position:fixed;
      width: 100%;
      top: 0px;
      left: 0px;
      z-index: 999;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .isShield{
        margin-right: 30px;
      }
      .shield-totat{
        font-size:24px;
        margin-right: 27px;
        display: inline-block;
        color:rgba(102,102,102,1);
      }
    }
    .concat-body{
      padding: 90px 30px 150px 30px;
      .concat-body-list{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        padding: 30px 0px;
      }
      .headerImg{
        width:86px;
        height:86px;
      }
    }
    .concat-body-container{
      position: relative;
      margin-left: 50px;
      .triangle{
        position:absolute;
        left: -20px;
        top: 20px;
        border-top: 20px solid transparent;
        border-right:30px solid $themeColor;
        border-bottom:20px solid transparent;
        border-left:0 solid transparent;
      }
      .concat-text{
        padding: 25px;
        background-color:$themeColor;
        border-radius:8px;
        color: #fff;
      }
    }
    .concat-footer{
      width:750px;
      height:122px;
      background:rgba(255,255,255,1);
      border:1PX solid rgba(221,221,221,1);
      position: fixed;
      bottom: 0px;
      display: flex;
      align-content: center;
      align-items: center;
      .concat-group{
        flex: 1;
        margin: 0px 30px;
        .concat-field{
          border:1PX solid rgba(221,221,221,.8);
          border-radius:8px;
        }
      }

      .concat-more{
        margin: 0px 30px;
        width:66px;
        height:66px;
        border:1PX solid rgba(221,221,221,1);
        border-radius:50%;
        display: flex;
        justify-content: center;
        align-items: center;
        .iconfont{
          color:rgba(153,153,153,1);
        }
      }
    }
  }
</style>
