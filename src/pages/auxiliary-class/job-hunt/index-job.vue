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
        <!--<dd-layout-div class="bg-t"  :width="42" :height="6" :mar="[15,'auto',0]"/>-->
        <!--</dd-layout-div>-->
      </dd-layout-div>
      <dd-layout-div @click="goPointPage('/auxiliary/jobHunt/collection')">我的收藏</dd-layout-div>
    </dd-layout-div>
    <dd-layout-div v-if="list.length > 0">
      <job-find :list="list"/>
      <more :status="hasMore"/>
    </dd-layout-div>

    <not-data v-else-if="isRequest"/>

  </dd-layout-div>


</template>

<script>
  import {mapActions} from 'vuex'
  import JobFind from "../../../components/template/item/job-find";
  import {hideLoading, showLoading} from "../../../util";

  export default {
    components: {JobFind},
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
      ...mapActions("jobHunt", ["getJobConfig", "getJobCategory", "getJobList", "getHuntList"]),
      onInfinite() {
        if (!this.hasMore) return false
        this.params.page++;
        this.getList();
      },
      async getList() {
        showLoading();
        this.isRequest = false;
        let result = await this.getHuntList(this.params);
        hideLoading();
        this.list = this.params.page == 1 ? result : this.list.concat(result);

        this.hasMore = result.length >= this.params.size;
        this.isRequest = true;
        return this.hasMore
      }
    },
    created() {
      this.getList();
      this.onscroll(this.onInfinite, this.$route.path)
    }
  }


</script>
