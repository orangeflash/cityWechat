<template>

  <dd-layout-div mi-h="100vh" class="bg-f">
    <Header/>
    <dd-layout-div :pad="[30]">
      <dd-layout-div class="flex flex-bt flex-y-center pad-b" :br="{bottom:`1px solid #EFF3F6`}">
        <dd-layout-img :src="getInfo.face" :width="1.24" :height="1.24" :fillet="1.24"/>
        <dd-layout-div class="flex-g-1" :mar="[0,0,0,30]">
          <dd-layout-div class="flex-y-center flex-bt">
            <dd-layout-div class="hide-e pad-t-5 fon-wb flex-g-1" :font-size="46">{{getInfo.name}}</dd-layout-div>
            <dd-layout-div class="col-price mar-l flex flex-y-center flex-g-0" :font-size="40">{{getInfo.salary}}<span
              class="col-3 fon-lg">/月</span></dd-layout-div>
          </dd-layout-div>
          <dd-layout-div class="flex flex-bt" :mar="[30,0,0]">
            <dd-layout-div class="col-9" :font-size="26">{{getInfo.releaseTime}} 发布</dd-layout-div>
            <dd-layout-div class="col-price">{{getInfo.updateTime}}更新</dd-layout-div>
          </dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>


      <dd-layout-div class="flex flex-y-center flex-bt" :pad="[47,0,0]">
        <dd-layout-div class="col-6" :font-size="32">{{getInfo.jobStatus}}</dd-layout-div>
        <dd-layout-div class="fon-b flex-y-center flex" @click="collection" :class="getInfo.follow?'col-f52c2c':''">
          <dd-layout-div class="iconfont icon-chakantieziguanzhu mar-r-10 "
                         :mar="[8,8,0]"/>
          收藏
        </dd-layout-div>
      </dd-layout-div>

      <dd-layout-div class="flex flex-y-center" :pad="[30,0,0]">
        <dd-layout-div class="col-6" :mar="[0,60,0,0]"><i class="iconfont icon-xingbie mar-r-5"></i>{{getInfo.sex}}
        </dd-layout-div>
        <dd-layout-div class="col-6" :mar="[0,60,0,0]"><i class="iconfont icon-shengri mar-r-5"></i>{{getInfo.age}}岁
        </dd-layout-div>
        <dd-layout-div class="col-6" :mar="[0,60,0,0]"><i class="iconfont icon-gongzuojingyan mar-r-5"></i>{{getInfo.experience}}
        </dd-layout-div>
        <dd-layout-div class="col-6" :mar="[0,60,0,0]"><i class="iconfont icon-xueli mar-r-5"></i>{{getInfo.education}}
        </dd-layout-div>
      </dd-layout-div>

      <dd-layout-div :pad="[30,0,0]">
        <dd-layout-tag v-for="(name ,key) in getInfo.tag" :key="key" :name="`#${name}`" :fill="true" color="#F2F3F5"
                       class="col-6 mar-r-10 mar-b-20"/>
      </dd-layout-div>
      <dd-layout-div class="fon-w5 fon-lg col-6" :line-height="50">{{getInfo.introduce}}</dd-layout-div>
    </dd-layout-div>
    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9" @click="openReport(getInfo.id,14)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>

    <dd-layout-div :pad="[30,0]" :mar="[0,30]" :br="{bottom:`1px solid #EFF3F6`}">
      <dd-layout-div class="fon-wb flex flex-y-center" :font-size="34" :height="55"><i
        class="iconfont icon-dian2 col-t mar-t-5"></i>求职期望
      </dd-layout-div>
      <dd-layout-div :pad="[30,0,0,26]">
        <dd-layout-div class="flex flex-bt flex-y-center">
          <dd-layout-div class="fon-wb fon-xll hide-e pad-t-5">{{getInfo.workNature}} | {{getInfo.area}}</dd-layout-div>
          <dd-layout-div class="fon-wb col-price flex-g-0" :font-size="40">{{getInfo.salary}}<span
            class="fon-normal col-3 fon-lg">/月</span></dd-layout-div>
        </dd-layout-div>
        <dd-layout-div class="col-6 fon-lg" :line-height="50" :pad="[30,0,0]">意向职位：{{getInfo.industryName}} <i
          class="iconfont icon-dian2 fon-xsss"></i> {{getInfo.positionName}}
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>


    <dd-layout-div :pad="[30,0]" :mar="[0,30]" :br="{bottom:`1px solid #EFF3F6`}">
      <dd-layout-div class="fon-wb flex flex-y-center" :font-size="34" :height="55"><i
        class="iconfont icon-dian2 col-t mar-t-5"></i>工作经历
      </dd-layout-div>
      <dd-layout-div :pad="[30,0,0,26]">
        <step-list :is-edit="isOwn" :list="jobDetlInfo.work"
                   @click="goPointPage({path:'addExperience',query:{type:2,jobId:$event.jobId,id:$event.id,info:$event}})"></step-list>
        <dd-layout-div v-if="isOwn" class="pad-tb flex-center">
          <dd-layout-div :width="280" :height="80" :fillet="50" class="flex-center col-t br-t" @click="goPointPage({path:'addExperience',query:{type:2,jobId:id}})">+ 添加工作经历</dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>

    <dd-layout-div :pad="[30,0]" :mar="[0,30]" :br="{bottom:`1px solid #EFF3F6`}">
      <dd-layout-div class="fon-wb flex flex-y-center" :font-size="34" :height="55"><i
        class="iconfont icon-dian2 col-t mar-t-5"></i>教育经历
      </dd-layout-div>
      <dd-layout-div :pad="[30,0,0,26]">
        <step-list :is-edit="isOwn" :list="jobDetlInfo.study"
                   @click="goPointPage({path:'addExperience',query:{type:1,jobId:$event.jobId,id:$event.id,info:$event}})"></step-list>
        <dd-layout-div v-if="isOwn" class="pad-tb flex-center">
          <dd-layout-div :width="280" :height="80" :fillet="50" class="flex-center col-t br-t" @click="goPointPage({path:'addExperience',query:{type:1,jobId:id}})">+ 添加教育经历</dd-layout-div>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <dd-layout-div :height="213" :pad="[0,30]" class="bg-f flex-y-center flex-bt">
      <dd-layout-div :width="331" :height="117" :fillet="117"
                     class="flex-center col-f fon-lg"
                     bg="linear-gradient(-90deg,rgba(255,156,0,1) 0%,rgba(255,225,0,1) 100%)"
                     @click="goPointPage({path:'/conversation',query:{tId:getInfo.userId}})"
      >
        <i class="iconfont icon-comments_fill fon-40 mar-t-10 mar-r-10"></i>
        在线私聊
      </dd-layout-div>
      <dd-layout-div :width="331" :height="117" :fillet="117"
                     class="flex-center col-f fon-lg"
                     bg="linear-gradient(-90deg,rgba(11,194,255,1) 0%,rgba(87,255,229,1) 100%)"
                     @click="callTel">
        <i class="iconfont icon-shouji fon-40 mar-t-10 mar-r-10"></i>
        联系方式
      </dd-layout-div>
    </dd-layout-div>

  </dd-layout-div>

</template>

<script>
  import {mapActions, mapState, mapGetters} from 'vuex'
  import Labels from '@/components/template/labels'
  import DetailsFooter from '@/components/template/details-footer'
  import StepList from '../../../components/template/job-hunt/step-list'
  import JobOperation from "../../../components/template/job-hunt/job-operation";
  import end from '@/assets/img/auxiliary/free-ride/end.png';
  import {Toast} from 'vant'
  import {utilMixins, computedDate} from "@/plugins/util-mixins";
  import {PlaceholderAvatar, PlaceholderImg, backendPath} from "@/project-config/base";
  import {hideLoading, showDialog, showHandleStatusByFlag, showLoading, showText} from "../../../util";
  import {updateShareConfig} from "../../../util/wechat-util";
  import ShareMask from "@/components/publication/share-mask";
  import {getAuxiliaryConfigColor} from '@/plugins/auxiliary/auxiliary-config'
  import {getLabelColor} from "../../../plugins/auxiliary/auxiliary-config";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdLayoutHtml from "../../../components/layout/dd-layout-html";

  export default {
    components: {DdLayoutHtml, DdLayoutImg, Labels, DetailsFooter, StepList, JobOperation, ShareMask},
    data() {
      return {
        list: [
          {name: '2009.09-2013.07', desc: '武汉聆听云码科技有限公司', desc2: '本科 | 市场营销'},
          {name: '2009.09-2013.07', desc: '武汉聆听云码科技有限公司', desc2: '本科 | 市场营销'},
          {name: '2009.09-2013.07', desc: '武汉聆听云码科技有限公司', desc2: '本科 | 市场营销'}
        ],
        showMask: false,
        end,
        PlaceholderAvatar,
        freeRideConfig: {},
        jobDetails: {},
        jobDetlInfo: {
          work: []
        },
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
              color: '#818181',
            }, {
              icon: 'icon-collection',
              iconActive: 'icon-collection-b',
              name: '收藏',
              color: '#818181',
              colorActive: this.$themeColor,
              useActive: false,
            },
          ],
          main: {
            name: '联系电话',
            childrenName: '',
          }
        },
        showJobOperation: false,
        operationData: {},
      }
    },
    methods: {
      ...mapActions('freeRide', ['getCarInfo', 'getFreeRideConfig', 'recordShare', 'getCategoryInfo']),
      ...mapActions("post", ["collectPost"]),
      ...mapActions("jobHunt", ["getJobConfig", "getJobInfo"]),
      ...mapActions("jobHunt/jobHuntEnter", ["getJobEnterMoney"]),
      getLabelColor(index, type) {
        return getLabelColor(index, type)
      },
      async load(id) {
        showLoading();
        this.jobConfig = await this.getJobConfig();
        this.huntMoney = await this.getJobEnterMoney(
          {categoryId: _.find(this.jobCategory, {data: '1'}).id}
        );
        this.labelsConfig.labels = [];
        const res = await this.getJobInfo({jobId: id, deliverId: this.deliverId});
        if (res.code == 1) {
          this.jobDetails = res.data.data;
          this.jobDetlInfo = res.data;
          //判断电话是否隐藏
          this.jobDetails.tel && this.$set(this.footerConfig.main, 'childrenName', this.canCallTel() ? this.jobDetails.tel : this.hideTelNumber(this.jobDetails.tel));
          this.$set(this.footerConfig.menu[2], 'colorActive', this.$themeColor);
          this.$set(this.footerConfig.menu[2], 'useActive', this.jobDetails.follow);

          // 配置转发信息
          updateShareConfig({
            title: this.jobDetails.industryName,
            imgUrl: this.getSingleImg(this.jobDetails.logo),
            desc: this.jobDetails.name + '求职' + this.jobDetails.positionName,
            link: window.location.href,
          })

        } else {
          showText('获取信息失败')
        }


        hideLoading();
      },
      // 收藏开关
      async offOnCollection() {
        showLoading();
        let res = await this.collectPost({
          postId: this.id,
          type: 7,
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
      async footerChoice(index) {
        if (index != 0) {
          const bool = await this.checkBindTel({callBack: true})
          if (!bool) return
        }
        switch (index) {
          case -1:      //按钮
            this.callTel();
            return;
          case 0:       //首页
            return this.goPointPage({
              path: '/auxiliary/jobHunt',
            })
          case 1:       //发布
            return this.goPointPage({
              name: 'JobJobSettled',
              params: {huntType: _.find(this.jobCategory, {data: '1'}).id}
            });
          case 2:       //收藏
            this.collection();
            return;
        }
      },
      // 打电话
      async callTel(tel) {

        if (this.canCallTel()) {
          location.href = `tel://${this.jobDetails.tel}`
        } else {
          try {
            const money = (+this.huntMoney.contactCharge).toFixed(2)
            await showDialog("需要支付 " + money + " 元");

            this.$router.push({
              name: 'cashier',
              params: {
                type: 26,
                param: {
                  jobId: this.id,
                  type: 5
                },
                info: {
                  money: money,
                  type: "查看简历拨打电话",
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
        return +this.huntMoney.contactCharge > 0 && !this.jobDetails.isLook ? false : true
      },
      // 收藏
      async collection() {
        const bool = await this.offOnCollection();
        this.$set(this.footerConfig.menu[2], 'useActive', bool);
      },
      editMethod() {
        this.showJobOperation = true;
        this.operationData = {id: this.jobDetails.id, type: 1, status: this.jobDetails.status};
      },
      onRefresh() {
        this.goPointPage({path: '/auxiliary/jobHunt'})
      },
    },
    computed: {
      // ...mapState({
      //   user: state => state.user,
      //   platform: state => state.platform,
      // }),
      ...mapState("jobHunt", {
        jobCategory: state => state.jobCategory,
      }),
      isOwn: function () {
        return this.user.id == this.jobDetails.userId
      },
      getInfo() {

        const data = JSON.parse(JSON.stringify(this.jobDetails || {}))

        let tag = [];
        data.label = JSON.parse(data.label || '{}')
        for (let i in data.label) tag.push(data.label[i])

        return {
          ...data,
          face: this.getSingleImg(data.logo),
          releaseTime: this.formatDateByTimeStamp(data.createdAt, 'MM-DD HH:mm'),
          updateTime: this.computedDate(data.changedAt),
          sex: data.sex == 1 ? '男' : '女',
          workNature: data.workNature == 1 ? '全职' : data.workNature == 2 ? '兼职' : '',
          tag,
        }
      }
    },
    mixins: [utilMixins],
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
        this.deliverId = this.$route.query.deliverId
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
      console.log(this.id, this.jobCategory)
    }
  }
</script>
