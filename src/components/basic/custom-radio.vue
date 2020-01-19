<template>
  <div id="CustomRadio">
    <div :style="{width: `${size}px`}" class="custom-radio" :class="{'custom-radio--active': selected}"
    >
      <div :style="{fontSize: `${size}px`}" class='custom-radio__wrapper'>
        <i :style="{color, fontSize: `${size}px`}" class='iconfont icon-wanchenggouxuan2 custom-radio-icon'/>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "CustomRadio",
    props: {
      size: {
        default: 30
      },
      color: {
        default: "red"
      },
      selected: {
        type: Boolean,
        default:true
      }
    },
    data() {
      return {}
    },
    methods: {},
    computed: {},
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #CustomRadio {

    .custom-radio {
      position: relative;
      $blockName: "custom-radio";
      &:after {
        display: block;
        content: "";
        padding-bottom: 100%;
      }
      &__wrapper {
        @include absoluteFull;
        @include flex-center;
        border-radius: 50%;
        overflow: hidden;
        background: #fff;
        &:after {
          @include absoluteFull;
          border: 0.06em solid rgb(236, 236, 236);
          border-radius: 50%;
          box-sizing: border-box;
          content: "";
          display: block;
        }
      }
      &-icon {
        visibility: hidden;
      }
      &--active {
        .#{$blockName}__wrapper:after {
          display: none;
        }
        .#{$blockName}-icon {
          visibility: visible;
        }
      }
    }

  }
</style>
