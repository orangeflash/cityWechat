<template>

  <dd-layout-div mi-h="100vh" class="bg-f">

    <dd-layout-div :pad="[70,0,30]" :width="588" class="mar-a">
      <div class="fon-50 fon-w5 mar-b">请选择你感兴趣的话题</div>
      <p class="col-9">至少选择一项，才能开启你的交友之旅哦！</p>
    </dd-layout-div>

    <!--兴趣-->
    <dd-layout-div :pad="[70,0,30]" :width="588" class="mar-a">
      <div class="flex-wrap flex">
        <dd-layout-div v-for="(info,i) in interest" :key="i" @click="info.active = !info.active" :pad="[30,35]"
                       :mar="[13]" :class="info.active?'bg-t col-f':' col-6'" class=" br-r-40 br-e">
          {{info.name}}
        </dd-layout-div>
      </div>
    </dd-layout-div>
    <dd-layout-div :bg="judgeParams == true?$themeColor:'#DAD9DD'" :mar="[70,'auto',0]" :width="588"
                   class="col-f fon-40 flex-center"
                   @click="clickHandle" :height="98" :fillet="98">开始交友
    </dd-layout-div>

  </dd-layout-div>

</template>

<script>
  import {Toast} from 'vant'
  import {mapState, mapActions} from 'vuex'
  import {getSuccessData, hideLoading, showHandleStatusByFlag, showLoading} from "../../../util";

  export default {
    data() {
      return {
        interest: []
      }
    },
    methods: {
      ...mapActions("cityLove", ["cityLoveRegister", 'cityLoveCategory']),
      async clickHandle() {
        if (this.judgeParams == true) {

          console.log(this.registerInfo)
          console.log("开始注册")
          showLoading("正在创建中...")
          this.registerInfo.icon = await this.uploadFile({
            files: this.registerInfo.files,
          })
          hideLoading();
          const res = await this.cityLoveRegister(this.registerInfo);
          console.log("注册结果", res)


          showHandleStatusByFlag(res.code > 0, '注册成功', res.msg, async (bool) => {

            if (bool) {
              await this.cityLoveRegister({
                userId: this.user.id
              });
              this.goPointPage('/auxiliary/cityLove')
            }


          })
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
        let bool = false;

        this.registerInfo.label = {};

        this.interest.forEach(item => {
          if (item.active) {
            this.registerInfo.label[item.id] = item.name
            bool = true
          }
        })

        if (!bool) return "请选择你感兴趣的话题"

        return bool;
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

        showLoading();
        const res = await this.cityLoveCategory({
          type: 19
        });
        hideLoading();
        console.log("res", res)

        this.interest = res.map(item => {
          return {
            ...item,
            active: false
          }
        })

      }
    }
  }

</script>
