<template>

  <div class="dd-form-chunk">
    <dd-title :title="title"></dd-title>
    <div class="bg-f">
      <slot name="content"></slot>
    </div>
  </div>


</template>

<script>

  import DdTitle from './title'

  export default {
    components:{DdTitle},
    props:['title']
  }


</script>
