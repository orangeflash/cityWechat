<template>

  <div class="housing-deal-details">
    <Header></Header>
    <div class="banner-box" v-if="isLease&&banners.length">
      <Banner :swiper="{children:banners}"
              :showImage="true"
              :height="230"></Banner>
    </div>
    <div class="housing-deal-details_info space">
      <div class="housing-deal-details_info_up">
        <h4>{{info.title}}</h4>
        <div class="">
          <Top
            :time="computedDate(info.createdAt)"
            :labelsConfig="labelsConfig"
          ></Top>
        </div>
      </div>
      <div class="housing-deal-details_info_down">
        <div
          v-for="(item,key) in picker"
          :key="key"
        >
          <p>{{item.name}}</p>
          <span>{{item.value}}{{item.after}}</span>
        </div>
      </div>
      <div class="labels" v-if="info.label&&info.label.length">
        <Labels :labels="info.label"></Labels>
      </div>
    </div>
    <div class="space address" v-if="isLease">
      <Card
        :name="info.communityName"
        :address="info.area + info.address"
        @click="openMap"
      ></Card>
    </div>
    <div class="space card-info" v-if="isLease">
      <div class="card-info_title"><i class="iconfont icon-yufukuanyufukuanjil"></i>房源信息</div>
      <div class="card-info_content">
        <ul>
          <li><em>装修：</em>{{info.renovation}}</li>
          <li><em>地区：</em>{{info.area}}</li>
          <li v-if="info.measure"><em>面积：</em>{{info.measure}}㎡</li>
          <li><em>类型：</em>{{info.rentType}}</li>
          <li><em>朝向：</em>{{info.orientation}}</li>
          <li v-if="info.floor"><em>楼层：</em>{{info.floor}}</li>
          <li v-if="info.developer"><em>开发商：</em>{{info.developer}}</li>
        </ul>
      </div>
    </div>
    <div class="dh-96 bg-F2F3F5 flex-bt flex-y-center pad-lr col-9"
         @click="openReport(info.id,info.identifying <=4 ?11:12)">
      如遇无效、虚假等信息，请立即举报哦！
      <div class="flex-y-center"><i class="iconfont icon-dengjuanzhuang col-E97142 fon-40 mar-r-10"></i>点此举报</div>
    </div>
    <div class="space card-info" v-if="info.data&&info.data.length">
      <div class="card-info_title"><i class="iconfont icon-yufukuanyufukuanjil"></i>房屋配置</div>
      <div class="card-info_content">
        <Labels :labels="info.data"></Labels>
      </div>
    </div>
    <div class="space card-info">
      <div class="card-info_title"><i class="iconfont icon-yufukuanyufukuanjil"></i>{{isLease?'房源描述':'要求描述'}}</div>
      <div class="card-info_content">
        <p v-html="info.body || '暂无描述'"></p>
      </div>
    </div>
    <DetailsFooter v-bind="footerConfig" @method="footerChoice"></DetailsFooter>
  </div>
</template>

<script>
  import Top from '@/components/template/housing-deal-card/top';
  import DetailsFooter from '../../../components/template/details-footer'
  import Labels from '@/components/template/labels'
  import Banner from '@/components/home/banner';
  import Card from '@/components/template/card/one'
  import {mapState, mapActions} from "vuex"
  import {Toast} from 'vant'
  import {hideLoading, showDialog, showLoading} from "@/util";
  import {utilMixins, computedDate} from "@/plugins/util-mixins";
  import {getAuxiliaryConfigColor} from "@/plugins/auxiliary/auxiliary-config";
  import {updateShareConfig, openLocation} from "../../../util/wechat-util";
  import {format} from "../../../util";

  export default {
    mixins: [utilMixins],
    components: {DetailsFooter, Top, Labels, Card, Banner},
    data() {
      return {
        showMapDialog: false,
        isLease: false,  //是出租帖子
        info: {},        //帖子信息
        banners: [],
        labelsConfig: {
          back: true,
          labels: []
        },
        picker: [],
        seeTelMoney: 0,
        config: {},    //租房的配置信息
        footerConfig: {
          menu: [
            {
              icon: 'icon-shouyexian',
              name: '首页',
            }, {
              icon: 'icon-fabudianjizhuangtai-',
              name: '发布',
            }, {
              icon: 'icon-collection',
              iconActive: 'icon-collection-b',
              name: '收藏',
              useActive: false,
            },
          ],
          main: {
            name: '',
            childrenName: '',
          }
        },
      }
    },
    methods: {
      ...mapActions("houingDeal", ['housingDealInfo', 'housingDealConfig', 'housingDealClssInfo', 'housingDealShare']),
      ...mapActions("wxPay", ["isCanCallAction"]),
      ...mapActions(["collectionPost"]),
      openMap() {
        openLocation({
          lat: this.info.lat,
          lng: this.info.lng,
          name: this.info.area,
          address: this.info.address
        })
      },
      async footerChoice(index) {
        if (index != 0) {
          const bool = await this.checkBindTel({callBack: true})
          if (!bool) return
        }
        switch (index) {
          case -1:// 拨打电话
            if (this.isLookTel()) {
              location.href = `tel://${this.info.linkTel}`
            } else {
              this.goPay(+this.seeTelMoney)
            }
            break;
          case 0:   //首页
            this.goPointPage("/auxiliary/housingDeal")
            break;
          case 1: //发布
            const bool = await this.checkBindTel({callBack: true})
            if (!bool) return

            let type = '',
              path = +this.info.identifying <= 4 ? "/auxiliary/housingDeal/release" : "/auxiliary/housingDeal/releaseSale";

            switch (+this.info.identifying) {
              case 3:
                type = 'lease';
                break;
              case 4:
                type = 'rentSeeking';
                break;
              case 5:
                type = 'unused';
                break;
              case 6:
                type = 'used';
                break;
            }
            this.goPointPage({
              path,
              query: {
                type,
                id: this.info.typeId
              }
            })

            // this.goPointPage({
            //   path: "/auxiliary/housingDeal/release",
            //   query: {
            //     type: this.isLease ? 'lease' : 'rentSeeking',
            //     id: this.info.typeId
            //   }
            // })
            break;
          case 2: //收藏
            this.collection();
            break;
        }
      },
      async collection() {
        const bool = await this.checkBindTel();
        if (!bool) return;
        showLoading();
        const result = await this.collectionPost({
          postId: this.info.id,
          type: 9
        })
        this.info.follow = result.status == 1;

        this.footerConfig.menu[2].useActive = this.info.follow;
        hideLoading();
      },
      dataConversion(v, k) {

        if (v.indexOf("-") >= 0) {
          try {
            const arr = v.split("-");
            switch (k) {
              case 'apartment':
                return arr[0] + "室" + arr[1] + '厅' + arr[2] + '卫';
              case 'deposit':
                return '押' + arr[0] + "付" + arr[1];
            }
          } catch (e) {

            return v
          }
        } else {
          return v
        }

      },
      getData(id) {
        showLoading()
        this.housingDealInfo({
          id
        }).then(result => {
          hideLoading();
          this.info = result;
          if (result.imgs.length) {
            result.imgs.forEach(v => v.notHost = true);
            this.banners = result.imgs || [];
          }
          this.info.data = result.data ? result.data.map(v => {
            return {
              name: v,
              color: getAuxiliaryConfigColor(v)
            }
          }) : [];
          this.info.label = result.label ? result.label.map(v => {
            return {
              name: v,
              color: getAuxiliaryConfigColor(v)
            }
          }) : [];

          let type = result.name;
          this.labelsConfig.labels.push({
            name: type,
            color: getAuxiliaryConfigColor(type)
          })
          this.labelsConfig.labels.push({
            name: result.rentType,
            color: getAuxiliaryConfigColor(result.rentType)
          })

          let title = '', imgUrl = '';
          switch (+result.identifying) {
            case 3:
              this.picker = [
                {name: '价格', value: result.rent + '元/月'},
                {name: '户型', value: this.dataConversion(result.apartment, 'apartment')},
                {name: '押金', value: result.deposit},
              ]
              title = '出租'
              imgUrl = this.getSingleImg(this.banners[0].url);
              break;
            case 4:    //求租
              this.picker = [
                {name: '价格', value: result.rent + '元/月'},
                {name: '押金', value: result.deposit},
                {name: '地区', value: result.area},
              ]
              title = '求租'
              imgUrl = this.config.shareImg;
              break;
            case 5:   //新房
              this.picker = [
                {name: '价格', value: isNaN(result.rent) ? result.rent : result.rent + '元/平'},
                {name: '开盘时间', value: format(+result.openTime * 1000).split(" ")[0]},
                {name: '状态', value: result.rentType},
              ]
              title = '新房'
              imgUrl = this.getSingleImg(this.banners[0].url);
              break;
            case 6: //二手房
              this.picker = [
                {name: '价格', value: isNaN(result.rent) ? result.rent : result.rent + '万起'},
                {name: '户型', value: this.dataConversion(result.apartment, 'apartment')},
                {name: '面积', value: result.measure + 'm²'},
              ]
              title = '二手房'
              imgUrl = this.getSingleImg(this.banners[0].url);
              break;
          }


          // this.picker = this.isLease
          //   ? [
          //     {name: '价格', value: +result.rent || result.rent || '面议', after: +result.rent ? '元/月' : ''},
          //     {
          //       name: isNaN(result.rent) ? '开盘时间' : '户型',
          //       value: isNaN(result.rent) ? format(+result.openTime * 1000).split(" ")[0] : this.dataConversion(result.apartment, 'apartment')
          //     },
          //     {
          //       name: result.deposit ? '押金' : result.measure ? '面积' : '状态',
          //       value: result.deposit ? result.deposit : result.measure ? result.measure + 'm²' : result.rentType
          //     }
          //   ] : [
          //     {name: '价格', value: +result.rent || '面议', after: +result.rent ? '元/月' : ''},
          //     {name: '押金', value: result.deposit},
          //     {name: '地区', value: result.area.split("-")[1]}
          //   ]

          this.seeTelMoney = result.moneyData.seeMoney || 0;

          this.footerConfig.main.name = this.isLookTel() ? result.linkMan : this.hideUserName(result.linkMan);
          // 隐藏是否隐藏电话
          this.footerConfig.main.childrenName = this.isLookTel() ? result.linkTel : this.hideTelNumber(result.linkTel);

          this.footerConfig.menu[2].useActive = this.info.follow;

          const desc = this.isLease
            ? this.dataConversion(result.apartment, 'apartment') + " | " + this.picker[0]&&this.picker[0].value + " | " + this.info.area + "\n" + this.info.body
            : this.picker[0]&&this.picker[0].value + " | " + this.info.area + "\n" + this.info.body;
          // 配置转发信息


          updateShareConfig({

            title: `【${title}】 ${this.info.title}`,
            imgUrl: this.isLease ? this.getSingleImg(this.banners[0].url) : this.config.shareImg,
            desc: desc,
            link: window.location.href,
          })
        })


      },
      async goPay(money, param = {}) {
        try {
          await showDialog("需要支付" + money.toFixed(2) + "元")
          this.$router.push({
            name: 'cashier',
            params: {
              type: 9,
              param: {
                rentingId: this.info.id,
                type: 4,
              },
              info: {
                money: money,
                type: "查看租房电话",
                isCall: true,
              }
            }
          });
        } catch (e) {
          console.log("老板，" + money.toFixed(2) + "元都不愿给我，电话号码这件事，我很难帮你办啊！");
        }
      },
      isLookTel() {
        return +this.seeTelMoney > 0 ?
          this.isCanCall ? true
            : this.config.see == 2
            ? false
            : this.info.isLook == 1 : true;
      }
    },
    computed: {
      ...mapState("wxPay", {
        // 是否允许拨打电话，该变量值是在wxPay里面设置的 记得在页面退出的时候把这个值去掉
        isCanCall: state => state.isCanCall
      }),
    },
    async created() {
      const query = this.$route.query;
      this.isLease = typeof query.isLease == 'string' ? eval(query.isLease.toLowerCase()) : query.isLease;
      if (query.id) {
        this.config = await this.housingDealConfig();
        this.getData(query.id);
        if (query.isShare) {
          this.housingDealShare({
            id: query.id
          })
        }
      } else {
        Toast.fail({
          message: '缺少Id',
          duration: 1500
        })
        setTimeout(() => {
          this.goPointPage("/auxiliary/housingDeal")
        }, 1500)
      }
    },
    // 用离开当前页面就会执行
    destroyed() {
      this.isCanCall && this.isCanCallAction();
    }
  }

</script>

<style scoped lang="scss">
  @import "../../../assets/common";

  .housing-deal-details {
    padding-bottom: 120px;

    .space {
      margin-bottom: 16px;
      background: #fff;
    }

    .banner-box {
      height: 460px;
    }

    .housing-deal-details_info {
      background: #fff;

      &_up {
        padding: 40px 32px;
        border-bottom: 1.1px solid #ddd;

        h4 {
          font-size: 32px;
          line-height: 44px;
        }

        div {
          padding-top: 24px;
        }
      }

      &_down {
        display: flex;
        justify-content: space-between;
        padding: 32px;
        height: 76px;
        border-bottom: 1.1px solid #ddd;

        div {
          text-align: center;
          flex: 1;

          p {
            color: #666;
            font-size: 26px;
            margin-bottom: 24px;
          }

          span {
            color: $themeColor;
            font-size: 30px;
          }
        }

        div:nth-child(2) {
          border-right: 1.1px solid #ddd;
          border-left: 1.1px solid #ddd;
        }
      }

      .labels {
        padding: 40px 30px;
      }
    }

    .address {
      padding: 30px;
    }

    .card-info {

      &_title {
        display: flex;
        align-items: center;
        height: 92px;
        border-bottom: 1.1px solid #ddd;
        padding: 0 30px;
        font-size: 30px;

        i {
          color: $themeColor;
          font-size: 40px;
          height: 32px;
          margin-right: 20px;
        }
      }

      &_content {
        padding: 30px;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            width: 50%;
            font-size: 26px;
            display: flex;
            margin-bottom: 36px;

            em {
              color: #999;
              margin-right: 10px;
              width: 100px;
            }
          }
        }

        p {
          color: #999;
          font-size: 26px;
          line-height: 40px;
        }
      }
    }
  }

</style>
