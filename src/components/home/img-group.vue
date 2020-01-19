<template>
  <div id="home-classification">
    <div id="ImageGroup" :style="{padding:`${upDownPadding}px ${leftRightPadding}px`, margin:`${topMargin}px 0 0`}">
      <ul class="content">
        <li class="image-item" v-for="(item,index) in numberOfRow" :key="item"
            :style="{padding:getImgPadding(index),height:`${height}px`,borderRadius:`${radius}px`,overflow:`hidden`}">
          {{pictureList[index].entry}}
          <img-wrapper @click.native="$pushRoute(pictureList[index].entry)"  not-load="true" v-if="getPicture(index)" :src="getPicture(index)" alt=""
               :style="{borderRadius:`${radius}px`,height: '100%'}"/>
          <div v-else class="img-placeholder"
               :style="{borderRadius:`${radius}px`,padding:`${padding/2}px ${padding}px`,height: '100%'}"></div>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {PlaceholderImg} from "../../project-config/base";

  export default {
    name: "homeClassification",
    props:["numberOfRow","padding","radius","pictureList","height","leftRightPadding","topMargin","upDownPadding","radius"],
    data() {
      return {
        PlaceholderImg
      }
    },
    methods: {
      getPicture(index) {
        const obj = this.pictureList[index];
        if (obj) {
          return obj.url ? obj.url : this.placeholderImg;
        } else {
          return this.placeholderImg;
        }
      },
      getImgPadding(index) {
        const vertical = `0px`;
        const horizontal = `${this.padding}px`;
        const defaultPadding = `${vertical} 0 ${vertical} ${horizontal}`;
        const lastPadding = `${vertical} ${horizontal} ${vertical} ${horizontal}`;
        return index + 1 === this.numberOfRow ? lastPadding : defaultPadding;
      }
    },
    computed: {},
    watch: {},
    created() {

    }
  }
</script>

<style scoped lang="scss">
  @import "../../assets/common";
  @import '../../assets/theme';

  #ImageGroup {
    background-color: #fff;
    .content {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    .image-item {
      flex: 1;
      font-size: 0;
      img {
        width: 100%;
        height: auto;
      }
      .img-placeholder {
        width: 100%;
        height: 100%;
        background: #fff;
      }
    }
  }
</style>
