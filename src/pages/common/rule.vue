<template>
  <div id="Rule">
    <p v-if="isRichText" class="pactBody" v-html="content"></p>
    <div v-else class="pactBody">
       <ul class="gradeInfo">
         <li>{{content.name}}</li>
         <li>加入合伙人比例<span>{{content.partnerFirst}}%<span v-if="partnerConfig.class=='2'">（二级{{content.partnerSecond}}%）</span></span></li>
         <li>信息相关比例<span>{{content.postFirst}}%<span v-if="partnerConfig.class=='2'">（二级{{content.postSecond}}%）</span></span></li>
         <li>商家相关比例<span>{{content.storeFirst}}%<span v-if="partnerConfig.class=='2'">（二级{{content.storeSecond}}%）</span></span></li>
       </ul>
    </div>
    <div class="cancel" @click="know">
      <span class="cancel-text">我知道了</span>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  export default {
    name: "Rule",
    data() {
      return {
        content:'',
        isRichText:true,
      }
    },
    methods: {
      ...mapActions("partner", ["getPartnerconfig","getPartnergradeInfo"]),
      know(){
        this.$router.go(-1)
      },
      async gethhrpz(){
        await this.getPartnerconfig();
        console.log(this.partnerConfig)
      },
    },
    computed: {
      ...mapState("partner", {
        partnerConfig: state => state.partnerConfig,
      }),
      value:{
        get(){
          return this.checked;
        },
        set(newVal){
          this.$emit("update:checked",newVal)
        }
      }
    },
    async created() {
      this.gethhrpz();
      const rulefrom= this.$route.params.rulefrom,rulequery=this.$route.params.rulequery
      console.log(rulefrom,rulequery)
      switch (rulefrom) {
        case 'partnerrule':
          this.content=(await this.getPartnerconfig()).rule
          break;
        case 'partnerprivilege':
          this.content=(await this.getPartnerconfig()).privilege
          break;
        case 'partnerWdtq':
          this.content=await this.getPartnergradeInfo({gradeId:rulequery})
          this.isRichText=false
          break
      }
    }
  }
</script>

<style>

  .pactBody img{
    max-width: 100%;
  }
</style>

<style scoped lang="scss">
  @import "../../assets/common";
  @import "../../assets/theme";
  #Rule {
    @include widhei;
    height: 100vh;
    background-color: #fff;
    .pactBody {
      overflow-x: hidden;
      overflow-y: scroll;
      padding: 30px 30px 150px;
      font-size: 28px;
      @include widhei;
      box-sizing: border-box;
    }
    .cancel {
      width: 100%;
      height: 120px;
      text-align: center;
      color: #fff;
      position: fixed;
      bottom: 0;
      background-color: #fff;
      border-top: 1.1px solid #f5f5f5;
      .cancel-text {
        display: inline-block;
        text-align: center;
        height: 60px;
        line-height: 60px;
        padding: 5px 0px;
        width: 80%;
        font-size: 28px;
        background-color: $themeColor;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        bottom: 50%;
        transform: translate(-50%, 50%);
      }
    }
    .gradeInfo{
      padding: 50px 20px;
      font-size: $font-size-base;
      li{
        margin-bottom: 20px;
      }
      span{
        color: #FF5669;
        margin-left: 10px;
      }
    }
  }
</style>
