<template>
  <dd-layout-div>
    <dd-layout-div class="flex-bt flex-y-center bg-f" :pad="[30,30,15]">
      <dd-layout-div class="flex-y-center">
        <dd-layout-div class="fon-xll col-t" :mar="[0,100,0,0]">
          最新
          <dd-layout-div class="bg-t" :width="42" :height="6" :mar="[15,'auto',0]"/>
        </dd-layout-div>
        <!--<dd-layout-div class="fon-xll">-->
          <!--推荐-->
          <!--&lt;!&ndash;<dd-layout-div class="bg-t"  :width="42" :height="6" :mar="[15,'auto',0]"/>&ndash;&gt;-->
        <!--</dd-layout-div>-->
      </dd-layout-div>
      <dd-layout-div @click="goPointPage('/auxiliary/jobHunt/collection')">我的收藏</dd-layout-div>
    </dd-layout-div>

    <dd-layout-div  v-if="list.length > 0">
      <hunt-find :list="list"/>
      <more :status="hasMore"/>
    </dd-layout-div>
    <not-data v-else-if="isRequest"/>
  </dd-layout-div>
</template>


<script>

  import HuntFind from "../../../components/template/item/hunt-find";
  import {computedDate, hideLoading, showLoading} from "../../../util";
  import {utilMixins} from "../../../plugins/util-mixins";

  import {mapActions} from 'vuex'

  export default {
    components: {HuntFind},
    mixins: [utilMixins],
    data() {
      return {
        list: [],
        hasMore: true,
        isRequest: false,
        params: {
          page: 1,
          size: 10,
        }
      }
    },
    methods: {
      ...mapActions("jobHunt", ["getJobList"]),
      onInfinite() {
        if (!this.hasMore) return false
        this.params.page++;
        this.getList();
      },
      async getList() {
        showLoading();
        this.isRequest = false;
        let result = await this.getJobList(this.params);
        hideLoading();
        this.list = this.params.page == 1 ? result : this.list.concat(result);

        this.hasMore = result.length >= this.params.size;
        this.isRequest = true;
        return this.hasMore
      }
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
    created() {
      this.getList();

      this.onscroll(this.onInfinite,this.$route.path)

    }
  }


</script>
