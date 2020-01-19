<template>
  <van-popup
    position="bottom"
    v-model="pickerShow">
    <van-picker
      show-toolbar
      value-key="name"
      @change="pickerChangeHandle"
      :title="title"
      :columns="getColumns"
      @confirm="pickerConfirm"
      @cancel="(pickerShow = !pickerShow) && $emit('input', false)"
    />
  </van-popup>

</template>

<script>

  export default {
    props: {
      columns: {
        type: Array,
        default: [],
      },
      title: {
        type: String,
        default: ''
      },
      value: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        pickerShow: false,
        itemColumns: [],
      }
    },
    watch: {
      value(newVal) {

        this.pickerShow = newVal
      },
      pickerShow(newVal) {

        if (newVal != this.value) {
          this.$emit('input', newVal)
        }
      },
      columns(newVal) {

      }
    },
    computed: {
      getColumns() {
        if (this.columns.length && this.getType(this.columns[0]) == 'json' && this.columns[0].son) {

          this.itemColumns = [
            {
              values: this.columns.map(item => item.name)
            },
            {
              values: this.columns[0].son.map(
                item => item.tradeName || item.name
              ),
              defaultIndex: 0
            }
          ];
          return this.itemColumns
        } else if (this.getType(this.columns[0]) == 'json') {
          return this.columns.map(item => {
            return item.name;
          })
        }
        return this.columns;
      }
    },
    methods: {
      pickerConfirm(values) {

        if (this.columns.length) {
          if (values.length > 1 && this.getType(values) == 'array') {
            const data = _.find(this.columns, {
                name: values[0]
              }),
              children = _.find(data.son, {
                name: values[1]
              })
            this.$emit('click', {
              name: 'picker',
              value: {Pid: data.id, id: children.id, type: 'confirm', txt: values.join(" ")}
            })
          } else {
            this.$emit('click', {
              name: 'picker', value: {
                ..._.find(this.columns, {
                  name: values
                }), type: 'confirm'
              }
            })
          }
        }
        this.$emit('input', false)
      },
      //公用pickerchange事件
      pickerChangeHandle(picker, values, index) {
        if (values.length > 1) {
          const res = picker.setColumnValues(
            1, _.find(this.columns, {
              name: values[0]
            }).son.map(item => item.name));
        }
      },
    }
  }

</script>
