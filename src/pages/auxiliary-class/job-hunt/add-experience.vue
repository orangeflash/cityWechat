<template>
  <div id="AddExperience">
    <Header moreName="" @onMore="goPointPage({name: 'RedbagRank',})"></Header>
    <div class="main">
      <picker-column v-if="this.params.type=='1'" :list="educationDataOne" @inputForm="inputForm"/>
      <picker-column v-if="this.params.type=='1'" :list="educationDataTwo" @inputForm="inputForm"/>
      <picker-column v-if="this.params.type=='2'" :list="experienceDataOne" @inputForm="inputForm"/>
      <picker-column v-if="this.params.type=='2'" :list="experienceDataTwo" @inputForm="inputForm"/>
      <picker-column :list="dateData" @click="pickerChoice"/>
    </div>
    <footer class="footer-container">
      <button class="footer-btn" @click="formSubmit">保存</button>
    </footer>
    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="confirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>
  </div>
</template>
<script>
  import {mapActions, mapState, mapGetters} from 'vuex';
  import PickerColumn from "@/components/template/picker/column"
  import {utilMixins} from "../../../plugins/util-mixins";
  import {updateShareConfig} from "../../../util/wechat-util";
  import {
    hideLoading,
    showDialog,
    showLoading,
    getUrlParams,
    parseObjToParams,
    showText,
    showHandleStatusByFlag
  } from "../../../util";
  import {Toast} from 'vant';
  import {PlaceholderAvatar} from "../../../project-config/base";
  import PlaceholderImg from "../../../assets/img/personal/my_publication_placeholder.jpg";

  export default {
    name: "PartnerWdfs",
    components: {PickerColumn},
    data() {
      return {
        showDatetime: false,
        currentDate: new Date(),
        maxDate: new Date(),
        educationDataOne: [
          {
            name: '学校名称',
            desc: '',
            type:'text',
            placeholder: '请输入学校名称',
            field: 'name'
          },
        ],
        educationDataTwo: [
          {
            name: '专业名称',
            desc: '',
            type:'text',
            placeholder: '请输入专业名称',
            field: 'jobName'
          },
        ],
        experienceDataOne: [
          {
            name: '公司名称',
            desc: '',
            type:'text',
            placeholder: '请输入公司名称',
            field: 'name'
          },
        ],
        experienceDataTwo: [
          {
            name: '职位名称',
            desc: '',
            type:'text',
            placeholder: '请输入职位名称',
            field: 'jobName'
          },
        ],
        dateData:[
          {
            name: '开始时间',
            desc: '请选择',
            time:true,
            field: 'startTime'
          },
          {
            name: '结束时间',
            desc: '请选择',
            time:true,
            field: 'endTime'
          },
        ],
        params:{
          jobId:null,
          name:'',
          jobName:'',
          startTime:null,
          endTime:null,
          type:null,
          id:null,
          // education:'',
          // salary:'',
        },
        active: 0,
        dataList: [],
        PlaceholderImg,
        PlaceholderAvatar,
      }
    },
    methods: {
      ...mapActions("jobHunt", ["getJobConfig"]),
      ...mapActions("jobHunt/jobHuntEnter", ["getRecruitResume","getMyRecruit","postSaveExperience"]),
      // 输入表单的时候触发
      inputForm(item, key) {
        console.log(item,key,this.params)
        item.desc && item.desc.trim() ? this.params[item.field] = item.desc : this.params[item.field] = null;
      },
      pickerChoice(item, index) {
        console.log(item,index)
        this.pickerDateIndex=index
        switch (item.field) {
          case 'startTime':
          case 'endTime':
            this.showDatetime = !this.showDatetime;
            return
          // case 'rideTime':
          //   this.params.type == 2 ? this.showTime = !this.showTime : this.showDatetime = !this.showDatetime;
          //   return;
          // case 'num':
          //   this.showChoicePersoanl = !this.showChoicePersoanl;
          //   return;
        }
        // if (item.field === 'area') {
        //   this.showChoiceAddress = !this.showChoiceAddress;
        // } else {
        //   this.columns = this.columnsData[item.field];
        //   this.pickerShow = !this.pickerShow;
        //   this.pickertitle = item.name;
        //   this.pickerIndex = index || index == 0 ? index : item.field;
        // }
      },
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`;
        } else if (type === 'month') {
          return `${value}月`
        }
        return value;
      },
      confirm(value) {
        this.showDatetime = false;
        if (this.pickerDateIndex || this.pickerDateIndex == 0) {
          // let format = '',
          //   d = this.listInfo[this.index],
          //   desc = '';
          // if (d.field == 'rideTime' && this.params.type == 2) {
          //   desc = value;
          // } else {
          //   format = 'YYYY-MM-DD HH:mm';
          //   desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
          // }
          let desc='',format = 'YYYY-MM';
          desc = this.formatDateByTimeStamp(new Date(value).getTime() / 1000, format)
          this.$set(this.dateData[this.pickerDateIndex], 'desc', desc);
          this.params[this.dateData[this.pickerDateIndex].field] = this.getTimeStamp(value);
          console.log(this.pickerDateIndex,value,this.params)
        }
      },
      getFields(){
        let fields;
        if(this.params.type==1){
          fields=this.dateData.concat(this.educationDataOne,this.educationDataTwo)
        }
        else if(this.params.type==2){
          fields=this.dateData.concat(this.experienceDataOne,this.experienceDataTwo)
        }
        return fields
      },
      fieldJudeg() {
        let fields=this.getFields();
        for (let i = 0; i < fields.length; i++) {
          const json = fields[i];
          if (!this.params[json.field]) {
            if (json.type) {
              return json.placeholder
            } else {
              return "请选择" + json.name;
            }
          }
        }
        if (this.params.endTime <= this.params.startTime) return "结束时间不能小于等于开始时间";

        return false;
      },
      async formSubmit(){
        const res = this.fieldJudeg();
        if (res) return  showText(res,1000);
        showLoading();
        let result = await this.postSaveExperience(this.params);
        if(result.code) {
            // hideLoading();
            showHandleStatusByFlag([true, '提交成功'])
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000)
        }
        else {
          showText(result.msg,2000,true);
        }
      },
      //编辑时候执行
      fillForm(data) {
        //给parmas赋值
        for(let i in data){
          console.log(i)
          if(this.params.hasOwnProperty(i)){
            this.params[i]=data[i]
          }
        }
        //给页面数据赋值
        if(this.params.type==1){
          this.educationDataOne[0].desc=data.name
          this.educationDataTwo[0].desc=data.jobName
        }
        else if(this.params.type==2){
          this.experienceDataOne[0].desc=data.name
          this.experienceDataTwo[0].desc=data.jobName
        }
        this.dateData[0].desc=this.formatDateByTimeStamp(data.startTime,'YYYY-MM')
        this.dateData[1].desc=this.formatDateByTimeStamp(data.endTime,'YYYY-MM')
        console.log(data,this.params)
      }
    },
    mixins: [utilMixins],
    computed: {
      ...mapState({
        user: state => state.user
      }),
      ...mapState("jobHunt", {
        jobCategory: state => state.jobCategory,
      }),
      tabList(){
        return ['我的求职','我的招聘']
        // return  _.map(this.jobCategory,({name})=>name)
      },
    },

    async created() {
      this.params.type=this.$route.query['type'],this.params.jobId=this.$route.query['jobId'],this.params.id=this.$route.query['id'];
      // console.log(this.params,this.$route.query['info'])
      document.title=this.$route.query['type']=='1'?'教育经历':'工作经历'
      //编辑
      if(this.$route.query['id']){
        this.fillForm(this.$route.query['info'])
      }
      // //配置
      // await this.getJobConfig()
      // // 获取列表
      // this.changeTab(0);
    }
  }
</script>
<style scoped lang="scss">
  @import "../../../assets/theme";

  #AddExperience {
    .main{
      background: #fff;
      padding: 0 30px;
    }
  }
</style>
