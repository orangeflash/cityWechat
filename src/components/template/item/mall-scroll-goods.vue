<template>

  <dd-layout-div>
    <dd-layout-div  :class="topClass">
      <dd-layout-div class="mar-b-10">{{name}}</dd-layout-div>
      <dd-layout-div class="flex flex-bt flex-y-center">
        <dd-layout-div class="fon-wb" :font-size="34">{{title}}</dd-layout-div>
        <dd-layout-div v-if="path" :pad="[12,10,6,20]" @click="path?goPointPage(path):'void 0'" :fillet="8"
                       class="col-9 fon-sm">查看更多<i class="iconfont icon-right fon-xs col-9"></i></dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>

    <dd-layout-div class="flex over-a" :pad="[30,0]">
      <slot/>
    </dd-layout-div>
  </dd-layout-div>

</template>


<script>
  import DdLayoutPartList from "../../layout/dd-layout-part-list";

  export default {
    components: {DdLayoutPartList},
    props: {
      moreColor: {
        type: String,
        default: '#CE1CA6'
      },
      name: {
        type: String,
      },
      title: {
        type: String,
      },
      path: {
        default: null
      },
      topClass:{
        type: String,
      }
    }

  }


</script>
