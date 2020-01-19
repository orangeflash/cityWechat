<template>
  <div class="job-operation">
    <Operation
      :show="showOperation"
      @close="close"
      @choice="actionsOperation"
      :actions="actions"
    ></Operation>
  </div>
</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import Operation from '../../../components/template/operation'
  import {getOperation} from "../../../plugins/common/index";
  import {showDialog, showLoading, showHandleStatusByFlag, hideLoading} from "../../../util";
  export default {
    props:['showOperation','info'],
    components: {Operation},
    data(){
      return{
        actions:[],
      }
    },
    methods:{
      ...mapActions("jobHunt/jobHuntEnter", ["getHuntEnterMoney","getJobEnterMoney","getJobTop","payJobHuntTop","postJobHuntDelete"]),
      ...mapActions('wxPay', ['payJobHuntRefresh']),
      //不能直接改变传进来的props,这样是最简单的解决办法
      close(){
        this.$parent.showJobOperation=false
      },
      open(){
        this.$parent.showJobOperation=true
      },
      // 操作选项
      async actionsOperation(item) {
        switch (item.field) {
          case 'share': //分享
            console.log("用户要分享")
            this.goPointPage({
              path: '/auxiliary/housingDeal/details',
              query: {id: this.itemInfo.id, isLease: +this.itemInfo.identifying == 3}
            })
            break;
          case 'refresh':  //刷新
            this.refreshPost();
            break;
          case 'over':    //结束

            await showDialog("您确定要结束该信息吗？");
            break;
          case 'edit':  //编辑
            this.goPointPage({name:this.type=='1'?'JobJobSettled':'JobHuntSettled',params:{huntType:_.find(this.jobCategory,{data:this.type}).id,id:this.id}})
            break;
          case 'top': //置顶
            item.data ? this.generateTopOrder(item) : this.getTopInfoList();
            break;
          case 'upOrDown':    //上下架
            try {
              const tips = "您确定要对该信息进行" + (this.itemInfo.display == 2 ? "上架" : "下架") + "吗？",
                isUp = +this.itemInfo.display == 1;
              await showDialog(tips);

              const res = await this.housingDealUpOrDown({
                rentingId: this.itemInfo.id,
                display: isUp ? 2 : 1
              });
              if (res.code == 1) {
                Toast.success({
                  message: isUp ? '已下架' : '已上架',
                  duration: 800
                })
                this.getMyCollection(true);
              } else {
                Toast.fail({
                  message: (isUp ? '下架' : '上架') + '失败',
                  duration: 800
                })
              }
            } catch (e) {
              console.log("原来是误操作")
            }
            break;
          case 'delete'://删除
            this.deleteInfo()
            break;
        }
      },
      //获取置顶套餐
      getTopInfoList() {
        showLoading();
        this.getJobTop({
          jobId: this.id,type:this.type
        }).then(result => {
          this.open()
          hideLoading();
          console.log('getJobTop', result)
          this.actions = [{
            title: '置顶类型',disabled: true
          }]
          const data = result.data;
          for (let i = 0; i < data.length; i++) {
            this.actions.push({
              name: data[i].body,
              field: 'top',
              data: data[i]
            })
          }
        })
      },
      //置顶
      async generateTopOrder(item) {
        try {
          await showDialog('需要支付：' + (+item.data.money).toFixed(2) + " 元");
          console.log(item);
          this.$router.push({
            name: 'cashier',
            params: {
              type: 28,
              param: {
                topId: item.data.id,
                jobId: this.id,
                type:this.type,
              },
              info: {
                money: item.data.money,
                type: "求职招聘信息置顶",
              }
            }
          });
        } catch (e) {
          console.log("老板，" + item.data.money + "元都不愿给我，置顶这件事，我很难帮你办啊！");
        }
      },
      async refreshPost() {
        console.log(this.type,this.id,this.categoryId)
        const res = this.type=='1'?await this.getJobEnterMoney({categoryId:this.categoryId}):await this.getHuntEnterMoney({categoryId:this.categoryId})
        let money = +res.refreshMoney
        if (money > 0) {
          try {
            await showDialog('需要支付：' + (+money).toFixed(2) + " 元");
            this.$router.push({
              name: 'cashier',
              params: {
                type: 27,
                param: {
                  jobId: this.id,type:this.type
                },
                info: {
                  money: money,
                  type: "求职招聘信息刷新",
                }
              }
            });
          } catch (e) {
            console.log(e)
          }
        } else {
          console.log('免费刷新');
          const order = await this.payJobHuntRefresh({
            jobId: this.id,type:this.type
          })
          console.log('order', order);
          showHandleStatusByFlag(order.code,order.msg,order.msg,)
        }
      },
      //删除
      async deleteInfo(){
        try {
          await showDialog("确定要删除该条信息吗？");
          showLoading();
          const res = await this.postJobHuntDelete({
            jobId: this.id,type:this.type
          })
          showHandleStatusByFlag(res.code,res.msg,res.msg,)
          res.code&&this.$parent.onRefresh();
        } catch (e) {
          console.log("还好没有删除该信息")
        }
      },
    },
    watch: {
      // 如果 `info` 发生改变，这个函数就会运行
      info: function (newVal, oldVal) {
        console.log('info',newVal)
        this.id=newVal.id
        this.type=newVal.type+''//转字符串用于find jobCategory
        this.categoryId=_.find(this.jobCategory,{data:this.type}).id
        this.actions = [];
        let arr=[];
        if(newVal.type==1&&newVal.status==1){
           arr=getOperation(['share','over','upOrDown'])
        }
        else if(newVal.type==1&&newVal.status!=1){
          arr=getOperation(['share','over','top','refresh','upOrDown'])
        }
        else if(newVal.type==2&&newVal.status==1){
          arr=getOperation(['over', 'share', 'upOrDown'])
        }
        else if(newVal.type==2&&newVal.status!=1){
          arr=getOperation(['share','over','top','refresh','upOrDown'])
        }
        this.actions = [{title: '信息ID：' + newVal.id}].concat(arr);
      }
    },
    mixins: [utilMixins],
    computed:{
      ...mapState("jobHunt", {
        jobCategory: state => state.jobCategory,
      }),
    },
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  .job-operation{
  }

</style>
