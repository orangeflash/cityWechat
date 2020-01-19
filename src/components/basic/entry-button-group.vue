<template>
  <div id="EntryButtonGroup" class="w100 b-box" :style="{marginTop:`${topMargin}px`}"
       v-if="chunkButtonList.length&&isKeep">
    <van-swipe
      @change="onChange"
      :loop="false"
      :class="{ 'pad-b-40': chunkButtonList[0] &&chunkButtonList[0].length > 1,notMore: chunkButtonList[0]&&chunkButtonList[0].length ==1 }"
    >
      <van-swipe-item v-for="(buttonList,chunkBtnKey) in chunkButtonList" :key="chunkBtnKey">
        <ul class="button-group" v-for="(chunkList,PIndex) in buttonList" :key="PIndex">
          <li
            class="button-item"
            v-for="(item) in chunkList"
            :key="item.id"
            :style="{visibility:item.visibility}"
          >
            <div
              class="icon-container"
              @click="goPage(item)"
              :style="{borderRadius:shapeRadiusStyle}"
            >
              <img-wrapper :src="item.url" v-if="item.url"/>
            </div>
            <h3 class="item__label" :style="{'color':color|| '#666'}">{{item.label||'按钮'}}</h3>
          </li>
        </ul>
      </van-swipe-item>
      <div slot="indicator" v-if="chunkButtonList && chunkButtonList.length > 1"
           class="posi-a zIndex99 b0 w100 dh-30 flex-center">
        <div class="flex">
            <span class="w-30 dh-8 br-r-4 mar-l-10" v-for="i in chunkButtonList.length" :key="i"
                  :class="current+1 == i ?'bg-t':'bg-e'"></span>
        </div>
      </div>
    </van-swipe>
  </div>
</template>
<script>
  import {mapActions, mapGetters, mapState} from "vuex";
  import _ from "lodash";
  import {randomNumber} from "../../util";
  import {getEntryPath} from "../../plugins/get-entry-path";

  export default {
    name: "EntryButtonGroup",
    props: [
      "buttonNumberOfRow",
      "shape",
      "entryButtonList",
      "color",
      "buttonNumberOfCol",
      "noHost",
      "topMargin"
    ],
    data() {
      return {
        row: 0,
        current: 0,
        isKeep: true,
      };
    },
    methods: {
      goPage(item) {
        //    this.$router.push("/yellowPage")
        if (item.entry) {
          try {
            if (!item.entry.query) {
              item.entry.query = {
                title: item.label,
                pid: item.entry.param.indexOf(',') >= 0 ? item.entry.param.split(",")[0] : item.entry.param,
                id: item.entry.param.indexOf(',') >= 0 ? item.entry.param.split(",")[1] : 0
              };
            }
          } catch (e) {

          }

          if (!item.entry.path)
            item.entry.path = getEntryPath(item.entry);
          if (!item.entry.path) return false;
          //this.$router.push(item.entry);
          return this.goPointPage({
            ...item.entry
          });
        }
      },
      onChange(index) {
        this.current = index;
      }

    },
    computed: {
      allButtonList() {
        const numberOfRow = this.buttonNumberOfCol;

        const chunkList =
          _.chunk(_.cloneDeep(this.entryButtonList), numberOfRow) || [];
        if (!chunkList.length) return [];
        let lastChild = chunkList[chunkList.length - 1] || [];
        if (lastChild.length < numberOfRow) {
          chunkList[chunkList.length - 1] = _.times(numberOfRow, n => {
            return (
              lastChild[n] || {
                id: randomNumber(10),
                visibility: "hidden"
              }
            );
          });
        }
        return chunkList || [];
      },
      chunkButtonList() {
        return (
          _.chunk(this.allButtonList || [], this.buttonNumberOfRow) || []
        );
      },
      shapeRadiusStyle() {
        switch (this.shape) {
          case 1:
            return "50%";
          case 2:
            return "0";
          case 3:
            return "25%";
        }
      }
    },
    activated() {
      this.isKeep = true
    },
    deactivated() {
      this.isKeep = false
    },
    created() {
    }
  };
</script>

<style lang="scss">
  @import "../../assets/common";

  .van-swipe__indicator--active {
    background-color: $themeColor;
  }

  .van-swipe__indicators {
    bottom: 5px;
  }
</style>


<style scoped lang="scss">
  @import "../../assets/common";

  .notMore {
    padding: 0 0 30px;
  }

  #EntryButtonGroup {
    background: #fff;
    min-height: 160px;

    .button-group {
      margin-top: 20px;
      display: flex;
      width: 100%;

      .button-item {
        flex: 1;
        text-align: center;

        .icon-container {
          height: 84px;
          line-height: 84px;
          width: 84px;
          display: inline-block;
          margin-bottom: 17px;
          transition: border 0.2s linear;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .item__label {
          color: #666;
        }
      }
    }
  }
</style>
