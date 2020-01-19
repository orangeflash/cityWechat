<template>

  <div class="dd-free-ride__top">
    <div class="dd-free-ride__top__time">
      <i class="iconfont icon-Group-" :class="over && over != 'false'&&'is-over'"></i>
      <span :class="over &&over != 'false'&&'is-over'">{{tips || '出发时间：'}}{{time}}</span>
    </div>
    <Labels v-bind="labelsConfig"></Labels>
  </div>

</template>

<script>

  import Labels from '../labels'

  /**
   * labelsConfig param info
   *
   *  v-bind:  {
   *      labels:[
   *        {
   *            name : 'labelName1',
   *            color:'red'
   *        },{
   *            name:'labelName2',
   *            color:'blue'
   *        }
   *      ],
   *      fontSize:number,
   *      back: boolean,
   *      field:string,
   *      maxLength:number,
   *      over:boolean
   *  }
   *
   * */

  export default {
    props: ['time', 'labels', 'tips', 'over'],
    components: {Labels},
    data() {
      return {
        labelsConfigTest: {
          labelsTest: [
            {
              text: '长期',
              color: '#FF3838'
            }, {
              text: '货找车',
              color: '#FFB230'
            }
          ],
          fontSize: 12,
          back: true,
          field: 'text',
          maxLength: 3,
          over: true
        }

      }
    },
    computed: {
      labelsConfig() {
        if (!this.labels) return {}
        let obj = {
          labels: this.labels,
          over: this.over && this.over != 'false',
          back:true
        }
        return obj

      }
    }
  }

</script>


<style scoped lang="scss">
  @import "../../../assets/common";

  .dd-free-ride__top {
    height: 80px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1.1px solid #eee;
    align-items: center;
    padding: 0 30px;

    &__time {
      display: flex;
      align-items: center;

      i {
        color: #666;
        font-size: 40px;
        margin-right: 20px;
        margin-top: 8px;
      }

      span {
        font-size: 28px;
        color: #666;
      }

      .is-over {
        color: #bbb !important;
      }
    }

    &__label {
      background: #20D4D0;
      padding: 6px 10px;
      color: #fff;
      font-size: 30px;
      border-radius: 6px;
      text-align: center;
    }

  }

</style>
