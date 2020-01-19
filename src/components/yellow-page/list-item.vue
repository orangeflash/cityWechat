<template>
  <div id="ListItem">
    <ul>
      <li
        class="borderBottom"
        v-for="(item,index) in Store"
        :key="index"
        @click="yellowInfo(item.id)"
      >
        <div class="pageList">
          <div class="listHead">
            <div class="flex-grow-1 flex-y-center">
              <!-- 黄页的logo -->
              <div class="listImg dis_in vertical">
                <img
                  v-if="item.logo!=null&&item.logo.length>0"
                  :src="getPathByAssetPath(item.logo[0].url)"
                  alt
                >
              </div>
              <!-- 黄页名字——类型——浏览量 -->
              <div class="dis_in vertical">
                <p class="vertical listName">
                  {{item.name}}
                  <!-- 是否入驻过商家 -->
                  <i
                    class="iconfont icon-dian"
                    v-if="item.isStore&&item.isStore!=0"
                    :style="{color:$themeColor}"
                  ></i>
                </p>
                <p class="vertical listType">{{item.typeName}}·{{item.newName}}</p>
              </div>
            </div>
            <div
              class="flex-grow-0 flex-y-center t_r listView"
              v-if="type==0&&tab==0"
            >浏览量：{{item.viewNum}}
            </div>
            <div class="flex-grow-0 flex-y-center t_r listView" v-if="type==0&&tab==1">
              <!-- <van-cell
                  class="srdlList_foot"
                  :title="`入驻时间：${item.joinTime}`"
                  :value="formatDateByTimeStamp(item.joinTime,'YYYY-MM-DD HH:mm')"
              />-->
              入驻时间：{{computedDate(new Date(item.joinTime).getTime())}}
            </div>
            <div
              class="flex-grow-0 flex-y-center t_r listView"
              v-if="type==0&&tab==2"
            >距离：{{item.distance}}
            </div>
          </div>
          <!-- 黄页列表的电话和地址 -->
          <div>
            <p class="listTel">
              <i class="iconfont icon-landline"></i>
              {{hideTelNumber(item.tel)}}
            </p>
            <p class="listAddress" v-if="type==0">
              <i class="iconfont icon-icon-"></i>
              {{item.address}}
            </p>
            <p class="listAddress" v-if="type==3">到期时间：{{item.endTime}}</p>
            <p class="listAddress" v-if="type==1">拨打时间：{{item.createdAt}}</p>
          </div>
          <!-- 根据需求变换样式————————列表样式、我的记录、我的收藏、我的发布 -->
          <div class="changeType">
            <div class="typeList">
              <div v-if="type==0">
                <i
                  v-if="setUp.code=='open'&&item.qrcode&&item.qrcode.length"
                  class="iconfont icon-weixin listIcon_tel"
                  :style="{color:$themeColor}"
                ></i>
                <i
                  class="iconfont icon-dianhua3 listIcon_address"
                  :style="{color:$themeColor}"
                ></i>
              </div>
              <p
                class="cancelCollection"
                v-if="type==2"
                @click.stop="$emit('cancelCollection',(item.id))"
              >取消收藏</p>
              <div class="userEdit" v-if="type==3">
                <div>
                  <p
                    class="edit"
                    @click.stop="$emit('editYellowPage',(item.id))"
                  >编辑</p>
                  <p
                    class="lower"
                    @click.stop="$emit('lowerYellowPage',(item.id))"
                    v-if="item.show=='1'"
                  >下架</p>
                  <p
                    class="lower"
                    @click.stop="$emit('upperYellowPage',(item.id))"
                    v-if="item.show=='2'"
                  >上架</p>
                </div>
                <div>
                  <p
                    class="edit"
                    @click.stop="$emit('payYellowPage',(item))"
                  >续费</p>
                  <p class="lower" @click.stop="$emit('removePage',(item.id))">删除</p>
                </div>
              </div>
            </div>
          </div>
          <img v-if="(showState && item.state && +item.state !=3) || +item.show==2 "
               class="status-icon-pic"
               :src="+item.state==2?examine:+item.state==4?refuse:lowerShelf"
               width="84">
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from "vuex";
  import {hideLoading, showDialog, showLoading} from "../../util";
  import {utilMixins} from "../../plugins/util-mixins";
  import examine from "../../assets/status/examine.png"   //待审核
  import expire from "../../assets/status/expire.png"     //已到期
  import lowerShelf from "../../assets/status/lower-shelf.png"  //已下架
  import refuse from "../../assets/status/refuse.png"  //已拒绝

  export default {
    name: "ListItem",
    props: ["Store", "type", "tab", 'showState'], //0-黄页列表 1-我的拨打记录 2-我的收藏 3-我的发布
    compontents: {},
    data() {
      // return 未定义时会报属性未定义错误
      return {
        setUp: {},
        refuse,
        lowerShelf,
        examine,
        expire
      };
    },
    methods: {
      ...mapActions("publication/yellowEnter", ["getYellowPageSetUp"]),
      yellowInfo(e) {
        this.$router.push({
          path: "/yellowPage/yellowInfo",
          query: {id: e}
        });
      }
    },
    mixins: [utilMixins],
    async created() {
      this.setUp = await this.getYellowPageSetUp();

      // hssg添加的，别问我为什么这样写，因为我真的不想改得太多,
      // try catch 防止报错阻止线程
      try {
        document.title = this.$parent.$parent.$parent.$parent.$parent.footerConfig.footerInfo[1].name = this.setUp.field || '电话本';
      } catch (e) {
        console.log(e);
      }

    }
  };
</script>
<style scoped lang="scss">
  @import "../../assets/common";

  #ListItem .van-tab--active .van-ellipsis {
    color: $themeColor;
  }

  .flex-grow-0 {
    min-width: 0;
    -webkit-box-flex: 0;
    -webkit-flex-grow: 0;
    flex-grow: 0;
    -ms-flex-positive: 0;
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }

  .flex-grow-1 {
    min-width: 0;
    -webkit-box-flex: 1;
    -webkit-flex-grow: 1;
    flex-grow: 1;
    -webkit-flex-shrink: 1;
    -ms-flex-positive: 1;
    -ms-flex-negative: 1;
    flex-shrink: 1;
  }

  .flex-y-center {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    -ms-grid-row-align: center;
    align-items: center;
  }

  .vertical {
    vertical-align: middle;
  }

  .dis_in {
    display: inline-block;
  }

  .t_r {
    text-align: right;
  }

  #ListItem {
    padding: 0 20px;
    background: none;

    .borderBottom {
      border-bottom: 1.1px solid #f9f9f9;
      position: relative;
      z-index: 1;
    }

    .iconfont {
      font-size: 30px;
    }

    .pageList {
      padding: 20px;
      height: auto;
      position: relative;
      margin-top: 20px;
      background: #fff;
      border-radius: 10px;

      .listHead {
        display: flex;
        width: 100%;
        padding-bottom: 20px;

        .listImg {
          width: 70px;
          height: 70px;
          overflow: hidden;
          border-radius: 50%;
          margin-right: 20px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .listType {
          font-size: 18px;
          padding-top: 10px;
          color: #818181;
        }

        .listName {
          color: #333;
          font-size: 30px;
        }

        .listView {
          font-size: 26px;
          color: #999;
        }
      }

      .listTel,
      .listAddress {
        color: #999;
        font-size: 28px;
        padding-top: 20px;
      }

      .changeType {
        // width: 100%;
        right: 20px;
        min-height: 50px;
        max-height: 100px;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;

        .typeList {
          .listIcon_tel,
          .listIcon_address {
            margin-top: 40px;
            display: inline-block;
          }

          .listIcon_tel {
            font-size: 44px;
          }

          .listIcon_address {
            font-size: 50px;
          }

          .cancelCollection {
            margin-top: 20px;
            padding: 15px 26px;
            border-radius: 50px;
            color: $themeColor;
            border: 1.1px solid $themeColor;
          }

          .userEdit {
            width: auto;

            div {
              display: inline-block;
              margin-left: 20px;
            }
          }

          .userEdit .edit {
            padding: 8px 20px;
            border-radius: 50px;
            color: $themeColor;
            border: 1.1px solid $themeColor;
          }

          .userEdit .lower {
            padding: 10px 20px;
            border-radius: 50px;
            color: #999;
            margin-top: 10px;
            border: 1.1px solid #999;
          }
        }
      }
    }

  }

  .status-icon-pic {
    position: absolute;
    top: 10px;
    left: 50%;
    margin-left: -30px;
    z-index: 0;
    width: 168px !important;
    height: 138px !important;
  }
</style>
