<template>
    <div class="setting-phone">
        <em class="setting-tig">一个手机号只能绑定一个账号哦！</em>
        <van-cell-group>
          <van-field  label="绑定手机号" v-model="value" placeholder=""  disabled class="binding-phone" input-align="right"/>
        </van-cell-group>
        <van-button type="primary" class="change-phone" @click="changePhone">修改手机号</van-button>
    </div>
</template>
           
<script>
import { Field , Button} from 'vant';
export default{
    data(){
      return {
        value:'185*****456',
      }
    },
    methods:{
      changePhone(){
        this.$router.push("/Personal/getCord")
      }
    },
    mounted(){},
    created(){}, 
}
</script>
<style scoped lang="scss">
    .setting-phone{
      .setting-tig{
        line-height: 90px;
        display: inline-block;
        padding: 0px 30px;
        color: rgba(153,153,153,1);
      }
      .binding-phone {
          display: flex;
          color:rgba(51,51,51,1);
      }
      .change-phone{
        background-color: rgba(93,178,113,1);
        margin: 80px 30px 0px 30px;
        width: 90%;
      }
    }            
</style>