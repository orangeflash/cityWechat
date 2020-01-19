<template>

  <!--评论订单-->
  <div class="order-comment" v-if="commentList.length>0">
    <div
      v-for="(item,key) in commentList"
      :key="key"
    >
      <div class="order-comment_rate">

        <div class="goods-info">
          <div class="goods-info_cover">
            <img-wrapper :src="item.goodsCover"></img-wrapper>
          </div>
          <div class="goods-info_text">
            <h3 class="goods-info_text_title">{{item.name}}</h3>
            <p class="goods-info_text_spec">{{item.data}}</p>
          </div>
        </div>
        <van-rate v-model="item.star" :size="30"/>
        <p>觉得怎么样，打个分吧</p>
      </div>
      <div class="order-comment_txt">
      <textarea
        v-model="item.body"
        placeholder="亲，在这家店消费还满意吗？店家的环境和服务如何？"></textarea>
        <photo-body
          @change-img="changeImgTwo"
          max="3"
          :mark="key"
        ></photo-body>
      </div>
    </div>
    <div class="button">
      <dd-button
        type="release"
        name="提 交"
        :radius="true"
        @click="releaseComment"
      ></dd-button>
    </div>
  </div>

</template>

<script>

  import DdButton from "@/components/template/button"
  import {chooseImage, uploadImage} from "@/util/wechat-util";
  import PhotoBody from '@/components/template/mall/release-photo/photo-body'
  import {mapActions} from 'vuex';

  import {Toast} from 'vant'
  import {hideLoading, showLoading} from "../../../util";

  export default {
    components: {DdButton, PhotoBody},
    data() {
      return {
        commentList: [],     //评论集
        mapImg: [],
        params: {
          star: 0,
          img: [],
          body: '',
          goodsId: null,
          storeId: 0,
        }
      }
    },
    methods: {
      ...mapActions('mall', ['mallSaveComment']),
      ...mapActions("common", ["getWxUpload"]),
      changeImgTwo(e, mark) {
        this.commentList[mark].img = this.mapImg[mark] = e;
        console.log(e, mark)
      },
      // 删除图片
      deletePic(index, mark) {

        this.mapImg[mark].splice(index, 1);

        this.commentList[mark].img = this.mapImg[mark]
      },
      async upload(img) {
        // 图片进行上传并返回结果集
        // const promiseArr = this.imgs.map(async item => {
        //   // 上传 返回 图片的id
        //   const {serverId} = await uploadImage(item);
        //   // 上传给服务器 ，并返回本服务器的图片路径
        //   const {data} = await this.getWxUpload({mediaId: serverId});
        //   // 返回给后台的图片格式
        //   return {
        //     type: "img",
        //     url: data
        //   }
        // });
        // this.params.img = await Promise.all(promiseArr);
        let promiseArr= img.map(async (item) => {
          const url=await this.getWxUpload({mediaId:item})
          return {
            type: 'img',
            url: url.data
          }
        })
        let arr=await Promise.all(promiseArr);
        return arr;
      },
      async releaseComment() {
        let rank = false;
        this.commentList.forEach(comment => {
          if (comment.star <= 0) {
            rank = true;
          }
        })


        if (rank) return Toast({
          message: '打个分吧',
          duration: 1500
        });
        for (let comment of this.commentList) {
          if (comment.img.length > 0) {
            showLoading("图片上传中...");
            comment.img = await this.upload(comment.img);
          }
        }
        showLoading("正在提交...")

        for (let comment of this.commentList) {
          const res = await this.mallSaveComment(comment);
          if (isNaN(Number(res.data))) {
            Toast.fail({
              message: res.msg,
              duration: 1500
            })
          } else {
            Toast.success({
              message: '评论成功',
              duration: 1500
            });
            setTimeout(() => {
              this.$router.go(-1);
            }, 1500)
          }
        }
        // showLoading("正在提交...")
        // const res = await this.mallSaveComment(this.params);
        // if (isNaN(Number(res.data))) {
        //   Toast.fail({
        //     message: res.msg,
        //     duration: 1500
        //   })
        // } else {
        //   Toast.success({
        //     message: '评论成功',
        //     duration: 1500
        //   });
        //   setTimeout(() => {
        //     this.$router.go(-1);
        //   }, 1500)
        // }
      }
    },
    created() {
      const query = this.$route.query;
      let tips = null;

      console.log(query);


      if (!query.mapGoods) tips = '缺少商品信息';
      if (tips) {
        Toast.fail({
          message: tips,
          duration: 1500
        })
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      } else {

        if (query.mapGoods.constructor === Array) {
          this.commentList = query.mapGoods.map(item => {
            this.mapImg.push([]);
            const goodsCover = item.img;
            item.img = [];
            return {
              star: 0,
              img: [],
              body: '',
              goodsCover,
              ...item
            }
          });
        } else {
          this.$router.go(-1);
        }
      }
    }

  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .order-comment {
    padding-bottom: 100px;
    background: #fff;
    min-height: calc(100%);

    &_rate {
      text-align: center;
      padding: 30px 30px 50px;
      border-bottom: 1.1px solid #E5E5E5;

      p {
        color: #999;
        margin-top: 30px;
      }
    }

    &_txt {
      margin: 30px;
      border-bottom: 1.1px solid #E5E5E5;
      padding-bottom: 30px;

      textarea {
        width: 100%;
        height: 150px;
        border: none;
        resize: none;
        font-size: 26px;
        line-height: 36px;
      }

      .picture-list {
        display: flex;
        flex-wrap: wrap;

        .choice {
          border: 1PX dashed $themeColor;
          width: 132px;
          height: 132px;
          color: $themeColor;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 18px;
          margin: 10px 30px 20px 0;

          div {
            i {
              font-size: 56px;
            }
          }
        }

        .picture-box {
          border: 1.1px solid $themeColor;
          position: relative;
          z-index: 0;

          > i {
            position: absolute;
            right: 15px;
            top: -15px;
            font-size: 0.36rem;
            width: 0;
            height: 0;
            border-radius: 50%;
          }

          > div {
            width: 132px;
            height: 132px;
            overflow: hidden;
          }
        }
      }
    }

    .button {
      margin: 0 30px;
    }

    .goods-info {
      display: flex;
      margin-bottom: 30px;

      &_cover {
        width: 80px;
        height: 80px;
        overflow: hidden;
        margin-right: 30px;
        border-radius: 10px;
      }

      &_text {
        width: calc(100% - 110px);
        text-align: left;

        h3 {
          height: 40px;
          overflow: hidden;
          line-height: 0.4rem;
        }

        > p {
          background: #eee;
          color: #999;
          display: inline-block;
          padding: 8px 10px 4px;
          border-radius: 4px;
          margin-top: 5px;
        }
      }

    }
  }


</style>
