<template>
  <div class="dd-tabs bg-f">
    <div class="dd-tabs_warp flex flex-y-center dh"
         :class="{'dd-tabs_warp_scrollable':tabs.length>4}"
    >
      <div class="over-a flex over-a">
        <div class="dd-tabs_line" v-if="!back"></div>
        <div class="flex fon-sm flex-g-0 mar-l"
             :class="{'pad-r':key== tabs.length-1}"
             v-for="(item,key) in tabs"
             @click="change(item,key)"
        >
          <span :class="{'dd-tab_back':back&&value == key}" class="pad-14-20-10">{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['tabs', 'value', 'back'],
    methods: {
      change(item, key) {
        this.$emit('input', key);
        this.$emit('change', item, key);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";


  .dd-tab_back {
    background: linear-gradient(90deg, rgba(255, 48, 0, 1) 0%, rgba(255, 162, 86, 1) 100%);;
    color: #fff;
    border-radius: 10px;
  }


</style>
