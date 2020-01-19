<template>

  <dd-layout-div bg="#EFF3F6">
    <Header/>
    <dd-layout-div v-for="(item,key) in getInfo" :key="key" class=" bg-f" :class="key < getInfo.length-1 &&'mar-b-10'">
      <dd-layout-div v-for="(solo,s) in item" :key="s">
        <dd-layout-div v-if="solo.title" class="fon-xll col-9" :pad="[40,30,0]">{{solo.title}}</dd-layout-div>
        <div class="flex-wrap flex pad-30" v-else-if="solo.interest">
          <dd-layout-div v-for="(info,i) in interest" :key="i" @click="info.active = !info.active" :pad="[30,35]"
                         :mar="[13]" :class="info.active?'bg-t col-f':' col-6'" class=" br-r-40 br-e">
            {{info.name}}
          </dd-layout-div>
        </div>
        <dd-layout-div v-else class="flex-bt flex-y-center pad-tb-30 mar-lr br-b-EFF3F6" @click="clickHandle(solo)">
          <div class="fon-b col-9">{{solo.label}}</div>
          <div  v-if="solo.field!='city'" class="fon-b flex-y-center">{{solo.value || solo.default}}{{solo.unit || ''}}<i
            class="iconfont icon-youjiantou2 col-9 mar-t-5"></i></div>
          <input v-else class="out-n br-n t-r" v-model="solo.value" placeholder="请输入所在城市"/>
        </dd-layout-div>
      </dd-layout-div>
    </dd-layout-div>
    <dd-layout-div bg="#fff" :pad="[30]">
      <dd-layout-div :bg="$themeColor" @click="saveInfo" class="col-f fon-40 flex-center"
                     :height="98" :fillet="98">保存
      </dd-layout-div>
    </dd-layout-div>

    <van-popup
      position="bottom"
      v-model="pickerShow">
      <van-picker
        show-toolbar
        value-key="name"
        :title="pickertitle"
        :columns="columns"
        @confirm="pickerConfirm"
        @cancel="pickerShow = !pickerShow"
      />
    </van-popup>

    <van-popup v-model="showDatetime" position="bottom">
      <van-datetime-picker
        v-bind="dateTime"
        @confirm="confirm"
        @cancel="showDatetime = !showDatetime"
      />
    </van-popup>

  </dd-layout-div>

</template>
<script>
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdSwitch from "../../../components/template/dd-form/switch";

  import {mapActions, mapState} from 'vuex'
  import {format, hideLoading, showHandleStatusByFlag, showLoading} from "../../../util";

  export default {
    components: {DdSwitch, DdLayoutImg},

    data() {
      return {
        dateTime: {
          type: "date",
          currentDate: new Date(),
          minDate: new Date(0),
        },
        showDatetime: false,
        pickerShow: false,
        pickertitle: '请选择',
        interest: [],
        occupation: [],
        columns: [],
        weight: (() => {
          const arr = []
          for (let i = 40; i < 100; i++) {
            arr.push({name: i});
          }
          return arr
        })(),
        height: (() => {
          const arr = []
          for (let i = 80; i < 230; i++) {
            arr.push({name: i});
          }
          return arr
        })(),

        sex: [
          {name: '男'},
          {name: '女'},
        ],
        emotion: [
          {name: '单身'},
          {name: '恋爱'},
          {name: '已婚'},
          {name: '离异'},
          {name: '丧偶'},
          {name: '保密'},
        ],
        education: [
          {name: '高中及以下'},
          {name: '大专'},
          {name: '本科'},
          {name: '硕士'},
          {name: '博士'},
        ],
        nation: [],
        field: '',

        list: [
          [
            {label: '昵称', value: '', field: 'name'}
          ], [
            {label: '联系方式', value: '', field: 'tel'}
          ], [
            {title: '基本资料'},
            {label: '性别', value: '', field: 'sex'},
            {label: '生日', value: '', field: 'birthday'},
            {label: '身高', value: '', field: 'height', unit: 'cm'},
            {label: '体重', value: '', field: 'weight', unit: 'kg'},
          ], [
            {title: '详细资料'},
            {label: '所在城市', value: '', field: 'city'},
            {label: '民族', value: '', field: 'nation', default: '请选择'},
            {label: '学历', value: '', field: 'education', default: '请选择'},
            {label: '职业', value: '', field: 'occupation', default: '请选择'},
            {label: '情感状况', value: '', field: 'emotion', default: '请选择'},
          ], [
            {title: '想聊的话题'},
            {
              interest: [], field: 'label'
            }
          ]
        ]
      }
    },
    methods: {
      ...mapActions("cityLove", ["cityLoveRegister", 'cityLoveCategory', 'MzList']),
      confirm(value) {
        const birthday = format(new Date(value).getTime()).split(" ")[0];
        this.pickerConfirm({
          name: birthday
        })
        this.showDatetime = false;
      },
      pickerConfirm(e) {
        this.list.forEach(item => {
          item.forEach(solo => {
            if (solo.field == this.field) solo.value = e.name
          })
        })
        this.pickerShow = false
      },
      async saveInfo() {
        const infoData = {};
        this.list.forEach(item => {

          item.forEach(solo => {

            if (solo.field == 'label') {
              const label = {};
              this.interest.forEach(item => {
                if (item.active) {
                  label[item.id] = item.name
                }
              })
              infoData.label = label;
            } else if (solo.field == 'sex') {
              infoData[solo.field] = solo.value == '男' ? 1 : 2;
            } else if (solo.field == 'occupation') {
              this.occupation.forEach(oc => {
                if (oc.name == solo.value) {
                  infoData[solo.field] = oc.id;
                }
              })
            } else if (solo.field) {
              infoData[solo.field] = solo.value;
            }
          })

        })
        showLoading("正在保存中...")
        const res = await this.cityLoveRegister({
          ...infoData,
          icon: [
            {
              type: "img",
              url: this.registerInfo.icon,
            }
          ],
          id: this.registerInfo.id,
        })
        hideLoading();

        showHandleStatusByFlag(res.code, '已保存', res.msg)
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000)
        await this.cityLoveRegister({
          userId: this.user.id
        })

      },
      async clickHandle(e) {
        this.field = e.field
        this.columns = []
        switch (this.field) {
          case 'nation':
            this.columns = this.nation;
            break;
          case 'occupation':
            this.columns = this.occupation;
            break;
          case 'emotion':
            this.columns = this.emotion;
            break;
          case 'education':
            this.columns = this.education;
            break;
          case 'sex':
            this.columns = this.sex
            break;
          case 'height':
            this.columns = this.height
            break;
          case'weight':
            this.columns = this.weight;
            break;
          case 'birthday':
            this.showDatetime = true;
            break;
          case 'name':
            const name = await this.inputConfirm({
              title: '用户名',
              value: e.value,
              placeholder: '请输入用户名',
              length: 8
            })
            this.pickerConfirm({
              name: name || e.value
            })
            return;
          case 'tel':
            const tel = await this.inputConfirm({
              title: '联系电话',
              value: e.value,
              placeholder: '请输入联系电话'
            })
            this.pickerConfirm({
              name: tel || e.value,

            })
            return;
        }
        this.columns.length > 0 && (this.pickerShow = !this.pickerShow)
      }
    }
    ,
    computed: {
      ...
        mapState("cityLove", {
          registerInfo: s => s.registerInfo
        }),
      getInfo() {
        this.list.forEach(solo => {
          solo.forEach(item => {
            if (item.field == 'sex') {
              item.value = +this.registerInfo[item.field] == 1 ? '男' : '女'
            } else if (item.field == 'occupation') {

              this.occupation.forEach(oc => {
                if (oc.id == this.registerInfo.occupation) {
                  item.value = oc.name;
                }
              })
            } else {
              item.value = this.registerInfo[item.field] || ''
            }
          })
        })
        return this.list
      }
    }
    ,
    async created() {
      showLoading();
      // 兴趣
      const res = await this.cityLoveCategory({
        type: 19
      });

      // 职业
      const occupation = await this.cityLoveCategory({
        type: 18
      });
      this.MzList().then((res) => {
        this.nation = res
      })
      hideLoading();
      this.occupation = occupation

      this.interest = res.map(item => {
        return {
          ...item,
          active: !!this.registerInfo.label[item.id]
        }
      })
    }
  }
</script>
