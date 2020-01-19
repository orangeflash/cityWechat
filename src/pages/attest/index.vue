<template>
  <div class="attest-index">
    <!--这个头部是组件来的 S-->
    <Header></Header>
    <!--这个头部是组件来的 E-->
    <img-wrapper not-load="true" :src="backendPath+'/wechatimg/testcenter/testlb.png'" class="attest-header"/>
    <ul class="attest-list">
      <li class="attest-item" v-if="isPersonal" @click="personalClick(1)">
        <div class="left">
          <img-wrapper not-load="true" :src="personal" class="type"/>
          <strong class="personal-attest">个人认证</strong>
        </div>
        <div class="right">
          <em class="text"
              :class="{success:+attestPrompt.type == 1,fail:+attestPrompt.type == 0}">{{attestPrompt.tips}}</em>
          <em class="not-successful" v-if="!attestPrompt.type">×</em>
          <em class="verified" v-else><i class="iconfont icon-gou1"></i></em>
        </div>
      </li>
      <li class="attest-item" v-if="company" @click="personalClick(2)">
        <div class="left">
          <img-wrapper not-load="true" :src="firmAttest" class="type"/>
          <strong class="personal-attest">企业认证</strong>
        </div>
        <div class="right">
          <em class="text"
              :class="{success:+attestPrompt.type == 1,fail:+attestPrompt.type == 0}">{{attestPrompt.tips}}</em>
          <em class="not-successful" v-if="!attestPrompt.type">×</em>
          <em class="verified" v-else><i class="iconfont icon-gou1"></i></em>
        </div>
      </li>
      <li class="attest-item" @click="personalClick(3)" v-if="bondOpen">
        <div class="left">
          <img-wrapper not-load="true" :src="marginAttest" class="type"/>
          <strong class="personal-attest">诚信保证金</strong>
        </div>
        <div class="right">
          <em class="text" :class="{success:bondInfo,fail:!bondInfo}">{{bondInfo?"已缴纳":'未缴纳'}}</em>
          <em class="not-successful" v-if="!bondInfo">×</em>
          <em class="verified" v-else><i class="iconfont icon-gou1"></i></em>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapState, mapActions} from "vuex"
  import personal from "../../assets/img/attest/personal.png"
  import firmAttest from "../../assets/img/attest/firm-attest.png"
  import marginAttest from "../../assets/img/attest/margin-attest.png"
  import {publishUrl, backendPath} from "../../project-config/base"
  import Header from "@/components/header";
  import {Dialog} from 'vant';
  import {Toast} from "vant";
  import {showDialog} from "../../util";

  export default {
    name: "attestIndex",
    components: {Header},
    data() {
      return {
        bondOpen: false,
        isCertified: true,
        isPersonal: false,
        company: false,
        personal,
        firmAttest,
        marginAttest,
        attestType: {
          tips: "未认证",
          type: 0,
          status: 0
        },
        attestation: {},
        attestPrompt: {
          tips: '未认证',
          type: 0
        },
        bondInfo: null,        //保证金的缴纳信息,
        type: null,
        id: null,
        publishUrl,
        backendPath
      }
    },
    methods: {
      ...mapActions("attest", ["getAttestTypeByPost", 'getAttestByPost', "getAttestStatus", "lookBondInfo"]),
      ...mapActions("shop", ["getShopInfoByParams"]),
      /**
       *  获取认证信息
       *  认证协议
       *
       *  */
      async getAttestation() {
        this.attestation = await this.getAttestByPost();


        this.attestation.identType.forEach(item => {
          // 判断是不是个人认证 并且个人认证是否开启'1' => '开启', '2' => '关闭' 并且是从个人认证进来的
          console.log(this.$route.query)
          if (+this.attestation.identOpen == 1) {
            if (item === 1
              // && +this.attestation.bondPersonal === 1
              && this.$route.query.type === 'personal') {
              this.isPersonal = true;
              this.id = this.user.id;
              // 判断是不是企业认证 并且企业认证是否开启'1' => '开启', '2' => '关闭' 并且是从企业认证进来的
            } else if (item === 2
              // && +this.attestation.bondCompany === 1
              && this.$route.query.type === 'store') {
              this.company = true;
              this.id = this.$route.query.id;
            }
          }
        })
        if (+this.attestation.bondOpen == 1) {
          if (this.$route.query.type === 'store' && +this.attestation.bondCompany === 1) {
            this.bondOpen = true
          } else if (this.$route.query.type === 'personal' && +this.attestation.bondPersonal === 1) {
            this.bondOpen = true
          }

        }

        const res = await this.getAttestStatus({
          type: this.isPersonal ? 1 : 2,
          id: this.isPersonal ? this.user.id : this.$route.query.id
        });
        if (res && res.status) {
          this.attestPrompt = +res.status ? "已认证" : "待审核"
          this.attestPrompt = {
            type: +res.status,
            tips: +res.status ? "已认证" : "待审核",
            status: res.status && true
          }
        }

        if (this.attestation.bondOpen && +this.attestation.bondOpen === 1) {
          this.bondInfo = await this.lookBondInfo({
            id: this.id,
            type: this.isPersonal ? 1 : 2,
          });
        }


        // // 判断是不是企业认证 '1' => '开启', '2' => '关闭' 并且是从个人认证进来的
        // if ( parseInt(this.attestation.bondCompany) === 1 ) {
        //    this.attestation.identType.map(item=>{
        //    if(item===2){
        //       this.isFirm = true;
        //     }
        //   })
        // }else {
        //   this.isFirm = false;
        // }
      },
      async personalClick(index) {
        switch (index) {
          case 1:
            if (this.attestPrompt.status) {
              Toast(this.attestPrompt.tips);
            } else {

              this.goPointPage({
                path: "/attestIndex/attestPersonal"
              })
            }
            break;
          case 2:
            if (this.attestPrompt.status) {
              Toast(this.attestPrompt.tips);
            } else {
              this.goPointPage({
                path: "/attestIndex/firmAttest",
                query: {
                  id: this.storeId
                }
              })
            }

            break;
          case 3:
            if (!this.attestation.companyMoney) {
              Toast("已缴纳");
            } else {
                this.goPointPage({
                  path: "/attestIndex/attestMargin",
                  query: {
                    id: this.$route.query.type == 'personal' ? this.user.id : this.storeId,
                    type: this.$route.query.type
                  }
                })

              // if (res.length) {
              //   this.goPointPage({
              //     path: "/attestIndex/attestMargin",
              //     query: {
              //       id: this.$route.query.type == 'personal' ? this.user.id : res[0].id,
              //       type: this.$route.query.type
              //     }
              //   })
              // } else {
              //   try {
              //     await showDialog("您还不是商家，是否入驻");
              //     this.goPointPage('/publication/businessEnterForm')
              //   } catch (e) {
              //     console.log(e);
              //   }
              // }

            }
            break;
        }
      }
    },
    computed: {
      ...mapState({
        user: state => state.user
      }),
      ...mapState("businessDistrict", {
        storeId: state => state.storeId,
      }),
    },
    created() {
      this.getAttestation();
    }
  }

</script>

<style scoped lang="scss">
  @import "../../assets/theme";

  .attest-header {
    height: 337px;
    width: 100%;
  }

  .attest-list {
    transform: translateY(-120px);
  }

  .attest-item {
    width: 690px;
    height: 180px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 7px 10px 0px rgba(221, 221, 221, 0.6);
    border-radius: 8px;
    margin: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    box-sizing: border-box;

    .type {
      width: 80px;
      height: 80px;
    }

    .left {
      width: 50%;
      display: flex;
      align-items: center;
    }

    .personal-attest {
      margin-left: 40px;
      font-size: $font-size-xl;
      color: rgba(51, 51, 51, 1);
    }

    .right {
      display: flex;
    }

    .text {
      font-size: $font-size-sm;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      margin-right: 20px;
    }

    .success {
      color: rgba(93, 178, 113, 1);
    }

    .fail {
      color: red;
    }

    .not-successful {
      width: 28px;
      height: 28px;
      text-align: center;
      line-height: 24px;
      background: rgba(255, 223, 223, 1);
      border-radius: 50%;
      font-size: 24px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(255, 0, 0, 1);
    }

    .verified {
      width: 28px;
      height: 28px;
      line-height: 24px;
      background: rgba(209, 255, 220, 1);
      border-radius: 50%;
      font-size: 18px;
      color: rgba(93, 178, 113, 1);
    }
  }
</style>
