<template>
  <div v-if="name"
       v-bind="getParams"
       @click="$emit('click')"
       class="br-r-4 dis-ib mar-r-15 mar-b-10">
    {{name}}
  </div>

</template>

<script>

  export default {
    props: {
      name: {
        type: String,
        default: null,
      },
      fill: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        default: 'warning'
      },
      size: {
        type: String,
        default: 'mini'
      },
      round: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: null
      }
    },
    computed: {
      getParams() {

        let className = '', style = {};
        if (this.size == 'mini') className += 'pad-10-10-4  fon-xs '
        else if (this.size == 'small') className += 'pad-12-20-10 fon-sm '
        else if (this.size == 'large') className += 'pad-16-30-14 fon-lg '

        if (this.fill) {
          className += 'col-f '
          if (this.color) {
            style.backgroundColor = this.color;
            style.border = `0.011rem solid ${this.color}`
          } else {
            if (this.type == 'warning') className += 'bg-warm br-warm '
            else if (this.type == 'danger') className += 'bg-danger br-danger '
            else if (this.type == 'primary') className += 'bg-t br-t '
            else if (this.type == 'success') className += 'bg-success br-success '
            else if (this.type == 'ash') className += 'bg-ash br-ash '
          }
        } else {

          if (this.color) {
            style.color = this.color;
            style.border = `0.011rem solid ${this.color}`
          } else {
            if (this.type == 'warning') className += 'col-warm br-warm '
            else if (this.type == 'danger') className += 'col-danger br-danger '
            else if (this.type == 'primary') className += 'col-t br-t '
            else if (this.type == 'success') className += 'col-success br-success '
            else if (this.type == 'ash') className += 'col-ash br-ash '
          }
        }

        return {'class': className, style};

      }
    }
  }


</script>
