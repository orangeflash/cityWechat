<template>
  <van-popup v-model="showInput">
    <div>
      <div class="dh flex-center fon-xl br-b-d" style="width: 7rem;">订单填写</div>
      <van-cell-group class="pad-30">
        <van-field
          v-model="params.logisticsName"
          label="物流公司"
          placeholder="请输入物流公司名称"
          required
        />

        <van-field
          v-model="params.logisticsCode"
          label="订单编号"
          placeholder="请输入订单编号"
          required
        />
      </van-cell-group>
      <dd-button
        type="release"
        class="mar-lr mar-b"
        name="确认"
        @click="confirm"
      ></dd-button>
    </div>
  </van-popup>
</template>

<script>
  import DdButton from "@/components/template/button"
  import {Toast} from 'vant'

  export default {
    components: {DdButton},
    props: {
      value: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        showInput: false,
        params: {
          logisticsName: '',
          logisticsCode: ''
        }
      }
    },
    watch: {
      value(newValue) {
        this.showInput = newValue;
      },
      showInput(newValue) {
        this.value != newValue && this.$emit('input', newValue);
      }
    },
    methods: {
      confirm() {
        if (!this.params.logisticsName.trim()) {
          return Toast.fail({
            message: '请输入物流公司名称'
          }, 1500)
        }
        if (!this.params.logisticsCode.trim()) {
          return Toast.fail({
            message: '请输入订单编号'
          }, 1500)
        }
        this.$emit('input', false);
        this.$emit('confirm', this.params);
      }
    }

  }


</script>
