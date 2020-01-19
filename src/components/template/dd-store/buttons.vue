<template>
  <div class="dd-store-buttons flex-x-end pad-30 bg-f">
    <button class="mar-l flex-center default"
            v-for="(item,key) in bts"
            :key="key"
            :class="item.type"
            v-if="item.name "
            @click.stop="$emit('click',item)"
    >{{item.name}}
    </button>
  </div>

</template>

<script>

  export default {
    props: ['bts']
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  button {
    padding: 0.15rem 0.2rem;
    font-size: 0.26rem;
    margin-left: 0.3rem;
    border-radius: 0.1rem;
    border: 0.011rem solid;
  }

  .default {
    background: #fff;
    border-color: #ddd;
  }

  .main {
    background-color: #f52c2c;
    border-color: #f52c2c;
    color: #fff;
  }

</style>
