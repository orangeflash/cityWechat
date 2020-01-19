<template>

  <div class="flex-col posi-f w100 hei100">
    <div>
      <Header/>
      <div class="dh col-6 pad-lr flex-y-center">员工管理</div>
    </div>
    <div class="flex-g-1 posi-r">
      <scroller
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        v-if="staffList.length"
      >
        <div class="bg-f mar-b-20" v-for="(item,key) in staffList" :key="key">
          <div class="pad-30">
            <div>
              <span class="fon-xxl mar-r">{{item.remarks || item.userName}}</span>
              <span class="col-9 mar-r fon-b">[员工]</span>
              <span class="col-t fon-b">{{hideTelNumber(item.userTel)}}</span>
            </div>
            <div class="mar-t-20 fon-b flex-y-center">
              <face
                :src="item.portrait"
                size="24"
                class="mar-r"
              />
              {{item.userName}}
            </div>
            <div class="flex mar-t">
              <span class="miw-175 fon-lg">核销权限：</span>
              <div class="flex-g-1 flex-wrap flex">
                <div class="col-6 mar-r fon-lg mar-b-20" v-for="(p,k) in item.power">{{p}}</div>
              </div>
            </div>
          </div>
          <div class="br-t-d dh-100 flex-y-center">
            <span class="flex-g-1 br-r-d dh flex-center fon-lg col-9" @click="deleteStaff(item.id)">删除</span>
            <span class="flex-g-1 dh flex-center col-t fon-lg"
                  @click="goPointPage('/storeAuxiliary/storeStaff/add?id='+item.id+'&userTel='+item.userTel)">修改</span>
          </div>
        </div>

      </scroller>
      <not-data v-else-if="isRequest"/>
    </div>
    <div class="pad-30 bg-f">
      <dd-button
        type="release"
        name="添加员工"
        @click="goPointPage('/storeAuxiliary/storeStaff/add')"
      ></dd-button>
    </div>

  </div>

</template>
<script>
  import DdButton from "@/components/template/button"
  import {mapActions, mapState} from 'vuex'
  import Face from '@/components/template/face'
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading} from "../../../util";

  export default {
    components: {DdButton, Face},
    data() {
      return {
        isRequest: false,
        params: {
          size: 10,
          page: 1
        },
        staffList: [],
      }
    },
    methods: {
      ...mapActions("storeAuxiliary/storeStaff", ["getMyStaffList", "delStaff"]),
      async onRefresh(done) {
        this.params.page = 1;
        await this.getStaffList(true);
        done && done()
      },
      async onInfinite(done) {
        this.params.page++;
        const bool = await this.getStaffList({
          storeId: this.storeId,
          ...this.params
        });
        done && done(!bool)
      },
      async getStaffList(refresh) {
        let result = await this.getMyStaffList({
          ...this.params,
          storeId: this.storeId
        });
        this.staffList = refresh && this.params.page == 1 ? result : this.staffList.concat(result);
        this.isRequest = true;
        return result.length >= this.params.size
      },
      async deleteStaff(id) {
        try {
          await showDialog("确定要删除该员工吗？")
          showLoading()
          const res = await this.delStaff({id});
          hideLoading();
          showHandleStatusByFlag(res.code, '删除成功', res.msg, (bool) => bool && this.onRefresh())
        } catch (e) {
          console.log(e)
        }

      }
    },
    computed: {
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    created() {
      this.onRefresh()
    }

  }
</script>
