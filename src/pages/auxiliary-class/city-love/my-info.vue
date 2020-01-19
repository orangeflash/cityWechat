<template>

  <dd-layout-div mi-h="100vh" bg="#fff">
    <div class="pad-b ">
      <div class="flex-bt pad-30">
        <div class="flex-y-center flex-g-1">
          <div class="posi-r">
            <dd-layout-img :src="face||getInfo.face"
                           :width="1.3" :height="1.3" :fillet="1.3"/>
            <div class="posi-a bg-0-5 flex-center r0 b0 br-r-c w-42 h-42 br-f">
              <i class="iconfont icon-paizhao fon-xss dh-20 col-f"></i>
            </div>
            <dd-file v-model="face" class="posi-a-i t0 l0 r0 b0" @change="faceChange"/>
          </div>
          <div class="mar-l flex-g-1" @click="goPointPage('/auxiliary/cityLove/myData')">
            <p class=" fon-xxl mar-b">{{getInfo.name}}</p>
            <span class="">ID：{{getInfo.id}}</span>
          </div>
        </div>
        <div class="flex-y-center" @click="goPointPage('/auxiliary/cityLove/myData')">
          <i class="iconfont icon-right  fon-40"></i>
        </div>
      </div>
      <ul class="flex flex-bt flex-y-center br-b-EFF3F6 pad-b mar-lr">
        <!--<li class="t-c flex-g-1">-->
        <!--<dd-layout-div class="fon-wb" :font-size="38">15</dd-layout-div>-->
        <!--<p class="col-9 fon-sm fon-w5 mar-t-25">消息</p>-->
        <!--</li>-->
        <li class="t-c flex-g-1" @click="goPointPage('/auxiliary/cityLove/myFollow?type=0')">
          <dd-layout-div class="fon-wb" :font-size="38">{{getInfo.myCollection}}</dd-layout-div>
          <p class="col-9 fon-sm fon-w5 mar-t-25">关注</p>
        </li>
        <li class="t-c flex-g-1" @click="goPointPage('/auxiliary/cityLove/myFollow?type=1')">
          <dd-layout-div class="fon-wb" :font-size="38">{{getInfo.myFans}}</dd-layout-div>
          <p class="col-9 fon-sm fon-w5 mar-t-25">粉丝</p>
        </li>
        <!--<li class="t-c flex-g-1">-->
        <!--<dd-layout-div class="fon-wb" :font-size="38">54</dd-layout-div>-->
        <!--<p class="col-9 fon-sm fon-w5 mar-t-25">通知</p>-->
        <!--</li>-->
      </ul>

      <ul class="flex flex-bt flex-y-center pad-b pad-t">
        <li class="t-c flex-g-1" @click="goPointPage('/auxiliary/cityLove/myDynamic')">
          <dd-layout-img :width="1.1" :height="1.1" :src="dynamic" class="bg-tran mar-a"/>
          <p class=" fon-sm fon-w5 mar-t">我的动态</p>
        </li>
        <li class="t-c flex-g-1" @click="goPointPage('/auxiliary/cityLove/browsingTraces')">
          <dd-layout-img :width="1.1" :height="1.1" :src="see" class="bg-tran mar-a"/>
          <p class=" fon-sm fon-w5 mar-t">浏览痕迹</p>
        </li>
        <li class="t-c flex-g-1" @click="goPointPage('/auxiliary/cityLove/telOrder')">
          <dd-layout-img :width="1.1" :height="1.1" :src="tel" class="bg-tran mar-a"/>
          <p class=" fon-sm fon-w5 mar-t">电话记录</p>
        </li>
        <li class="t-c flex-g-1" @click="goPointPage('/auxiliary/vip')">
          <dd-layout-img :width="1.1" :height="1.1" :src="vip" class="bg-tran mar-a"/>
          <p class=" fon-sm fon-w5 mar-t">会员中心</p>
        </li>
      </ul>

      <div class="flex-y-center pad-t mar-lr fon-wb fon-lg">管理资料</div>
      <ul class="flex flex-bt flex-y-center pad-b pad-t">
        <li class="t-c flex-g-1" @click="operationTop">
          <dd-layout-img :width="1.1" :height="1.1" :src="top" class="bg-tran mar-a"/>

          <p class=" fon-sm fon-w5 mar-t">{{getInfo.isTop==1?'置顶续费':'我要置顶'}}</p>
        </li>
        <li class="t-c flex-g-1" @click="inputSign">
          <dd-layout-img :width="1.1" :height="1.1" :src="sign" class="bg-tran mar-a"/>
          <p class=" fon-sm fon-w5 mar-t">个性签名</p>
        </li>
        <li class="t-c flex-g-1" @click="goPointPage('/auxiliary/cityLove/myData')">
          <dd-layout-img :width="1.1" :height="1.1" :src="data" class="bg-tran mar-a"/>
          <p class=" fon-sm fon-w5 mar-t">我的资料</p>
        </li>
        <li class="t-c flex-g-1" @click="goPointPage('/auxiliary/cityLove/albums')">
          <dd-layout-img :width="1.1" :height="1.1" :src="image" class="bg-tran mar-a"/>
          <p class=" fon-sm fon-w5 mar-t">我的相册</p>
        </li>
      </ul>

      <dd-layout-div v-if="getInfo.isTop==1">
        <dd-layout-div bg="rgba(239,243,246,1)" :height="8"/>
        <dd-layout-div class="flex-y-center flex-bt" :pad="[0,30]" :height="108">
          <dd-layout-div class="flex flex-y-center">
            <dd-layout-div class="posi-r fon-wb dis-ib" :font-size="38" :width="34" :fillet="10"
                           bg="linear-gradient(90deg,rgba(247,168,97,1) 0%,rgba(255,119,111,1) 100%)" :height="34"
                           br="0.01rem solid #EFF3F6">
              <div class="posi-a w100 hei100 t0 l0 flex-center">
                <i class="iconfont icon-zhiding1 col-f fon-xsss mar-t-5"></i>
              </div>
            </dd-layout-div>
            <dd-layout-div class="lg fon-wb mar-l">我的置顶服务</dd-layout-div>
          </dd-layout-div>
          <dd-layout-div color="#FF2837" class="fon-lg fon-w5">还有{{formatTime(getInfo.topEndTime,'computed')}}到期
          </dd-layout-div>

        </dd-layout-div>
        <dd-layout-div bg="rgba(239,243,246,1)" :height="8"/>
      </dd-layout-div>


      <!--<dd-layout-div :br="{top:'0.08rem solid #EFF3F6'}">-->
      <!--<div class="flex-bt pad-30 fon-wb fon-lg">-->
      <!--<div class="flex-y-center">-->
      <!--<dd-layout-div bg="#FFC152" :width="34" :height="34" class="flex-center mar-r" :fillet="8">-->
      <!--<i class="iconfont icon-tianchongxing- col-f fon-xss mar-t-5"></i>-->
      <!--</dd-layout-div>-->
      <!--会员-->
      <!--</div>-->
      <!--<div class="fon-lg fon-wb">未开通</div>-->
      <!--</div>-->
      <!--<div class="flex-bt pad-30">-->
      <!--<span class="flex-g-1 flex-y-center mar-r-60 lineH-40">会员可免费查看用户电话、免费与用 户私聊，免费次数由会员等级决定</span>-->
      <!--<dd-layout-div class="flex-center flex-g-0 mar-l" :pad="[25]" bg="#FFBD4C" :fillet="8">-->
      <!--<i class="iconfont icon-tianchongxing- col-f mar-t-5 mar-r"></i>-->
      <!--<span class="col-f fon-lg">立即开通</span>-->
      <!--</dd-layout-div>-->
      <!--</div>-->
      <!--</dd-layout-div>-->
    </div>

  </dd-layout-div>

</template>
<script>
  import DdLayoutImg from "../../../components/layout/dd-layout-img";
  import {mapActions, mapState} from 'vuex'
  import {utilMixins} from "../../../plugins/util-mixins";
  import DdFile from "../../../components/template/dd-form/dd-file";
  import {showDialog} from "../../../util";
  import {Toast} from 'vant'

  import top from "../../../assets/img/other/top.png"
  import data from "../../../assets/img/other/data.png"
  import image from "../../../assets/img/other/image.png"
  import sign from "../../../assets/img/other/sign.png"
  import see from "../../../assets/img/other/see.png"
  import vip from "../../../assets/img/other/vip.png"
  import dynamic from "../../../assets/img/other/dynamic.png"
  import tel from "../../../assets/img/other/tel.png"


  export default {
    components: {DdFile, DdLayoutImg},
    mixins: [utilMixins],
    data() {
      return {
        top, data, image, sign, see, vip, dynamic, tel,
        showInput: false,
        body: '',
        face: '',
      }
    },
    methods: {
      ...mapActions("cityLove", ["cityLoveRegister", 'cityLoveCategory', 'cityLoveGetTopList', 'cityLoveTopOrder']),
      confirm() {
        return
      },
      async operationTop(e) {

        const list = await this.cityLoveGetTopList();

        console.log("list", list)

        this.$root.$children[0].openTopPicker({
          actions: list
        }, async (e) => {
          console.log(e)

          const money = (+e.money || 0).toFixed(2);

          if (money > 0) {
            try {
              await showDialog("需要支付" + money + "元");
              const res = await this.cityLoveTopOrder({
                topId: this.getInfo.id,
              })
              if (res.code && res.data > 0) {
                this.$router.push({
                  name: 'cashier',
                  params: {
                    type: 42,
                    param: {
                      topId: res.data,
                    },
                    info: {
                      money: money,
                      type: "交友信息置顶",
                    }
                  }
                });
              } else {
                Toast.fail({
                  message: res.msg,
                  duration: 1500
                })
              }

            } catch (e) {
              console.log("老板，" + money + "元都不愿给我，置顶这件事，我很难帮你办啊！");
            }

          } else {
            console.log("免费置顶")
          }

        })

      },
      async inputSign() {
        const introduce = await this.inputConfirm({
          title: '个性签名',
          value: this.registerInfo.introduce,
          length: 16,
          placeholder: '请简单的自我介绍'
        })

        if (this.registerInfo.introduce != introduce) {
          this.registerInfo.introduce = introduce;
          await this.cityLoveRegister({
            ...this.registerInfo,
            icon: [
              {
                type: "img",
                url: this.registerInfo.icon
              }
            ],
            userId: ''
          });
          await this.cityLoveRegister({
            userId: this.user.id
          })
        }
      },
      async faceChange(e) {
        this.registerInfo.icon = await this.uploadFile({
          files: e.files,
        })

        const res = await this.cityLoveRegister({
          ...this.registerInfo,
          userId: ''
        });
        console.log("修改了头像", res)
        await this.cityLoveRegister({
          userId: this.user.id
        })
      }
    },
    computed: {
      ...mapState("cityLove", {
        registerInfo: s => s.registerInfo
      }),
      getInfo() {
        return {
          ...this.registerInfo,
          face: this.getSingleImg(this.registerInfo.icon)
        }
      }
    },
    async created() {
      this.cityLoveRegister({
        userId: this.user.id
      });
    }
  }
</script>
