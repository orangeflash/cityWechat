<template>
  <div class="showbox pad-30">
    <div class="showboxhead">
      <p>城市代理提拥比例</p>
    </div>
    <div class="shouboxmain">
      <div class="showboxinfos" v-for="(item,index) in list[1]" :key="index">
        <p class="infoprop">{{item.title}}:   <span class="blue">{{item.postBonus}}</span> </p>
        <p class="infotips">{{item.tips}}</p>
      </div>

    </div>
    <div class="showfooter">
      <div class="foot-mar-btn mb supplement">
        <button>知道了</button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "agent-bonus",
        props:["list"],
        data(){
          return {
            listObj : this.list[0],
            newList:[]
          }
        },
        methods:{
          getList(){
            for(let i in this.listObj) {
              // i是键 this.listObj[i] 是值
              this.list[1].forEach(item=>{
                item[`${i}`]=this.listObj[i]
              })
            }
          }
        },
        created() {
          this.getList()
          console.log(this.list[1])
      }
    }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  .showbox {
    background: #fff;
    width: 630px;
    height: 853px;
    .showboxhead {
      font-size: 28px;
      color: #333;
      text-align: center;
      margin: 30px 0;
    }
    .shouboxmain {
      line-height: 50px;
      overflow: auto;
      height: 700px;
      .showboxinfos {
        margin-bottom: 40px;
      }
      .infoprop {
        font-family: 'PingFang-SC-Medium';
        font-weight: bold;
        font-size: 32px;
        color: #333;
        span {
          margin-left: 15px;
        }
      }
      .infotips {
        font-size: 24px;
        color: #999;
      }
      .blue {
        font-size: 32px;
        color: $themeColor;
      }
    }
    .supplement {
      width: 90% !important;
      border-radius: 44px;
      button {
        background:$themeColor !important;
      }
    }
  }
</style>
