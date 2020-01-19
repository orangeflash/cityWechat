<template>
  <div id="EditTabText">
    <van-field
      class="text-area"
      v-model="inputVal"
      type="textarea"
      placeholder="请输入您要发布的内容"
      rows="5"
    />
    <section class="input__wrap">
      <input placeholder="请在此处黏贴公众号文章链接" v-model="weChatUrl" class="input" type="text">
    </section>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'

  export default {
    name: "EditTabText",
    props: {
      editForm: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        inputVal: "",
        weChatUrl: ""
      }
    },
    methods: {
      getFormData() {
        return {
          wechatUrl: this.weChatUrl,
          body: this.inputVal.replace(/\n/g, "↵")
        }
      },
      initForm() {

        const v = JSON.parse(JSON.stringify(this.editForm)).body
        // console.log(v,this.editForm)
        this.inputVal = v&&v.replace(/↵/g, "\n");
        this.weChatUrl = this.editForm.wechatUrl
      }
    },
    computed: {},
    created() {
      this.editForm&&this.initForm();
    }
  }
</script>

<style scoped lang="scss">
  #EditTabText {
    margin-top: 16px;
    background-color: #fff;
    .text-area:after {
      display: none;
    }
    .input__wrap {
      width: 100%;
      display: flex;
      height: 90px;
      border-top: 1PX solid #DDDDDD;
      .input {
        flex: 1;
        margin-left: 30px;
        outline: none;
        border: 0;
        font-size: 28px;
        color: #333333;
      }
      .input::-webkit-input-placeholder {
        font-size: 24px;
        line-height: 1.5;
        color: #999999;
      }
    }
  }
</style>
