<template>

  <div class="dd-form-textarea flex-bt pad-20">
    <textarea v-model="v"
              @input="$emit('input',v)"
              :placeholder="placeholder"
              :style="{'height':(height||300)/100+'rem','background':bg||'#fff'}"
    ></textarea>
  </div>

</template>

<script>

  export default {
    props: ['placeholder', 'value', 'height', 'bg'],
    data() {
      return {
        v: ''
      }
    },
    watch: {
      value(newValue) {
        this.v = newValue;

      }
    },
    created() {
      this.v = this.value;
    }
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-form-textarea {
    textarea {
      border: none;
      width: 100%;
      resize: none;
      outline: none;
      line-height: 40px;
    }
  }

</style>
