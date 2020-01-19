<template>
  <div class="dd-content-one" @click="$emit('click')">
    <h4>{{data.title}}</h4>
    <div class="user-info">
      <UserInfo
        :src="data.portrait"
        size="27"
        :name="data.userName"
        color="#999"
      ></UserInfo>
      <DdButton type="operation"
                v-if="type=='operation'"
                :name="buttonName"
                @click="$emit('button')"

      ></DdButton>
      <div class="address" v-else>
        <i class="iconfont icon-dizhi2"></i>{{data.area}}
      </div>
    </div>
  </div>
</template>

<script>

  import UserInfo from "@/components/template/user";
  import DdButton from "@/components/template/button"

  export default {
    components: {UserInfo, DdButton},
    props: ['type', 'buttonName', 'data'],
    created() {
      if (this.data && this.data.apartment && this.data.deposit) {
        const apartment = this.data.apartment.split("-"),
          deposit = this.data.deposit.split("-");
        this.data.apartment = apartment[0] + "室" + apartment[1] + "厅";
        this.data.deposit = "押" + deposit[0] + "付" + deposit[1];
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-content-one {
    font-size: 30px;

    h4 {
      padding-bottom: 30px;
      line-height: 40px;
    }

    .user-info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .address {
        font-size: 26px;
        color: #999;
        display: flex;

        i {
          margin-right: 10px;
          height: 10px;
        }

      }
    }
  }

</style>
