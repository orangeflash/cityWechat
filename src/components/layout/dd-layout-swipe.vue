<template>

  <layout-div :style="getStyle" class="over-h posi-r">
    <layout-div :style="getChildStyle" class="flex" @load="loadHandle">
      <slot/>
    </layout-div>
    <layout-div class="flex-center flex posi-a b0 l0 r0" :height="40" :unit="unit" v-if="!$slots.point">
      <layout-div class="flex">
        <layout-div v-for="i in this.length" :key="i" class="op-5" :mar="[0,15]" :height="20" :width="20"
                    :bg="Math.abs(index) == i-1?'red':'#fff'" :fillet="20" :unit="unit"/>
      </layout-div>
    </layout-div>
    <slot v-else name="point"/>
  </layout-div>

</template>
<script>
  export default {
    props: {
      value: {
        type: Number,
        default: 0
      },
      width: {   //宽
        type: Number,
        default: null
      },
      height: {  //高
        type: Number,
        default: null,
      },
      unit: {   //单位
        type: String,
        default: 'px'
      },
      time: {   //时间（毫秒）
        type: Number,
        default: 3000
      },
      direction: { //方向 X | Y (注意是：大写)
        type: String,
        default: "X"
      },
      duration: {    //每次切换的时间（毫秒）
        type: Number,
        default: 300
      },
      autoPlay: {   //是否自动轮播
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        style: {},
        multiple: 50,  //倍数处理，更加UI进行 100倍是按照 750*1334 的UI
        dom: null,     //当前swipe元素
        length: 0,    //子元素的数量
        countWidth: 0,   //总长度
        index: 0,
        isTouch: false,// 手指是否在屏幕上
      }
    },
    methods: {
      loadHandle(e) {
        this.dom = e.dom
        this.length = e.dom.childElementCount
        for (let i = 0; i < this.length; i++) {
          this.dom.children[i].style.height = this.height ? this.height / this.multiple + this.unit : ''
          this.dom.children[i].style.width = parseFloat(this.dom.style.width) / this.length / this.multiple + this.unit
          this.dom.children[i].style.flexGrow = 1;
        }
        this.bingTouch(this.dom)
        // 判断可不可以自动轮播
        if (this.autoPlay && this.length) this.beginSwipe()
      },
      bingTouch(dom) {
        const self = this;
        let tranX = 0
        this.touch({
          stop: false,
          dom,
          start(e) {
            dom.style.transitionDuration = '0ms'
            tranX = parseFloat(dom.style.transform.split("(")[1]) || 0
          },
          move({dx}) {
            dom.style.transform = `translateX(${dx + tranX + self.unit})`;
          },
          change({direction}) {
            switch (direction) {
              case 'left':
                self.index--;
                break;
            }
            self.moveHandle()
          }
        })
      },
      moveHandle() {     //移动
        const Y = parseFloat(this.dom.style.width) / this.length
        this.dom.style.transitionDuration = `${this.duration}ms`
        this.dom.style.transform = `translateX(${this.index * Y + this.unit})`;
        setTimeout(() => {
          if (!this.isTouch) {
            if (Math.abs(this.index) == this.length - 1) {
              // console.log("要开始调换位置了");
              const first = this.dom.firstChild;
              first.style.transform = `translateX(${(Math.abs(-this.index) + 1) * Y + this.unit})`;
            } else if (Math.abs(this.index) == this.length) {
              // console.log("开始下一轮了")
              const first = this.dom.firstChild;
              this.dom.style.transitionDuration = '0ms'
              this.dom.style.transform = `translateX(${0 + this.unit})`;
              this.index = 0;
              first.style.transform = `translateX(${0 + this.unit})`;
            }
          }
          this.$emit('input', Math.abs(this.index))
        }, this.duration)
      },
      beginSwipe() {
        setTimeout(() => {
          if (this.isTouch) return this.beginSwipe(); //如果是手指在移动，就不再执行
          this.index--
          this.moveHandle()
          this.beginSwipe()
        }, this.time > this.duration ? this.time : this.duration + 1000)
      }
    },
    computed: {
      getStyle() {
        if (this.unit != 'rem') this.multiple = 1;
        const width = this.width ? this.width / this.multiple + this.unit : '100%',
          height = this.height ? this.height / this.multiple + this.unit : ''
        return {width, height};
      },
      getChildStyle() {
        if (this.unit != 'rem') this.multiple = 1;
        this.countWidth = ((this.width || this.dom ? this.dom.parentNode.clientWidth : window.screen.width) / this.multiple * this.length)
        this.style.width = this.countWidth + this.unit
        if (this.height) {
          this.style.height = this.height / this.multiple + this.unit
        } else {
          this.style.height = ''
        }
        return this.style;
      }
    }
  }

</script>


