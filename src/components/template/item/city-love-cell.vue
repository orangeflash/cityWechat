<template>
  <div>
    <dd-layout-div v-for="(item,key) in list" :key="key" :pad="[48,30]"
                   @click="goPointPage('/auxiliary/cityLove/details?id='+item.friendId)"
                   class="flex-y-center flex-bt br-b-F7">
      <dd-layout-div class="flex-g-1 flex">
        <dd-layout-img :src="item.face" :width="1.31" :height="1.31" :fillet="1.3"/>

        <dd-layout-div :mar="[0,30]" class="flex-g-1">
          <div class="fon-xl fon-wb lineH-48">{{item.nickname}}</div>
          <div class=" flex mar-t-5">
            <dd-layout-div :bg="item.sex==1?'#4FA6F6':'#F871A4'"
                           class="col-f fon-xsss pad-6-4-4 mar-l-10 br-r-4 flex-y-center"><i
              class="iconfont  col-f fon-xsss mar-r-5"
              :class="item.sex==1?'icon-nanxianxing':'icon-nvxianxing'"></i>{{item.age}}岁
            </dd-layout-div>
            <span class="col-f bg-CA99F3 fon-xsss pad-6-4-4 mar-l-10 br-r-4 flex-y-center"><i
              class="iconfont icon-dingwei1 col-f fon-xsss mar-r-5"></i>{{item.city}}</span>
          </div>
          <p class="col-bb mar-t-20" v-if="type=='browse'">{{item.time}}</p>
          <dd-layout-div class="col-t br-t pad-10-20-8 dis-ib mar-t-20" :stop="true"
                         @click="collectionHandle(item.friendId)"
                         v-else-if="type=='follow'" :fillet="8">{{item.follow?'取消关注':'关注'}}
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div color="#fff" v-if="button =='私信聊天'" :fillet="50" :pad="[25,25,23]"
                     class="fon-b flex-g-0"
                     :stop="true"
                     @click="goPointPage({path:'/conversation',query:{tId:item.userId}})"
                     :bg="buttonColor">
        <i class="iconfont icon-comments_fill col-f fon-b mar-r"></i>{{button}}
      </dd-layout-div>
      <dd-layout-div color="#fff" v-else :fillet="50" :pad="[25,25,23]"
                     class="fon-b flex-g-0"
                     :bg="buttonColor">
        <i class="iconfont icon-comments_fill col-f fon-b mar-r"></i>{{button}}
      </dd-layout-div>
    </dd-layout-div>
  </div>

</template>


<script>

  import DdLayoutImg from "../../layout/dd-layout-img";

  import {mapActions} from 'vuex'

  export default {
    components: {DdLayoutImg},
    props: {
      list: {
        type: Array,
        default: () => []
      },
      type: {
        type: String,
        default: 'browse'
      },
      hideFollow: {
        type: Boolean,
        default: false,
      },
      button: {
        type: String,
        default: '私信聊天'
      },
      buttonColor: {
        type: String,
        default: 'linear-gradient(-90deg,rgba(255,156,0,1) 0%,rgba(255,225,0,1) 100%)'
      },
    },
    methods: {
      ...mapActions("post", ["collectPost"]),
      async collectionHandle(id, key) {
        await this.collectPost({
          type: 12,
          postId: id
        })

        this.$emit('collection', key)

      }
    }
  }


</script>
