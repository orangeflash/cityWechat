<template>
  <div class="pad-30 bg-f">
    <div class="box-sha pad-lr pad-t-20 pad-b-20 flex-y-center br-r-16">
      <div class="flex-g-1 flex-y-center">
        <div class="dh-90 over-h br-r-c w-90 bg-f9 mar-r">
          <img-wrapper v-if="config.cover[0].url" :src="config.cover[0].url"/>
        </div>
        <div>
          <div class="fon-wb fon-b mar-b-10">{{config.infoTitle}}</div>
          <p class="col-9 fon-xss">{{config.desc}}</p>
        </div>
      </div>
      <div class="bg-t col-f pad-lr pad-t-15 pad-b-12 br-r-4 fon-wb" @click="handle">{{config.btnName
        || '点击查看'}}
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      config: {
        type: Object,
        default: Object
      },
      deliver: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showCode: false,
      }
    },
    methods: {
      handle() {

        if (this.deliver) {
          console.log("this.deliver",this.deliver)
          this.$emit('click', {
            name: 'dd-layout-search',
            value: this.config
          })

        } else {
          this.$emit('click')
        }
      }
    }
  }

</script>
