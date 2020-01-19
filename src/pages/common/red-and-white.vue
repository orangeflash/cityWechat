<template>
  <div class="red-and-white">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->

    <!--<em class="my-bag">我的红包</em> -->
    <div class="backdrop">
      <img-wrapper :src="backdrop" />
    </div>
    <div class="user">
      <div class="announcer-img">
        <img-wrapper :src="postDetail.portrait"/>
      </div>

      <strong class="user-name">{{postDetail.userName}}<br/>埋了一个红包</strong>
    </div>
    <p class="red-bag-info">共<em class="info-num">{{moneyInfo.allcount}}</em>个红包，已抢 <em class="info-num">{{moneyInfo.getcount}}</em>个，还剩<em
      class="info-num"> {{parseInt(moneyInfo.allcount)-parseInt(moneyInfo.getcount)}} </em>个</p>
    <ul class="pick-up-list">
      <li class="pick-up-item" v-for="item in moneyInfo.data" :key="item.id">
        <div class="info-box-header">
          <div class="recipients">
            <img-wrapper :src="item.portrait" />
          </div>

          <div class="info-mid">
            <em class="nick-name">{{item.userName}}</em>
            <em class="time-go">{{computedDateInfo(+item.creatTime)}}</em>
          </div>
        </div>
        <strong class="info-end">{{item.money}}元</strong>
      </li>
    </ul>
  </div>
</template>

<script>
  import backdrop from "../../assets/img/post-datail/backdrop.png"
  import {mapState, mapActions} from "vuex"
  import {computedDate} from "../../util/index"
  import Header from "@/components/header";

  export default {
    name: "redAndWhite",
    components: {Header},
    data() {
      return {
        backdrop,
        postDetail: '',
        moneyInfo: '',
      }
    },
    methods: {
      ...mapActions("post", ["getRedListById", 'getPostDetailById']),
      async getPostDetail() {
        const {data} = await this.getPostDetailById({
          postId: this.$route.query.postId
        })
        this.postDetail = data[0]
      },
      async getRedBagList() {
        const data = await this.getRedListById({
          postId: this.$route.query.postId
        });
        this.moneyInfo = data
      },
      computedDateInfo(time) {
        return computedDate(time)
      },
    },
    created() {
      this.getPostDetail();
      this.getRedBagList();
    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/theme";
  @import "../../assets/common";

  .red-and-white {
    padding: 0px;
    background: linear-gradient(0deg, rgba(219, 66, 58, 1) 0%, rgba(209, 53, 46, 1) 100%);
    height: 100%;
    position: fixed;
    width: 100%;
  }

  .backdrop {
    width: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 0;
  }

  .my-bag {
    font-size: $font-size-base;
    color: rgba(255, 236, 93, 1);
    display: block;
    text-align: right;
    padding: 30px 30px 0px 0px;
    z-index: 99;
    position: relative;
  }

  .user {
    position: relative;
    z-index: 20;
    left: 50%;
    top: 50px;
    transform: translate(-50%);
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  .announcer-img {
    width: 124px;
    height: 124px;
    // display: block;
    margin: 0 auto;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 7px 3px rgba(211, 68, 59, 0.31);
    border-radius: 50%;
    overflow: hidden;
    vertical-align: middle;
  }

  .user-name {
    font-size: 36px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    line-height: 60px;
    text-shadow: 0px 2px 7px rgba(211, 68, 59, 1);
  }

  .red-bag-info {
    position: relative;
    z-index: 10;
    display: inline-block;
    line-height: 60px;
    color: #fff;
    font-size: $font-size-sm;
    top: 50px;
    left: 50%;
    white-space: nowrap;
    text-align: center;
    transform: translateX(-50%);

    &:after {
      content: '';
      display: inline-block;
      width: 136px;
      height: 1PX;
      background: rgba(255, 255, 255, .6);
      vertical-align: middle;
      margin-left: 10px;
    }

    &:before {
      content: '';
      display: inline-block;
      width: 136px;
      height: 1PX;
      background: rgba(255, 255, 255, .6);
      vertical-align: middle;
      margin-right: 10px;
    }
  }

  .info-num {
    color: #ffec5d;
    font-size: $font-size-sm;
    /*opacity: 1;*/
  }

  .pick-up-list {
    margin-top: 60px;
    position: fixed;
    width: calc(100% - 60px);
    padding: 30px;
    height: calc(100% - 500px);
    overflow: scroll;
  }

  .pick-up-item {
    height: 142px;
    background: rgba(255, 255, 255, 1);
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 30px;
    margin-top: 20px;
  }

  .recipients {
    width: 96px;
    height: 96px;
    background: rgba(93, 178, 113, 1);
    border-radius: 50%;
  }

  .info-box-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .info-mid {
    display: flex;
    flex-direction: column;
    margin-left: 20px;

    .nick-name {
      font-size: $font-size-lg;
      color: rgba(51, 51, 51, 1);
      line-height: 48px;
    }

    .time-go {
      font-size: $font-size-xs;
      color: rgba(153, 153, 153, 1);
      line-height: 48px;
    }
  }

  .info-end {
    float: right;
    font-size: 36px;
    font-weight: bold;
    color: rgba(255, 79, 61, 1);
    line-height: 48px;
  }
</style>
