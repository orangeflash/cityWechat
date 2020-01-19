<template>

  <dd-layout-div class="bg-f pad-30" mi-h="100vh">
    <dd-layout-div :pad="[90,30,30]">
      <div class="fon-50 fon-w5 mar-b">请完善你的个人信息</div>
      <p class="col-9">正在创建账号，请填写真实信息</p>
    </dd-layout-div>
    <div class="pad-30">
      <dd-layout-div :br="{bottom:'0.02rem solid #DAD9DD'}" class="mar-b">
        <input class="dh w100 out-n br-n fon-xxl" v-model="registerInfo.name" placeholder="请输入用户名"/>
      </dd-layout-div>
      <dd-layout-div :br="{bottom:'0.02rem solid #DAD9DD'}" class="mar-b" @click="showDatetime = !showDatetime">
        <dd-layout-div class="dh w100 out-n br-n fon-xxl flex-y-center " :class="!registerInfo.birthday&&'col-bb'">
          {{registerInfo.birthday
          || '请选择你的出生日期'}}
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div :br="{bottom:'0.02rem solid #DAD9DD'}" class="mar-b" @click="areaPickerDialog = !areaPickerDialog">
        <dd-layout-div class="dh w100 out-n br-n fon-xxl flex-y-center" :class="!registerInfo.city&&'col-bb'">
          {{registerInfo.city || '请选择你的所在城市'}}
        </dd-layout-div>
      </dd-layout-div>
      <div class="flex-bt flex-y-center mar-t pad-tb-30">
        <dd-layout-div class="fon-40 col-f flex-center" @click="registerInfo.sex = 1" :pad="[30,60,28]" :fillet="60"
                       :bg="registerInfo.sex == 1?$themeColor:'#DAD9DD'">
          <i class="iconfont col-f icon-nanxianxing mar-r-10 fon-40"></i>
          男生
        </dd-layout-div>
        <span class="fon-40 col-9">or</span>
        <dd-layout-div class="fon-40 col-f flex-center" @click="registerInfo.sex = 2" :pad="[30,60,28]" :fillet="60"
                       :bg="registerInfo.sex == 2?$themeColor:'#DAD9DD'">
          <i class="iconfont col-f icon-nvxianxing  mar-r-10 fon-40"></i>
          女生
        </dd-layout-div>
      </div>
      <dd-layout-div class="col-f fon-40 flex-center mar-t"

                     :bg="getType(judgeParams) == 'string'?'#DAD9DD':$themeColor"

                     @click="clickHandle" :height="98"
                     :fillet="98">下一步
      </dd-layout-div>
    </div>


    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-bind="dateTime"
        @confirm="confirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>

    <van-popup position="bottom" v-model="areaPickerDialog">
      <van-area :area-list="areaList" :columns-num="3" title="请选择" @confirm="selectClick"
                @cancel="areaPickerDialog = !areaPickerDialog"/>
    </van-popup>

  </dd-layout-div>
</template>


<script>

  import {format} from "../../../util";
  import areaList from "../../../../static/area.js"

  import {mapActions, mapState} from 'vuex'
  import {Toast} from 'vant'

  export default {
    data() {
      return {
        dateTime: {
          type: "date",
          currentDate: new Date(),
          minDate: new Date(0),
        },
        showDatetime: false,
        areaList,
        areaPickerDialog: false,
      }
    },
    methods: {
      confirm(value) {
        this.registerInfo.birthday = format(new Date(value).getTime()).split(" ")[0];
        this.showDatetime = false;
      },
      /**选择地址 */
      selectClick(save) {
        this.areaPickerDialog = !this.areaPickerDialog
        this.registerInfo.city = save.map(item => {
          return item.name
        }).join("-")
      },
      clickHandle() {
        if (this.judgeParams == true) {
          this.goPointPage('/auxiliary/cityLove/registerTwo')
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
        if (!this.registerInfo.name.trim()) return "请输入用户名";
        if (!this.registerInfo.birthday.trim()) return "请选择出生日期"
        if (!this.registerInfo.city.trim()) return "请选择所在城市"
        return true
      }
    },
    async created() {
      if (this.registerInfo.id) {
        this.goPointPage("/auxiliary/cityLove")
      }else{
        this.registerInfo.tel = null;
        const bool = await this.checkBindTel({callBack: true})
        if (!bool) return
        this.registerInfo.tel = this.user.userTel
      }



    }
  }


</script>
