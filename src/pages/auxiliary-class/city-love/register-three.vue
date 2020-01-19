<template>
  <dd-layout-div mi-h="100vh" class="bg-f">
    <dd-layout-div :pad="[70,0,30]" :width="588" class="mar-a">
      <div class="fon-50 fon-w5 mar-b">请完善你的基本资料</div>
    </dd-layout-div>
    <div class="pad-tb mar-t">
      <p class="fon-wb fon-xl t-c mar-b">你的身高 <span class="col-t fon-xxl">{{Math.abs(registerInfo.height)}}</span> cm
      </p>
      <dd-layout-rule :min="100" :max="230" :color="$themeColor" v-model="registerInfo.height"/>
    </div>
    <div class="pad-tb mar-t">
      <p class="fon-wb fon-xl t-c mar-b">你的体重
        <dd-layout-div color="#FF8C4D" class="col-t dis-ib fon-xxl">{{Math.abs(registerInfo.weight)}}</dd-layout-div>
        kg
      </p>
      <dd-layout-rule :min="100" :max="230" color="#FF8C4D" v-model="registerInfo.weight"/>
    </div>
    <dd-layout-div :bg="judgeParams == true?$themeColor:'#DAD9DD'" class="col-f fon-40 flex-center" :mar="[80,60,0]"
                   @click="clickHandle" :height="98" :fillet="98">下一步
    </dd-layout-div>
  </dd-layout-div>
</template>

<script>


  import DdLayoutRule from "../../../components/layout/dd-layout-rule";

  import {mapState} from 'vuex'
  import {Toast} from 'vant'

  export default {
    components: {DdLayoutRule},
    data() {
      return {}
    },
    methods: {
      clickHandle() {
        if (this.judgeParams == true) {
          this.goPointPage('/auxiliary/cityLove/registerFour')
        } else {
          Toast({
            message: this.judgeParams,
            duration: 1500
          })
        }
      }
    },
    computed: {
      ...mapState("cityLove", {
        registerInfo: s => s.registerInfo
      }),

      judgeParams() {
        if (!this.registerInfo.name.trim()) return this.goPointPage("/auxiliary/cityLove/register")
        if (!this.registerInfo.birthday.trim()) return this.goPointPage("/auxiliary/cityLove/register")
        if (!this.registerInfo.city.trim()) return this.goPointPage("/auxiliary/cityLove/register")
        if (!this.registerInfo.face.trim()) return this.goPointPage("/auxiliary/cityLove/registerTwo")
        if (!this.registerInfo.height) return this.goPointPage("/auxiliary/cityLove/registerThree")
        if (!this.registerInfo.weight) return this.goPointPage("/auxiliary/cityLove/registerThree")
        return true
      }
    },
    async created() {
      if (this.registerInfo.id) {
        this.goPointPage("/auxiliary/cityLove")
      } else {
        this.registerInfo.tel = null;
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.registerInfo.tel = this.user.userTel
      }
    }
  }


</script>
