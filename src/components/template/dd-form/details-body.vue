<template>

  <dd-form-chunk :title="title">
    <div slot="content">
      <dd-form-textarea
        v-model="details"
        @input="$emit('input',details)"
        class="pad-30 fon-b br-n"
        :height="height"
        :placeholder="placeholder"/>
      <photo-body
        @change-img="(e)=>$emit('change',e)"
        @click="(e)=>$emit('click',e)"
        :max="4"
        :photo-list="pictures"
        :deliver="deliver"
      ></photo-body>
    </div>
  </dd-form-chunk>


</template>

<script>
  import DdFormChunk from "@/components/template/dd-form/chunk"
  import DdFormTextarea from "@/components/template/dd-form/textarea"
  import PhotoBody from '@/components/template/mall/release-photo/photo-body'

  export default {
    components: {DdFormChunk, DdFormTextarea, PhotoBody},
    props: {
      value: {
        type: String,
        default: '',
      },
      deliver: {
        type: Boolean,
        default: false,
      },
      pictures: {
        type: Array,
        default() {
          return []
        },
      },
      placeholder: {
        type: String,
        default: '请输入...',
      },
      height: {
        type: Number,
        default: 150
      },
      title: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        details: '',
      }
    },
    watch: {
      value(newValue) {
        this.details = newValue
      },
    },
    created() {
      this.details = this.value;
    }
  }

</script>
