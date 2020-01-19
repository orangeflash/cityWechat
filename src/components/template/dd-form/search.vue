<template>

  <div class="flex-y-center dh posi-f w100">
    <div class="pad-lr w100 flex">
      <div class="flex-g-1">
        <slot name="before"/>
      </div>
      <div class="flex-g-1 flex-y-center flex-bt  bg-0-5 br-r-20 dh-55 pad-lr">
        <div class="col-f fon-xss hide-e w-300">
          <i class="col-fl iconfont icon-xiazai5 mar-r-10 fon-xss"></i>
          {{placeholder}}
        </div>
        <div class="col-t miw-50">搜索</div>
      </div>
      <div class="flex-g-1">
        <slot name="after"/>
      </div>

    </div>

  </div>

</template>

<script>

  export default {
    props: {
      placeholder: {
        type: String,
        default: '请输入...'
      },
    }
  }

</script>
