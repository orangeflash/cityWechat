<template>
  <div class="bg-f">
    <div class="posi-r">
      <Banner
        :height="7.5"
        :swiper="{children:getInfo.images}"
        unit="rem"
      ></Banner>
      <dd-layout-div @click="$router.go(-1)" :width="52" :height="52" :mar="[50,20]" :fillet="50"
                     class="t0 l0 posi-a bg-0-5 col-f flex-center">
        <i class="iconfont icon-zuojiantou3 mar-t-5"></i>
      </dd-layout-div>

      <dd-layout-div :width="122" :height="122" :mar="[50,30]" :fillet="122" @click="collectionHandle"
                     class="t0 r0 posi-a bg-0-5 col-f flex-center">
        <div class="t-c">
          <i class="iconfont icon-xin fon-40" :class="getInfo.follow?'col-t':'col-f'"></i>
          <p class=" fon-xss mar-t-10" :class="getInfo.follow?'col-t':'col-bb'">{{getInfo.follow?'已关注':'关注'}}</p>
        </div>

      </dd-layout-div>

    </div>
    <dd-layout-div :pad="[40,0,30]" :mar="[0,30]" class="br-b-d">
      <div class="fon-40 fon-wb">{{getInfo.nickname}}</div>
      <div class=" flex mar-t-20">
        <dd-layout-div class="col-f bg-F871A4 fon-xsss pad-6-4-4 mar-r-10 br-r-4 flex-y-center"
                       :bg="getInfo.sex=='男'?'#4FA6F6':'#F871A4'"><i
          class="iconfont col-f fon-xsss mar-r-5" :class="getInfo.sex=='男'?'icon-nanxianxing':'icon-nvxianxing'"></i>{{getInfo.age}}岁
        </dd-layout-div>
        <span class="col-f bg-CA99F3 fon-xsss pad-6-4-4 mar-r-10 br-r-4 flex-y-center"><i
          class="iconfont icon-dingwei1 col-f fon-xsss mar-r-5"></i>{{getInfo.city}}</span>
      </div>
      <p class="fon-sm mar-t-20">{{getInfo.introduce}}</p>
    </dd-layout-div>

    <div class="flex pad-30 flex-y-center">
      <div @click="tabConfig.index = 0" class="fon-w5 mar-r" :class="tabConfig.index == 0?'fon-40':'fon-b'">资料</div>
      <div @click="tabConfig.index = 1" class="fon-w5 mar-r" :class="tabConfig.index == 1?'fon-40':'fon-b'">
        动态{{getInfo.dynamicNum}}
      </div>
    </div>


    <div class="pad-30" v-if="tabConfig.index == 0">
      <div v-for="(item,key) in infoList" :key="key" class="">
        <div class="fon-b fon-wb">{{item.title}}</div>
        <div class="pad-t pad-b">
          <!--相册-->
          <dd-layout-div :height="140" v-if="item.type == 'photo'" class="mar-b" @load="divLoad">
            <div v-if="getInfo.photos.length" class="flex-bt">
              <div class="flex flex-g-1 over-h">
                <dd-layout-img :width="1.4" :height="1.4" :fillet="0.08" class="mar-r-10"
                               v-for="(url,u) in getInfo.photos" @click="previewImage(url,getInfo.photos)" :src="url"
                               :key="u"/>
              </div>
              <dd-layout-div class="mar-l flex-center" :width="90"
                             @click="goPointPage('/auxiliary/cityLove/albums?userId='+getInfo.id)"
                             if="getInfo.photos.length > 4">
                <i class="iconfont icon-right fon-46 col-9"></i>
              </dd-layout-div>
            </div>
            <dd-layout-div v-else class="t-c fon-w5 fon-b flex-center" :height="140" color="#7D88AC">暂无数据
            </dd-layout-div>
          </dd-layout-div>

          <!--签名-->
          <div class="fon-b col-6 mar-b" v-if="item.type == 'sign'">{{item.value[item.type]}}</div>

          <!--基本资料 | 详细资料-->
          <ul class="flex-wrap flex" v-if="item.type == 'data'">
            <li class="fon-b col-6 w50 mar-b" v-for="(info,i) in item.value[item.type]" :key="i">
              <span class="col-6 mar-r">{{info.label}}</span><span v-if="info.value">{{info.value}}{{info.unit?info.unit:''}}</span><span
              class="col-7D88AC"
              v-else>暂无数据</span>
            </li>
          </ul>
          <!--兴趣-->
          <ul class="flex-wrap flex" v-if="item.type == 'interest'">
            <li v-for="(info,i) in getInfo.label" :key="i" class="pad-30 br-r-40 br-e col-6 mar-b-20 mar-r">
              {{info}}
            </li>
          </ul>
        </div>
      </div>
      <!--<dd-layout-div :height="136" bg="#EFF3F6" :fillet="136" :pad="[0,30]"-->
      <!--class="flex-bt flex-y-center mar-b">-->
      <!--<div class="flex-y-center">-->
      <!--<dd-layout-img :src="vipStar" :width="0.86" :height="0.96" class="mar-l bg-tran"></dd-layout-img>-->
      <!--<div class="mar-l">-->
      <!--<div class="fon-wb fon-lg mar-b-20">超级会员卡</div>-->
      <!--<p class="col-9">可免费查看联系方式哦！</p>-->
      <!--</div>-->
      <!--</div>-->
      <!--<dd-layout-div :pad="[25,30,20]" class="bg-line-FDA544-FF9426 br-r-40 col-f fon-sm"-->
      <!--@click="goPointPage('/auxiliary/vip')">立即开通-->
      <!--</dd-layout-div>-->
      <!--</dd-layout-div>-->
      <div class="flex-x-center">
        <!--<dd-layout-div :width="331" :height="117" :fillet="117"-->
        <!--bg="linear-gradient(-90deg,rgba(255,156,0,1) 0%,rgba(255,225,0,1) 100%)"-->
        <!--@click="goPointPage({path:'/conversation',query:{tId:getInfo.userId}})"-->
        <!--class="flex-center col-f fon-lg"><i class="iconfont icon-comments_fill mar-r-10 fon-40"></i>私信聊天-->
        <!--</dd-layout-div>-->
        <dd-layout-div :width="331" :height="117" :fillet="117"
                       @click="contactOther"
                       bg="linear-gradient(-90deg,rgba(11,194,255,1) 0%,rgba(87,255,229,1) 100%)"
                       class="flex-center col-f fon-lg"><i class="iconfont icon-shouji mar-r-10 fon-40"></i>联系方式
        </dd-layout-div>
      </div>
    </div>

    <dd-layout-div v-else>
      <city-love-notice :list="list"/>
    </dd-layout-div>


  </div>

</template>
<script>
  import Banner from "../../../components/home/banner";
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import DdLayoutUser from "../../../components/layout/dd-layout-user";
  import vipStar from '../../../assets/img/other/vip-star.png'
  import {mapActions, mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import {computedDate, showDialog, showHandleStatusByFlag} from "../../../util";
  import CityLoveNotice from "../../../components/template/item/city-love-notice";
  import {updateShareConfig} from "../../../util/wechat-util";

  export default {
    mixins: [utilMixins],
    components: {CityLoveNotice, DdLayoutUser, DdLayoutImg, Banner},
    data() {
      return {
        vipStar,
        info: {
          images: [],
          photos: []
        },
        banners: [],
        tabConfig: {
          index: 0,
        },
        list: [],
        params: {
          page: 1,
          size: 10
        },
        infoList: [
          {
            title: '相册',
            type: 'photo',
          },
          {
            title: '基本资料',
            type: 'data',
            value: {
              data: [
                {label: '性别', value: '', field: 'sex'},
                {label: '年龄', value: '', field: 'age', unit: '岁'},
                {label: '民族', value: '', field: 'nation', unit: ''},
                {label: '身高', value: '', field: 'height', unit: 'cm'},
                {label: '体重', value: '', field: 'weight', unit: 'kg'},
              ]
            }
          }, {
            title: '详细资料',
            type: 'data',
            value: {
              data: [
                {label: '学历', value: '', field: 'education', default: ``},
                {label: '所在城市', value: '', field: 'city', default: `<span class="col-7D88AC">暂无数据</span>`},
                {label: '职业', value: '', field: 'typeName', default: `<span class="col-7D88AC">暂无数据</span>`},
                {label: '情感状况', value: '', field: 'emotion', default: `<span class="col-7D88AC">暂无数据</span>`},
              ]
            }
          }, {
            title: '想聊的话题',
            type: 'interest',
          }
        ]
      }
    },
    methods: {
      ...mapActions("cityLove", ['cityLoveGetInfo', 'cityLoveGetDynamicList']),
      ...mapActions("post", ["collectPost"]),
      divLoad(e) {
        return console.log("div加载完毕", e)
      },
      onInfinite() {
        if (!this.hasMore) return
        this.params.page++;
        this.getDynamicList();
      },
      async getDynamicList() {
        console.log("this.getInfo", this.getInfo)
        let result = await this.cityLoveGetDynamicList({
          ...this.params,
          friendId: this.id
        })

        result = result.map(item => {
          return {
            ...item,
            face: this.getSingleImg(item.icon),
            nickname: item.name,
            age: item.birthday,
            nation: item.nation,
            city: item.address,
            love: item.love,
            loveNum: item.loveNum || 0,
            share: item.share || 0,
            browse: item.viewNum || 0,
            sex: +item.sex == 1 ? '男' : '女',
            photos: item.media ? item.media.map(item => {
              return this.getSingleImg(item.url);
            }) : [],
            time: computedDate(item.createdAt)
          }
        });
        this.list = this.list.concat(result);
        this.hasMore = result.length >= this.params.size;
        this.isRequest = true;

      },
      async collectionHandle() {
        await this.collectPost({
          type: 12,
          postId: this.getInfo.id
        })


        this.info = await this.cityLoveGetInfo({
          id: this.getInfo.id
        })

      },
      async contactOther() {

        if (this.getInfo.look) {
          this.callTel(this.getInfo.tel)
        } else {
          const money = (this.friendConfig.seeMoney ? +this.friendConfig.seeMoney : 0).toFixed(2);

          if (money > 0) {
            try {
              await showDialog("需要支付" + money + '元');
              this.$router.push({
                name: "cashier",
                params: {
                  type: 9,
                  param: {
                    friendId: this.getInfo.id,
                    money: money,
                    type: 7
                  },
                  info: {
                    money: +money,
                    type: "交友电话付费",
                    isCall: true
                  }
                }
              });
            } catch (e) {
              console.log("老板，" + money + "元都不愿给我，联系对方这件事，我很难帮你办啊！");
            }

          } else {
            this.callTel(this.getInfo.tel)
          }
        }


      }
    },
    computed: {
      ...mapState("cityLove", {
        registerInfo: s => s.registerInfo,
        friendConfig: s => s.friendConfig,
      }),
      getInfo() {

        const data = JSON.parse(JSON.stringify(this.info))

        if (!data.id) return data

        let city = '';
        data.city && (city = data.city.split("-")[0]);
        if (city.length > 3) city = city.substring(0, 4) + "...";

        const photos = data.media.map(item => {
          return this.getSingleImg(item.url)
        })

        const info = {
          id: data.id,
          nickname: data.name,
          age: data.birthday,
          nation: data.nation,
          sex: +data.sex == 1 ? '男' : '女',
          city,
          introduce: data.introduce,
          images: [this.getSingleImg(data.icon)].concat(photos),
          photos,
          label: data.label,
          follow: data.follow,
          height: data.height,
          weight: data.weight,
          education: data.education,
          typeName: data.typeName,
          emotion: data.emotion,
          tel: data.tel,
          look: data.look,
          userId: data.userId,
          dynamicNum: data.dynamicNum
        }


        this.infoList.forEach(item => {
          if (item.value && item.value.data) {
            item.value.data.forEach(solo => {
              solo.value = info[solo.field]
            })
          }
        })

        return info
      }
    },
    created() {
      const query = this.$route.query
      this.isFailParams({
        field: query.id,
        tips: '缺少用户id',
      }, async () => {
        this.id = query.id;


        this.info = await this.cityLoveGetInfo({
          id: query.id
        })

        console.log("userInfo", this.info)

        updateShareConfig({
          title: "【同城交友】" + this.info.name,
          imgUrl: this.getSingleImg(this.info.icon),
          desc: this.info.introduce,
        });
      })

      this.getDynamicList()
    },
    destroyed() {
      // 用离开当前页面就会执行
      if (this.isCanCall) {
        this.isCanCallAction();
      }
    }
  }
</script>
