<template>
  <div class="dd-card-three mar-30">
    <div v-if="!ifCard" class="not-card">
      <div>
        <p>还没有自己的名片</p>
        <span class="flex-center" @click="goPointPage({path:'/auxiliary/card/createCard'})">点击拥有名片</span>
      </div>
    </div>

    <div v-else="ifCard">
      <div v-if="!iCard">
        <div class="card-info posi-r" v-if="cardInfo">
          <StatusStamp :data="cardInfo"/>
          <div class="dd-card-three_up flex flex-bt">
            <user-info

              size="44"
              :src="cardInfo.logo&&cardInfo.logo.length&&getSingleImg(cardInfo.logo[0].url)"
              border-radius="44"
              :name="cardInfo.name"
              :info="`${cardInfo.department || ''}·${cardInfo.position || ''}`"
              fontSize="36"
              infoColor="#999"
            ></user-info>
            <div class="flex-y-end ">
              <span class="col-t fon-b">{{cardInfo.company}}</span>
            </div>
          </div>
          <div class="dd-card-three_center">
            <ul class="row-list">
              <li class="row flex-y-center"><i class="iconfont icon-dianhua5"></i><span>{{cardInfo.tel}}</span></li>
              <li class="row flex-y-center"><i class="iconfont icon-dizhi3"></i><span>{{cardInfo.address}}</span></li>
              <li class="row flex-y-center" v-show="whichCard">{{`“${cardInfo.body}”`}}</li>

            </ul>
          </div>
          <div class="attr  flex flex-x-bt pad-30" v-show="whichCard">
            <span>关注：{{cardInfo.followNum>0?cardInfo.followNum:0}}</span>
            <span>点赞：{{cardInfo.loveNum>0?cardInfo.loveNum:0}}</span>
            <span>人气：{{cardInfo.viewNum>0?cardInfo.viewNum:0}}</span>
            <span>转发：{{cardInfo.shareNum>0?cardInfo.shareNum:0}}</span>
          </div>
        </div>


      </div>

      <div v-else class="not-card">
        <div>
          <button class="flex-center" @click="clickCard">继续创建名片</button>
          <p class="mar-t">最多可拥有9张名片</p>
        </div>
      </div>
      <div class="dd-card-three_down" v-show="!whichCard">{{cardInfo.body}}</div>

    </div>

  </div>


</template>

<script>

  import UserInfo from "@/components/template/user";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {showDialog} from "../../../util";
  import StatusStamp from "@/components/template/status-stamp";


  export default {
    props: {
      //
      ifCard: {
        type: Boolean,
        default: false
      },
      //
      iCard: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      cardInfo: {
        type: Object,
        default: Object
      },
      whichCard: {
        type: Boolean,
        default: true,
      },
    },
    components: {UserInfo,StatusStamp},
    data() {
      return {
        events: "",
      }
    },
    methods: {
      clickCard() {
        console.log(this.disabled)
        if (this.disabled) {
          showDialog('你最多只能添加9张名片', '温馨提示', false)
        } else {
          this.goPointPage({path: '/auxiliary/card/createCard'})
        }
      },
    },
    async created() {

    },
    mixins: [utilMixins],
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .dd-card-three {


    min-height: 4rem;
    box-shadow: 0px 0px 10px 0px rgba(221, 221, 221, 0.64);
    border-radius: 14px;
    background-color: #fff;

    .card-info {
      background: url('../../../assets/img/yellow-page/card_bg.png') no-repeat;
      background-size: 100% 100%;

    }

    .attr {
      margin: 20px;
      padding-bottom: 70px;
      color: #999;
    }

    &_up {
      padding: 30px;
      border-bottom: 1px solid #eee;
    }

    &_center {
      .row-list {
        padding-top: 20px;
        padding-bottom: 30px;


        .row {
          padding: 10px 30px;
          font-size: 28px;
          color: #666;

          i {
            font-size: 36px;
            margin-right: 10px;
            height: 34px;
          }
        }
      }

    }

    &_down {
      padding: 60px 30px 50px;
      line-height: 36px;
      text-align: center;
      font-size: 28px;
      color: #999;
    }

    .not-card {
      display: flex;
      justify-content: center;
      padding-top: 100px;
      font-size: 28px;
      height: 230px;
      background: url('../../../assets/img/yellow-page/card_bg.png') repeat;
      background-size: 100% 100%;

      p {
        margin-bottom: 50px;
        color: #999;
        text-align: center;
      }

      button {
        padding: 0 40px;
        height: 70px;
        border: 1.1px solid #999;
        border-radius: 40px;
        background: rgba(255, 255, 255, 1);
      }
    }
  }
</style>
