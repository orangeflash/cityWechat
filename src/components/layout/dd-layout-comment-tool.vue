<template>
  <div>
    <div class="dh-68 pad-b-15 w100"></div>
    <div class="posi-f b0 l0 r0">
      <div class="dh-80 pad-lr bg-f flex-y-center pad-t-15 pad-b-15 " v-if="!showArea">
        <div class="flex-g-1 pad-lr bg-e br-r-34">
          <input class="out-n w100 dh-68 bg-e fon-xl br-n" readonly @click="show" placeholder="写评论"/>
        </div>
        <ul class="flex-y-center col-6 t-c">
          <li class="flex-g-1 mar-l mar-r w-60" @click="$emit('click',0)">
            <div class="mar-b-10">
              <i class="iconfont " :class="isLike?'icon-buoumaotubiao16 col-t':'icon-buoumaotubiao15'"></i>
            </div>
            点赞
          </li>
          <li class="flex-g-1 mar-l mar-r w-60" @click="$emit('click',1)">
            <div class="mar-b-10">
              <i class="iconfont icon-fenxiang-tianchong"></i>
            </div>
            分享
          </li>
          <li class="flex-g-1 mar-l w-60" @click="$emit('click',2)">
            <div class="mar-b-5">
              <i class="iconfont icon-shouyexian fon-40"></i>
            </div>
            首页
          </li>
        </ul>
      </div>
      <div v-show="showArea">
        <div class="bg-0-5 posi-f t0 l0 b0 r0" @click="show"></div>
        <div class="posi-r bg-f pad-lr pad-t">
          <div class="bg_search_bg  pac-b pad-t pad-lr br-r-30">
            <textarea v-model="comment" :autofocus="autofocus" ref="textarea"
                      class="h-277 resize-n pad-0 br-n lineH-40 bg-tran w100 fon-xl  dis-b posi-r"
                      placeholder="留下你的足迹~"></textarea>
          </div>
          <div class="flex-bt dh flex-y-center">
            <span class="col-9 fon-wb fon-xll" @click="show">取消</span>
            <span class="col-t fon-wb fon-xll" @click="commentHandle">发送</span>
          </div>
        </div>
      </div>
    </div>


  </div>

</template>


<script>

  import {showDialog, showHandleStatusByFlag} from "../../util";

  export default {
    props: {
      isLike: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        showArea: false,
        comment: '',
        autofocus: false,
      }
    },
    methods: {
      show() {
        this.showArea = !this.showArea;
        console.log("this.$refs.textarea",this.$refs.textarea)
        this.$refs.textarea.focus();
        this.$refs.textarea.select();
      },
      commentHandle() {
        if (this.comment.trim()) {
          this.$emit('comment', this.comment);
          this.show();
        } else {
          showDialog("请输入您的评论", '提示', false)
        }
      }
    }
  }

</script>
