<template>


  <div class="pad-lr info-body fon-lg lineH-48 fon-normal" style="word-wrap:break-word" ref="ddHtml" v-html="getRightHtml"></div>


</template>

<script>

  export default {
    props: {
      html: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        pictures: []
      }
    },
    methods: {
      getData() {
        if (this.$refs.ddHtml) {
          let images = this.$refs.ddHtml.querySelectorAll('img');
          this.pictures = [];
          const that = this;
          if (images.length > 0) {
            images.forEach(item => {
              this.pictures.push(item.getAttribute('src'))

              item.onclick = function () {
                that.previewImage(item.getAttribute('src'), that.pictures)
              }
            })
          }
          this.$emit('load', {
            images,
            text: this.$refs.ddHtml.innerText,
            pictures: this.pictures,
          })
        } else {
          window.requestAnimationFrame(this.getData)
        }
      }
    },
    computed:{
      getRightHtml(){
        //console.log('this.html',this.html)
        return this.html.replace(/\n/g, '<br/>')
      }
    },
    created() {
      window.requestAnimationFrame(this.getData)
    }
  }

</script>
