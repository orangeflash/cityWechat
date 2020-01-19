<template>

  <!--循环轮播-->

  <div class="marquee">
    <div class="marquee-content pad-b-20" ref="marquee">
      <slot name="content"></slot>
    </div>
  </div>


</template>

<script>

  export default {
    props: {
      length: {
        type: Number,
        default: 0,
      },
      direction: {
        type: String,
        default: 'left'
      },
      width: {
        type: Number,
        default: innerWidth,
      },
      speed: {
        type: Number,
        default: 1,
      }
    },
    data() {
      return {
        csP: null,
        cs: null,
        csW: 0,
      }
    },
    methods: {
      beginLoop() {
        setInterval(() => {
          this.cs.forEach((item, i) => {
            let left = (parseInt(item.style.left) || 0) - this.speed;
            item.style.left = left + 'px';
            if (left < -item.clientWidth) item.style.left = (this.cs.length - 1) * item.clientWidth + 'px';
          })
        }, 100)
      },
    },
    created() {
      setTimeout(() => {
        let obj = this.$refs.marquee;
        this.csP = obj.firstElementChild;
        this.cs = obj.querySelectorAll(".marquee-children");
        this.csP.style.position = 'relative';
        this.csP.style.width = '100%';


        this.cs.forEach((item, i) => {
          this.csW = item.clientWidth;
          this.csH = item.clientWidth;
          item.style.position = 'absolute';
          item.style.left = item.clientWidth * i + 'px'
        });
        this.csP.style.height = this.csH + 'px';
        if (this.cs.length * this.csW > this.csP.clientWidth) {
          this.beginLoop();
        }
      }, 100)

    }
  }


</script>
