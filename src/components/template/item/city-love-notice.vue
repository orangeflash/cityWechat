<template>

  <div>
    <div v-for="(item,key) in list" :key="key" class="pad-t pad-lr">
      <div class="flex-y-center flex-bt">
        <div class="flex flex-y-center" @click="goPointPage('/auxiliary/cityLove/dynamicDetails?id='+item.id)">
          <dd-layout-img
            :src="item.face"
            :width="0.85"
            :height="0.85"
            :fillet="0.85"
          />
          <div class="mar-l">
            <div class="fon-b mar-b-20">{{item.nickname}}</div>
            <p class="flex flex-y-center">
              <dd-layout-div class="col-f fon-xsss pad-6-4-4 mar-l-10 br-r-4 flex-y-center"
                             :bg="item.sex==1?'#4FA6F6':'#F871A4'"><i
                class="iconfont col-f fon-xsss mar-r-5"
                :class="item.sex==1?'icon-nanxianxing':'icon-nvxianxing'"></i>{{item.age}}岁
              </dd-layout-div>
              <dd-layout-div class="fon-xss col-9 mar-l-10 pad-6-4-4">{{item.time}}</dd-layout-div>
              <dd-layout-div class="fon-xss col-9 mar-l-10 pad-6-4-4">{{item.display==1?'公开':item.display==2?'私密':''}}
              </dd-layout-div>

            </p>
          </div>
        </div>
        <dd-layout-div v-if="!item.state&&operation" @click="operationHandle(item,key)">
          <i class="iconfont icon-caidan col-C2C7D1 fon-46"></i>
        </dd-layout-div>

        <!--<dd-layout-div class="col-f bg-t" @click="displayHandle(item.id,item.display)" :fillet="30"-->
        <!--:pad="[17,20,15]">-->
        <!---->
        <!--</dd-layout-div>-->

      </div>
      <div class="mar-t fon-xll lineH-48 " @click="goPointPage('/auxiliary/cityLove/dynamicDetails?id='+item.id)">
        {{item.body}}
      </div>
      <div class="flex flex-bt mar-t" v-if="item.photos.length>0"
           @click="goPointPage('/auxiliary/cityLove/dynamicDetails?id='+item.id)">
        <dd-layout-img
          v-for="(url,u) in item.photos" :key="u"
          v-if="u<3"
          :stop="true"
          @click="previewImage(url,item.photos)"
          :src="url"
          :width="2.23" :height="2.23" :fillet="0.3"/>
        <dd-layout-div v-if="item.photos.length < 3" :width="223" :height="223"></dd-layout-div>
      </div>
      <div class="mar-t flex-bt flex-y-center">
        <span class="bg-FAFAFA pad-14-20-10 br-r-40 flex-y-center fon-20">
          <i class="iconfont icon-dingwei1 fon-20 mar-r-10 mar-t-5"></i>{{item.city}}
        </span>


      </div>

      <div class="flex-y-center flex-bt mar-t col-6 pad-b br-b-EFF3F6">
        <div>
          <span class="fon-sm col-t" v-if="item.state">{{item.state}}</span>
          <span class="fon-sm" v-else><i class="iconfont fon-40 icon-yanjing mar-r-10"></i>{{item.browse}}</span>
        </div>
        <div>
          <span class="mar-l fon-sm"><i class="iconfont icon-xin mar-r-10" :class="item.love&&'col-t'"></i>{{item.loveNum}}</span>
          <!--<span class="mar-l fon-sm"><i class="iconfont icon-biaoqing1 mar-r-10"></i>42</span>-->
          <span class="mar-l fon-sm"><i class="iconfont icon-zhuanfa  mar-r-10"></i>{{item.shareNum}}</span>
        </div>
      </div>
    </div>

  </div>

</template>
<script>
  import DdLayoutUser from "../../layout/dd-layout-user";
  import DdLayoutImg from "../../layout/dd-layout-img";

  export default {
    components: {DdLayoutImg, DdLayoutUser},
    props: {
      list: {
        type: Array,
        default: () => []
      },
      operation: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      operationHandle(item, key) {

        this.$emit('operation', item, key)

      }
    }
  }
</script>
