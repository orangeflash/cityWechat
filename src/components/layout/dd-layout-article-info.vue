<template>
  <div class="pad-lr pad-t flex-bt" @click="$emit('click')">
    <div class="flex-g-1 mar-r flex-col flex-bt">
      <div class="hide-e-2"
           :class="getInfo.pictures.length > 1?'mh-96 ':' dh-96'">
        <span class="col-f bg-FFB849 fon-xss br-r-8 pad-4-4-2 dis-ib mar-r-10" v-if="getInfo.attribute == 1">置</span>
        <span class="col-f bg-FF8AD6 fon-xss br-r-8 pad-4-4-2 dis-ib mar-r-10" v-if="getInfo.attribute == 2">精</span>
        <span class="fon-xl fon-wb lineH-48">{{getInfo.title}}</span>
      </div>
      <div v-if="getInfo.pictures.length > 1" class="flex mar-t-20 mar-b-20">
        <dd-layout-img v-for="(src,key) in getInfo.pictures" class="mar-r-10" :fillet="0.3" v-if="key < 3" :src="src"
                       :key="key"
                       :stop="true"
                       @click="previewImage(src, getInfo.pictures)"
                       :width="2.23"
                       :height="2.23"/>
      </div>
      <div :class="getInfo.pictures.length > 1?'flex-bt flex-y-center':'flex-g-1 flex-col flex-bt mar-t mar-b'"
           class="mih-80">
        <p class="col-9">{{getInfo.time}}</p>
        <div class="col-6">
          <span class="fon-sm"><i class="iconfont icon-biaoqing1 mar-r-10"></i>{{getInfo.comment}}</span>
          <span class="fon-sm mar-l"><i class="iconfont icon-yanjing2 fon-40 mar-r-10"></i>{{getInfo.browse}}</span>
        </div>
      </div>
    </div>
    <dd-layout-img v-if="getInfo.pictures.length == 1"
                   class="mar-b"
                   :stop="true"
                   @click="previewImage(getInfo.pictures[0], getInfo.pictures)" :width="2.23"
                   :height="2.23" :fillet="0.3" :src="getInfo.pictures[0]"/>
  </div>
</template>

<script>
  import DdLayoutImg from "./dd-layout-img";

  export default {
    components: {DdLayoutImg},
    props: {
      title: String,
      attribute: {
        type: Number,
        default: 0
      },
      pictures: {
        type: Array,
        default: () => []
      },
      time: String,
      like: Number,
      browse: Number,
      comment: Number,
      infoData: {
        type: Object,
        default: Object
      }
    },
    computed: {
      getInfo() {

        if (this.infoData.title) return this.infoData

        return {
          title: this.title,
          attribute: this.attribute,
          pictures: this.pictures,
          time: this.time,
          like: this.like,
          browse: this.browse,
          comment: this.comment,
        }
      }
    }
  }


</script>
