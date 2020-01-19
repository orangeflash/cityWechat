<template>
  <div id>
    <Header :childrenTitle="'口碑' + this.storeConfig.field" moreName="排行榜说明" @onMore="rankingExplain"></Header>
    <div id="rankingList">
      <div class="ranking">
        <div class="rankingButton">
          <div
            class="rankingButtonList"
            v-for="(item,index) in buttonList"
            :key="index"
            v-on:click="clickList(item.id)"
            :style="item.img"
            :class="selectId==item.id?'selectClass':''"
          >{{item.name}}
          </div>
        </div>

        <div class="dataList">
          <div class="listChildren" v-for="(item,index) in rankingList" :key="index">
            <div class="rankingIndex" v-if="index>2"></div>
            <div class="rankingIndexFuck index0" v-if="index==0"></div>
            <div class="rankingIndexFuck index1" v-if="index==1"></div>
            <div class="rankingIndexFuck index2" v-if="index==2"></div>
            <div class="listIndex" v-if="index>2">{{index+1}}</div>
            <div class="listLogo">
              <img :src="getPathByAssetPath(item.storeLogo[0].url)">
            </div>
            <div class="shopName">
              <p class="storeName">{{item.storeName}}</p>
              <p class="storeHot">{{selectId==1?item.popularity:selectId==2?item.followNum:''}}
                <span v-if="selectId==1">人气</span>
                <span v-if="selectId==2">人已关注</span>
                <span v-if="selectId==3" style="color: transparent">11111</span>
              </p>
            </div>
            <div
              class="enterShop"
              @click="goPage({path:'/shopDetail',query:{storeId:item.id}})"
            >进店
            </div>
          </div>
        </div>
        <van-popup v-model="show" class="popupPact" position="right">
          <p class="pactBody" v-html="system.body"></p>
          <div class="cancel" @click="show=!show">
            <span class="cancel-text">我已知晓</span>
          </div>
        </van-popup>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import Header from "@/components/header";
  import {updateShareConfig} from "../../util/wechat-util";

  export default {
    components: {
      Header
    },
    data() {
      return {
        selectId: 1,
        system: "",
        show: false,
        buttonList: [
          {
            name: "关注排行",
            id: "2",
            img: {
              backgroundImage:
                "url(" +
                require("../../assets/img/business-district/ranking/ranking.png") +
                ")",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%"
            }
          },
          {
            name: "人气排行",
            id: "1",
            img: {
              backgroundImage:
                "url(" +
                require("../../assets/img/business-district/ranking/hot.png") +
                ")",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%"
            }
          },
          {
            name: "品质商家",
            id: "3",
            img: {
              backgroundImage:
                "url(" +
                require("../../assets/img/business-district/ranking/store.png") +
                ")",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100%"
            }
          }
        ],
        rankingList: []
      };
    },
    computed: {
      ...mapState("common", {
        storeConfig: state => state.storeConfig,
      }),
    },
    methods: {
      ...mapActions("businessDistrict", [
        "getStoreRanking",
        "getStoreCastGory"
      ]),
      // 顶部按钮的点击事件
      clickList(e) {
        this.selectId = e
        this.changeList(e);
      },
      goStoreInfo(e) {
        console.log(e);
      },
      goPage(param) {
        this.goPointPage({
          obj: this,
          ...param
        });
      },
      rankingExplain(e) {
        console.log("这是点击说明");
        this.show = !this.show;
      },
      // 改变排序
      async changeList(e) {
        let rankingList = this.rankingList;
        rankingList = await this.getStoreRanking({type: e});
        for (let i in rankingList) {
          rankingList[i].storeLogo = JSON.parse(rankingList[i].storeLogo);
        }
        this.rankingList = rankingList;
      }
    },
    async created() {
      document.title = '口碑' + this.storeConfig.field
      this.changeList(1);
      //    动态改变顶部按钮的文字
      let system = await this.getStoreCastGory();
      console.log("执行没", system);
      this.buttonList[0].name = system.followName || "关注商家";
      this.buttonList[1].name = system.popularityName || "人气商家";
      this.buttonList[2].name = system.qualityName || "口碑商家";
      this.system = system;
      updateShareConfig({
        title: system.title,
        imgUrl: system.shareImg,
        desc: system.shareDescription,
      })
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/common";

  #rankingList {
    background-image: url("../../assets/img/business-district/ranking/rankingBack.png");
    background-repeat: no-repeat;
    background-size: 100%;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    .selectClass {
      font-size: 34px;
      margin-top: -30px;
    }

    .ranking {
      width: 100%;
      height: 100%;
      padding: 255px 20px 30px 0px;
      display: flex;
      flex-direction: column;
    }

    .popupPact {
      width: 100%;
      border-radius: 8px;
      height: 100%;
      background-color: #f9f9f9;
    }

    .pactBody {
      line-height: 40px;
      margin-top: 20px;
      overflow-y: scroll;
      min-height: 90%;
      padding: 0 30px;
      font-size: 30px;
      height: calc(100vh - 150px);
    }

    // .doc {
    //     color: $themeColor;
    // }

    .cancel {
      width: 100%;
      height: 100px;
      text-align: center;
      color: #fff;
      position: absolute;
      background-color: #fff;

      .cancel-text {
        display: inline-block;
        text-align: center;
        height: 60px;
        line-height: 60px;
        padding: 5px 0px;
        width: 80%;
        font-size: 28px;
        background-color: $themeColor;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        bottom: 50%;
        transform: translate(-50%, 50%);
      }
    }

    .rankingButton {
      width: 100%;
      height: auto;
      display: flex;
      flex-grow: 0;
      flex-wrap: nowrap;
      margin-bottom: 50px;

      .rankingButtonList {
        line-height: 70px;
        text-align: center;
        color: #fff;
        font-weight: bold;
        font-size: 30px;
        justify-content: center;
        align-items: center;
        width: 180px;
        margin-left: 7.2%;
        height: 90px;
        background-image: url("../../assets/img/business-district/ranking/ranking.png");
        background-repeat: no-repeat;
        background-size: 100%;
      }
    }

    .dataList {
      flex-grow: 1;
      width: 100%;
      flex-shrink: 1;
      height: auto;
      padding-bottom: 300px;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    .listChildren {
      width: 90%;
      margin: 30px auto 0;
      height: 188px;
      position: relative;
      background-image: url("../../assets/img/business-district/ranking/listBack.png");
      background-repeat: no-repeat;
      background-size: 100%;
      display: flex;
      align-items: Center;

      .rankingIndex {
        position: absolute;
        width: 71px;
        height: 88px;
        top: -7px;
        left: 22px;
        background-size: 100%;
        background-image: url("../../assets/img/business-district/ranking/rankingIndex.png");
      }

      .rankingIndexFuck {
        position: absolute;
        width: 120px;
        height: 102px;
        top: -40px;
        left: 0px;
        background-size: 100%;
      }

      .index0 {
        background-image: url("../../assets/img/business-district/ranking/one.png");
      }

      .index1 {
        background-image: url("../../assets/img/business-district/ranking/two.png");
      }

      .index2 {
        background-image: url("../../assets/img/business-district/ranking/three.png");
      }

      .listIndex {
        position: absolute;
        top: 26px;
        left: 22px;
        width: 54px;
        font-size: 30px;
        text-align: center;
        color: #fff;
      }

      .listLogo {
        max-width: 60%;
        height: 100px;
        margin-left: 100px;
      }

      .listLogo img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }

      .shopName {
        padding-left: 20px;
        max-width: 38%;

        .storeName {
          font-size: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .storeHot {
          font-size: 25px;
          padding-top: 20px;
          color: red;
        }
      }

      .enterShop {
        width: 122px;
        height: 46px;
        float: right;
        background-size: 100%;
        background-image: url("../../assets/img/business-district/ranking/placehodel.png");
        position: absolute;
        right: 4%;
        line-height: 47px;
        text-align: center;
        color: #fff;
      }
    }
  }
</style>
