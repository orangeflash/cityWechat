<template>
  <div id="RadioRow">
    <div class="radio-row" :calss="{'radio-row--bordered': showBorder}"
         :style='{minHeight: `${height}px`}'>
      <div class="radio-row__children">
        <slot/>
      </div>
      <div class="radio-row__symbol">
        <CustomRadio :size="20" :color="symbolColor" :selected="selected"/>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import CustomRadio from "../basic/custom-radio";

  export default {
    name: "RadioRow",
    props: {
      showBorder: {
        default: false
      },
      symbolColor: {
        default: "red"
      },
      height: {
        default: 60
      }
    },
    components: {CustomRadio},
    data() {
      return {
        selected: true
      }
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  #RadioRow {
    @import "../../assets/common";

    .radio-row {
      min-height: 60px;
      @include flex-center($justify: space-between);
      @at-root &--bordered {
        @extend .radio-row;
        border-bottom: 1PX solid #DDDDDD;
      }
    }

  }
</style>
