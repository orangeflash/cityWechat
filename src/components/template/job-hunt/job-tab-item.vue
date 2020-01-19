<template>
  <div id="JobTabItem">
    <ul class="near__container">
      <li class="near-list__item" v-for="(item,index) in storeList" :key="index">
        <div v-if="jobType==1" class="JobTabItem_job"
             @click="goPointPage({path:'/auxiliary/jobHunt/jobJobDetails',query:{id:item.id,deliverId:item.deliverId}})">
          <div class="job_hd">
            <img-wrapper not-load="true" class="job_hd_img" :src="getSingleImg(item.logo)"></img-wrapper>
            <div class="job_hdrt">
              <div class="job_hdrttop">
                <div class="job_hdrttop_lt">{{item.name}}</div>
                <div class="job_hdrttop_rt"><span>{{item.salary}}</span><span>/月</span></div>
              </div>
              <div v-if="pageType!='myjob'" class="job_hdrtft">
                <div>
                  <i class="iconfont icon-xingbie"></i>
                  <span>{{item.sex=='2'?'女':'男'}}</span>
                </div>
                <div>
                  <i class="iconfont icon-shengri"></i>
                  <span>{{item.age}}岁</span>
                </div>
                <div>
                  <i class="iconfont icon-gongzuojingyan"></i>
                  <span>{{item.experience}}</span>
                </div>
                <div>
                  <i class="iconfont icon-xueli"></i>
                  <span>{{item.education}}</span>
                </div>
              </div>
              <div v-else class="job_hdrtft">
                意向职位：{{item.positionName}}
              </div>
            </div>
          </div>
          <div v-if="pageType!='myjob'" class="job_bd_top">
            <div class="job_bd_lt">
              <van-tag v-for="(val,key,i) in JSON.parse(item.label)" :key="key" :color="getLabelColor(i,0)" :plain="i?true:false" type="danger">{{val}}</van-tag>
              <!--<van-tag color="#FF7328" plain type="danger">形象好</van-tag>-->
              <!--<van-tag color="#618AFF" plain type="danger">经验丰富</van-tag>-->
            </div>
            <div v-if="pageType=='list'" class="job_bd_rt">联系</div>
            <div v-if="pageType=='collection'" class="job_bd_rt qxsc" @click.stop="$emit('cancel-col',item.id,1)">取消收藏</div>
          </div>
          <div v-if="pageType=='list'" class="job_ft">
            <!--<i class="iconfont icon-location"></i>-->
            <span class="job_ft_add">意向职位：{{item.positionName}}</span>
            <span class="job_ft_date">{{formatDateByTimeStamp(item.createdAt,'YYYY-MM-DD')}}</span>
          </div>
          <div v-if="pageType=='myjob'" class="job_ft">
            <i class="iconfont icon-location myjobadd"></i>
            <span class="job_ft_add">{{changeArea(item.area)}}</span>
            <span class="myjobedit" v-if="lookDl">查看详情</span>
            <span v-if="item.status==1||item.status==2" @click.stop="$emit('edit-operation',item.id,1,item.status)" class="myjobedit">操作/编辑</span>
          </div>
        </div>
        <div v-if="jobType==2" class="JobTabItem_hunt"
             @click="goPointPage({path:'/auxiliary/jobHunt/jobHuntDetails',query:{id:item.id}})">
          <div class="hunt_hd">
            <div class="hunt_hd_top">
              <div class="hunt_hd_top_lt">{{item.title}}</div>
              <div class="hunt_hd_top_rt"><span>{{item.salary}}</span><span>/月</span></div>
            </div>
            <div v-if="pageType=='myjob'" class="hunt_hd_ft">
              <i class="iconfont icon-location"></i>
              <span class="hunt_hd_ft_add">{{changeArea(item.area)}}</span>
              <span class="hunt_hd_ft_date">{{formatDateByTimeStamp(item.createdAt,'YYYY-MM-DD')}}</span>
            </div>
          </div>
          <div v-if="pageType=='myjob'" class="myhunt_ft">
            <span class="myhuntgetjl" @click.stop="goPointPage({path:'myGetJob',query:{recruitId:item.id}})">收到的简历</span>
            <span v-if="item.status==1||item.status==2" @click.stop="$emit('edit-operation',item.id,2,item.status)" class="myjobedit">操作/编辑</span>
          </div>
          <div v-if="pageType!='myjob'" class="hunt_bd">
            <div class="hunt_bd_top">
              <div class="hunt_bd_lt">
                <van-tag v-for="(val,key,i) in JSON.parse(item.label)" :key="key" :color="getLabelColor(i,1)" :plain="(i==0||i==1)?false:true" type="danger">{{val}}</van-tag>
              </div>
              <div v-if="pageType=='list'" class="hunt_bd_rt">申请</div>
              <div v-if="pageType=='collection'" class="hunt_bd_rt qxsc" @click.stop="$emit('cancel-col',item.id,2)">取消收藏</div>
            </div>
            <div v-if="pageType=='list'" class="hunt_bd_ft">
              <div>
                <i class="iconfont icon-dizhi3"></i>
                <span>{{changeArea(item.area)}}</span>
              </div>
              <div>
                <i class="iconfont icon-gongzuojingyan"></i>
                <span>{{item.experience}}</span>
              </div>
              <div>
                <i class="iconfont icon-xueli"></i>
                <span>{{item.education}}</span>
              </div>
            </div>
          </div>
          <div v-if="pageType=='list'" class="hunt_ft">
            <i class="iconfont icon-location"></i>
            <span class="hunt_ft_add">{{item.address}}</span>
            <span class="hunt_ft_date">{{formatDateByTimeStamp(item.createdAt,'YYYY-MM-DD')}}</span>
          </div>
        </div>
        <status-stamp :data="item"></status-stamp>
      </li>
    </ul>
  </div>

</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import {Dialog} from 'vant';
  import StatusStamp from "@/components/template/status-stamp";
  import {PlaceholderImg, backendPath} from "../../../project-config/base";
  import {utilMixins} from "../../../plugins/util-mixins";
  import {getLabelColor} from "../../../plugins/auxiliary/auxiliary-config";

  export default {
    name: "JobTabItem",
    props: ['storeList', 'sort', 'jobType', 'pageType',"lookDl"],
    components: {StatusStamp},
    data() {
      return {
        backendPath
      }
    },
    methods: {
      // ...mapActions("post", ["getPostListByParams"]),

      // getImageList(obj) {
      //   return this.getMediaList(obj).img || []
      // },
      changeArea(area){
        //这种是错误的写法
       // let arr =  area.split(',').splice(0,1).join(',');
        let arr=area&&area.split(',')||[]
        //splice()返回值是删除的数组，且改变了原数组
        //如果仅删除一个元素，则返回一个元素的数组
        return arr.splice(1,arr.length-1).join(',');
      },
      getLabelColor(index,type){
        return getLabelColor(index,type)
      },
    },
    computed: {},

    mixins: [utilMixins],
    created() {

    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/theme";

  #JobTabItem {
    color: #333;
    font-size: $font-size-base;
    padding: 20px 30px 0px;
    background: #f4f4f4;

    .near__container {
      .near-list__item {
        position: relative;
        z-index: 0;
        margin: 0px 0px 20px;
        background: #fff;
        border-radius: 10px;
      }
    }

    .van-tag {
      font-size: 12px;
      margin-right: 10px;
    }

    .JobTabItem_hunt {
      > div {
        padding: 25px 30px;
      }

      /*招聘头部*/
      .hunt_hd {
        &_top {
          @include flex-between;

          &_lt {
            font-size: $font-size-xl;
            @include t-overflow;
          }

          &_rt {
            margin-left: 30px;
            flex-shrink: 0;

            :nth-child(1) {
              font-size: $font-size-xl;
              color: $themeColor;
            }

            :nth-child(2) {
              font-size: $font-size-sm;
              color: #666;
            }
          }
        }
        &_ft{
          margin-top: 30px;
          @include flex-center($justify: space-between);
          color: #999;

          .iconfont {
            margin-right: 20px;
            margin-top: 5px;
          }

          &_add {
            flex: 1;
            @include t-overflow();
          }

          &_date {
            margin-left: 20px;
          }

        }
      }

      /*招聘bd*/
      .hunt_bd {
        border-top: 1.1px solid #EEEEEE;
        &_top {
          @include flex-between;
        }

        &_lt {
          font-size: $font-size-xl;
          @include t-overflow;
        }

        &_rt {
          color: #fff;
          border-radius: 25px;
          padding: 12px 25px;
          margin-left: 30px;
          flex-shrink: 0;
          background: linear-gradient(to right, #FF3838, #FF5D05);
        }

        &_ft {
          > div {
            flex-shrink: 0;
          }

          margin-top: 30px;
          color: #999999;
          @include flex-between;
          flex-wrap: wrap;
        }
      }

      /*招聘ft*/
      .hunt_ft {
        border-top: 1.1px solid #EEEEEE;
        @include flex-center($justify: flex-start);

        .iconfont {
          color: #FA864D;
          font-size: 50px;
          margin-right: 20px;
          margin-top: 5px;
        }

        &_add {
          flex: 1;
          @include t-overflow;
        }

        &_date {
          color: #999;
        }
      }
    }

    .JobTabItem_job {
      > div {
        padding: 25px 30px;
      }

      /*工作头部*/
      .job_hd {
        display: flex;
        align-items: center;
        border-bottom: 1.1px solid #EEEEEE;

        &_img {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          margin-right: 20px;
        }

        &rt {
          flex: 1;
          /*@include flex-center($direction:column,$justify:space-between);*/
          &top {
            @include flex-between;

            &_lt {
              flex: 1;
              font-size: $font-size-xl;
              @include t-overflow;
            }

            &_rt {
              margin-left: 30px;
              flex-shrink: 0;

              :nth-child(1) {
                font-size: $font-size-xl;
                color: $themeColor;
              }

              :nth-child(2) {
                font-size: $font-size-sm;
                color: #666;
              }
            }
          }

          &ft {
            > div {
              flex-shrink: 0;
            }

            margin-top: 30px;
            color: #999999;
            @include flex-between;
            flex-wrap: wrap;
          }
        }
      }

      /*工作bd*/
      .job_bd {
        &_top {
          @include flex-between;
          border-bottom: 1.1px solid #EEEEEE;
        }

        &_lt {
          font-size: $font-size-xl;
          @include t-overflow;
        }

        &_rt {
          color: #fff;
          border-radius: 25px;
          padding: 12px 25px;
          margin-left: 30px;
          flex-shrink: 0;
          background: linear-gradient(to right, #FF3838, #FF5D05);
        }
      }

      /*工作ft*/
      .job_ft {
        @include flex-center($justify: flex-start);
        color: #999;

        .iconfont {
          color: #FA864D;
          font-size: 50px;
          margin-right: 20px;
          margin-top: 5px;
        }

        .myjobadd {
          font-size: 30px;
          color: #999;
        }

        &_add {
          flex: 1;
          @include t-overflow();
        }

        &_date {
          margin-left: 20px;
        }
      }
    }

    .qxsc {
      background: #fff !important;
      color: $themeColor !important;
      border: 1.1px solid $themeColor;
    }

    .myjobedit {
      color: #fff;
      padding: 15px 20px;
      border-radius: 10px;
      background: $themeColor;
    }

    .myhuntgetjl {
      color: #fff;
      padding: 15px 20px;
      border-radius: 10px;
      background: $themeColor;
    }

    /*我的招聘ft*/
    .myhunt_ft {
      border-top: 1.1px solid #EEEEEE;
      @include flex-center($justify: space-between);
      color: #999;

      .iconfont {
        margin-right: 20px;
        margin-top: 5px;
      }

      &_add {
        flex: 1;
        @include t-overflow();
      }

      &_date {
        margin-left: 20px;
      }
    }
  }
</style>
