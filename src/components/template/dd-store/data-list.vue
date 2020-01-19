<template>

  <ul
    v-if="form.length > 0"
    :style="{'background':bag || '#fff'}"
  >
    <li
      v-for="(item,key) in form"
      :key="key"
      class="flex-bt flex-y-center col-9"
      :style="{'min-height':((height || 88 )/100)+'rem'}"
      v-if="item"
      :class="item.className"
    >
      <div style="min-width: 1.5rem;" v-if="item.label || item.icon">
        <i class="iconfont mar-r" v-if="item.icon" :class="item.icon"></i>
        <span :style="{'color':item.color}" v-html="item.label"></span>
      </div>
      <span v-if="item.info" class="flex-g-1" :style="{'line-height':((height || 88 )/100)+'rem'}"
            v-html="item.info"></span>
      <div v-if="item.html" v-html="item.html"></div>
      <slot name="right"></slot>
    </li>
  </ul>

</template>
<script>

  export default {
    props: ['form', 'height', 'bag', 'fontSize'],
  }

</script>
