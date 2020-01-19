<template>
  <div id="CheckboxPicker">
    <van-popup
      position="bottom"
      v-model="pickerShow">
      <div class="van-picker">
        <div class="van-hairline--top-bottom van-picker__toolbar flex-bt pad-lr">
          <!--<span class="text" @click="pickerShow=!pickerShow">取消</span>-->
          <span class="flex-g-1 fon-lg t-c">{{title}}</span>
          <span class="fon-lg" style="color:#1989fa" @click="confirm">确定</span>
        </div>
        <div class="picker-body" style="height: 220px;">
          <van-checkbox-group v-model="currentResult" @change="groupChange">
            <van-cell-group>
              <van-cell
                v-for="(item, index) in currentList"
                clickable
                :key="item"
                :title="`${titleBefore||''}${item}${titleAfter||''}`"
                @click="toggle(index)"
              >
                <van-checkbox :checked-color="$themeColor" :name="item" ref="checkboxes"/>
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  export default {
    name: "CheckboxPicker",
    props: ['value','list','result','title','titleBefore','titleAfter'],
    data() {
      return {
        currentList:[],
        currentResult:[],
      }
    },
    methods: {
      //多选框切换
      toggle(index) {
        this.$refs.checkboxes[index].toggle();
      },
      confirm(){
        let arr=[]
        this.currentResult.forEach((item)=>{
          const listItem=_.find(this.list, ['name', item]);
          arr.push(listItem)
        })
        this.$emit('confirm',arr)
        // console.log('confirm',this.list,this.currentList,this.result,this.currentResult,arr)
      },
      groupChange(e){

      },
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
      // currentResult:{
      //   get() {
      //     return this.result
      //   },
      //   set(newVal) {
      //     this.$emit("input", newVal)
      //   }
      // },
      // currentList(){
      //    return this.list.map((item)=>item.name)
      // },
    },
    watch:{
      list:{
        handler(newVal){
          this.currentList=newVal.map((item)=>item.name);
          //console.log('list',newVal)
        },
        immediate: true,
        // deep: true,
      },
      result:{
        handler(newVal){
          this.currentResult=newVal.map((item)=>item.name);
          //console.log('result',newVal)
        },
        immediate: true,
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";
  .picker-body{
    overflow-y: scroll;
  }
</style>
