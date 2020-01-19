<template>

  <!--评论模版-->
  <div class="dd-comment">
    <div class="dd-comment_up">
      <div class="dd-comment_up_user">
        <span>{{comment.userName}}：</span>
        <van-rate v-model="+comment.star" readonly :size="15"/>
      </div>
      <div class="dd-comment_up_time">{{computedDate(comment.createdAt)}}</div>
    </div>
    <div class="dd-comment_center" v-html="comment.body"></div>
    <div class="dd-comment_down" v-if="comment.img.length>0">
      <ul class="dd-comment_down_pics">
        <li
          v-for="(item,key) in comment.img"
          :key="key"
        >
          <dd-layout-img :fillet="0.08" :src="getSingleImg(item.url)" @click="previewImage(getSingleImg(item.url),comment.img.map(img=>getSingleImg(img.url)))" :width="1.56" :height="1.56"/>
        </li>
      </ul>

    </div>
  </div>


</template>

<script>
  import {utilMixins} from "@/plugins/util-mixins";
  import DdLayoutImg from "../../layout/dd-layout-img";

  export default {
    components: {DdLayoutImg},
    props: ['comment'],
    mixins: [utilMixins],
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-comment {
    padding: 30px 0;
    margin: 0 30px;
    border-bottom: 1.1px solid #ddd;

    &_up {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &_user {
        display: flex;
        align-items: center;
        font-size: 30px;
      }

      &_time {
        color: #999;
      }
    }

    &_center {
      margin: 20px 0;
      font-size: 26px;
      line-height: 42px;
    }

    &_down {

      &_pics {
        display: flex;
        flex-wrap: wrap;

        li {
          width: 172px;
          height: 172px;
        }
      }
    }
  }
</style>
