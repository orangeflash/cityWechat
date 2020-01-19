<template>


  <!--尺子刻度-->


  <div class="posi-r dh-150 mar-a w-600 over-h" :style="{border:`3px solid ${color}`}">
    <div class="posi-a w100 flex-x-center">
      <dd class="down-2-3" :style="{borderTopColor:color}"></dd>
    </div>
    <ul class="flex mar-l-5" ref="rule">
      <dd-layout-div v-for="(i,k) in max" :pad="[0,14,0,0]" unit="px" :key="k" class="flex-g-0 posi-r flex-x-center">
        <dd-layout-div :width="1" :mar="[0,0,20]" unit="px" :class="i%10 == 0?'dh-90':i%5 == 0?'dh-60':'dh-40'"
                       :style="{ backgroundColor:color,}"></dd-layout-div>
        <span class="posi-a b0 fon-lg" :style="{color:color}" v-if="i%10 == 0">{{i}}</span>
      </dd-layout-div>
    </ul>
  </div>


</template>


<script>

  export default {
    props: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      value: {
        type: Number,
        default: 50
      },
      color: {
        type: String,
        default: '#FF8C4D'
      }
    },
    data() {
      return {
        index: 50
      }
    },
    methods: {
      bind() {
        if (this.$refs.rule) {
          const dom = this.$refs.rule;
          let data = {
            X: 0,
            distanceX: 0,
            maxW: this.max * 15
          }

          const that = this;

          this.$refs.rule.style.paddingLeft = this.$refs.rule.clientWidth / 2 - 1 + 'px';

          dom.style.transform = `translateX(${-(Math.abs(this.value) - 1) * 15}px)`

          dom.style.width = Math.abs(this.max) * 15 + 'px'
          this.touch({
            dom,
            start({x}) {
              data.X = parseFloat(dom.style.transform ? dom.style.transform.split("(")[1].split("px)")[0] : 0);
            },
            move({dx}) {

              data.distanceX = dx + data.X

              if (data.distanceX >= 0) {
                data.distanceX = 0
              } else if (Math.abs(data.distanceX) >= data.maxW) {
                data.distanceX = -data.maxW
              }

              that.$emit('input', Math.abs(~~(data.distanceX / 15)) + 1)

              dom.style.transform = `translateX(${data.distanceX}px)`
            },
            end(data) {

            }
          })

        } else {
          window.requestAnimationFrame(this.bind)
        }
      }
    },
    created() {
      window.requestAnimationFrame(this.bind)
    }
  }


</script>
