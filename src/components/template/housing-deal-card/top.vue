<template>

    <div class="dd-housing-card-top">
      <Labels v-bind="labelsConfig"></Labels>
      <div class="dd-housing-card-top_time">{{time}} 发布</div>
    </div>

</template>

<script>

  import Labels from '../labels'
  export default {
    components:{Labels},
    props:['time','labelsConfig'],
    data(){
      return{
        labelsConfigs:{
          back:true,
          labels:[
            {
              name:'房屋出租',
              color:'#22D4D4'
            },{
              name:'整租',
              color:'#FFB131'
            }
          ]
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/common";
  .dd-housing-card-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    &_time{
      color: #999;
      font-size: 26px;
    }
  }

</style>
