<template>
  <div class="dd-face "
       @click="$emit('click')"
       :class="['dd-face__'+ (size || '48') ]"
       :style="{'borderRadius':borderRadius+'rem','width':  (size || 48) / 50+'rem','height':  (size || 48) / 50+'rem'}"
  >
    <img-wrapper :src="src"></img-wrapper>
  </div>
</template>
<script>
  export default {
    props: ['src', 'size', 'borderRadius']
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-face {
    display: inline-block;
    overflow: hidden;
    border-radius: 50%;
    background: #fff;

    &__24 {
      width: 48px;
      height: 48px;
    }

    &__27 {
      width: 54px;
      height: 54px;
    }

    &__36 {
      width: 72px;
      height: 72px;
    }

    &__48 {
      width: 96px;
      height: 96px;
    }
  }

</style>
