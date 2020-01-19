<template>

  <dd-layout-div>

    <dd-layout-div
      class="bg-f" :mar="[0,0,20]" :pad="[30]" v-for="(item,key) in getRightList" :key="key">
      <dd-layout-div
        @click="goPointPage({path:'/auxiliary/jobHunt/jobJobDetails',query:{id:item.id,deliverId:item.deliverId}})">
        <dd-layout-div class="flex-bt flex-y-center mar-b">
          <dd-layout-img :src="item.face" :width="1" :height="1" :fillet="1"/>
          <dd-layout-div class="flex-g-1 mar-l">

            <dd-layout-div class="flex-bt mar-b-20">
              <dd-layout-div class="flex flex-g-1">
                <dd-layout-div :pad="[5,0]" class="hide-e fon-xll fon-wb">{{item.name}}</dd-layout-div>
                <dd-layout-img class="mar-t-10 mar-l-10 flex-g-0" :src="top" :width="0.79" :height="0.24"
                               v-if="item.isTop == 1"/>
              </dd-layout-div>
              <dd-layout-div class="flex-g-0 mar-l">
                <dd-layout-div class="col-price fon-xxl fon-wb">{{item.salary}}<span class="fon-lg col-3 fon-normal"
                                                                                     v-if="item.salary != '面议'">/月</span>
                </dd-layout-div>
              </dd-layout-div>
            </dd-layout-div>

            <dd-layout-div class="flex-bt">
              <dd-layout-div class="col-9">{{item.sex}} | {{item.age}}岁 | {{item.experience}} | {{item.education}}
              </dd-layout-div>
              <dd-layout-div class="col-9">{{item.createdAt}}</dd-layout-div>
            </dd-layout-div>

          </dd-layout-div>
        </dd-layout-div>

        <dd-layout-div :mar="[0,0,10]">
          <dd-layout-tag v-for="(tag, t) in item.tag" :key="t" :name="`#${tag}`" color="#F2F3F5" :fill="true"
                         class="col-6 mar-r"/>
        </dd-layout-div>

        <dd-layout-div class="fon-wb fon-b hide-e pad-t-5">意向职位：{{item.industryName}} <i
          class="iconfont icon-dian2 fon-xsss"></i> {{item.positionName}}
        </dd-layout-div>

      </dd-layout-div>

      <dd-layout-div class="flex-bt">
        <dd-layout-div></dd-layout-div>
        <dd-layout-div class="col-f bg-t" :fillet="10" :pad="[17,20,13]" v-if="item.status==1||item.status==2"
                       @click="$emit('edit-operation',item.id,1,item.status)">操作/编辑
        </dd-layout-div>

      </dd-layout-div>

    </dd-layout-div>

  </dd-layout-div>

</template>
<script>
  import DdLayoutImg from "../../layout/dd-layout-img";
  import top from '../../../assets/img/city-information/top.png'

  import {mapActions} from 'vuex'
  import {computedDate, hideLoading, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";

  export default {
    mixins: [utilMixins],
    components: {DdLayoutImg},
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {top}
    },
    computed: {
      getRightList() {
        return this.list.map(item => {
          const label = item.label ? JSON.parse(item.label) : {};
          let tag = [];
          for (let i in label) tag.push(label[i])
          return {
            ...item,
            face: this.getSingleImg(item.logo),
            sex: item.sex == 1 ? '男' : '女',
            tag,
            createdAt: computedDate(item.createdAt)
          }
        })
      }
    },
  }
</script>
