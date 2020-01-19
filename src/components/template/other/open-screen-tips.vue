<template>

  <div class="posi-f t0 l0 r0 b0 bg-0-5 flex-center"
       v-if="value"
  >
    <div class="bg-f bg-f br-r-20 w-600">
      <div class="dh flex-center posi-r">
        <span class="posi-a r0 t0 mar-t-20 mar-r fon-xl col-6" @click="$emit('input',false)">X</span>
        <div class="fon-b">{{title}}</div>
      </div>
      <div class="pad-30">
        <div v-html="context"></div>
      </div>
      <div class="flex-center pad-b">
        <div class="col-f bg-t w-175 dh-80 fon-lg flex-center pad-lr br-r-20" @click="$emit('input',false)">我知道了</div>
      </div>

    </div>
  </div>


</template>

<script>

  export default {
    props: {
      value: {
        type: String,
        default: false,
      },
      title: {
        type: String,
        default: '温馨提示'
      },
      context: {
        type: String,
        default: ''
      }
    }
  }

</script>
