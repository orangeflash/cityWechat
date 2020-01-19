<template>

  <div>
    <Header/>
    <div class="pad-30 col-6 lineH-38 fon-b">
      请填写员工信息，三个信息任写一组即可！不必须填写完！
    </div>
    <van-cell-group>
      <van-field
        v-model="params.userId"
        clearable
        :disabled="$route.query.id > 0"
        label="用户ID"
        placeholder="请填写用户ID(纯数字)"
      />
    </van-cell-group>
    <div class="dh col-6 flex-y-center pad-lr">或</div>
    <van-cell-group>
      <van-field
        v-model="params.userTel"
        clearable
        label="员工手机"
        placeholder="请填写员工手机号"
        :disabled="$route.query.id > 0"
      />
    </van-cell-group>
    <div class="dh col-6 flex-y-center pad-lr fon-lg">其他信息</div>
    <van-cell-group>
      <van-field
        clearable
        v-model="params.remarks"
        label="员工备注"
        placeholder="请填写备注名"
      />
    </van-cell-group>
    <div class="dh col-6 flex-y-center pad-lr fon-lg">核销权限</div>
    <dd-check-box class="bg-f" :labels="labels" @click="choice"/>
    <dd-button
      class="mar-30"
      type="release"
      @click="add"
      name="确定"
    />
  </div>

</template>

<script>

  import DdButton from "@/components/template/button"
  import {mapActions, mapState} from 'vuex'
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";
  import DdCheckBox from "@/components/template/dd-form/check-box"
  import {Toast} from 'vant'

  export default {
    components: {DdButton, DdCheckBox},
    data() {
      return {
        labels: [],
        userTel: '',
        params: {
          userId: '',
          userTel: '',
          remarks: '',
          power: []
        }
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeStaff", ["addStaff", "writerOffPower", 'getStaffInfo']),
      choice(e) {
        console.log(e);
        this.params.power = (e || []).map(item => {
          return item.key
        });
        console.log(this.params.power)
      },
      async add() {
        if (this.params.userId.trim() || this.params.userTel.trim()) {
          showLoading("正在添加...")

          this.userTel.trim() && (this.params.userTel = this.userTel);
          const res = await this.addStaff({
            ...this.params,
            storeId: this.storeId
          });
          hideLoading();
          showHandleStatusByFlag(res.code, this.params.id ? '修改成功' : '添加成功', res.msg, async (bool) => {

            if (bool) {
              if (this.params.id) {
                this.$router.go(-1)
              } else {
                try {
                  await showDialog("是否继续添加?")
                  this.params.userTel = '';
                  this.params.userId = ''
                  this.params.remarks = ''
                } catch (e) {
                  this.$router.go(-1)
                }
              }

            }
          })
        } else {
          Toast({
            message: '请填写员工信息',
            duration: 1500
          })
        }
      }
    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    async created() {
      const query = this.$route.query;
      if (query.id) {
        showLoading();
        this.params.id = query.id
        const info = await this.getStaffInfo(query);
        hideLoading();
        this.params.userId = info.userId;
        this.params.userTel = this.hideTelNumber(query.userTel);
        this.params.remarks = info.remarks;
        this.userTel = query.userTel;
        this.params.power = info.power

        console.log(this.labels)
      }

      this.writerOffPower().then(async result => {
        console.log("writerOffPower", result);
        this.labels = [];
        console.log("this.params.power", this.params.power)
        for (let k in result) {
          console.log("!this.params.power[k]", !this.params.power[k])
          this.labels.push({
            name: result[k],
            key: k,
            active: query.id?!!this.params.power[k]:!this.params.power[k]
          })
        }


      });


    }
  }

</script>
