<template>
    <div>
      <em class="setting-tig">一个手机号只能绑定一个账号哦！</em>
      <van-cell-group>
            <van-field
                v-model="phoneNum"
                clearable
                label="手机号"
                placeholder="请输入新手机号"
            />
           <a href="javascript:;" class="getCord" @click="getCordClick">{{getCordNum}}</a>
            <van-field
                v-model="passCord"
                type="password"
                label="验证码"
                placeholder="请输入验证码"
                clearable
            />
      </van-cell-group>
      <van-button type="primary" class="confirm-the-changes" @click="SevaClick">确认修改并保存</van-button>
    </div>
</template>
           
<script>
import { Field,Toast,Button} from 'vant';

export default{
     data(){
         return {
             phoneNum:'',
             passCord:'',
             getCordNum:'获取验证码',
             timeGo:59,
             markId:1,
         }
     },
     methods:{
       getCordClick(){

            if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phoneNum))){
            //if(this.phoneNum.trim().length != 0){
                Toast('已发送，请稍等');
                if(this.markId==1){
                        const timeId = setInterval(()=>{
                            this.timeGo--;
                            if (this.timeGo>0) {
                              this.markId=0
                              this.getCordNum = ` ${this.timeGo} 秒后再次获取`;
                            } else {
                              clearInterval(timeId);
                              this.getCordNum="获取验证码";
                              this.markId=1
                            }
                        },1000)
                }else{
                    Toast('不要连续点击哦！！');
                    return
                }
           }else{
                Toast('请输入正确的手机号 ~\\(^o^)/~');
           }
       },
       SevaClick(){

        //电话号码判断 - Clover(若有问题请联系删除)
         if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phoneNum))){
           return Toast('请输入正确的手机号 ~\\(^o^)/~')
         }else if(this.passCord.trim().length != 0){
           return Toast('请输入验证码 ~\\(^o^)/~')
         }else{
           return Toast('正在执行...请稍后')
         }

         if(this.passCord.trim().length != 0 || this.phoneNum.trim().length != 0){

         }else{
            Toast('请输入验证码或者手机号！');
            return;
         }
       }
     },
     mounted(){},
     created(){}  
}
</script>
<style scoped lang="scss">
    .setting-tig{
        line-height: 90px;
        display: inline-block;
        padding: 0px 30px;
        color: rgba(153,153,153,1);
    }
    .getCord{
        position: absolute;
        top: 30px;
        right: 30px;
        font-size:30px;
        color:rgba(255,99,22,1);
    }
    .confirm-the-changes{
        margin: 70px 30px 0px 30px;
        width: 90%;
        background-color: rgba(93,178,113,1);
    }
</style>
