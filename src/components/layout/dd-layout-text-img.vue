<template>

  <div class="pad-t pad-lr pad-b" :style="{marginTop:config.topMargin+'px',marginBottom:config.isBottom+'px'}">
    <div class=" flex-y-center flex-bt">
      <div>
        <span class="fon-xll fon-wb col-3">{{config.infoTitle}}</span>
      </div>
    </div>
    <div>
      <div class="flex-bt flex flex-wrap">
        <div
          class="w-330 mar-t-20 flex-y-center bg-f9 flex-center br-r-8"
          v-for="(item,i) in config.textImage"
          :key="i"
          @click="entryHandle(item)"

        >
          <div class="flex-bt  pad-lr flex-y-center">
            <div class="flex-grow-1 w100 mar-r-10">
              <div class="col-3 fon-b fon-wb mar-b-10 ">{{item.name || '功能名称'}}</div>
              <p class="col-9 dh-34 lineH-34 hide-e w100">{{item.desc || '该功能的描述信息...'}}</p>
            </div>
            <div class="ba_f br-r-c dh-90 w-90 flex-center over-h mar-t-10 mar-b-10 flex-g-0" style="min-width: 45px;">
              <dd-layout-img
                :src="item.url" v-if="item.url" :width="0.9" :height="0.9" :fillet="0.16"/>
              <i class="iconfont icon-tupian" v-else style="font-size: 30px"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

  import {getEntryPath} from "../../plugins/get-entry-path";
  import DdLayoutImg from "./dd-layout-img";

  export default {
    components: {DdLayoutImg},
    props: {
      config: Object
    },
    methods: {
      entryHandle(item) {
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
      }
    }
  }

</script>
