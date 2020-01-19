<template>

  <dd-layout-div class="bg-f" mi-h="100vh">
    <Header/>
    <dd-layout-div :pad="[30,0]" :mar="[0,30]" :br="{bottom:`1px solid #EFF3F6`}">
      <dd-layout-div class="flex-bt flex-y-center mar-b" :height="58">
        <dd-layout-div class="pad-t-10 hide-e fon-wb" :font-size="46">{{getInfo.title}}</dd-layout-div>
        <dd-layout-div class="col-price fon-wb fon-40 flex-g-0 mar-l">{{getInfo.salary}}<span
          class="fon-w5 col-3 fon-lg"
          v-if="getInfo.salary!='面议'">/月</span>
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="mar-b fon-lg">{{getInfo.title}}</dd-layout-div>
      <dd-layout-div class="col-9" :font-size="26">{{getInfo.releaseTime}}发布</dd-layout-div>
    </dd-layout-div>

    <dd-layout-div :pad="[30,0]" :mar="[0,30]" :br="{bottom:`1px solid #EFF3F6`}">
      <dd-layout-div class="flex flex-y-center flex-bt">
        <dd-layout-div class="col-6 fon-lg flex-y-center"><i v-if="getInfo.area" class="iconfont icon-dingwei1 col-3 mar-r-5"></i>{{getInfo.area}}
        </dd-layout-div>
        <dd-layout-div class="fon-b flex-y-center flex" @click="collection" :class="getInfo.follow?'col-f52c2c':''">
          <dd-layout-div class="iconfont icon-chakantieziguanzhu "
                         :mar="[0,8,0]"/>
          收藏
        </dd-layout-div>
      </dd-layout-div>
      <dd-layout-div class="flex flex-y-center" :pad="[30,0,0]">
        <dd-layout-div class="col-6" :mar="[0,60,0,0]"><i class="iconfont icon-xingbie mar-r-5"></i>{{getInfo.sex}}
        </dd-layout-div>
        <dd-layout-div class="col-6" :mar="[0,60,0,0]"><i class="iconfont icon-gongzuojingyan mar-r-5"></i>{{getInfo.experience}}
        </dd-layout-div>
        <dd-layout-div class="col-6" :mar="[0,60,0,0]"><i class="iconfont icon-xueli mar-r-5"></i>{{getInfo.education}}
        </dd-layout-div>
      </dd-layout-div>

      <dd-layout-div :pad="[30,0,0]">
        <dd-layout-tag :name="`#${val}`" :key="key" v-for="(val,key,i) in getInfo.tag" :fill="true" color="#F2F3F5"
                       class="col-6 mar-r-10 mar-b-20"/>
      </dd-layout-div>

    </dd-layout-div>


    <dd-layout-div :pad="[30,0]" :mar="[0,30]" :br="{bottom:`1px solid #EFF3F6`}">
      <dd-layout-div class="fon-wb flex flex-y-center mar-b-10" :font-size="34" :height="55"><i
        class="iconfont icon-dian2 col-t mar-t-5"></i>职位详情
      </dd-layout-div>


      <dd-layout-div class="col-6 fon-lg" :line-height="60" :mar="[0,0,0,25]" :key="getInfo.description" v-if="getInfo.description"
                     v-html="getInfo.description"
      />
      <dd-layout-div class="fon-b flex-center" color="#7D88AC" :line-height="60" v-else :mar="[0,0,0,25]">暂无数据
      </dd-layout-div>


    </dd-layout-div>

    <dd-layout-div :pad="[30,0]" :mar="[0,30]" :br="{bottom:`1px solid #EFF3F6`}">
      <dd-layout-div class="fon-wb flex flex-y-center mar-b-10" :font-size="34" :height="55"><i
        class="iconfont icon-dian2 col-t mar-t-5"></i>公司环境
      </dd-layout-div>
      <dd-layout-div class="over-a flex" :pad="[20,0,10]" v-if="getInfo.pictures.length > 0">
        <dd-layout-img :width="1.40" :height="1.40" v-for="(item,index) in getInfo.pictures"
                       @click="previewImage(item,getInfo.pictures)" :key="index" :src="item" class="mar-r-10 bg-tran"
                       :fillet="0.08"/>
      </dd-layout-div>
      <dd-layout-div :pad="[20,0,10]" :height="140" class="flex-center fon-b" v-else color="#7D88AC">暂无数据
      </dd-layout-div>
    </dd-layout-div>

    <dd-layout-div class="flex flex-y-center" :pad="[30]"
                   @click="goPointPage('/auxiliary/jobHunt/allHuntInfo?userId='+getInfo.userId)">
      <dd-layout-img class="mar-r" :width="1.31" :height="1.31" :fillet="0.3" :src="getInfo.face"/>
      <dd-layout-div class="flex-g-1">
        <dd-layout-div class="flex">
          <dd-layout-div class="fon-wb fon-xll hide-e" :pad="[10,0]" max-w="100%">{{getInfo.name}}</dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="flex-bt mar-t-15">
          <dd-layout-div class="fon-sm">共{{getInfo.huntLength}}个职位在招</dd-layout-div>
          <i class="iconfont icon-iconfront- col-3"></i>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9" @click="openReport(getInfo.id,13)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>
    <dd-layout-div :pad="[30,0]" :mar="[0,30]" :br="{bottom:`1px solid #EFF3F6`}"
                   @click="1||openLocation({lat:getInfo.lat,lng:getInfo.lng,name:getInfo.storeName,address:getInfo.area+getInfo.address})">
      <dd-layout-div class="fon-wb flex flex-y-center mar-b-10" :font-size="34" :height="55"><i
        class="iconfont icon-dian2 col-t mar-t-5"></i>公司地址
      </dd-layout-div>
      <dd-layout-div class="flex-bt mar-t-15">
        <dd-layout-div class="fon-b hide-e col-6 pad-t-5" :mar="[0,0,0,26]">{{getInfo.area}} {{getInfo.address}}
        </dd-layout-div>
        <!--<i class="iconfont icon-iconfront- col-3"></i>-->
      </dd-layout-div>
    </dd-layout-div>


    <dd-layout-div :height="213" :pad="[0,30]" class="bg-f flex-y-center flex-bt">
      <dd-layout-div :width="331" :height="117" :fillet="117"
                     class="flex-center col-f fon-lg"
                     bg="linear-gradient(-90deg,rgba(255,156,0,1) 0%,rgba(255,225,0,1) 100%)"
                     @click="sendResume"
      >
        <i class="iconfont icon-wodejianli fon-xss mar-t-5 mar-r-10"></i>
        投递简历
      </dd-layout-div>
      <dd-layout-div :width="331" :height="117" :fillet="117"
                     class="flex-center col-f fon-lg"
                     bg="linear-gradient(-90deg,rgba(11,194,255,1) 0%,rgba(87,255,229,1) 100%)"
                     @click="callTel">
        <i class="iconfont icon-shouji fon-40 mar-t-10 mar-r-10"></i>
        {{getInfo.linkman}}
      </dd-layout-div>
    </dd-layout-div>

    <van-dialog
      class="dialog"
      title="请选择简历"
      v-model="dialogshow"
      show-cancel-button
      :before-close="beforeClose"
    >
      <van-radio-group v-model="jobId" class="vanradiogroup">
        <van-cell-group>
          <van-cell class="personjoblist" center v-for="item in jobList" :key="item.id" @click="radioChange(item.id)">
            <van-cell center>
              <template slot="icon">
                <img-wrapper :src="getSingleImg(item.logo)||PlaceholderAvatar" not-load="true"
                             class="personjoblistimg"/>
              </template>
              <template slot="title">
                <div class="personjoblisttop">
                  <div>{{item.name}}</div>
                  <div class="money"><span>{{item.salary}}</span>/月</div>
                </div>
                <div class="personjoblistft" style="margin-top: 5px;">
                  <div class="hhjrfy">意向职位：{{item.positionName}}</div>
                  <div class="hhjrfy"></div>
                </div>
              </template>
            </van-cell>
            <van-radio slot="right-icon" :name="item.id" :checked-color="$themeColor"/>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>

  </dd-layout-div>


</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import Labels from '@/components/template/labels'
  import FormList from '@/components/template/form-list'
  import DetailsFooter from '@/components/template/details-footer'
  import JobOperation from "../../../components/template/job-hunt/job-operation";
  import {Toast} from 'vant'
  import {computedDate, utilMixins} from "@/plugins/util-mixins";
  import {backendPath, PlaceholderAvatar, PlaceholderImg,} from "@/project-config/base";
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  import {updateShareConfig, openLocation} from "../../../util/wechat-util";
  import ShareMask from "@/components/publication/share-mask";
  import {getAuxiliaryConfigColor} from '@/plugins/auxiliary/auxiliary-config'
  import {getLabelColor} from "../../../plugins/auxiliary/auxiliary-config";
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";

  export default {
    components: {DdLayoutImg, DdLayoutHtml, Labels, JobOperation, DetailsFooter, FormList, ShareMask},
    data() {
      return {
        backendPath,
        showMask: false,
        dialogshow: false,
        jobId: null,
        jobDetlInfo: null,
        jobList: [],
        PlaceholderAvatar,
        freeRideConfig: {},
        jobDetails: null,
        labelsConfig: {
          labels: [],
          back: true
        },
        remarksConfig: {
          labels: [],
        },
        footerConfig: {
          menu: [
            {
              icon: 'icon-shouyexian',
              name: '首页',
              color: '#818181',
            }, {
              icon: 'icon-fabudianjizhuangtai-',
              name: '发布',
              judge: true,
              color: '#818181',
            }, {
              icon: 'icon-collection',
              iconActive: 'icon-collection-b',
              name: '收藏',
              judge: true,
              color: '#818181',
              colorActive: this.$themeColor,
              useActive: false,
            },
          ],
          main: {
            name: '投递简历',
            judge: true,
            childrenName: '',
          }
        },
        showJobOperation: false,
        operationData: {},
      }
    },
    methods: {
      openLocation,
      ...mapActions('freeRide', ['getCarInfo', 'getFreeRideConfig', 'recordShare', 'getCategoryInfo']),
      ...mapActions("post", ["collectPost"]),
      ...mapActions("jobHunt", ["getJobConfig", "getHuntInfo",]),
      ...mapActions("jobHunt/jobHuntEnter", ["getJobDeliver", "getMyResume"]),
      getLabelColor(index, type) {
        return getLabelColor(index, type)
      },
      getImageList(obj) {
        return this.getMediaList(obj).img || []
      },
      async load(id) {
        showLoading();
        this.jobConfig = await this.getJobConfig();
        this.labelsConfig.labels = [];
        const res = await this.getHuntInfo({recruitId: id});
        if (res.code == 1) {
          this.jobDetails = res.data.data;
          this.jobDetlInfo = res.data;
          this.$set(this.footerConfig.menu[2], 'colorActive', this.$themeColor);
          this.$set(this.footerConfig.menu[2], 'useActive', this.jobDetails.follow);
          // console.log(this.getMediaList(this.jobDetails.media))
          // 配置转发信息
          updateShareConfig({
            title: this.jobDetails.title||this.jobConfig.field,
            imgUrl: this.getMediaList(this.jobDetails.media).img && this.getMediaList(this.jobDetails.media).img[0] || this.jobConfig.shareImg,
            desc: this.jobDetails.positionName+' '+this.jobDetails.salary,
            link: window.location.href,
          })

        } else {
          showText('获取信息失败')
        }

        hideLoading();
      },
      async sendResume() {
        if (this.jobList.length == 0) {
          try {
            await showDialog("您暂无简历,是否进行添加?");
            this.goPointPage({
              name: 'JobJobSettled',
              params: {huntType: _.find(this.jobCategory, {data: '2'}).id}
            })
          } catch (e) {
            //showText('您暂无简历，请添加简历后投递',2000)
            return false;
          }
        }
        this.dialogshow = true;
      },
      // 收藏开关
      async offOnCollection() {
        showLoading();
        let res = await this.collectPost({
          postId: this.id,
          type: 8,
        });
        this.load(this.id)
        if (res.code == 1) {
          res = res.data;
          if (res.status == 2) {
            showHandleStatusByFlag(true, '取消成功')
          } else {
            showHandleStatusByFlag(true, '收藏成功')
          }
        } else {
          hideLoading();
        }

        return res.status == 1
      },
      //获取我的简历
      async getMyJobList() {
        // 默认选中第一个
        this.jobList = await this.getMyResume({page: 1, size: 10}) || [];
        this.JobId = this.jobList[0].id;
        this.radioChange(this.JobId)
      },
      async radioChange(id) {
        this.jobId = id;
        // this.gradeInfo=await this.getPartnergradeInfo({gradeId:id})
        // console.log(this.gradeInfo)
      },
      // 投递简历
      async beforeClose(action, done) {
        console.log(action, this.jobId)
        if (action === 'confirm') {
          // showLoading()
          const res = await this.getJobDeliver({jobId: this.jobId, recruitId: this.id})
          showHandleStatusByFlag(res.code, '投递成功', res.msg)
          if (res.code) {
            // this.myboss=yqminfo.data
          }
          done();
          // showHandleStatusByFlag(true,'绑定成功')
          // showHandleStatusByFlag([true,'绑定成功'])
          // setTimeout(done, 1000);
        } else {
          done();
        }
      },
      async footerChoice(index) {
        // if(index!=0){
        //   const bool=await this.checkBindTel({callBack:true})
        //   if(!bool) return
        // }
        switch (index) {
          case -1:      //按钮
            if (this.jobList.length == 0) {
              try {
                await showDialog("您暂无简历,是否进行添加?");
                this.goPointPage({
                  name: 'JobHuntSettled',
                  params: {huntType: _.find(this.jobCategory, {data: '2'}).id}
                })
              } catch (e) {
                //showText('您暂无简历，请添加简历后投递',2000)
                return false;
              }


            }
            this.dialogshow = true;
            return;
          case 0:       //首页
            return this.goPointPage({
              path: '/auxiliary/jobHunt'
            })
          case 1:       //发布
            return this.goPointPage({
              name: 'JobHuntSettled',
              params: {huntType: _.find(this.jobCategory, {data: '2'}).id}
            });
          case 2:       //收藏
            this.collection();
            return;
        }
      },
      // 打电话
      async callTel(tel) {

        if (this.canCallTel()) {
          location.href = `tel://${this.jobDetails.linkTel}`
        } else {
          try {
            const money = (+this.freeRide.moneyData.seeMoney || 0).toFixed(2)
            await showDialog("需要支付 " + (+money).toFixed(2) + " 元");

            this.$router.push({
              name: 'cashier',
              params: {
                type: 17,
                param: {
                  carId: this.id,
                  type: 3
                },
                info: {
                  money: money,
                  type: "拨打电话",
                }
              }
            });
          } catch (e) {
            console.log('老板，我是需要生存的啊！')
          }
        }
      },
      // 可以打电话，返回的是bool
      canCallTel() {
        return true
        //没有价格就是免费拨打
        console.log("!this.freeRide.moneyData", !this.freeRide.moneyData)

        if (!this.freeRide.moneyData.seeMoney || +this.freeRide.moneyData.seeMoney <= 0) return true;

        if (!this.freeRideConfig.see || !this.freeRide.isLook) return false;
        console.log("+this.freeRideConfig.see:" + (this.freeRideConfig.see));


        return +this.freeRideConfig.see == 1 ? (+this.freeRide.isLook == 1 ? true : false) : false;
      },
      // 收藏
      async collection() {
        const bool = await this.offOnCollection();
        this.$set(this.footerConfig.menu[2], 'useActive', bool);
      },
      editMethod() {
        this.showJobOperation = true;
        this.operationData = {id: this.jobDetails.id, type: 2, status: this.jobDetails.status};
      },
      onRefresh() {
        this.goPointPage({path: '/auxiliary/jobHunt'})
      },
    },
    computed: {
      ...mapState({
        user: state => state.user,
        platform: state => state.platform,
      }),
      ...mapState("jobHunt", {
        jobCategory: state => state.jobCategory,
      }),
      isOwn: function () {
        return this.user.id == this.jobDetails.userId
      },
      getInfo() {
        const data = this.jobDetails || {};
        let pictures = data.media ? JSON.parse(data.media) : []
        return {
          ...data,
          releaseTime: this.formatDateByTimeStamp(data.createdAt, 'MM-DD HH:mm'),
          sex: data.sex == 1 ? '男' : data.sex == 2 ? '女' : '性别不限',
          pictures: pictures.map(item => {
            return this.getSingleImg(item.url)
          }),
          face: data.storeLogo && this.getMediaList(data.storeLogo).img[0] || data.portrait || PlaceholderAvatar,
          name: data.storeName || data.userName,
          storeIsAuth: +data.storeIsAuth === 1,  //企业认证
          isAuth: +data.isAuth === 1,      //个人认证
          isEnsure: +data.isEnsure === 1,  //已交保证金
          huntLength: data.count,
          tag: data.tag || [],
          isStore: data.storeId > 0,   //是否为商家
        }
      }
    },
    mixins: [utilMixins],
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
      } else {
        Toast.fail({
          message: '缺少Id',
          duration: 1500
        })
        setTimeout(() => {
          this.$router.go(-1);
        }, 1500)
      }
      //用户是通过分享进来的
      // if (this.$route.query.isShare) {
      //   this.recordShare({
      //     id: this.id
      //   })
      // }
      this.load(this.id);
      this.getMyJobList();
      console.log(this.id)
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  .vanradiogroup {
    margin-top: 20px;
    height: auto;
    max-height: 400px;
    overflow-y: scroll;
  }

  .personjoblist {
    &img {
      @include widhei($width: 100px, $height: 100px, $brs: 50%);
      margin-right: 20px;
    }

    &top {
      @include flex-between;

      .money span {
        color: #e60000;
      }
    }

    &ft {
      color: #999;
      //@include t-overflow;
    }
  }
</style>
