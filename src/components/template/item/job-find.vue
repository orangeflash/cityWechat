<template>

  <dd-layout-div>
    <dd-layout-div
      :pad="[30,30,10]" :mar="[0,0,30]" class="bg-f" v-for="(item,key) in getList" :key="key">
      <dd-layout-div @click="goPointPage({path:'/auxiliary/jobHunt/jobHuntDetails',query:{id:item.id}})">
        <dd-layout-div class="flex-bt flex-y-center" :mar="[0,0,20]">
          <dd-layout-div class=" flex flex-g-1">
            <dd-layout-div :pad="[5,0,0]" class="fon-wb fon-xll hide-e">{{item.title}}</dd-layout-div>
            <dd-layout-img class="mar-t-10 mar-l-10 flex-g-0" :src="top" :width="0.79" :height="0.24"
                           v-if="item.isTop == 1"/>
          </dd-layout-div>
          <dd-layout-div class="flex-g-0 col-price fon-xxl fon-wb">{{item.salary}}<span class="fon-lg col-3 fon-normal"
                                                                               v-if="item.salary != '面议'">/月</span>
          </dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="flex-bt" :mar="[0,0,30]">
          <dd-layout-div class="col-9">{{item.area}} | {{item.experience}} | {{item.education}}</dd-layout-div>
          <dd-layout-div class="col-9">{{item.createdAt}}</dd-layout-div>
        </dd-layout-div>
        <dd-layout-div :mar="[0,0,10]">
          <dd-layout-tag v-for="(tag, t) in item.tag" :key="t" :name="`#${tag}`" color="#F2F3F5" :fill="true"
                         class="col-6 mar-r"/>
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div v-if="pageType=='myjob'" class="flex flex-bt" :pad="[0,0,20]">
        <dd-layout-div class="col-f bg-t" :fillet="10" :pad="[17,20,13]" bg="#618AFF"
                       :stop="true"
                       @click="goPointPage({path:'myGetJob',query:{recruitId:item.id}})">收到的简历
        </dd-layout-div>
        <dd-layout-div class="col-f bg-t" :fillet="10" :pad="[17,20,13]" v-if="item.status==1||item.status==2" @click="$emit('edit-operation',item.id,2,item.status)"
              >操作/编辑</dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
  </dd-layout-div>
</template>

<script>


  import {computedDate} from "../../../util";
  import top from '../../../assets/img/city-information/top.png'
  import DdLayoutImg from "../../layout/dd-layout-img";

  export default {
    components: {DdLayoutImg},
    props: {
      pageType: {
        type: String,
        default: null
      },
      list: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {top}
    },
    computed: {
      getList() {
        return this.list.map(item => {
          const label = item.label ? JSON.parse(item.label) : {};
          let tag = [];
          for (let i in label) tag.push(label[i])
          return {
            ...item,
            tag,
            createdAt: computedDate(item.createdAt)
          }
        });
      }
    }
  }

</script>
