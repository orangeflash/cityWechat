<template>
  <div id="CheckboxPicker" class="posi-r zIndex9999">
    <van-popup
      position="bottom"
      v-model="pickerShow">
      <div class="van-picker">
        <div class="van-hairline--top-bottom van-picker__toolbar flex-bt pad-lr">
          <!--<span class="text" @click="pickerShow=!pickerShow">取消</span>-->
          <span class="flex-g-1 fon-lg t-c">{{title}}</span>
          <span class="fon-lg" style="color:#1989fa" @click="confirm">确定</span>
        </div>
        <div class="picker-body over-a" style="height: 220px;">
          <ul>
            <li class="dh br-b-d flex-bt mar-l flex-y-center pad-r fon-b"
                v-for="(item,key) in getList"
                :class="item.className"
                @click.stop="choice(key)"
            >
              <span :style="item.style">{{item.name}}</span>
              <i class="iconfont icon-multiple_choice fon-46 col-t" v-if="item.active"></i>
              <i class="iconfont icon-choose_none_line fon-46 col-9" v-else></i>
            </li>
          </ul>
        </div>
      </div>
    </van-popup>
  </div>
</template>


<script>

  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '请选择'
      },
      list: {
        type: Array,
        default: []
      },
      deliver: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        result: null,
        k: null,
      }
    },
    computed: {
      pickerShow: {
        get() {
          return this.value
        },
        set(newVal) {
          this.$emit("input", newVal)
        }
      },
      getList() {

        return this.list.map((item, index) => {
          return {
            ...item,
            active: index == this.k,
          }
        });
      }
    },
    methods: {
      choice(k) {
        this.k = k;
        this.result = this.list[k];
      },
      confirm() {
        this.$emit('input', false);
        this.deliver ? this.$emit('click', {
          name: 'radio-picker',
          value: this.result
        }) : this.$emit('confirm', this.result);
      }
    }
  }


</script>
