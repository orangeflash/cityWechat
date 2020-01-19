<template>
  <div id="albums">
    <div class="albums-box">
      <ul class="albums-list">
        <li class="albums-single"
            v-for="(item,key) in pictures"
            :class="{'center': key%3 == 1}"
            :key="key" @click="showImage(item.url)">
          <img-wrapper :src="item.url"></img-wrapper>
        </li>
      </ul>
    </div>
    <div class="albums-footer">
      <button @click="$router.back(-1)">我知道了</button>
    </div>
  </div>
</template>

<script>


  export default {
    name: "album",
    ports: ['pictures', 'callBack'],
    data() {
      return {}
    },
    methods: {
      showImage(src) {

        let srcs = [];
        if (typeof this.pictures == 'object') {
          srcs = this.pictures.map(item => {
            return item.url;
          })
        } else {
          srcs = this.pictures;
        }
        this.previewImage(src, srcs)
      }
    },
    created() {
      console.log("============== Album this.$route.query===============")
      if (this.$route.query.pictures) {
        this.pictures = this.$route.query.pictures
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../assets/common";

  #albums {
    .albums-box {
      position: fixed;
      top: 0;
      width: 100%;
      bottom: 90px;

      ul {

        display: flex;
        flex-wrap: wrap;
        /*justify-content: space-between;*/
        padding: 20px 20px 150px;

        li {
          width: 220px;
          height: 220px;
          margin: 0 5px 20px 5px;
          border-radius: 8px;
          background-color: #fff;
          border: 1.1px solid #eee;
        }
      }
    }

    .albums-footer {
      position: fixed;
      width: 100%;
      bottom: 0;
      background-color: #fff;
      display: flex;
      align-items: center;
      height: 90px;

      button {
        background-color: $themeColor;
        color: #fff;
        font-size: 28px;
        height: 72px;
        width: 94%;
        display: block;
        margin: 0 auto;
        border-radius: 8px;
      }
    }
  }


</style>
